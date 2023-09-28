from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
import cv2
import mysql.connector

app = Flask(__name__)
CORS(app)

mydb = mysql.connector.connect(
host="localhost",
user="root",
password="Jibimax123",
database="rainfalldepartures"
)

model1 = load_model('./server/satellite3.h5')
imageclassifier = load_model('./server/ImageClassifier.h5')
model = load_model('./server/CloudBurstPredictorversion4.h5')

mycursor = mydb.cursor()

mycursor.execute("select * from departures")


# Define a route for image upload
@app.route('/upload1', methods=['POST'])
def upload_image1():
    if 'image' in request.files:
        image = request.files['image']
        allowed_extensions = {'jpg', 'jpeg', 'png', 'tif', 'tiff'}
        file_extension = image.filename.rsplit('.', 1)[1].lower()
        if file_extension not in allowed_extensions:
            return jsonify({'error': 'Unsupported image format'})
        
        # You can save the image if needed
        image.save(image.filename)
        img = cv2.imread(image.filename)
        img = cv2.resize(img,(512,512),interpolation=cv2.INTER_AREA)
        
        img = (img - img.min())/(img.max() - img.min())
        img.resize([1,512,512,3])
        predictions = model1.predict(img)
        os.remove(image.filename)
        return jsonify(predictions.tolist())
    return jsonify({'error': 'No image provided'})

@app.route('/upload2', methods=['POST'])
def upload_image2():
    if 'image' in request.files:
        image = request.files['image']
        allowed_extensions = {'jpg', 'jpeg', 'png', 'tif', 'tiff'}
        file_extension = image.filename.rsplit('.', 1)[1].lower()
        if file_extension not in allowed_extensions:
            return jsonify({'error': 'Unsupported image format'})
        
        # You can save the image if needed
        image.save(image.filename)
        img = cv2.imread(image.filename)
        img = cv2.resize(img,(128,128),interpolation=cv2.INTER_AREA)
        img = img/255
        img = img.reshape([1,128,128,3])
        predictions = imageclassifier.predict(img)
        os.remove(image.filename)
        return jsonify(predictions.tolist())
    return jsonify({'error': 'No image provided'})

@app.route('/upload3', methods=['POST'])
def timeseries():
    data = request.get_json()
    district = data.get('district_name', 'None')

    for x in mycursor:
    
        if district != 'None' and x[0] == district:
            #st.write(x[1:])
            input = x[1:]
            input = np.array(input)
            #st.write(x[1:])
            input = input.reshape([1,14,1])
            result = model.predict(input)
            #print(x.shape)
            print(x)
            return jsonify(result.tolist())
        
    return jsonify({'error': 'Error Occurred'})

if __name__ == '__main__':
    app.run(debug=True)
