import os
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO

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

def get_image_metadata(image):
    metadata = {}
    try:
        img = Image.open(image)
        info = img._getexif()
        if info:
            for tag, value in info.items():
                tag_name = TAGS.get(tag, tag)
                metadata[tag_name] = str(value)  # Convert value to string
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
    
    print(f"Received login attempt with email: {email} and password: {password}")
    
    if email == test_user_email and password == test_user_password:
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

if __name__ == '__main__':
    app.run(debug=True)
