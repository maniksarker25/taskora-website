// hooks/useSocket.js
"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import baseUrl from "../../../../utils/baseUrl";

export const useSocket = () => {
  const socketRef = useRef(null);

  const { accessToken, user } = useSelector((state) => state.auth);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Token or user not found → disconnect socket
    if (!accessToken || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Create socket instance
    socketRef.current = io(`${baseUrl}`, {
      auth: { token: accessToken },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });

    const socket = socketRef.current;

    // Connected
    socket.on("connect", () => {
      console.log("Socket Connected");
      setIsConnected(true);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setIsConnected(false);
    });

    // Error
    socket.on("socket-error", (err) => {
      console.log("Socket Error", err);
    });

    // cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, user]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
