import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, FileImage } from 'lucide-react';

interface InlineImageGalleryProps {
  images: { fileName: string; fileUrl?: string; messageId: string }[];
  onClose: () => void;
}

const InlineImageGallery: React.FC<InlineImageGalleryProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = images[currentIndex];
  const totalCount = images.length;

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalCount) % totalCount);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalCount);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!currentImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[800] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
        <div className="bg-black/50 px-3 py-1 rounded-full">
          <p className="text-white text-sm">
            {currentIndex + 1} / {totalCount} {totalCount === 1 ? 'image' : 'images'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Main display */}
      <div className="flex items-center justify-center max-w-[80vw] max-h-[60vh]">
        {currentImage.fileUrl ? (
          <img
            src={currentImage.fileUrl}
            alt={currentImage.fileName}
            className="max-h-[60vh] max-w-[80vw] rounded-xl object-contain"
          />
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl p-8 flex flex-col items-center justify-center max-w-[80vw] max-h-[60vh]">
            <FileImage size={48} className="text-[#555] mb-4" />
            <p className="text-white text-center text-lg font-medium mb-2">
              {currentImage.fileName}
            </p>
            <p className="text-[#555] text-sm">
              Image preview not available
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {totalCount > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {totalCount > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex gap-2 p-2 bg-black/50 rounded-lg overflow-x-auto max-w-[80vw]">
            {images.map((image, index) => (
              <button
                key={image.messageId}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-indigo-500 bg-[#2a2a2a]'
                    : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                }`}
              >
                {image.fileUrl ? (
                  <img
                    src={image.fileUrl}
                    alt={image.fileName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <FileImage size={16} className="text-[#555]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineImageGallery;
