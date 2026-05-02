import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import DOMPurify from 'dompurify';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * ChatbotWidget component providing an AI-powered election assistant.
 * Incorporates security sanitization and performance optimizations.
 */
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Election Assistant powered by Gemini. Ask me anything about the election process, candidates, or your constituency.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Chat Session with context
  useEffect(() => {
    let isMounted = true;
    const initChat = async () => {
      try {
        const [phasesSnap, candidatesSnap] = await Promise.all([
          getDocs(collection(db, "election_phases")),
          getDocs(collection(db, "candidates"))
        ]);
        
        let phasesContext = "Election Phases:\n";
        phasesSnap.forEach(doc => {
          const d = doc.data();
          phasesContext += `- ${d.title} (${d.date}): ${d.description} [Status: ${d.status}]\n`;
        });

        let candidatesContext = "Candidates:\n";
        candidatesSnap.forEach(doc => {
          const d = doc.data();
          candidatesContext += `- ${d.name} (${d.party}) - Votes: ${d.votes}\n`;
        });

        const systemInstruction = `You are a helpful, conversational Election Assistant. 
You answer questions clearly and in an easy-to-follow way for beginners.
Context:
${phasesContext}
${candidatesContext}
Always be polite and helpful. If asked how to vote, direct them to register and then use the Dashboard.`;

        const apiKey = import.meta.env.VITE_GEMINI_API;
        if (apiKey && isMounted) {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction 
          });
          const chat = model.startChat({
            history: [
              { role: "user", parts: [{ text: "Hello" }] },
              { role: "model", parts: [{ text: "Hello! I'm your Election Assistant. How can I help you today?" }] }
            ]
          });
          setChatSession(chat);
        }
      } catch (err) {
        console.error("Chat initialization failed:", err.message);
      }
    };
    initChat();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sanitize and Send message - Optimized with useCallback
  const handleSend = useCallback(async (e) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || !chatSession) return;

    // Security: Sanitize user input to prevent XSS
    const sanitizedInput = DOMPurify.sanitize(trimmedInput);
    
    setMessages(prev => [...prev, { id: Date.now(), text: sanitizedInput, isBot: false }]);
    setInput('');
    setIsTyping(true);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, text: "Thinking...", isBot: true }]);

    try {
      const result = await chatSession.sendMessage(sanitizedInput);
      const responseText = result.response.text();
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: responseText } : m));
    } catch (err) {
      console.error("Gemini Error:", err.message);
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, text: "I'm having trouble connecting to my brain right now. Please try again later." } : m));
    } finally {
      setIsTyping(false);
    }
  }, [input, chatSession]);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }} role="region" aria-label="Election Assistant Chatbot">
      {isOpen ? (
        <div className="card glass-panel flex-col animate-fade-in" style={{ width: '350px', height: '500px', padding: 0, overflow: 'hidden', display: 'flex' }}>
          <div className="flex items-center justify-between p-4" style={{ background: 'rgba(79, 70, 229, 0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
            <div className="flex items-center gap-2">
              <Bot className="text-primary" aria-hidden="true" />
              <span style={{ fontWeight: 600 }} id="chatbot-title">Election Assistant</span>
            </div>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} aria-label="Close Chatbot">
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
              placeholder="Ask about elections..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
              disabled={!chatSession || isTyping}
              aria-label="Your message"
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }} disabled={!chatSession || isTyping} aria-label="Send message">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="btn btn-primary animate-fade-in" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)' }}
          aria-label="Open Election Assistant Chat"
        >
          <MessageSquare size={28} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
