// ImageComponent.tsx
import React from 'react';

interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt }) => {
  return (
    <div className="w-full max-w-xs mx-auto mt-4">
      <img src={src} alt={alt} className="object-contain w-full h-60 md:h-72" />
    </div>
  );
};

export default ImageComponent;
