import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaHeart, FaReply, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { getPostComments, createComment, deleteComment, likeComment } from '@/services';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, onDelete, onLike }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

    const handleLike = async () => {
        try {
            await likeComment(comment.id);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
            if (onLike) onLike(comment.id, !isLiked);
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this comment?')) {
            try {
                await deleteComment(comment.id);
                toast.success('Comment deleted');
                if (onDelete) onDelete(comment.id);
            } catch (error) {
                toast.error('Failed to delete comment');
            }
        }
    };

    const isOwner = user?.userId === comment.authorId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
            <img
                src={comment.authorDP || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`}
                alt={comment.authorName}
                className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.authorName}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    {comment.content}
                </p>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 text-xs ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                    >
                        <FaHeart className={isLiked ? 'fill-current' : ''} />
                        <span>{likesCount}</span>
                    </button>

                    <button className="text-xs text-gray-500 hover:text-blue-500">
                        <FaReply className="inline mr-1" />
                        Reply
                    </button>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="text-xs text-gray-500 hover:text-red-500"
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const CommentSection = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await getPostComments(postId);
            setComments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to load comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            const commentData = {
                content: newComment.trim(),
                authorId: user.userId,
                authorName: user.name,
                authorDP: user.profilePicture || ''
            };

            const response = await createComment(postId, commentData);
            setComments(prev => [response.data, ...prev]);
            setNewComment('');
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    const handleLikeComment = (commentId, isLiked) => {
        setComments(prev =>
            prev.map(c =>
                c.id === commentId
                    ? { ...c, isLiked, likesCount: c.likesCount + (isLiked ? 1 : -1) }
                    : c
            )
        );
    };

    return (
        <div className="mt-6" id="comments">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex space-x-3">
                        <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || submitting}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane />
                                    <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    Please login to comment on this post.
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onDelete={handleDeleteComment}
                                onLike={handleLikeComment}
                            />
                        ))}
                    </AnimatePresence>

                    {comments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No comments yet. Be the first to comment!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};