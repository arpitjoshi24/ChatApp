import React from "react";

export default function MessageList({ messages, currentUserId }) {
  const downloadFile = async (filename) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/download/${filename}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download file: ${error.message}`);
    }
  };

  // Function to get file icon based on extension
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconClass = "w-5 h-5 mr-2";
    
    switch (ext) {
      case 'pdf':
        return (
          <svg className={iconClass} fill="#FF0000" viewBox="0 0 24 24">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className={iconClass} fill="#2B579A" viewBox="0 0 24 24">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7.5 8.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v2zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v4zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className={iconClass} fill="#217346" viewBox="0 0 24 24">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
          </svg>
        );
      case 'zip':
      case 'rar':
        return (
          <svg className={iconClass} fill="#FFA500" viewBox="0 0 24 24">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z"/>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <svg className={iconClass} fill="#4CAF50" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="#666" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
    }
  };

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((msg) => {
        const sender = typeof msg.sender === "string"
          ? { _id: msg.sender, name: "Unknown" }
          : msg.sender;

        const isMe = sender._id === currentUserId;

        return (
          <div
            key={msg._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex flex-col max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"}`}>
              {/* Sender name */}
              {!isMe && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                    {sender.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{sender.name}</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`relative rounded-2xl px-4 py-3 shadow-sm ${
                  isMe 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                }`}
              >
                {/* Text message */}
                {msg.message && (
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                )}

                {/* File message */}
                // In your MessageList component, update the file display part:
{msg.type === "file" && msg.fileUrl && (
  <button
    onClick={() => downloadFile(msg.fileUrl)}
    className={`flex items-center p-3 rounded-lg border transition-all duration-200 hover:shadow-md w-full ${
      isMe 
        ? "bg-blue-400 border-blue-300 hover:bg-blue-300" 
        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }`}
  >
    {getFileIcon(msg.fileUrl)}
    <div className="flex-1 text-left min-w-0">
      <p className={`text-sm font-medium truncate ${isMe ? "text-white" : "text-gray-700"}`}>
        {msg.fileUrl.split('/').pop()} {/* Show only filename */}
      </p>
      <p className={`text-xs ${isMe ? "text-blue-100" : "text-gray-500"}`}>
        {formatFileSize(msg.fileSize)} • Click to download
      </p>
    </div>
    <svg 
      className={`w-4 h-4 ml-2 ${isMe ? "text-blue-200" : "text-gray-400"}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </button>
)}

                {/* Message status indicator for sent messages */}
                {isMe && (
                  <div className="flex justify-end mt-1">
                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className={`text-xs mt-1 px-1 ${isMe ? "text-gray-500" : "text-gray-400"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}