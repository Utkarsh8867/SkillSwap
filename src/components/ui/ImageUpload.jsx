'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import Image from 'next/image';
import { cn, formatBytes } from '@/utils/helpers';
import { MAX_IMAGE_UPLOAD, MAX_IMAGE_SIZE_MB } from '@/utils/constants';
import toast from 'react-hot-toast';

export const ImageUpload = ({ images, onImagesChange }) => {
  const maxSizeInBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`'${file.name}' exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`);
          } else {
            toast.error(error.message);
          }
        });
      });
    }

    if (acceptedFiles.length === 0) return;

    const newImages = acceptedFiles.map(file => Object.assign(file, {
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
    }));

    if ((images.length + newImages.length) > MAX_IMAGE_UPLOAD) {
      toast.error(`Maximum ${MAX_IMAGE_UPLOAD} images allowed.`);
      return;
    }

    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    maxSize: maxSizeInBytes,
    multiple: true,
  });

  const removeImage = (idToRemove) => {
    const imageToRemove = images.find(img => img.id === idToRemove);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== idToRemove));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300',
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          {isDragActive ? (
            <>
              <FaImage className="w-12 h-12 text-blue-500 animate-pulse" />
              <p className="text-blue-600 dark:text-blue-400 font-medium">Drop images here...</p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Drag images here, or <span className="font-semibold text-blue-600">click to select</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Max {MAX_IMAGE_UPLOAD} images, {MAX_IMAGE_SIZE_MB}MB each. (PNG, JPG, WEBP)
              </p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {images.map(image => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative group aspect-square"
              >
                <Image
                  src={image.preview}
                  alt={image.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-colors duration-300 rounded-lg"/>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-2 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Remove image"
                >
                  <FaTimes className="w-3 h-3"/>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs rounded-b-lg">
                  <p className="truncate">{image.name}</p>
                  <p>{formatBytes(image.size)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};