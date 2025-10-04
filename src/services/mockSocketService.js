// Mock Socket Service for testing when backend is not available
class MockSocketService {
    constructor() {
        this.connected = false;
        this.userId = null;
        this.rooms = new Set();
        this.eventHandlers = new Map();
        this.mockUsers = new Map(); // Simulate other connected users
    }

    connect(token, userId) {
        console.log('Mock Socket: Connecting...', { userId });
        this.connected = true;
        this.userId = userId;

        // Simulate connection
        setTimeout(() => {
            this.emit('connect');
            this.joinRoom(`user_${userId}`);
        }, 100);
    }

    disconnect() {
        console.log('Mock Socket: Disconnecting...');
        this.connected = false;
        this.userId = null;
        this.rooms.clear();
        this.eventHandlers.clear();
        this.emit('disconnect');
    }

    joinRoom(roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.add(roomId);
            console.log(`Mock Socket: Joined room ${roomId}`);
        }
    }

    leaveRoom(roomId) {
        if (this.rooms.has(roomId)) {
            this.rooms.delete(roomId);
            console.log(`Mock Socket: Left room ${roomId}`);
        }
    }

    joinConversation(conversationId) {
        this.joinRoom(`conversation_${conversationId}`);
    }

    leaveConversation(conversationId) {
        this.leaveRoom(`conversation_${conversationId}`);
    }

    on(event, callback) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(callback);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Mock Socket: Error in event handler', error);
                }
            });
        }
    }

    sendMessage(conversationId, messageData) {
        console.log('Mock Socket: Sending message', { conversationId, messageData });

        // Simulate message delivery to other participants
        // In a real scenario, this would be handled by the server
        setTimeout(() => {
            // Don't echo back to sender
            if (messageData.senderId !== this.userId) {
                this.emit('newMessage', {
                    ...messageData,
                    conversationId
                });
            }
        }, 100);
    }

    isConnected() {
        return this.connected;
    }

    // Simulate receiving a message from another user
    simulateIncomingMessage(conversationId, fromUserId, content) {
        const message = {
            messageId: Date.now().toString(),
            conversationId,
            senderId: fromUserId,
            senderName: `User ${fromUserId}`,
            content,
            messageType: 'text',
            createdAt: new Date().toISOString()
        };

        setTimeout(() => {
            this.emit('newMessage', message);
        }, Math.random() * 2000 + 500); // Random delay 0.5-2.5s
    }
}

export default MockSocketService;