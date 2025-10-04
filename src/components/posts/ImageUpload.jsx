'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Assuming you have a Button component in `components/ui/`
// If not, you can replace it with a standard <button>
// import { Button } from '@/components/ui/Button'; 

export const ImageUpload = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // This function will be passed to the parent component
  // to get the final uploaded URLs
  const handleImagesChange = (newImages) => {
    setImages(newImages);
    if (onImagesChange) {
      onImagesChange(newImages);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    
    if (images.length + newImages.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    handleImagesChange([...images, ...newImages]);
  }, [images, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (fileName) => {
    handleImagesChange(images.filter(file => file.name !== fileName));
  };
  
  // This is a dummy upload function. Replace with your actual Cloudinary logic.
  const handleUploadAll = async () => {
    if (images.length === 0) {
      toast.error("Please select images to upload.");
      return;
    }
    setIsUploading(true);
    toast.loading('Uploading images...');

    // Simulate upload delay
    setTimeout(() => {
        setIsUploading(false);
        toast.dismiss();
        toast.success('Images uploaded successfully! (Simulated)');
        // In a real app, you would get URLs back from Cloudinary and pass them to the parent
        // const uploadedUrls = await uploadToCloudinary(images);
        // onImagesChange(uploadedUrls);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isDragActive ? (
            <>
              <FaImage className="w-12 h-12 text-blue-500" />
              <p className="font-medium text-blue-600">Drop the images here...</p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">Drag & drop images, or click to select</p>
              <p className="text-xs text-gray-500">Max {maxImages} images, 5MB each</p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
          >
            {images.map(file => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative overflow-hidden rounded-lg group"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                  onLoad={() => URL.revokeObjectURL(file.preview)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => removeImage(file.name)}
                    className="p-2 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {images.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleUploadAll} 
            disabled={isUploading}
            className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUploading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isUploading ? 'Uploading...' : 'Upload All'}
          </button>
        </div>
      )}
    </div>
  );
};