"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import notyf from "@/utils/notificacion";
import { useSession } from "next-auth/react";


export default function Chat({ information, messagesSave, setMessagesSave }) {
    const { data: session } = useSession();
    const [disabled, setDisabled] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [saving, setSaving] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState(null);
    const [showSavedMessages, setShowSavedMessages] = useState(false);
    const messagesEndRef = useRef(null);
    const savedMessagesRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (savedMessagesRef.current && !savedMessagesRef.current.contains(event.target)) {
                setShowSavedMessages(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const EnviarPregunta = async () => {
        const { tema, content, knowledge } = information
        const userMessage = {
            id: messages.length + 1,
            role: "user",
            content: input,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setDisabled(true);
        setThinking(true)

        try {
            const response = await fetch("/api/chat/conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    threadId,
                    contentInput: input,
                    tema,
                    content,
                    knowledge
                }),
            });

            if (response.ok && response.body) {
                if (!threadId) setThreadId(response.headers.get("X-Thread-Id"));

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                const assistantMessageId = messages.length + 2;


                setMessages((prev) => [
                    ...prev,
                    { id: assistantMessageId, role: "assistant", content: "" },
                ]);
                setThinking(false);

                await new Promise(resolve => setTimeout(resolve, 10));

                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;

                    if (value) {
                        const chunkValue = decoder.decode(value, { stream: !done });

                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: msg.content + chunkValue }
                                    : msg
                            )
                        );
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        setDisabled(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        EnviarPregunta();
    };

    const handleKeySubmit = (e) => {
        if (input !== "") {
            if (e.key === "Enter") {
                e.preventDefault();
                EnviarPregunta();
            }
        }
    };

    const formatMessageContent = (content) => {
        return content.replace(/\n/g, "<br>");
    };

    const descargarConversacion = () => {  
        const conversacionTexto = messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n\n');

        const blob = new Blob([conversacionTexto], { type: 'text/plain' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversacion.txt';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const cargarConversacion = (savedMessageIndex) => {
        if (messagesSave && messagesSave[savedMessageIndex] && messagesSave[savedMessageIndex].messages) {
            const messagesWithIds = messagesSave[savedMessageIndex].messages.map((msg) => ({
                ...msg,
            }));
            setMessages(messagesWithIds);
            setThreadId(messagesSave[savedMessageIndex].threadId);
            setShowSavedMessages(false);
        }
    };

    const iniciarNuevoChat = () => {
        setMessages([]);
        setInput("");
        setThreadId(null);
        setShowSavedMessages(false);
    };


    const guardarConversacion = async () => {
        if (messagesSave.length > 0) {
            const compararConversation = messagesSave.find((msg) => msg.threadId === threadId);
            if (compararConversation && compararConversation.messages.length === messages.length) return notyf.error("La conversacion ya esta guardada")
            if (messagesSave.length > 2) return notyf.error("Solo se pueden guardar 3 conversaciones")
        }

        setDisabled(true);
        setSaving(true);

        try {
            const res = await fetch("/api/chat/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    threadId,
                    messages,
                    email: session.user.email
                }),
            })
            if (res.ok) {
                notyf.success("Conversacion guardada");
                setMessagesSave((prevMessagesSave) => {
                    const existingIndex = prevMessagesSave.findIndex(msg => msg.threadId === threadId);

                    if (existingIndex !== -1) {
                        const updatedMessagesSave = [...prevMessagesSave];
                        updatedMessagesSave[existingIndex] = { threadId, messages };
                        return updatedMessagesSave;
                    } else {
                        return [...prevMessagesSave, { threadId, messages }];
                    }
                });
            }
        } catch (error) {
            console.error("Error al guardar conversacion")
        }
        setDisabled(false);
        setSaving(false);

    }

    return (
        <section className="flex justify-center items-center w-[670px] shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="max-w-xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative" ref={savedMessagesRef}>
                        <button
                            type="button"
                            onClick={() => setShowSavedMessages(!showSavedMessages)}
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-500 px-2 py-1 rounded transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-sm">Chats</span>
                        </button>

                        {showSavedMessages && (
                            <div className="absolute z-10 mt-1 w-64 bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden">
                                <div className="p-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between items-center">
                                    <span>Conversaciones guardadas</span>
                                    <button
                                        onClick={iniciarNuevoChat}
                                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Nuevo chat
                                    </button>
                                </div>

                                {messagesSave && messagesSave.length > 0 ? (
                                    <ul className="max-h-64 overflow-y-auto">
                                        {messagesSave.map((savedMsg, idx) => (
                                            <li
                                                key={idx}
                                                className="px-3 py-2 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors"
                                                onClick={() => cargarConversacion(idx)}
                                            >
                                                <div className="text-white text-[13px] font-medium truncate">{savedMsg.threadId}</div>
                                                <div className="text-gray-400 text-xs truncate mt-1 flex justify-between items-center">
                                                    {savedMsg.messages[0].content.substring(0, 35)}...

                                                    <Trash2 className="h-4 text-red-500" onClick={(e) => { alert("hola"); e.stopPropagation() }} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-3 px-3 text-gray-400 text-xs">
                                        No hay conversaciones guardadas
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {messages.length > 1 && (
                        <div className="flex gap-[100px]">

                            <button
                                type="button"
                                onClick={descargarConversacion}
                                disabled={disabled}
                                className="text-sm text-gray-400 hover:text-gray-500 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                <span>Descargar conv</span>
                            </button>
                            <button
                                type="button"
                                onClick={guardarConversacion}
                                disabled={disabled}
                                className="text-sm text-gray-400 hover:text-gray-500 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                <span>{saving ? "Guardando..." : "Guardar conv"}</span>
                            </button>
                        </div>

                    )}
                </div>

                <div className="text-white max-h-96 h-full overflow-y-auto bg-gray-800 rounded-md mb-4 p-3">
                    {messages.length > 0 ? (
                        messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex flex-col mb-2 p-2 rounded-md ${m.role === "assistant"
                                    ? "self-end bg-gray-700"
                                    : "self-start bg-blue-500"
                                    }`}
                            >
                                <span
                                    className={`text-xs ${m.role === "assistant" ? "text-right" : "text-left"}`}
                                >
                                    {m.role}
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: formatMessageContent(m.content)
                                    }}
                                    style={{ whiteSpace: "pre-wrap" }}
                                ></span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                            No hay mensajes. Comienza una conversación...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div>
                    <label className="text-gray-600 block font-bold my-2">{thinking?"Pensando...":""}</label>
                </div>

                <div className="relative">
                    <textarea
                        rows={3}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="text-black bg-gray-100 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 pr-16"
                        placeholder="Escribe algo..."
                        autoFocus
                        onKeyDown={handleKeySubmit}
                    />
                    <button
                        className="absolute bottom-4 right-2 bg-blue-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-blue-700"
                        disabled={disabled || input === ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </section>
    );
}