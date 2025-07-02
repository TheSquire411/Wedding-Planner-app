import { useState, useCallback, useRef } from 'react';
import { GalleryImage } from '../types'; // Using our centralized type

// --- Configuration Constants ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];

// --- Helper Functions (could be moved to a separate image utility file) ---

/**
 * Simulates optimizing an image. In a real app, this would involve compression.
 * For now, it just returns the object URL.
 */
const optimizeImage = async (file: File): Promise<string> => {
  // In a real app, you might use a library like `browser-image-compression`
  console.log(`Optimizing ${file.name}...`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate async work
  return URL.createObjectURL(file);
};

/**
 * Simulates generating a thumbnail for an image.
 */
const generateThumbnail = async (file: File): Promise<string> => {
  // In a real app, you'd create a smaller canvas and draw the image onto it.
  console.log(`Generating thumbnail for ${file.name}...`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async work
  return URL.createObjectURL(file);
};


// --- The Custom Hook ---

interface FileUploadOptions {
  onUploadComplete?: (newPhotos: GalleryImage[]) => void;
  onError?: (errorMessage: string) => void;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        const errorMsg = `${file.name} is not a supported format. Please use JPG, PNG, or HEIC.`;
        console.error(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        const errorMsg = `${file.name} is too large. Maximum file size is 10MB.`;
        console.error(errorMsg);
        options.onError?.(errorMsg);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newPhotos: GalleryImage[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      try {
        const optimizedUrl = await optimizeImage(file);
        const thumbnailUrl = await generateThumbnail(file);
        
        const newPhoto: GalleryImage = {
          id: `${Date.now()}-${Math.random()}`,
          url: optimizedUrl,
          thumbnail: thumbnailUrl,
          filename: file.name,
          size: file.size,
          category: 'Inspiration', // Default category
          tags: [],
          isFavorite: false,
          uploadDate: new Date(),
          source: 'device',
          edits: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            filter: 'None'
          }
        };
        newPhotos.push(newPhoto);
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        options.onError?.(`Error processing ${file.name}.`);
      }
      
      setUploadProgress(((i + 1) / validFiles.length) * 100);
    }

    setIsUploading(false);
    setUploadProgress(0);
    options.onUploadComplete?.(newPhotos);
  }, [options]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    isUploading,
    uploadProgress,
    dragActive,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileSelect,
    triggerFileInput,
  };
}