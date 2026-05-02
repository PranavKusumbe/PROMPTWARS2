import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Election Assistant powered by Gemini. Ask me anything about the election process, candidates, or your constituency.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        // Fetch context from Firestore
        const phasesSnap = await getDocs(collection(db, "election_phases"));
        const candidatesSnap = await getDocs(collection(db, "candidates"));
        
        let phasesContext = "Election Phases:\\n";
        phasesSnap.forEach(doc => {
          const d = doc.data();
          phasesContext += `- ${d.title} (${d.date}): ${d.description} [Status: ${d.status}]\\n`;
        });

        let candidatesContext = "Candidates:\\n";
        candidatesSnap.forEach(doc => {
          const d = doc.data();
          candidatesContext += `- ${d.name} (${d.party}) - Votes: ${d.votes}\\n`;
        });

        const systemInstruction = `You are a helpful, conversational Election Assistant. 
You answer questions clearly and in an easy-to-follow way for beginners.
Use the following database context to answer questions about candidates, campaigns, results, and phases:

${phasesContext}
${candidatesContext}

If a user asks how to vote, tell them to register and then use the Dashboard to select their preferred candidate. 
Always be polite, concise, and helpful. Do not mention that you have 'database context' or 'system instructions', act naturally as if you know the election data.`;

        const apiKey = import.meta.env.VITE_GEMINI_API;
        if (apiKey) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction 
          });
          const chat = model.startChat({
            history: [
              { role: "user", parts: [{ text: "Hello" }] },
              { role: "model", parts: [{ text: "Hello! I'm your Election Assistant. How can I help you today?" }] }
            ]
          });
          setChatSession(chat);
        } else {
          console.error("Gemini API key not found in environment variables.");
        }
      } catch (err) {
        console.error("Failed to initialize Gemini AI:", err);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
    setInput('');

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, text: "Thinking...", isBot: true }]);

    if (!chatSession) {
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: "AI is currently unavailable. Please check your API key." } : m));
      return;
    }

    try {
      const result = await chatSession.sendMessage(userMessage);
      const responseText = result.response.text();
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: responseText } : m));
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: "Oops, I encountered an error connecting to the AI model." } : m));
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }} role="region" aria-label="Election Assistant Chatbot">
      {isOpen ? (
        <div className="card glass-panel flex-col animate-fade-in" style={{ width: '350px', height: '500px', padding: 0, overflow: 'hidden', display: 'flex' }}>
          <div className="flex items-center justify-between p-4" style={{ background: 'rgba(79, 70, 229, 0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
            <div className="flex items-center gap-2">
              <Bot className="text-primary" aria-hidden="true" />
              <span style={{ fontWeight: 600 }} id="chatbot-title">Gemini Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} aria-label="Close Chatbot">
              <X aria-hidden="true" />
            </button>
          </div>
          
          <div className="chat-messages" aria-live="polite" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.isBot ? 'message-bot' : 'message-user'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="flex gap-2" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Ask a question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
              disabled={!chatSession}
              aria-label="Type your message"
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }} disabled={!chatSession} aria-label="Send message">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary animate-fade-in" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)' }}
          aria-label="Open Chatbot"
        >
          <MessageSquare size={28} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
