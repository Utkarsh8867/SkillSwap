'use client';

import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { ContactModal } from './ContactModal';
import { FaHeart, FaComment, FaShare, FaBookmark, FaStar, FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { likePost, bookmarkPost, deletePost } from '@/services';
import toast from 'react-hot-toast';

const PostCard = memo(({ post, onLike, onBookmark, onShare, onEdit, onDelete, showActions = true }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.userId) || false);
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarkedPosts?.includes(post.postId) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const isOwner = user?.userId === post.authorId;

  const handleLike = useCallback(async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      setLoading(true);
      const response = await likePost(post.postId);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);

      if (onLike) {
        onLike(post.postId, response.data.isLiked);
      }
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLoading(false);
    }
  }, [post.postId, user, onLike]);

  const handleBookmark = useCallback(async () => {
    if (!user) {
      toast.error('Please login to bookmark posts');
      return;
    }

    try {
      setLoading(true);
      const response = await bookmarkPost(post.postId);
      setIsBookmarked(response.data.isBookmarked);

      if (onBookmark) {
        onBookmark(post.postId, response.data.isBookmarked);
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to bookmark post');
    } finally {
      setLoading(false);
    }
  }, [post.postId, user, onBookmark]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: `${window.location.origin}/post/${post.postId}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }

      if (onShare) {
        onShare(post.postId);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [post, onShare]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(post.postId);
    }
  }, [post.postId, onEdit]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      await deletePost(post.postId);
      toast.success('Post deleted successfully');

      if (onDelete) {
        onDelete(post.postId);
      }
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  }, [post.postId, onDelete]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card overflow-hidden w-full max-w-full"
    >
      <div className="content-padding">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/profile/${post.authorId}`} className="flex items-center group">
            <img
              src={post.authorDP || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}`}
              alt={post.authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">{post.authorName}</h4>
              {/* You might need to fetch author's rating separately or have it in the post object */}
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            {isOwner && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit post"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete post"
                >
                  <FaTrash />
                </button>
              </>
            )}
            <button
              onClick={handleBookmark}
              disabled={loading}
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

        {/* Content */}
        <Link href={`/post/${post.postId}`}>
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-600 line-clamp-3 mb-4">{post.description}</p>
        </Link>

        {/* Skills */}
        <div className="mb-4">
          {post.skillsOffered?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Offering:</p>
              <div className="flex flex-wrap gap-2">
                {post.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {post.skillsNeeded?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Seeking:</p>
              <div className="flex flex-wrap gap-2">
                {post.skillsNeeded.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-xs font-medium"
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
          <div className="mb-4">
            <ImageGallery images={post.images} />
          </div>
        )}

        {/* Footer */}
        {showActions && (
          <div className="pt-4 border-t dark:border-gray-700">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={loading}
                  className={`flex items-center space-x-1 transition-colors ${isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                    }`}
                >
                  <FaHeart className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">{likesCount}</span>
                </button>

                <Link
                  href={`/post/${post.postId}#comments`}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FaComment />
                  <span className="text-sm">{commentsCount}</span>
                </Link>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <FaShare />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Contact for Exchange Button */}
            {user && !isOwner && (
              <div className="mt-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>Contact for Exchange</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contact Modal */}
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          post={post}
          user={user}
        />
      </div>
    </motion.div>
  );
});

PostCard.displayName = 'PostCard';

export { PostCard };