import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useUploadThing } from '../utils/uploadthing';

export function BookCoverUpload({ onUploadComplete, imagePreview, setImagePreview, imageFile, setImageFile }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const { startUpload } = useUploadThing('bookCover');

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
    setUploadSuccess(false);
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Auto-upload to UploadThing
    uploadToUploadThing(file);
  };

  const uploadToUploadThing = async (fileToUpload) => {
    try {
      setIsUploading(true);
      setError('');

      console.log('Uploading to UploadThing:', fileToUpload.name);

      // Use UploadThing's startUpload to upload directly to their CDN
      const result = await startUpload([fileToUpload]);

      console.log('UploadThing response:', result);

      if (!result || result.length === 0) {
        throw new Error('No file uploaded');
      }

      const uploadedFile = result[0];
      const imageUrl = uploadedFile.url || uploadedFile.fileUrl;

      if (!imageUrl) {
        throw new Error('No URL returned from UploadThing');
      }

      console.log('✅ Image uploaded to UploadThing:', imageUrl);
      onUploadComplete(imageUrl);
      setUploadSuccess(true);
      setImageFile(null);
    } catch (err) {
      console.error('❌ UploadThing error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploadSuccess(false);
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

      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
        </div>
      )}

      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs text-blue-600">Uploading image...</p>
        </div>
      )}

      {imageFile && !uploadSuccess && (
        <button
          type="button"
          onClick={() => uploadImageFile(imageFile)}
          disabled={isUploading}
          className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
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
