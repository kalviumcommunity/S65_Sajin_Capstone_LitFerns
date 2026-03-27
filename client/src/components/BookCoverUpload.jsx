import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

export function BookCoverUpload({ onUploadComplete, imagePreview, setImagePreview, imageFile, setImageFile }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be less than 4MB');
      return;
    }

    setError('');
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadCover = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      // UploadThing expects the field name to match the route name
      formData.append('files', imageFile);

      // Upload to your backend which will forward to UploadThing
      const response = await axios.post(`${apiUrl}/api/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.file) {
        const uploadedFileUrl = response.data.file.url || response.data.file.ufsUrl;
        onUploadComplete(uploadedFileUrl);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="w-20 h-28 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <Upload size={20} className="text-gray-300" />
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1 relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-teal-400 hover:bg-teal-50/20 transition cursor-pointer">
            <Upload size={18} className="text-teal-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">
              {imageFile ? imageFile.name : 'Click to upload'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG — max 4MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <X size={12} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {imageFile && (
        <button
          type="button"
          onClick={uploadCover}
          disabled={isUploading}
          className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload Cover Image
            </>
          )}
        </button>
      )}
    </div>
  );
}
