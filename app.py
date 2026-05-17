from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
app = Flask(__name__)

# MongoDB Connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/notesdb"
mongo = PyMongo(app)

# Home Page
@app.route('/')
def home():
    return render_template('index.html')

# Get Notes
@app.route('/get_notes', methods=['GET'])
def get_notes():
    notes = []
    for note in mongo.db.notes.find():
        notes.append({
            '_id': str(note['_id']),
            'text': note['text']
        })
    return jsonify(notes)

# Add Note
@app.route('/add_note', methods=['POST'])
def add_note():
    data = request.json
    mongo.db.notes.insert_one({
        'text': data['text']
    })
    return jsonify({'message': 'Note added'})

# Delete Note
@app.route('/delete_note/<id>', methods=['DELETE'])
def delete_note(id):
    mongo.db.notes.delete_one({
        '_id': ObjectId(id)
    })
    return jsonify({'message': 'Note deleted'})

# Edit Note
@app.route('/edit_note/<id>', methods=['PUT'])
def edit_note(id):
    data = request.json
    mongo.db.notes.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'text': data['text']}}
    )
    return jsonify({'message': 'Note updated'})

if __name__ == '__main__':
    app.run(debug=True)