import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { ImageUpload } from '../ui/ImageUpload';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services';
import toast from 'react-hot-toast';

const SkillTagInput = ({ field, placeholder, error }) => {
    const [inputValue, setInputValue] = useState('');

    const addSkill = () => {
        const value = inputValue.trim();
        if (value && !(field.value || []).includes(value)) {
            field.onChange([...(field.value || []), value]);
            setInputValue('');
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="input-style flex-1"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                        }
                    }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    Add
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border dark:border-gray-700">
                {(field.value || []).map((skill, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                            className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-300"
                        >
                            <FaTimes className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export const ProfileEdit = ({ user, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location?.city || '',
            skillsToTeach: user?.skillsToTeach || [],
            skillsToLearn: user?.skillsToLearn || []
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location?.city || '',
                skillsToTeach: user.skillsToTeach || [],
                skillsToLearn: user.skillsToLearn || []
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Add text fields
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });

            // Add profile image if selected
            if (profileImage.length > 0) {
                formData.append('profileImage', profileImage[0]);
            }

            const response = await updateUserProfile(user.userId, formData);
            toast.success('Profile updated successfully!');
            onSave(response.data);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Profile
                </h2>
                <Button variant="outline" onClick={onCancel}>
                    <FaTimes className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Image */}
                <div>
                    <label className="block text-sm font-medium mb-2">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaUser className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <ImageUpload
                                images={profileImage}
                                onImagesChange={setProfileImage}
                                maxImages={1}
                            />
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            <FaUser className="inline mr-2" />
                            Full Name *
                        </label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            id="name"
                            className="input-style w-full"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            <FaEnvelope className="inline mr-2" />
                            Email *
                        </label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            type="email"
                            id="email"
                            className="input-style w-full"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                        Bio
                    </label>
                    <textarea
                        {...register('bio')}
                        id="bio"
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="input-style w-full"
                    />
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                        <FaMapMarkerAlt className="inline mr-2" />
                        Location
                    </label>
                    <input
                        {...register('location')}
                        type="text"
                        id="location"
                        placeholder="e.g., New York, NY"
                        className="input-style w-full"
                    />
                </div>

                {/* Skills to Teach */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Skills I Can Teach
                    </label>
                    <Controller
                        name="skillsToTeach"
                        control={control}
                        render={({ field, fieldState }) => (
                            <SkillTagInput
                                field={field}
                                error={fieldState.error}
                                placeholder="e.g., React, Python, Design"
                            />
                        )}
                    />
                </div>

                {/* Skills to Learn */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Skills I Want to Learn
                    </label>
                    <Controller
                        name="skillsToLearn"
                        control={control}
                        render={({ field, fieldState }) => (
                            <SkillTagInput
                                field={field}
                                error={fieldState.error}
                                placeholder="e.g., Machine Learning, UI/UX"
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} isLoading={loading}>
                        <FaSave className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};