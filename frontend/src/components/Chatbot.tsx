// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { MessageCircle, Send, X, Loader2 } from 'lucide-react';

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// export function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = input.trim();
//     setInput('');
//     setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
//     setIsLoading(true);

//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       const result = await model.generateContent(userMessage);
//       const response = await result.response;
//       const text = response.text();
      
//       setMessages(prev => [...prev, { role: 'assistant', content: text }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, { 
//         role: 'assistant', 
//         content: 'I apologize, but I encountered an error. Please try again.' 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {/* Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//       >
//         <MessageCircle className="h-6 w-6" />
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="absolute bottom-20 right-0 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center space-x-2">
//               <MessageCircle className="h-5 w-5 text-blue-600" />
//               <h3 className="font-semibold">FinanceHub Assistant</h3>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   message.role === 'user' ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-lg p-3 ${
//                     message.role === 'user'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {message.content}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 rounded-lg p-3">
//                   <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <form onSubmit={handleSubmit} className="p-4 border-t">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask about our financial services..."
//                 className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 disabled={isLoading}
//               />
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 <Send className="h-5 w-5" />
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X } from 'lucide-react';

// export function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {/* Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//       >
//         <MessageCircle className="h-6 w-6" />
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="absolute bottom-20 right-0 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center space-x-2">
//               <MessageCircle className="h-5 w-5 text-blue-600" />
//               <h3 className="font-semibold">FinanceHub Assistant</h3>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Embedded Chatbot Iframe */}
//           <div className="flex-1 overflow-hidden">
//             <iframe
//               src="https://www.chatbase.co/chatbot-iframe/jVwrZtEkRBqBMo_eOV3Aq"
//               width="100%"
//               style={{ height: '100%', minHeight: '700px' }}
//               frameBorder="0"
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">FinanceHub Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/jVwrZtEkRBqBMo_eOV3Aq"
              width="100%"
              style={{ height: "500px", border: "none" }}
              frameBorder="0"
            />
          </div>
        </div>
      )}
</div>
  );
}