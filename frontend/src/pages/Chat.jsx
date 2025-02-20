import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Search, Smile, Paperclip, ArrowLeft, Home } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import EmojiPicker from 'emoji-picker-react';
import { messages as messageApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { user, allUsers } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [showChat, setShowChat] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Filter followed users
  const followedUsers = allUsers?.filter(u => 
    user?.following?.includes(u._id) &&
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedUser) {
      const roomId = [user._id, selectedUser._id].sort().join('-');
      socket?.emit('join_room', roomId);
      
      messageApi.getMessages(roomId)
        .then(response => setMessages(response.data.messages))
        .catch(error => console.error('Error fetching messages:', error));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (message.sender._id !== user._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      socket.on('user_typing', ({ isTyping, userId }) => {
        if (userId === selectedUser?._id) {
          setIsTyping(isTyping);
        }
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [socket, selectedUser, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const roomId = [user._id, selectedUser._id].sort().join('-');
    const formData = new FormData();
    formData.append('receiverId', selectedUser._id);
    formData.append('roomId', roomId);
    
    if (message.trim()) {
      formData.append('content', message);
    }
    
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await messageApi.sendMessage(formData);
      const data = response.data;
      
      setMessages(prev => [...prev, data.message]);
      socket.emit('send_message', data.message);
      
      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    const roomId = [user._id, selectedUser._id].sort().join('-');
    socket.emit('typing', {
      roomId,
      userId: user._id,
      isTyping: e.target.value.length > 0
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
  {/* Left Sidebar - Users List */}
  <div
    className={`${
      showChat ? "hidden md:flex" : "flex"
    } w-full md:w-1/4 lg:w-1/5 flex-col bg-white border-r`}
  >
    {/* App Name - Fixed */}
    <div className="p-4 border-b bg-white flex justify-start space-x-4 items-center">
      <button
          onClick={handleHomeClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to Home"
        >
          <Home className="h-6 w-6 text-gray-600" />
      </button>
      <h1 className="text-2xl font-bold text-gray-800">Vibesta</h1>
      
    </div>

    {/* Search Bar - Fixed */}
    <div className="p-4 border-b bg-white">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Users List - Scrollable */}
    <div className="flex-1 overflow-y-auto">
      {followedUsers?.map((followedUser) => (
        <div
          key={followedUser._id}
          onClick={() => handleUserSelect(followedUser)}
          className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
            selectedUser?._id === followedUser._id ? "bg-blue-50" : ""
          }`}
        >
          <img
            src={followedUser.image}
            alt={followedUser.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900 text-sm md:text-base">
              {followedUser.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Click to chat</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Right Chat Area */}
  <div
    className={`${
      !showChat ? "hidden md:flex" : "flex"
    } flex-1 flex-col h-screen`}
  >
    {selectedUser ? (
      <>
        {/* Chat Header - Fixed */}
        <div className="p-3 md:p-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <img
            src={selectedUser.image}
            alt={selectedUser.name}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-medium text-gray-900 text-sm md:text-base">
              {selectedUser.name}
            </h2>
            {isTyping && <p className="text-xs text-gray-500">typing...</p>}
          </div>
        </div>

        {/* Chat Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gray-50 hide-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] lg:max-w-[50%] p-3 rounded-lg break-words ${
                  msg.sender._id === user._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.type === "image" ? (
                  <img
                    src={msg.fileUrl}
                    alt="Shared image"
                    className="rounded-lg max-w-full h-auto"
                  />
                ) : msg.type === "file" ? (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 break-all"
                  >
                    <Paperclip className="h-4 w-4 flex-shrink-0" />
                    <span className="overflow-hidden text-ellipsis">
                      Download File
                    </span>
                  </a>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form - Fixed at bottom */}
        <div className="border-t bg-white sticky bottom-0 z-10">
          <form onSubmit={handleSendMessage} className="p-2 md:p-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Smile className="h-6 w-6 text-gray-600" />
              </button>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label
                htmlFor="file-input"
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <Paperclip className="h-6 w-6 text-gray-600" />
              </label>
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!message.trim() && !file}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-4 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    setMessage((prev) => prev + emojiObject.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
            {file && (
              <div className="mt-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-600 flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </form>
        </div>
      </>
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    )}
  </div>
</div>

  );
};

export default Chat;