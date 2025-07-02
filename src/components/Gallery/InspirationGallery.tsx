import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Heart, Search, Filter, Grid, List, Plus, Camera, Tag, Calendar, Trash2, Eye, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  category: string;
  caption?: string;
  tags: string[];
  isFavorite: boolean;
  uploadDate: Date;
  notes?: string;
}

interface InspirationGalleryProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InspirationGallery({ category, isOpen, onClose }: InspirationGalleryProps) {
  const { state } = useApp();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'favorites' | 'name'>('date');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const IMAGES_PER_PAGE = 12;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic'];

  // Simulate storage usage (in a real app, this would come from backend)
  const storageUsed = images.reduce((total, img) => total + img.size, 0);
  const storageLimit = 1024 * 1024 * 1024; // 1GB
  const storagePercentage = (storageUsed / storageLimit) * 100;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        alert(`${file.name} is not a supported format. Please use JPG, PNG, or HEIC.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    if (validFiles.length > 20) {
      alert('Maximum 20 files can be uploaded at once.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload process
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create image object
      const newImage: GalleryImage = {
        id: Date.now().toString() + i,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file), // In real app, generate thumbnail
        filename: file.name,
        size: file.size,
        category,
        tags: [],
        isFavorite: false,
        uploadDate: new Date(),
        caption: '',
        notes: ''
      };

      setImages(prev => [newImage, ...prev]);
      setUploadProgress(((i + 1) / validFiles.length) * 100);
    }

    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
  };

  const filteredImages = images
    .filter(img => 
      img.category === category &&
      (img.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
       img.filename.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'favorites':
          return b.isFavorite === a.isFavorite ? 0 : b.isFavorite ? 1 : -1;
        case 'name':
          return a.filename.localeCompare(b.filename);
        case 'date':
        default:
          return b.uploadDate.getTime() - a.uploadDate.getTime();
      }
    });

  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  };

  const deleteImage = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImage(null);
    }
  };

  const updateImageData = (imageId: string, updates: Partial<GalleryImage>) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
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

        {/* Storage Usage */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage: {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}</span>
            <span className="text-gray-600">{storagePercentage.toFixed(1)}% used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            ></div>
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
                  placeholder="Search by caption, tags, or filename..."
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
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginatedImages.map((image) => (
                    <div key={image.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <img
                          src={image.thumbnail}
                          alt={image.filename}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(image.id);
                            }}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${image.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-800 truncate">{image.caption || image.filename}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(image.size)}</p>
                        {image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {image.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                            {image.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{image.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedImages.map((image) => (
                    <div key={image.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <img
                        src={image.thumbnail}
                        alt={image.filename}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{image.caption || image.filename}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(image.size)} • {image.uploadDate.toLocaleDateString()}</p>
                        {image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {image.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(image.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${image.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Upload Photos</h4>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 mb-2">Uploading photos...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{uploadProgress.toFixed(0)}% complete</p>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop photos here</p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.heic"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-4">
                    JPG, PNG, HEIC up to 10MB each • Max 20 files
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <ImagePreviewModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onUpdate={(updates) => updateImageData(selectedImage.id, updates)}
            onDelete={() => deleteImage(selectedImage.id)}
          />
        )}
      </div>
    </div>
  );
}

// Image Preview Modal Component
interface ImagePreviewModalProps {
  image: GalleryImage;
  onClose: () => void;
  onUpdate: (updates: Partial<GalleryImage>) => void;
  onDelete: () => void;
}

function ImagePreviewModal({ image, onClose, onUpdate, onDelete }: ImagePreviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    caption: image.caption || '',
    tags: image.tags.join(', '),
    notes: image.notes || ''
  });

  const handleSave = () => {
    onUpdate({
      caption: editData.caption,
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      notes: editData.notes
    });
    setIsEditing(false);
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden flex">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <img
            src={image.url}
            alt={image.filename}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800">Image Details</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdate({ isFavorite: !image.isFavorite })}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className={`h-5 w-5 ${image.isFavorite ? 'text-red-500 fill-current' : ''}`} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.caption}
                  onChange={(e) => setEditData(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add a caption..."
                />
              ) : (
                <p className="text-gray-600">{image.caption || 'No caption'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add tags separated by commas..."
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {image.tags.length > 0 ? (
                    image.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No tags</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              {isEditing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes..."
                />
              ) : (
                <p className="text-gray-600">{image.notes || 'No notes'}</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                <strong>Filename:</strong> {image.filename}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Size:</strong> {(image.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-500">
                <strong>Uploaded:</strong> {image.uploadDate.toLocaleDateString()}
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Edit Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}