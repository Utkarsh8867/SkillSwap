import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { updatePost, getPostById } from '@/services';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import { FaPlus, FaTimes, FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { postValidation } from '@/utils/validation';

const SkillTagInput = ({ field, placeholder, error, className }) => {
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
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    <FaPlus /> Add
                </Button>
            </div>
            <div className={`flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border dark:border-gray-700 ${className}`}>
                {(field.value || []).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
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

export const PostEdit = ({ postId, onSave, onCancel }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [postData, setPostData] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        trigger,
        reset
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            title: '',
            description: '',
            category: '',
            skillsOffered: [],
            skillsNeeded: [],
            skillLevel: 'Intermediate',
            postType: 'exchange',
            location: 'Remote',
            availability: '',
            duration: '',
        }
    });

    const watchedValues = watch();

    // Load existing post data
    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const response = await getPostById(postId);
                const post = response.data;

                setPostData(post);
                setExistingImages(post.images || []);

                // Reset form with existing data
                reset({
                    title: post.title || '',
                    description: post.description || '',
                    category: post.category || '',
                    skillsOffered: post.skillsOffered || [],
                    skillsNeeded: post.skillsNeeded || [],
                    skillLevel: post.skillLevel || 'Intermediate',
                    postType: post.postType || 'exchange',
                    location: post.location?.city || 'Remote',
                    availability: post.availability || '',
                    duration: post.duration || '',
                });
            } catch (error) {
                toast.error('Failed to load post data');
                if (onCancel) onCancel();
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            loadPost();
        }
    }, [postId, reset, onCancel]);

    const handleNext = async () => {
        const fieldsToValidate = [
            [], // Step 0 (not used)
            ['title', 'description', 'category', 'postType'], // Step 1
            [], // Step 2 (handled separately)
            ['location', 'availability', 'duration'], // Step 3
        ][currentStep];

        if (currentStep === 2) {
            if (['offering', 'exchange'].includes(watchedValues.postType)) fieldsToValidate.push('skillsOffered');
            if (['seeking', 'exchange'].includes(watchedValues.postType)) fieldsToValidate.push('skillsNeeded');
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid && currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const removeExistingImage = (imageUrl) => {
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
        setImagesToRemove(prev => [...prev, imageUrl]);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Add text fields
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('postType', data.postType);
            formData.append('skillLevel', data.skillLevel);
            formData.append('availability', data.availability);
            formData.append('duration', data.duration);

            // Handle skills arrays
            if (data.skillsOffered && data.skillsOffered.length > 0) {
                formData.append('skillsOffered', data.skillsOffered.join(','));
            }
            if (data.skillsNeeded && data.skillsNeeded.length > 0) {
                formData.append('skillsNeeded', data.skillsNeeded.join(','));
            }

            // Add location
            if (data.location) {
                formData.append('location', JSON.stringify({
                    city: data.location,
                    coordinates: { lat: 0, lng: 0 }
                }));
            }

            // Add new images
            images.forEach((image) => {
                formData.append('images', image);
            });

            // Add images to remove
            if (imagesToRemove.length > 0) {
                formData.append('removeImages', JSON.stringify(imagesToRemove));
            }

            const response = await updatePost(postId, formData, imagesToRemove);
            toast.success('Post updated successfully!');

            if (onSave) {
                onSave(response.data);
            } else {
                router.push(`/post/${postId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update post.');
            console.error("Post update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    const steps = [
        { title: 'Basic Info', desc: 'Update your post details' },
        { title: 'Skills', desc: 'What skills are involved?' },
        { title: 'Details', desc: 'Set the logistics' },
        { title: 'Images', desc: 'Update visuals for your post' }
    ];

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Post
                </h2>
                <Button variant="outline" onClick={onCancel}>
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep > index + 1 ? 'bg-green-500 text-white' :
                                    currentStep === index + 1 ? 'bg-primary-500 text-white' :
                                        'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                {currentStep > index + 1 ? '✓' : index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {steps[currentStep - 1].title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {steps[currentStep - 1].desc}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Post Type */}
                            <div>
                                <label htmlFor="postType" className="block text-sm font-medium mb-1">Post Type</label>
                                <select {...register('postType')} id="postType" className="input-style w-full">
                                    <option value="exchange">Skill Exchange</option>
                                    <option value="offering">Offering Skills</option>
                                    <option value="seeking">Seeking Skills</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                                <input
                                    {...register('title', postValidation.title)}
                                    type="text"
                                    id="title"
                                    placeholder="e.g., Learn React, Teach Python"
                                    className="input-style w-full"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
                                <textarea
                                    {...register('description', postValidation.description)}
                                    id="description"
                                    rows={4}
                                    placeholder="Describe what you're offering and what you're looking for..."
                                    className="input-style w-full"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                                <select {...register('category')} id="category" className="input-style w-full">
                                    <option value="">Select a category</option>
                                    <option value="programming">Programming</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="business">Business</option>
                                    <option value="language">Language</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Skills */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {['offering', 'exchange'].includes(watchedValues.postType) && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Skills Offered</label>
                                    <Controller
                                        name="skillsOffered"
                                        control={control}
                                        rules={postValidation.skills}
                                        render={({ field, fieldState }) =>
                                            <SkillTagInput
                                                field={field}
                                                error={fieldState.error}
                                                placeholder="e.g., React, Node.js"
                                                className="bg-green-50 dark:bg-green-900/20"
                                            />
                                        }
                                    />
                                </div>
                            )}

                            {['seeking', 'exchange'].includes(watchedValues.postType) && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Skills Needed</label>
                                    <Controller
                                        name="skillsNeeded"
                                        control={control}
                                        rules={postValidation.skills}
                                        render={({ field, fieldState }) =>
                                            <SkillTagInput
                                                field={field}
                                                error={fieldState.error}
                                                placeholder="e.g., Python, Figma"
                                                className="bg-blue-50 dark:bg-blue-900/20"
                                            />
                                        }
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="skillLevel" className="block text-sm font-medium mb-1">Skill Level</label>
                                <select {...register('skillLevel')} id="skillLevel" className="input-style w-full">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Details */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    {...register('location')}
                                    type="text"
                                    id="location"
                                    placeholder="e.g., New York, Remote"
                                    className="input-style w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="availability" className="block text-sm font-medium mb-1">Availability</label>
                                <input
                                    {...register('availability')}
                                    type="text"
                                    id="availability"
                                    placeholder="e.g., Weekends, Evenings"
                                    className="input-style w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium mb-1">Expected Duration</label>
                                <select {...register('duration')} id="duration" className="input-style w-full">
                                    <option value="">Select duration</option>
                                    <option value="1-2 weeks">1-2 weeks</option>
                                    <option value="1 month">1 month</option>
                                    <option value="2-3 months">2-3 months</option>
                                    <option value="6+ months">6+ months</option>
                                    <option value="ongoing">Ongoing</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Images */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">Current Images</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingImages.map((imageUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(imageUrl)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">Add New Images</h3>
                                <ImageUpload images={images} onImagesChange={setImages} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t mt-6 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        Previous
                    </Button>

                    {currentStep < 4 ? (
                        <Button type="button" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                            <FaSave className="w-4 h-4 mr-2" />
                            Update Post
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};