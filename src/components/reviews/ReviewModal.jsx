'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar } from 'react-icons/fa';
import { createReview, updateReview } from '@/services';
import toast from 'react-hot-toast';

export const ReviewModal = ({ isOpen, onClose, user, existingReview = null, onSuccess }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [skillExchanged, setSkillExchanged] = useState(existingReview?.skillExchanged || '');
    const [exchangeType, setExchangeType] = useState(existingReview?.exchangeType || 'learned');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
            setSkillExchanged(existingReview.skillExchanged || '');
            setExchangeType(existingReview.exchangeType);
        } else {
            setRating(0);
            setComment('');
            setSkillExchanged('');
            setExchangeType('learned');
        }
    }, [existingReview, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            setLoading(true);

            const reviewData = {
                revieweeId: user.userId,
                rating,
                comment: comment.trim(),
                skillExchanged: skillExchanged.trim() || 'general',
                exchangeType
            };

            if (existingReview) {
                await updateReview(existingReview.reviewId, reviewData);
                toast.success('Review updated successfully');
            } else {
                await createReview(reviewData);
                toast.success('Review created successfully');
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(existingReview ? 'Failed to update review' : 'Failed to create review');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`w-8 h-8 ${index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    } hover:text-yellow-400 transition-colors`}
            >
                <FaStar />
            </button>
        ));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {existingReview ? 'Edit Review' : 'Write a Review'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <img
                                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Rating: {user.rating || 0}/5 ({user.totalReviews || 0} reviews)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Review Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rating *
                            </label>
                            <div className="flex items-center space-x-1">
                                {renderStars()}
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {rating > 0 ? `${rating}/5` : 'Select rating'}
                                </span>
                            </div>
                        </div>

                        {/* Exchange Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Exchange Type *
                            </label>
                            <select
                                value={exchangeType}
                                onChange={(e) => setExchangeType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="learned">I learned from them</option>
                                <option value="taught">I taught them</option>
                            </select>
                        </div>

                        {/* Skill */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skill Exchanged
                            </label>
                            <input
                                type="text"
                                value={skillExchanged}
                                onChange={(e) => setSkillExchanged(e.target.value)}
                                placeholder="e.g., JavaScript, Guitar, Cooking..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                maxLength={100}
                            />
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Review *
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this person..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                rows={4}
                                maxLength={500}
                                required
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {comment.length}/500
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0 || !comment.trim()}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                ) : (
                                    existingReview ? 'Update Review' : 'Submit Review'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};