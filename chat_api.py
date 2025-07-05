from flask import Flask, request, jsonify
import pickle

# Load the trained model and vectorizer
with open('chatbot_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_msg = data.get('message', '')

    # Vectorize user message
    user_vec = vectorizer.transform([user_msg])

    # Predict response
    prediction = model.predict(user_vec)[0]

    return jsonify({'reply': prediction})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
