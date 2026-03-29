import { useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUploadThing } from '../utils/uploadthing';

export function BookCoverUpload({ onUploadComplete, imagePreview, setImagePreview, setImageFile }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const { startUpload } = useUploadThing('bookCover');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be smaller than 4MB.');
      return;
    }

    setError('');
    setUploadSuccess(false);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    uploadToUploadThing(file);
  };

  const uploadToUploadThing = async (fileToUpload) => {
    try {
      setIsUploading(true);
      setError('');

      const result = await startUpload([fileToUpload]);

      if (!result || result.length === 0) throw new Error('Upload failed: No file returned.');
      
      const imageUrl = result[0].url;
      if (!imageUrl) throw new Error('Upload failed: No URL returned.');

      onUploadComplete(imageUrl);
      setUploadSuccess(true);
      setImageFile(null);
    } catch (err) {
      console.error('UploadThing error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploadSuccess(false);
      // Clear preview on failure to allow re-upload of same file
      setImagePreview(null);
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setImagePreview(null);
    setImageFile(null);
    setUploadSuccess(false);
    setError('');
    onUploadComplete(''); // Also clear the URL in the parent form
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-36 rounded-md border-2 border-dashed border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Book cover preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearPreview}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="text-center p-2">
                <Upload size={24} className="text-gray-400 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Cover</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="relative w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center">
              <Upload size={20} className="text-emerald-600 mb-2" />
              <p className="text-sm text-gray-700 font-medium">
                {isUploading ? 'Uploading...' : (imagePreview ? 'Change file' : 'Upload cover')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Max 4MB</p>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
      {uploadSuccess && !error && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
          <CheckCircle size={16} />
          <span>Cover uploaded successfully!</span>
        </div>
      )}
    </div>
  );
}
