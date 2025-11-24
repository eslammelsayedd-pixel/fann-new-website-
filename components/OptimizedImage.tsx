
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string; // Expecting the base filename without extension if utilizing the optimization script
  alt: string;
  className?: string;
  priority?: boolean; // If true, eager load (for Hero)
  sizes?: string; // Standard HTML sizes attribute
  width?: number; // Required for CLS prevention
  height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Assuming src is a full URL or path. 
  // If using the optimization script, we would parse the filename.
  // For this implementation, we will check if it's an external URL or local.
  const isExternal = src.startsWith('http');

  if (isExternal) {
    return (
      <div className={`relative overflow-hidden bg-fann-charcoal-lighter ${className}`}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          width={width}
          height={height}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
      </div>
    );
  }

  // Local Optimization Logic (matches scripts/optimize-images.mjs output)
  const filename = src.split('/').pop()?.split('.')[0];
  const basePath = '/images/optimized';

  return (
    <div className={`relative overflow-hidden bg-fann-charcoal-lighter ${className}`}>
      {/* Blur Placeholder */}
      {!isLoaded && !priority && (
        <img 
          src={`${basePath}/${filename}-placeholder.webp`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
        />
      )}

      <picture>
        <source
          type="image/webp"
          srcSet={`
            ${basePath}/${filename}-400.webp 400w,
            ${basePath}/${filename}-768.webp 768w,
            ${basePath}/${filename}-1280.webp 1280w,
            ${basePath}/${filename}-1920.webp 1920w
          `}
          sizes={sizes}
        />
        <motion.img
          src={`${basePath}/${filename}-full.webp`}
          alt={alt}
          className={`w-full h-full object-cover relative z-10`}
          initial={{ opacity: priority ? 1 : 0 }}
          animate={{ opacity: isLoaded || priority ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          width={width}
          height={height}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
