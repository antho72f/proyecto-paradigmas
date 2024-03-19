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
      if (inputValue.toLowerCase().includes("generar una imagen")) {
        const imageResponse = await openai.images.generate({ 
          model: "dall-e-2", 
          prompt: `Utiliza tu imaginación y crea una imagen sorprendente basada en "${inputValue}". ¡Sé tan creativo como puedas!` 
        });
        const imageURL = imageResponse.data[0].url;
        setMessages([...newMessages, { text: `Aquí está la imagen generada:`, imageUrl: imageURL, isUser: false }]);
      } else {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ 
            role: 'user', 
            content: `Déjate llevar por la creatividad y responde de manera original a "${inputValue}".` 
          }],
        });
      
        const botMessage = response.choices[0].message.content.trim();
        setMessages([...newMessages, { text: botMessage, isUser: false }]);
      }
    } catch (error) {
      console.error("Error al obtener la respuesta de OpenAI:", error);
    }    
  };

  const handleNewChat = () => {
    localStorage.removeItem("messages");
    setMessages([{ text: "Hola, ¿En qué te puedo ayudar hoy?", isUser: false }]);
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
              {message.imageUrl && (
                <div className="image-container">
                  <img src={message.imageUrl} alt="Generated Image" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-fixed flex items-center justify-between px-4 py-2 border-t border-gray-300 w-full max-w-screen-xl mx-auto bg-gray-700 rounded-t-lg">
        <div className="flex-grow flex items-center">
          <button
            className="px-2 py-1 bg-gray-300 text-xs md:text-sm text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 mr-2"
            onClick={handleNewChat}
          >
            Nuevo Chat
          </button>
          <textarea
          type="text"
          placeholder="Mensaje..."
          className="px-2 py-1 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:border-blue-500 flex-grow"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-xs md:text-sm text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ml-2"
            onClick={sendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
      <style>
        {`
        .bottom-fixed {
          position: fixed;
          bottom: 0;
          width: 100%;
        }
        .image-container {
          max-width: 100%;
          overflow: hidden;
        }
        .image-container img {
          width: 40%;
          height: auto;
          display: block;
        }
        `}
      </style>
    </div>
  );
}

export default Home;
