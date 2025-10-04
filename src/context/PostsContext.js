'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getAllPosts, createPost } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { socketService } from '@/services';
import toast from 'react-hot-toast';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllPosts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        ...params
      });

      // The backend returns { posts: [...], pagination: {...} } structure
      const postsData = response.data?.posts || [];
      const paginationData = response.data?.pagination || {};

      setPosts(Array.isArray(postsData) ? postsData : []);
      setPagination(prev => ({ ...prev, ...paginationData }));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
      // Only show toast error if it's not a network connectivity issue
      if (!err.message?.includes('Network Error') && !err.code?.includes('ECONNREFUSED')) {
        toast.error('Could not fetch posts.');
      }
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (isAuthenticated) {
      const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        toast.success(`New post created: "${newPost.title}"`);
      };
      const handlePostUpdated = (updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => p.postId === updatedPost.postId ? updatedPost : p));
      };
      const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.postId !== postId));
      };

      socketService.on('postCreated', handlePostCreated);
      socketService.on('postUpdated', handlePostUpdated);
      socketService.on('postDeleted', handlePostDeleted);

      return () => {
        socketService.off('postCreated', handlePostCreated);
        socketService.off('postUpdated', handlePostUpdated);
        socketService.off('postDeleted', handlePostDeleted);
      };
    }
  }, [isAuthenticated]);


  const addNewPost = async (postData) => {
    try {
      const { data } = await createPost(postData);

      return data;
    } catch (error) {
      toast.error('Failed to create post.');
      throw error;
    }
  };

  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const searchPosts = useCallback((query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const value = {
    posts,
    setPosts,
    loading,
    error,
    pagination,
    searchQuery,
    addNewPost,
    fetchPosts,
    goToPage,
    setLimit,
    searchPosts
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};