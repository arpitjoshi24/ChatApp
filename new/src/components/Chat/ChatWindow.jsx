import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "../../context/AuthContext";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
});

export default function ChatWindow() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(({ data }) => setUsers(data.filter((u) => u._id !== user._id)))
      .catch((err) => console.error("❌ Error fetching users:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!receiverId || !user) return;
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/chat/${receiverId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(({ data }) => setMessages(data))
      .catch((err) => console.error("❌ Error fetching messages:", err))
      .finally(() => setIsLoading(false));
  }, [receiverId, user]);

  useEffect(() => {
    if (!user) return;
    socket.emit("join_room", user._id);

    socket.on("receive_message", (msg) => {
      const sender = typeof msg.sender === "string" ? { _id: msg.sender, name: "Unknown" } : msg.sender;
      if (
        sender._id === receiverId ||
        msg.receiver?._id === receiverId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive_message");
  }, [receiverId, user]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async (text, file) => {
  if (!text && !file) return;
  if (!user || !receiverId) return;

  try {
    const formData = new FormData();
    formData.append("receiver", receiverId);
    
    if (text) {
      formData.append("text", text);
    }
    
    if (file) {
      formData.append("file", file);
    }


    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/chat/send`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const sentMessage = response.data;

    setMessages((prev) => [...prev, sentMessage]);

   
    socket.emit("send_message", {
      _id: sentMessage._id,
      sender: { _id: user._id, name: user.name },
      receiver: { _id: receiverId },
      message: sentMessage.message,
      fileUrl: sentMessage.fileUrl,
      fileSize: sentMessage.fileSize,
      type: sentMessage.type,
      createdAt: sentMessage.createdAt
    });

  } catch (err) {
    console.error(" Error sending message:", err);
    throw err;
  }
};

  const selectedUser = users.find((u) => u._id === receiverId);

  return (
    <div className="flex h-screen bg-gray-50">
     
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
       
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Messages</h1>
              <p className="text-blue-100 text-sm mt-1">Welcome, {user?.name}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0112 0c0 .295-.046.585-.132.865A5.99 5.99 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

      
        <div className="flex-1 overflow-y-auto">
          <h3 className="px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-50">CONTACTS</h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setReceiverId(user._id)}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                  receiverId === user._id 
                    ? "bg-blue-50 border-l-4 border-l-blue-500" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    receiverId === user._id ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">Online</p>
                </div>
                {receiverId === user._id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

  
      <div className="flex-1 flex flex-col">
 
        {selectedUser ? (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
             
              
            </div>
          </div>
        ) : (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-500">Select a conversation</h2>
              <p className="text-sm text-gray-400">Choose a contact to start messaging</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
          {selectedUser ? (
            <>
              <div className="h-full overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <MessageList messages={messages} currentUserId={user?._id} />
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No Conversation Selected</h3>
                <p className="text-gray-400">Choose a contact from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>

  
        {selectedUser && <MessageInput onSend={handleSend} />}
      </div>
    </div>
  );
}