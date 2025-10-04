'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserProfile } from '@/components/profile/UserProfile';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { FaArrowLeft, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { getUserById, getUserPosts, getUserReviews, followUser, unfollowUser } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const params = useParams();
  const { userId } = params;
  const { user: currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await getUserById(userId);
        setUserData(userResponse.data);

        // Check if current user is following this user
        if (currentUser && userResponse.data.followers) {
          setIsFollowing(userResponse.data.followers.includes(currentUser.userId));
        }

        // Fetch user posts
        try {
          const postsResponse = await getUserPosts(userId);
          setPosts(postsResponse.data || []);
        } catch (postsError) {
          console.error('Error fetching user posts:', postsError);
          setPosts([]);
        }

        // Fetch user reviews
        try {
          const reviewsResponse = await getUserReviews(userId);
          setReviews(reviewsResponse.data || []);
        } catch (reviewsError) {
          console.error('Error fetching user reviews:', reviewsError);
          setReviews([]);
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.error || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        toast.success('Unfollowed user');
      } else {
        await followUser(userId);
        setIsFollowing(true);
        toast.success('Following user');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSendMessage = () => {
    // Navigate to messages page with this user
    window.location.href = `/messages?user=${userId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link href="/dashboard">
            <Button>
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you're looking for doesn't exist.
          </p>
          <Link href="/dashboard">
            <Button>
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.userId === userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Actions */}
      {!isOwnProfile && (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              {currentUser && (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleSendMessage}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <FaEnvelope className="w-4 h-4" />
                    <span>Message</span>
                  </Button>

                  <Button
                    onClick={handleFollow}
                    disabled={followLoading}
                    isLoading={followLoading}
                    variant={isFollowing ? 'outline' : 'primary'}
                    className="flex items-center space-x-2"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <UserProfile
          userId={userId}
          userData={userData}
          posts={posts}
          reviews={reviews}
          isOwnProfile={isOwnProfile}
          onEdit={() => {
            // This won't be called for other users' profiles
            if (isOwnProfile) {
              window.location.href = '/profile';
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default UserProfilePage;