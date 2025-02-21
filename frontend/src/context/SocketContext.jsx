import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();
const baseUrl = process.env.NODE_ENV === 'production' ? 'https://full-stack-social-media-app-ten.vercel.app/' : 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector(state => state.auth);


  useEffect(() => {
    if (user) {
      const newSocket = io(baseUrl, {
        query:{ userId: user._id }
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);