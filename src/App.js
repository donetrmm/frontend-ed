import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [apiData, setApiData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io("http://44.216.58.62");

    socket.on("websocketEvent", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleApiFetch = async () => {
    const serviceOrder = {
      name: "PAGO",
    };

    try {
      const response = await fetch("http://52.0.157.138/service-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceOrder),
      });

      if (!response.ok) {
        throw new Error("Hubo un problema al realizar la solicitud.");
      }

      const jsonData = await response.json();
      setApiData(jsonData);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <div className="container">
            <div className="component api-fetch">
        <h2>Evento</h2>
        <div>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
          <div ref={messagesEndRef} />
        </div>
        <button onClick={handleApiFetch}>Iniciar</button>
      </div>
      <div className="component websocket">
      <h2>WebSocket</h2>
        <div className="scrollable">
          <ul>
            {messages.map((message, index) => (
              <li key={index}>
                <pre>{JSON.stringify(message, null, 2)}</pre>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
