'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import socketService from '@/services/socketService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      
      const handleNewNotification = (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]); 
        
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{newNotification.title || 'New Notification'}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{newNotification.message}</p>
                </div>
              </div>
            </div>
          </div>
        ));
      };

      socketService.on('newNotification', handleNewNotification);

      return () => {
        socketService.off('newNotification', handleNewNotification);
      };
    }
  }, [isAuthenticated]);

  const value = { notifications };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};