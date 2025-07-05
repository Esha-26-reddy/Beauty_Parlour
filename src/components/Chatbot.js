import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Welcome to Rohini Beauty Parlour. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await axios.post('http://localhost:5000/api/chatbot', { message: input });

      // Add bot reply
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: response.data.reply || "Sorry, I didn't get that." },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
      ]);
      console.error('Chatbot API error:', error);
    }

    setIsLoading(false);
    setInput('');
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end',
              backgroundColor: msg.from === 'bot' ? '#e0e0e0' : '#e91e63',
              color: msg.from === 'bot' ? '#000' : '#fff',
              borderTopLeftRadius: msg.from === 'bot' ? 0 : 20,
              borderTopRightRadius: msg.from === 'bot' ? 20 : 0,
            }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && <div style={styles.typingIndicator}>Bot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          style={styles.inputBox}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            ...styles.sendButton,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: 340,
    height: 420,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    gap: 8,
  },
  message: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: 20,
    fontSize: 14,
    lineHeight: 1.4,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 12,
    paddingLeft: 8,
  },
  inputContainer: {
    display: 'flex',
    padding: 12,
    borderTop: '1px solid #ddd',
  },
  inputBox: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#e91e63',
    border: 'none',
    borderRadius: 6,
    padding: '10px 16px',
    color: '#fff',
    fontWeight: 'bold',
  },
};

export default Chatbot;
