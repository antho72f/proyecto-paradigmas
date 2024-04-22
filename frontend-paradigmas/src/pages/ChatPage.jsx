import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import { ChatHistorialModal } from "../components/ui/ChatHistorialModal";
import { getMessagesByHistoryIdRequest } from "../api/historial"; // Importa la función para obtener mensajes por ID de historial

export function ChatPage() {
    const { user } = useAuth();

    const [messages, setMessages] = useState([
        { text: "¡Hola! ¿En qué puedo ayudarte hoy? Si necesitas generar una imagen, solo dime: 'Necesito generar una imagen', puedo ayudarte con eso también. Solo dime qué tipo de imagen estás buscando, y la GPT de CreativeGPT podrá proporcionarte una variedad de opciones creativas y originales. ¿Te gustaría una ilustración para tu proyecto, un diseño para redes sociales o quizás algo completamente único? ¡Estoy aquí para hacer que tu experiencia sea lo más fluida y productiva posible!", isUser: false },
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const [historialId, setHistorialId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/openai", { inputValue });
            const { text: openaiResponse, imageUrl } = response.data;

            const userMessageResponse = await axios.post("/historial", {
                HistorialID: historialId,
                Contenido: inputValue,
                UsuarioID: user.ID
            });
            const { Id: userMessageId } = userMessageResponse.data;

            if (!historialId) {
                setHistorialId(userMessageId);
            }

            const openaiMessageResponse = await axios.post("/historial", {
                HistorialID: userMessageId,
                Contenido: openaiResponse,
                UsuarioID: user.ID
            });

            const newMessages = [
                ...messages,
                { text: inputValue, isUser: true },
                { text: openaiResponse, imageUrl, isUser: false }
            ];
            setMessages(newMessages);
            setInputValue("");
        } catch (error) {
            //console.error("Error al enviar el mensaje o obtener la respuesta de OpenAI:", error);
        }
    };

    const handleNewChat = () => {
        localStorage.removeItem("messages");
        setMessages([{ text: "¡Hola! ¿En qué puedo ayudarte hoy? Si necesitas generar una imagen, solo dime: 'Necesito generar una imagen', puedo ayudarte con eso también. Solo dime qué tipo de imagen estás buscando, y la GPT de CreativeGPT podrá proporcionarte una variedad de opciones creativas y originales. ¿Te gustaría una ilustración para tu proyecto, un diseño para redes sociales o quizás algo completamente único? ¡Estoy aquí para hacer que tu experiencia sea lo más fluida y productiva posible!", isUser: false }]);
        setHistorialId(null);
    };

    const onViewMessage = async (messageId) => {
        try {
            const response = await getMessagesByHistoryIdRequest(messageId);
            const historyMessages = response.data.map(message => ({
                text: message.Contenido,
                isUser: message.UsuarioID === user.ID
            }));
            setMessages(historyMessages);
            setHistorialId(messageId);
            setShowModal(false);
        } catch (error) {
            //console.error("Error al cargar el historial de mensajes:", error);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
            <ChatHistorialModal onClose={() => setShowModal(false)} onViewMessage={onViewMessage} visible={showModal} />
            <div className="flex-grow overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(100% - 120px)" }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${index % 2 === 0 ? "text-right" : "text-left"}`} // Alternar entre text-right y text-left
                        style={{ borderRadius: "12px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", cursor: "pointer", transition: "background-color 0.3s" }}
                    >
                        <div
                            className={`inline-block p-2 rounded-lg ${index % 2 === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`} // Alternar entre bg-blue-500 y bg-gray-200
                            style={{ backgroundColor: index % 2 === 0 ? "#3182ce" : "#edf2f7" }} // Alternar entre colores de fondo
                        >
                            {message.text}
                            {message.imageUrl && (
                                <div className="image-container">
                                    <img src={message.imageUrl} alt="Generated Image" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="bottom-fixed flex items-center justify-between px-4 py-2 border-t border-gray-300 max-w-screen-lg mx-auto bg-gray-700 rounded-t-lg">
                <div className="flex-grow flex items-center">
                    <button
                        className="px-2 py-1 bg-gray-300 text-xs md:text-sm text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 mr-2"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="ml-1">Historial</span>
                    </button>
                    <button
                        className="px-2 py-1 bg-gray-300 text-xs md:text-sm text-black rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 mr-2"
                        onClick={handleNewChat}
                    >
                        <span className="ml-1">Nuevo Chat</span>
                    </button>
                    <textarea
                        type="text"
                        placeholder="Escribe tu mensaje aquí..."
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:border-blue-500 flex-grow"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ color: "black" }}
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
                    width: calc(100% - 40px);
                    padding: 10px 20px;
                    margin: 10px;
                }
                .flex-grow {
                    flex-grow: 1;
                }
                .image-container {
                    max-width: 100%;
                    overflow: hidden;
                }
                .image-container img {
                    width: 40%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                `}
            </style>
        </div>
    );
}
