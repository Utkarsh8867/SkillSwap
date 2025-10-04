import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchPosts } from '../services';
import { useDebounce } from './useDebounce';

export const useSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedQuery = useDebounce(query, 300);

    const search = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchPosts(searchQuery);
            setResults(response.data.posts || []);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedQuery) {
            search(debouncedQuery);
        } else {
            setResults([]);
        }
    }, [debouncedQuery, search]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        search,
        clearSearch
    };
};