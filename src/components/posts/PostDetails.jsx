'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { Button } from '@/components/ui/Button';
import { CommentSection } from './CommentSection';
import { FaHeart, FaComment, FaShare, FaBookmark, FaStar, FaMapMarkerAlt, FaClock, FaEdit } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { likePost, bookmarkPost } from '@/services';
import Link from 'next/link';
import toast from 'react-hot-toast';

export const PostDetails = ({ post, onEdit }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [loading, setLoading] = useState(false);

  const isOwner = user?.userId === post.authorId;

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      setLoading(true);
      await likePost(post.postId);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark posts');
      return;
    }

    try {
      setLoading(true);
      await bookmarkPost(post.postId);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch (error) {
      toast.error('Failed to bookmark post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <Link href={`/profile/${post.authorId}`} className="flex items-center group">
                <img
                  src={post.authorDP || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}`}
                  alt={post.authorName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600">
                    {post.authorName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-yellow-500' : ''}
                >
                  <FaBookmark />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <FaShare />
                </Button>
              </div>
            </div>

            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6 space-y-4">
              {post.skillsOffered && post.skillsOffered.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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

              {post.skillsNeeded && post.skillsNeeded.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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

            {/* Location and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              {post.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  <span>{post.location.city || 'Remote'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FaClock />
                <span>Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
                >
                  <FaHeart />
                  Like
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FaComment />
                  Comment
                </Button>
              </div>

              {user && user.userId !== post.authorId && (
                <Button className="flex items-center gap-2">
                  Contact for Exchange
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};