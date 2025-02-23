import os
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import requests
from tf_keras.models import Sequential
import json
import openai

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")  # Add a secret key for session management

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

api_key = os.environ.get("API_KEY2")

# Animal Classification related functions
def preprocess_image(image):
    """Preprocess image for model input"""
    image = image.convert("RGB")  # Ensure image is RGB
    image = np.array(image)
    image_resized = tf.image.resize(image, (224, 224))
    image_resized = tf.cast(image_resized, tf.float32)
    image_resized = (image_resized - 127.5) / 127.5
    return tf.expand_dims(image_resized, 0).numpy()

def load_image_from_url(url):
    """Load and preprocess image from URL"""
    response = requests.get(url)
    image = Image.open(BytesIO(response.content)).convert("RGB")  # Convert to RGB
    image = preprocess_image(image)
    return image


class AnimalClassifier:
    def __init__(self):
        self.model_url = "https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/4"
        self.classification_model = Sequential([
            hub.KerasLayer(self.model_url, trainable=False)
        ])
        
        self.download_labels()
        with open("ilsvrc2012_wordnet_lemmas.txt", "r") as f:
            self.labels = [line.strip() for line in f.readlines()]
    
    def download_labels(self):
        """Download ImageNet labels if not present"""
        try:
            with open("ilsvrc2012_wordnet_lemmas.txt", "r") as f:
                pass
        except FileNotFoundError:
            url = "https://storage.googleapis.com/bit_models/ilsvrc2012_wordnet_lemmas.txt"
            response = requests.get(url)
            with open("ilsvrc2012_wordnet_lemmas.txt", "w") as f:
                f.write(response.text)
    
    def predict(self, image_url):
        try:
            image = load_image_from_url(image_url)
            predictions = self.classification_model.predict(image)
            predicted_label = self.labels[int(np.argmax(predictions))]
            return {"species": predicted_label, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "error"}

# Initialize the classifier
classifier = AnimalClassifier()

def get_image_metadata(image):
    metadata = {}
    try:
        img = Image.open(image)
        info = img._getexif()
        if info:
            for tag, value in info.items():
                tag_name = TAGS.get(tag, tag)
                metadata[tag_name] = str(value)
        else:
            print("No EXIF metadata found")
    except Exception as e:
        print(f"Error extracting metadata: {e}")
    return metadata

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    try:
        # Extract metadata from the raw image
        image_metadata = get_image_metadata(BytesIO(file.read()))
        file.seek(0)  # Reset file pointer to the beginning after reading
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        image_url = upload_result["secure_url"]

        return jsonify({"imageUrl": image_url, "metadata": image_metadata})
    except Exception as e:
        print(f"Error during upload: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Use credentials from environment variables
    test_user_email = os.getenv("TEST_USER_EMAIL")
    test_user_password = os.getenv("TEST_USER_PASSWORD")
    
    if email == "user@example.com" and password == "password":
        session['user'] = email
        return jsonify({"success": True})
    else:
        return jsonify({"success": False}), 401

@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user' in session:
        return jsonify({"isAuthenticated": True})
    else:
        return jsonify({"isAuthenticated": False})

# New endpoint for animal classification
@app.route('/classify-animal', methods=['POST'])
def classify_animal():
    if 'image_url' not in request.json:
        return jsonify({"error": "No image URL provided", "status": "error"}), 400
    
    image_url = request.json['image_url']
    result = classifier.predict(image_url)

    # Extract only the species field
    species = result.get("species", "Unknown")
    
    return species  # Return only the species

@app.route('/animal-info', methods=['POST'])
def get_animal_info():
    if 'species' not in request.json:
        return jsonify({"error": "No species name provided", "status": "error"}), 400
    
    species = request.json['species']
    api_url = 'https://api.api-ninjas.com/v1/animals?name={}'.format(species)
    
    response = requests.get(api_url, headers={'X-Api-Key': api_key})
    
    if response.status_code == requests.codes.ok:
        animal_info = response.json()  # Get the JSON response from the API
    else:
        animal_info = {"error": response.status_code, "message": response.text}
    
    return jsonify(animal_info)  # Return animal info

@app.route('/save-data', methods=['POST'])
def save_data():
    data = request.get_json()
    print(data)
    try:
        file_path = os.path.join(os.path.dirname(__file__), '../react-frontend/birdo/src/data/data.json')
        with open(file_path, 'r+') as file:
            file_data = json.load(file)
            file_data.append(data)
            file.seek(0)
            json.dump(file_data, file, indent=4)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error saving data: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/get-insights', methods=['POST'])
def get_insights():
    try:
        data = request.get_json()
        species = data.get('species')
        
        if not species:
            return jsonify({"error": "Species parameter is required"}), 400

        prompt = f"""Given the following data on wildlife sightings for {species}, provide actionable insights that can help users make informed decisions. The insights should include:
1. Population Trend: Analyze population changes
2. Migration Pattern: Describe observed movement patterns
3. Human Impact Alert: Identify human-related threats
4. Optimal Spotting Times/Locations: Recommend best observation opportunities

Format the response EXACTLY like this example (keep the section headers verbatim):

Population Trend:
"The population of [species] has declined by 15% in the past month in [region], suggesting potential threats or habitat disruption. Further investigation is needed to identify underlying causes."

Migration Pattern:
"Recent sightings show that [species] is migrating northward, with the last sighting at coordinates [coordinates]. It is expected to arrive in [new region] within the next week."

Human Impact Alert:
"Increased sightings of [species] near urban areas indicate possible habitat disturbance. Conservation efforts may need to focus on protecting these critical areas."

Optimal Spotting Times/Locations:
"Most sightings of [species] occur at 6 AM near water sources in [region]. Plan your observation trips accordingly for the best chances of spotting them."""""

        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a wildlife conservation expert providing concise, factual insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=400
        )

        insights = response.choices[0].message.content.strip()
        return insights, 200  # Return raw text as the frontend expects

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return jsonify({"error": "Failed to generate insights"}), 500

if __name__ == '__main__':
    app.run(debug=True)