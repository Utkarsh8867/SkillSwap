'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSearch, FaEllipsisV, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { socketService } from '@/services';
import {
    getConversations,
    getMessages,
    sendMessage,
    createConversation,
    markAsRead
} from '@/services/messageService';
import { getUserById } from '@/services';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const MessageBubble = ({ message, isOwn, sender }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
            ? 'bg-primary-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
            {!isOwn && (
                <p className="text-xs font-medium mb-1 opacity-75">
                    {sender?.name}
                </p>
            )}
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </p>
        </div>
    </motion.div>
);

const ConversationItem = ({ conversation, isActive, onClick }) => (
    <motion.div
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        onClick={onClick}
        className={`p-4 cursor-pointer border-b dark:border-gray-700 ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''
            }`}
    >
        <div className="flex items-center space-x-3">
            <img
                src={conversation.participant?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.participant?.name || '')}`}
                alt={conversation.participant?.name}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.participant?.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {conversation.lastMessageTime &&
                            formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {conversation.lastMessage || 'No messages yet'}
                </p>
            </div>
            {conversation.unreadCount > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {conversation.unreadCount}
                </span>
            )}
        </div>
    </motion.div>
);

const MessagesContent = () => {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get('user');

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showConversations, setShowConversations] = useState(true);

    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setShowConversations(window.innerWidth >= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load conversations
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const response = await getConversations();
                setConversations(response.data || []);

                // If target user specified, create/find conversation
                if (targetUserId) {
                    const existingConv = response.data.find(
                        conv => conv.participant.userId === targetUserId
                    );

                    if (existingConv) {
                        setActiveConversation(existingConv);
                        if (isMobile) setShowConversations(false);
                    } else {
                        // Create new conversation
                        try {
                            const newConvResponse = await createConversation(targetUserId);
                            const newConv = newConvResponse.data;
                            setConversations(prev => [newConv, ...prev]);
                            setActiveConversation(newConv);
                            if (isMobile) setShowConversations(false);
                        } catch (error) {
                            toast.error('Failed to start conversation');
                        }
                    }
                }
            } catch (error) {
                toast.error('Failed to load conversations');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadConversations();
        }
    }, [user, targetUserId, isMobile]);

    // Load messages for active conversation
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeConversation) return;

            try {
                // Join the conversation room
                socketService.joinConversation(activeConversation.id);

                const response = await getMessages(activeConversation.id);
                setMessages(response.data || []);

                // Mark as read
                await markAsRead(activeConversation.id);
            } catch (error) {
                toast.error('Failed to load messages');
            }
        };

        loadMessages();

        // Cleanup: leave room when conversation changes
        return () => {
            if (activeConversation) {
                socketService.leaveConversation(activeConversation.id);
            }
        };
    }, [activeConversation]);

    // Socket listeners
    useEffect(() => {
        if (!user) return;

        const handleNewMessage = (message) => {
            console.log('Received message:', message);

            // Only add to current conversation if it matches
            if (message.conversationId === activeConversation?.id) {
                setMessages(prev => {
                    // Prevent duplicate messages
                    const exists = prev.some(m => m.messageId === message.messageId);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }

            // Update conversation list for all conversations
            setConversations(prev =>
                prev.map(conv => {
                    if (conv.id === message.conversationId) {
                        return {
                            ...conv,
                            lastMessage: message.content,
                            lastMessageTime: message.createdAt,
                            unreadCount: message.conversationId === activeConversation?.id ?
                                conv.unreadCount : (conv.unreadCount || 0) + 1
                        };
                    }
                    return conv;
                })
            );
        };

        const handleMessageSent = (message) => {
            console.log('Message sent confirmation:', message);
        };

        socketService.on('newMessage', handleNewMessage);
        socketService.on('messageSent', handleMessageSent);

        return () => {
            socketService.off('newMessage', handleNewMessage);
            socketService.off('messageSent', handleMessageSent);
        };
    }, [user, activeConversation]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || sendingMessage) return;

        setSendingMessage(true);
        const tempMessageId = Date.now().toString();
        const tempMessage = {
            messageId: tempMessageId,
            conversationId: activeConversation.id,
            senderId: user.userId,
            senderName: user.name,
            content: newMessage.trim(),
            messageType: 'text',
            createdAt: new Date().toISOString(),
            isTemp: true
        };

        // Optimistically add message to UI
        setMessages(prev => [...prev, tempMessage]);
        const messageContent = newMessage.trim();
        setNewMessage('');

        try {
            const messageData = {
                content: messageContent,
                type: 'text'
            };

            const response = await sendMessage(activeConversation.id, messageData);

            // Replace temp message with real message
            setMessages(prev =>
                prev.map(msg =>
                    msg.messageId === tempMessageId ? response.data : msg
                )
            );

            // Update conversation in list
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === activeConversation.id
                        ? {
                            ...conv,
                            lastMessage: response.data.content,
                            lastMessageTime: response.data.createdAt
                        }
                        : conv
                )
            );

            // Emit socket event for real-time delivery
            socketService.sendMessage(activeConversation.id, response.data);

        } catch (error) {
            // Remove temp message on error
            setMessages(prev => prev.filter(msg => msg.messageId !== tempMessageId));
            setNewMessage(messageContent); // Restore message content
            toast.error('Failed to send message');
        } finally {
            setSendingMessage(false);
        }
    };

    const selectConversation = (conversation) => {
        setActiveConversation(conversation);
        if (isMobile) {
            setShowConversations(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-white dark:bg-gray-900 relative">
            {/* Conversations Sidebar */}
            <AnimatePresence>
                {(showConversations || !isMobile) && (
                    <motion.div
                        initial={{ x: isMobile ? -300 : 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: isMobile ? -300 : 0 }}
                        className={`${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'relative'} 
                                   w-full md:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700`}
                    >
                        {/* Header */}
                        <div className="p-4 border-b dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Messages
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <FaSearch />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="overflow-y-auto h-full">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No conversations yet
                                    </p>
                                </div>
                            ) : (
                                conversations.map(conversation => (
                                    <ConversationItem
                                        key={conversation.id || conversation.conversationId}
                                        conversation={conversation}
                                        isActive={activeConversation?.id === conversation.id}
                                        onClick={() => selectConversation(conversation)}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {isMobile && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowConversations(true)}
                                        >
                                            <FaArrowLeft />
                                        </Button>
                                    )}
                                    <img
                                        src={activeConversation.participant?.profilePicture ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.participant?.name || '')}`}
                                        alt={activeConversation.participant?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {activeConversation.participant?.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {activeConversation.participant?.isOnline ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <FaEllipsisV />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map(message => (
                                <MessageBubble
                                    key={message.messageId || message._id}
                                    message={message}
                                    isOwn={message.senderId === user.userId}
                                    sender={message.senderId === user.userId ? user : activeConversation.participant}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center space-x-3">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 input-style"
                                    disabled={sendingMessage}
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sendingMessage}
                                    isLoading={sendingMessage}
                                >
                                    <FaPaperPlane />
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="text-center">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Choose a conversation from the sidebar to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MessagesPage = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MessagesContent />
        </Suspense>
    );
};

export default MessagesPage;