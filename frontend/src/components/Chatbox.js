import React, { useState, useEffect, useRef } from 'react';
import '../Chatbox.css';

const Chatbox = () => {
  const [showChatbox, setShowChatbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      sender: 'User',
      message: `<span class='user-label'>User:</span> ${userInput}`
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC7drj9va4kH3ldX1CHQ1jtvf-DzpnChLs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userInput }] }],
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const botMessage = {
        sender: 'Gemini',
        message: `<span class='ai-label'>SmartAI:</span> ${data?.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*/g, '') || 'Sorry, I didn’t catch that.'}`
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setMessages((prev) => [...prev, { sender: 'Gemini', message: "<span class='ai-label'>SmartAI:</span> There was an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="chatbox-toggle" onClick={() => setShowChatbox(!showChatbox)}>SmartAI</div>
      {showChatbox && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h3>Chat with Gemini</h3>
            <button onClick={() => setShowChatbox(false)}>X</button>
          </div>
          <div className="chatbox-body">
            {messages.length === 0 && <div className="placeholder">Please ask SmartAI</div>}  
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender.toLowerCase()}`}>
                <p dangerouslySetInnerHTML={{ __html: msg.message }}></p>
              </div>
            ))}
            {isLoading && <div className="chat-message loading"><p>Loading...</p></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Type your message..."
            />
            <button onClick={handleChatSubmit}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
