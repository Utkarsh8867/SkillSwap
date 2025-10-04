import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaUsers, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { followUser, unfollowUser } from '../../services';
import toast from 'react-hot-toast';

export const UserCard = ({ user, onFollow }) => {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(
        user.followers?.includes(currentUser?.userId) || false
    );
    const [loading, setLoading] = useState(false);

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            toast.error('Please login to follow users');
            return;
        }

        setLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(user.userId);
                setIsFollowing(false);
                toast.success('Unfollowed user');
            } else {
                await followUser(user.userId);
                setIsFollowing(true);
                toast.success('Following user');
            }

            if (onFollow) {
                onFollow(user.userId, !isFollowing);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/messages?user=${user.userId}`;
    };

    const isOwnProfile = currentUser?.userId === user.userId;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <Link href={`/profile/${user.userId}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                            <img
                                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </h3>
                            {user.bio && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {user.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center text-yellow-500 mb-1">
                                <FaStar className="w-4 h-4 mr-1" />
                                <span className="font-semibold">{user.rating || 0}</span>
                            </div>
                            <p className="text-xs text-gray-500">Rating</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center text-blue-500 mb-1">
                                <FaUsers className="w-4 h-4 mr-1" />
                                <span className="font-semibold">{user.completedExchanges || 0}</span>
                            </div>
                            <p className="text-xs text-gray-500">Exchanges</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center text-green-500 mb-1">
                                <span className="font-semibold">{user.totalReviews || 0}</span>
                            </div>
                            <p className="text-xs text-gray-500">Reviews</p>
                        </div>
                    </div>

                    {/* Location */}
                    {user.location?.city && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">{user.location.city}</span>
                        </div>
                    )}

                    {/* Skills Preview */}
                    <div className="mb-4">
                        {user.skillsToTeach && user.skillsToTeach.length > 0 && (
                            <div className="mb-2">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Can teach:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {user.skillsToTeach.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {user.skillsToTeach.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                                            +{user.skillsToTeach.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {user.skillsToLearn && user.skillsToLearn.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Wants to learn:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {user.skillsToLearn.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {user.skillsToLearn.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                                            +{user.skillsToLearn.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Action Buttons */}
            {!isOwnProfile && currentUser && (
                <div className="px-6 pb-4 flex space-x-2">
                    <Button
                        onClick={handleMessage}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center space-x-1"
                    >
                        <FaEnvelope className="w-3 h-3" />
                        <span>Message</span>
                    </Button>

                    <Button
                        onClick={handleFollow}
                        disabled={loading}
                        isLoading={loading}
                        variant={isFollowing ? 'outline' : 'primary'}
                        size="sm"
                        className="flex-1 flex items-center justify-center space-x-1"
                    >
                        <FaUserPlus className="w-3 h-3" />
                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                    </Button>
                </div>
            )}
        </motion.div>
    );
};