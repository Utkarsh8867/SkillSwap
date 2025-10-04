// Export all services from a single entry point
export * from './authService';
export * from './postService';
export * from './userService';
export * from './reviewService';
export * from './matchingService';
export * from './healthService';
export * from './messageService';
export * from './notificationService';
export * from './settingsService';
export { default as api } from './api';
export { default as socketService } from './socketService';

// Re-export commonly used functions
export {
    getAllPosts,
    searchPosts,
    createPost,
    updatePost,
    deletePost
} from './postService';

export {
    getAllUsers,
    getNearbyUsers,
    updateUserProfile
} from './userService';

export {
    loginUser,
    registerUser,
    getMyProfile,
    refreshToken
} from './authService';