from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

# Load model and vectorizer
with open('chatbot_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

app = Flask(__name__)
CORS(app, origins=["https://rohini-beauty-parlour.vercel.app"])  # restrict frontend domain

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        user_msg = data.get('message', '').strip()
        if not user_msg:
            return jsonify({'error': 'Message is required'}), 400

        user_vec = vectorizer.transform([user_msg])
        prediction = model.predict(user_vec)[0]

        return jsonify({'reply': prediction})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
