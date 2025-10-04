'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from '@/components/posts/PostCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FaBookmark, FaHeart } from 'react-icons/fa';
import { getUserBookmarks } from '@/services';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (user) {
            loadBookmarks();
        }
    }, [user]);

    const loadBookmarks = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await getUserBookmarks(user.userId, {
                page: pageNum,
                limit: 10
            });

            const newPosts = response.data.posts || [];

            if (append) {
                setPosts(prev => [...prev, ...newPosts]);
            } else {
                setPosts(newPosts);
            }

            setHasMore(newPosts.length === 10);
            setPage(pageNum);
        } catch (error) {
            toast.error('Failed to load bookmarks');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            loadBookmarks(page + 1, true);
        }
    };

    const handleBookmarkRemoved = (postId) => {
        setPosts(prev => prev.filter(post => post.postId !== postId));
        toast.success('Bookmark removed');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Please Login
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be logged in to view your bookmarks.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-3 mb-2">
                        <FaBookmark className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Bookmarks
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Posts you've saved for later
                    </p>
                </motion.div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <FaBookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No bookmarks yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start bookmarking posts you find interesting!
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaHeart className="w-4 h-4 mr-2" />
                            Explore Posts
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.postId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <PostCard
                                    post={post}
                                    onBookmark={(postId, isBookmarked) => {
                                        if (!isBookmarked) {
                                            handleBookmarkRemoved(postId);
                                        }
                                    }}
                                />
                            </motion.div>
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center py-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <span>Load More</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}