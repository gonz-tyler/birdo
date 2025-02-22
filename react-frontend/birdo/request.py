   import requests
   
   response = requests.post(
       "http://localhost:5000/predict",
       json={"image_url": "https://images.pexels.com/photos/6477261/pexels-photo-6477261.jpeg"}
   )
   print(response.json())