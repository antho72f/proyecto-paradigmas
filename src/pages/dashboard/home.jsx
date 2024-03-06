import React, { useState, useEffect } from "react";
import OpenAI from "openai";

const apiKey = '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';
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

export function Home() {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("messages");
    return storedMessages ? JSON.parse(storedMessages) : [
      { text: "Hola, ¿En qué te puedo ayudar hoy?", isUser: false },
    ];
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue("");

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: inputValue }],
      });
    
      const botMessage = response.choices[0].message.content.trim();
      setMessages([...newMessages, { text: botMessage, isUser: false }]);
    } catch (error) {
      console.error("Error al obtener la respuesta de OpenAI:", error);
    }    
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto px-6 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
          >
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="bottom-fixed flex items-center justify-between px-4 py-2 border-t border-gray-300">
        <input
          type="text"
          placeholder="Mensaje..."
          className="w-2/3 md:w-2/3 sm:w-2/3 px-2 py-1 mr-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:border-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="w-1/3 md:w-1/3 sm:w-1/3 px-2 py-1 bg-blue-500 text-xs md:text-sm text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Enviar
        </button>
      </form>

      <style>
        {`
        .bottom-fixed {
          position: fixed;
          bottom: 0;
          width: 75%;
        }
        `}
      </style>
    </div>
  );
  
}

export default Home;
