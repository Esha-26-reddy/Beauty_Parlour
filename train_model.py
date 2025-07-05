import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Step 1: Load data
data = pd.read_csv('chat_data.csv')  # Make sure this file exists in the same folder

# Step 2: Vectorize the text (questions)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(data['question'])

# Step 3: Target output (answers)
y = data['answer']

# Step 4: Train the model
model = MultinomialNB()
model.fit(X, y)

# Step 5: Save model and vectorizer using pickle
with open('chatbot_model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("✅ Model trained and saved as chatbot_model.pkl and vectorizer.pkl")
