import { useState } from 'react';
import { checkHealth, getAllPosts, getAllUsers } from '../services';
import { useApi } from '../hooks/useApi';

const ApiTest = () => {
    const { execute, loading, error } = useApi();
    const [results, setResults] = useState({});

    const testHealth = async () => {
        const result = await execute(() => checkHealth(), {
            showSuccessToast: true,
            successMessage: 'Backend is healthy!'
        });
        setResults(prev => ({ ...prev, health: result }));
    };

    const testPosts = async () => {
        const result = await execute(() => getAllPosts(), {
            showSuccessToast: true,
            successMessage: 'Posts loaded successfully!'
        });
        setResults(prev => ({ ...prev, posts: result }));
    };

    const testUsers = async () => {
        const result = await execute(() => getAllUsers(), {
            showSuccessToast: true,
            successMessage: 'Users loaded successfully!'
        });
        setResults(prev => ({ ...prev, users: result }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">API Connection Test</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                    onClick={testHealth}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Test Health Check
                </button>

                <button
                    onClick={testPosts}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Test Get Posts
                </button>

                <button
                    onClick={testUsers}
                    disabled={loading}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Test Get Users
                </button>
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {Object.keys(results).length > 0 && (
                <div className="space-y-4">
                    {results.health && (
                        <div className="bg-green-50 p-4 rounded">
                            <h3 className="font-semibold text-green-800">Health Check Result:</h3>
                            <pre className="text-sm mt-2 text-green-700">
                                {JSON.stringify(results.health, null, 2)}
                            </pre>
                        </div>
                    )}

                    {results.posts && (
                        <div className="bg-blue-50 p-4 rounded">
                            <h3 className="font-semibold text-blue-800">Posts Result:</h3>
                            <p className="text-sm text-blue-700">
                                Found {Array.isArray(results.posts) ? results.posts.length : 0} posts
                            </p>
                            <pre className="text-sm mt-2 text-blue-700 max-h-40 overflow-y-auto">
                                {JSON.stringify(results.posts, null, 2)}
                            </pre>
                        </div>
                    )}

                    {results.users && (
                        <div className="bg-purple-50 p-4 rounded">
                            <h3 className="font-semibold text-purple-800">Users Result:</h3>
                            <p className="text-sm text-purple-700">
                                Found {Array.isArray(results.users) ? results.users.length : 0} users
                            </p>
                            <pre className="text-sm mt-2 text-purple-700 max-h-40 overflow-y-auto">
                                {JSON.stringify(results.users, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApiTest;