import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar'; // ✅ Import Sidebar

export default function ChatPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex font-sans">
      {/* Sidebar (LEFT) */}
      <div className="w-1/4 bg-white border-r">
        <Sidebar role={currentUser.role} />
      </div>

      {/* Chat Area (RIGHT) */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <h1 className="text-2xl font-bold text-center my-6">Chat</h1>

        {/* Chat Messages Box */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === currentUser._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} shadow`}>
                {msg.text}
                {msg.senderId === currentUser._id && (
                  <div className="text-[10px] text-right mt-1">
                    {msg.seen ? 'Seen ✅' : 'Sent ✔️'}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* 🛫 Scroll auto to bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box + send button (to be added) */}
      </div>
    </div>
  );
}
