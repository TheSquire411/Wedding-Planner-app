import React, { useState, useMemo } from 'react';
import { Upload, X, Heart, Search, Filter, Grid, List, Plus, Camera, Trash2, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GalleryImage } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import { useFileUpload } from '../../hooks/useFileUpload';
import Modal from '../common/Modal';

interface InspirationGalleryProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InspirationGallery({ category, isOpen, onClose }: InspirationGalleryProps) {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'favorites' | 'name'>('date');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);

  const {
    isUploading,
    uploadProgress,
    dragActive,
    handleDrag,
    handleDrop,
    triggerFileInput,
    fileInputRef,
    handleFileSelect
  } = useFileUpload({
    onUploadComplete: (newPhotos) => {
      newPhotos.forEach(photo => {
        dispatch({ type: 'ADD_INSPIRATION_IMAGE', payload: { ...photo, category } });
      });
      setShowUploadModal(false);
    },
    onError: (errorMessage) => alert(`Upload Error: ${errorMessage}`),
  });

  const images = useMemo(() => state.inspirationImages.filter(img => img.category === category), [state.inspirationImages, category]);

  const filteredImages = useMemo(() => {
    return images
      .filter(img =>
        (img.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (img.tags && img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
         img.filename.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'favorites':
            return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
          case 'name':
            return a.filename.localeCompare(b.filename);
          case 'date':
          default:
            return b.uploadDate.getTime() - a.uploadDate.getTime();
        }
      });
  }, [images, searchTerm, sortBy]);

  const toggleFavorite = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      dispatch({ type: 'UPDATE_INSPIRATION_IMAGE', payload: { id: imageId, updates: { isFavorite: !image.isFavorite } } });
    }
  };

  const deleteImage = (imageId: string) => {
    dispatch({ type: 'DELETE_INSPIRATION_IMAGE', payload: imageId });
    setImageToDelete(null);
    if(selectedImage?.id === imageId) {
        setSelectedImage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{category} Inspiration</h3>
              <p className="text-primary-100 text-sm">{filteredImages.length} images</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Plus className="h-4 w-4 text-white" />
                <span className="text-white font-medium">Upload Photos</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 border-b bg-white">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="favorites">Sort by Favorites</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No {category.toLowerCase()} inspiration yet</h3>
                <p className="text-gray-500 mb-6">Upload your first inspiration photos to get started</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Upload Photos
                </button>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={image.thumbnail} alt={image.filename} className="w-full h-40 object-cover cursor-pointer" onClick={() => setSelectedImage(image)} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFavorite(image.id)} className="p-1 bg-white/80 rounded-full hover:bg-white"><Heart className={`h-4 w-4 ${image.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} /></button>
                        <button onClick={() => setImageToDelete(image)} className="p-1 bg-white/80 rounded-full hover:bg-white"><Trash2 className="h-4 w-4 text-red-600" /></button>
                      </div>
                      <div className="p-3"><p className="text-sm font-medium text-gray-800 truncate">{image.caption || image.filename}</p><p className="text-xs text-gray-500 mt-1">{formatFileSize(image.size)}</p></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <img src={image.thumbnail} alt={image.filename} className="w-16 h-16 object-cover rounded-lg cursor-pointer" onClick={() => setSelectedImage(image)} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{image.caption || image.filename}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(image.size)} • {new Date(image.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => toggleFavorite(image.id)} className="p-2 text-gray-400 hover:text-red-500"><Heart className={`h-4 w-4 ${image.isFavorite ? 'text-red-500 fill-current' : ''}`} /></button>
                        <button onClick={() => setSelectedImage(image)} className="p-2 text-gray-400 hover:text-primary-500"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setImageToDelete(image)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={`Upload to ${category} Gallery`}
      >
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          {isUploading ? (
            <>
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Uploading: {uploadProgress.toFixed(0)}%</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & drop photos here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button onClick={triggerFileInput} className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600">Choose Files</button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        title="Delete Image"
        footer={
          <>
            <button onClick={() => setImageToDelete(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button onClick={() => deleteImage(imageToDelete!.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </>
        }
      >
        <p className="text-gray-600">Are you sure you want to delete "{imageToDelete?.filename}"? This cannot be undone.</p>
      </Modal>
    </>
  );
}