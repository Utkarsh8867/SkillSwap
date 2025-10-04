'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTh, FaList } from 'react-icons/fa';
import { PostCard } from '@/components/posts/PostCard';
import { UserCard } from '@/components/users/UserCard';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { searchPosts, searchUsers } from '@/services';
import { useDebounce } from '@/hooks/useDebounce';

const SearchContent = () => {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState('posts');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({});

    // Results state
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    const debouncedQuery = useDebounce(query, 300);

    // Search function
    const performSearch = async (searchQuery = debouncedQuery, page = 1) => {
        if (!searchQuery.trim()) {
            setPosts([]);
            setUsers([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (activeTab === 'posts') {
                const response = await searchPosts(searchQuery, page, pagination.limit);
                setPosts(response.data.posts || []);
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            } else {
                const response = await searchUsers(searchQuery, page, pagination.limit);
                setUsers(response.data.users || []);
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed');
            setPosts([]);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery, 1);
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [debouncedQuery, activeTab]);

    useEffect(() => {
        if (query) {
            performSearch(query, pagination.page);
        }
    }, [pagination.page]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const tabs = [
        { id: 'posts', label: 'Posts', count: posts.length },
        { id: 'users', label: 'Users', count: users.length }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Search Results
                    </h1>
                    <SearchBar
                        onSearch={setQuery}
                        placeholder="Search for posts, users, or skills..."
                    />
                </div>

                {/* Search Stats */}
                {query && (
                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-400">
                            {loading ? 'Searching...' : `Results for "${query}"`}
                        </p>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <FaFilter />
                            Filters
                        </Button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-style"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="relevant">Most Relevant</option>
                            {activeTab === 'users' && <option value="rating">Highest Rated</option>}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                        >
                            <FaTh />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                        >
                            <FaList />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-6"
                    >
                        <SearchFilters filters={filters} onFiltersChange={setFilters} />
                    </motion.div>
                )}

                {/* Results */}
                <div className="mb-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={() => performSearch(query)}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'posts' && (
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                    : 'space-y-6'
                                }>
                                    {posts.map((post, index) => (
                                        <motion.div
                                            key={post.postId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <PostCard post={post} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                    : 'space-y-6'
                                }>
                                    {users.map((user, index) => (
                                        <motion.div
                                            key={user.userId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <UserCard user={user} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* No Results */}
                            {((activeTab === 'posts' && posts.length === 0) ||
                                (activeTab === 'users' && users.length === 0)) &&
                                query && !loading && (
                                    <div className="text-center py-12">
                                        <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            No {activeTab} found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Try adjusting your search terms or filters
                                        </p>
                                        <Button onClick={() => setQuery('')}>
                                            Clear Search
                                        </Button>
                                    </div>
                                )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SearchContent />
        </Suspense>
    );
};

export default SearchPage;