'use client';

import { motion } from 'framer-motion';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export const ReviewCard = ({ review, canEdit = false, onEdit, onDelete }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={review.reviewerDP || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}`}
                        alt={review.reviewerName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.reviewerName}
                        </h4>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>

                {canEdit && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEdit(review)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Edit review"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => onDelete(review.reviewId)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete review"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-3">
                {review.skillExchanged && review.skillExchanged !== 'general' && (
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Skill:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-xs font-medium">
                            {review.skillExchanged}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full text-xs font-medium">
                            {review.exchangeType === 'taught' ? 'Taught' : 'Learned'}
                        </span>
                    </div>
                )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
            </p>
        </motion.div>
    );
};