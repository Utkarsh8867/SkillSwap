'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostsContext';
import { PostCard } from '@/components/posts/PostCard';
import { SearchBar } from '@/components/search/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { FaPlus, FaFilter, FaList, FaTh } from 'react-icons/fa';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Pagination } from '@/components/ui/Pagination';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    posts: allPosts,
    loading: postsLoading,
    error: postsError,
    pagination,
    searchPosts,
    goToPage,
    setLimit
  } = usePosts();
  const router = useRouter();

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(allPosts)) return [];

    return allPosts
      .filter(post => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.skillsOffered?.some(skill => skill.toLowerCase().includes(query)) ||
          post.skillsNeeded?.some(skill => skill.toLowerCase().includes(query))
        );
      })
      .filter(post => {
        if (filters.category?.length > 0 && !filters.category.includes(post.category)) {
          return false;
        }
        return true;
      });
  }, [allPosts, searchQuery, filters]);


  const handleLike = (postId) => console.log(`Liking post ${postId}`);
  const handleBookmark = (postId) => console.log(`Bookmarking post ${postId}`);
  const handleShare = (postId) => console.log(`Sharing post ${postId}`);

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="container-responsive section-padding">
            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Discover amazing skills to learn and share.
                </p>
              </div>

              {/* Mobile Create Post Button */}
              <div className="sm:hidden">
                <Button
                  onClick={() => router.push('/create-post')}
                  className="btn-primary w-full"
                  size="lg"
                >
                  <FaPlus className="mr-2" /> Create Your First Post
                </Button>
              </div>

              {/* Desktop Create Post Button */}
              <div className="hidden sm:flex justify-end">
                <Button onClick={() => router.push('/create-post')} className="btn-primary">
                  <FaPlus className="mr-2" /> Create Post
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <SearchBar onSearch={searchPosts} />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="container-responsive py-4 sm:py-6">
          <div className="flex flex-col gap-4 mb-6">
            {/* Mobile Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-shrink-0"
                >
                  <FaFilter className="mr-2" /> Filters
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-center gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg w-fit mx-auto sm:mx-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-800 shadow text-blue-600'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                  title="Grid view"
                >
                  <FaTh className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-800 shadow text-blue-600'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                  title="List view"
                >
                  <FaList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Grid/List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Posts Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search or filters, or create your first post!
                </p>
                <Button
                  onClick={() => router.push('/create-post')}
                  className="btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Create First Post
                </Button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                : 'space-y-4 sm:space-y-6'
            }>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.postId || post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;