'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { CommentsSection } from '@/components/posts/CommentsSection';
import { ContactModal } from '@/components/posts/ContactModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FaHeart, FaComment, FaShare, FaBookmark, FaEdit, FaTrash, FaEnvelope, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { getPostById, likePost, bookmarkPost, deletePost } from '@/services';
import toast from 'react-hot-toast';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        if (params.id) {
            loadPost();
        }
    }, [params.id, user]);

    const loadPost = async () => {
        try {
            setLoading(true);
            const response = await getPostById(params.id);
            const postData = response.data;
            setPost(postData);
            setIsLiked(postData.likes?.includes(user?.userId) || false);
            setIsBookmarked(user?.bookmarkedPosts?.includes(postData.postId) || false);
            setLikesCount(postData.likes?.length || 0);
        } catch (error) {
            toast.error('Failed to load post');
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like posts');
            return;
        }

        try {
            setActionLoading(true);
            const response = await likePost(post.postId);
            setIsLiked(response.data.isLiked);
            setLikesCount(response.data.likesCount);
        } catch (error) {
            toast.error('Failed to like post');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            toast.error('Please login to bookmark posts');
            return;
        }

        try {
            setActionLoading(true);
            const response = await bookmarkPost(post.postId);
            setIsBookmarked(response.data.isBookmarked);
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Failed to bookmark post');
        } finally {
            setActionLoading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.description,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            setActionLoading(true);
            await deletePost(post.postId);
            toast.success('Post deleted successfully');
            router.push('/');
        } catch (error) {
            toast.error('Failed to delete post');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Post not found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = user?.userId === post.authorId;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <Link href={`/profile/${post.authorId}`} className="flex items-center group">
                                <img
                                    src={post.authorDP || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}`}
                                    alt={post.authorName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                        {post.authorName}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                    {post.location?.city && (
                                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <FaMapMarkerAlt className="w-3 h-3" />
                                            <span>{post.location.city}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="flex items-center space-x-2">
                                {isOwner && (
                                    <>
                                        <Link
                                            href={`/post/${post.postId}/edit`}
                                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                            title="Edit post"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            disabled={actionLoading}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                            title="Delete post"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleBookmark}
                                    disabled={actionLoading}
                                    className={`p-2 transition-colors ${isBookmarked
                                        ? 'text-yellow-500 hover:text-yellow-600'
                                        : 'text-gray-500 hover:text-yellow-500'
                                        }`}
                                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                                >
                                    <FaBookmark />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {post.title}
                        </h1>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            {post.description}
                        </p>

                        {/* Skills */}
                        <div className="mb-6 space-y-4">
                            {post.skillsOffered?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Skills Offered
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skillsOffered.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {post.skillsNeeded?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                        Skills Needed
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.skillsNeeded.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Images */}
                        {post.images && post.images.length > 0 && (
                            <div className="mb-6">
                                <ImageGallery images={post.images} />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between py-4 border-t border-b dark:border-gray-700 mb-6">
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={handleLike}
                                    disabled={actionLoading}
                                    className={`flex items-center space-x-2 transition-colors ${isLiked
                                        ? 'text-red-500 hover:text-red-600'
                                        : 'text-gray-500 hover:text-red-500'
                                        }`}
                                >
                                    <FaHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                                </button>

                                <div className="flex items-center space-x-2 text-gray-500">
                                    <FaComment className="w-5 h-5" />
                                    <span>{post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
                                </div>

                                <button
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                                >
                                    <FaShare className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Contact for Exchange Button */}
                        {user && !isOwner && (
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-lg"
                                >
                                    <FaEnvelope className="w-5 h-5" />
                                    <span>Contact for Exchange</span>
                                </button>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div id="comments">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                Comments
                            </h3>
                            <CommentsSection
                                postId={post.postId}
                                initialCommentsCount={post.comments?.length || 0}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contact Modal */}
                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                    post={post}
                    user={user}
                />
            </div>
        </div>
    );
}