import { useState, useEffect, useCallback } from 'react';

export const usePagination = (fetchFunction, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    const fetchData = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFunction({
                ...initialParams,
                ...params,
                page: pagination.page,
                limit: pagination.limit
            });

            if (response.data.posts) {
                // Handle posts response format
                setData(response.data.posts);
                setPagination(prev => ({
                    ...prev,
                    ...response.data.pagination
                }));
            } else if (Array.isArray(response.data)) {
                // Handle direct array response
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, initialParams, pagination.page, pagination.limit]);

    const goToPage = useCallback((page) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    const nextPage = useCallback(() => {
        if (pagination.page < pagination.pages) {
            goToPage(pagination.page + 1);
        }
    }, [pagination.page, pagination.pages, goToPage]);

    const prevPage = useCallback(() => {
        if (pagination.page > 1) {
            goToPage(pagination.page - 1);
        }
    }, [pagination.page, goToPage]);

    const setLimit = useCallback((limit) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        pagination,
        goToPage,
        nextPage,
        prevPage,
        setLimit,
        refetch: fetchData
    };
};