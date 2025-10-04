import { io } from 'socket.io-client';
import MockSocketService from './mockSocketService';

class SocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.joinedRooms = new Set();
    this.mockService = new MockSocketService();
    this.useMock = false;
  }

  connect(token, userId) {
    if (this.socket?.connected || this.mockService.isConnected()) return;

    this.userId = userId;

    try {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
        auth: { token, userId },
        transports: ['websocket', 'polling'],
        timeout: 5000
      });

      this.socket.on('connect', () => {
        console.log('Connected to real server');
        this.useMock = false;
        // Join user's personal room for notifications
        this.joinRoom(`user_${userId}`);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.joinedRooms.clear();
      });

      this.socket.on('connect_error', (error) => {
        console.warn('Socket connection failed, using mock service:', error.message);
        this.useMock = true;
        this.mockService.connect(token, userId);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Fallback to mock after timeout
      setTimeout(() => {
        if (!this.socket?.connected) {
          console.warn('Socket connection timeout, using mock service');
          this.useMock = true;
          this.mockService.connect(token, userId);
        }
      }, 5000);

    } catch (error) {
      console.warn('Socket initialization failed, using mock service:', error);
      this.useMock = true;
      this.mockService.connect(token, userId);
    }
  }

  disconnect() {
    if (this.useMock) {
      this.mockService.disconnect();
    } else if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
    this.joinedRooms.clear();
    this.useMock = false;
  }

  joinRoom(roomId) {
    if (this.useMock) {
      this.mockService.joinRoom(roomId);
    } else if (this.socket && !this.joinedRooms.has(roomId)) {
      this.socket.emit('join_room', roomId);
      this.joinedRooms.add(roomId);
      console.log(`Joined room: ${roomId}`);
    }
  }

  leaveRoom(roomId) {
    if (this.useMock) {
      this.mockService.leaveRoom(roomId);
    } else if (this.socket && this.joinedRooms.has(roomId)) {
      this.socket.emit('leave_room', roomId);
      this.joinedRooms.delete(roomId);
      console.log(`Left room: ${roomId}`);
    }
  }

  joinConversation(conversationId) {
    if (this.useMock) {
      this.mockService.joinConversation(conversationId);
    } else {
      this.joinRoom(`conversation_${conversationId}`);
    }
  }

  leaveConversation(conversationId) {
    if (this.useMock) {
      this.mockService.leaveConversation(conversationId);
    } else {
      this.leaveRoom(`conversation_${conversationId}`);
    }
  }

  on(event, callback) {
    if (this.useMock) {
      this.mockService.on(event, callback);
    } else if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.useMock) {
      this.mockService.off(event, callback);
    } else if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.useMock) {
      this.mockService.emit(event, data);
    } else if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Send message to specific conversation
  sendMessage(conversationId, messageData) {
    if (this.useMock) {
      this.mockService.sendMessage(conversationId, messageData);
    } else if (this.socket) {
      this.socket.emit('send_message', {
        conversationId,
        ...messageData
      });
    }
  }

  // Get connection status
  isConnected() {
    if (this.useMock) {
      return this.mockService.isConnected();
    }
    return this.socket?.connected || false;
  }
}

export default new SocketService();