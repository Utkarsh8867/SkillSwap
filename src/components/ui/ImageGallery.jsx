'use client';

import Image from 'next/image';

export const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const firstImage = images[0];
  const remainingImages = images.length - 1;

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden group">
      <Image
        src={firstImage.url || firstImage}
        alt="Post image"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {remainingImages > 0 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-full">
          + {remainingImages} more
        </div>
      )}
    </div>
  );
};