import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setIsUploading(true);
    try {
      await onSend(text, file);
      setText("");
      setFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        alert("File size too large. Please select a file smaller than 10MB.");
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-rar-compressed'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("File type not supported. Please select an image, PDF, document, or archive file.");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      
      setText(newText);
      
      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setText(prev => prev + emoji);
    }
    
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  return (
    <div className="bg-white border-t border-gray-200 p-4 relative">
      {/* File Preview */}
      {file && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFileRemove}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            disabled={isUploading}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full right-12 mb-2 z-50"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{
              showPreview: false
            }}
            theme="light"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`flex-shrink-0 cursor-pointer p-2 transition-all duration-200 rounded-lg ${
            isUploading 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
          }`}
          title={isUploading ? "Uploading..." : "Attach file"}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </label>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            rows="1"
            className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 max-h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              minHeight: "48px",
            }}
            disabled={isUploading}
          />
          
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
              showEmojiPicker 
                ? "bg-yellow-50 text-yellow-500" 
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Add emoji"
            disabled={isUploading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
              <path d="M14 9.5a1.5 1.5 0 11-3.001.001A1.5 1.5 0 0114 9.5zM8 9.5a1.5 1.5 0 11-3.001.001A1.5 1.5 0 018 9.5zM12 17c-2 0-3-2-3-2h6s-1 2-3 2z"/>
            </svg>
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !file) || isUploading}
          className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
          title={isUploading ? "Uploading..." : "Send message"}
        >
          {isUploading ? (
            <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : text.trim() || file ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Keyboard Shortcut Hint */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>Press Enter to send</span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}