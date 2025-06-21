
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='static')
CORS(app)

TESTIMONIALS_FILE = 'testimonials.json'

def load_testimonials():
    if not os.path.exists(TESTIMONIALS_FILE):
        return []
    with open(TESTIMONIALS_FILE, 'r') as f:
        return json.load(f)

def save_testimonials(data):
    with open(TESTIMONIALS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    return jsonify(load_testimonials())

@app.route('/api/testimonials', methods=['POST'])
def add_testimonial():
    new_testimonial = request.json
    data = load_testimonials()
    data.append(new_testimonial)
    save_testimonials(data)
    return jsonify({'message': 'Testimonial saved successfully'}), 201

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
