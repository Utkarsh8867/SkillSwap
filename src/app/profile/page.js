'use client';

import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/components/profile/UserProfile';
import { EditProfile } from '@/components/profile/EditProfile';
import { useState, useEffect } from 'react';
import { getUserPosts, getUserReviews } from '@/services';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';


const MyProfilePage = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState(user);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData(user);
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.userId) return;

    setLoadingData(true);
    try {
      // Load user posts
      try {
        const postsResponse = await getUserPosts(user.userId);
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
      } catch (postsError) {
        console.error('Error loading posts:', postsError);
        setPosts([]);
      }

      // Load user reviews
      try {
        const reviewsResponse = await getUserReviews(user.userId);
        setReviews(Array.isArray(reviewsResponse.data) ? reviewsResponse.data : []);
      } catch (reviewsError) {
        console.error('Error loading reviews:', reviewsError);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = (updatedData) => {
    setUserData(prev => ({ ...prev, ...updatedData }));
    setIsEditing(false);
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      {isEditing ? (
        <EditProfile
          userData={userData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <UserProfile
          userId={user.userId || user.id}
          userData={userData}
          posts={posts}
          reviews={reviews}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default MyProfilePage;