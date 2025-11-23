// client/src/components/ReviewModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const StarIcon = ({ className = "w-6 h-6 text-gray-300", filled = false }) => (
  <svg className={`${className} ${filled ? 'text-yellow-400' : ''}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewModal = ({ isOpen, onClose, product, user, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  if (!isOpen || !product) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validasi jumlah file
    const totalFiles = mediaFiles.length + files.length;
    if (totalFiles > 7) {
      toast.error('Maksimal 7 file (5 foto + 2 video)');
      return;
    }

    // Validasi tipe dan ukuran file
    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        toast.error(`${file.name} bukan foto atau video`);
        return;
      }

      // Validasi ukuran
      const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB video, 5MB foto
      if (file.size > maxSize) {
        toast.error(`${file.name} terlalu besar (max ${isVideo ? '20MB' : '5MB'})`);
        return;
      }

      validFiles.push(file);

      // Buat preview
      const preview = {
        file,
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video'
      };
      previews.push(preview);
    });

    setMediaFiles([...mediaFiles, ...validFiles]);
    setMediaPreviews([...mediaPreviews, ...previews]);
  };

  const removeMedia = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);

    // Revoke URL untuk free memory
    URL.revokeObjectURL(mediaPreviews[index].url);

    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productId = product.product._id || product.product;

      // Buat FormData untuk upload file
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);

      // Tambahkan semua media files
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        formData,
        config
      );

      toast.success('Ulasan berhasil dikirim!');

      // Cleanup previews
      mediaPreviews.forEach(preview => URL.revokeObjectURL(preview.url));

      if (onSuccess) onSuccess();
      onClose();
      setComment('');
      setRating(5);
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mengirim ulasan';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold">Beri Nilai Produk</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded bg-white" />
            <div>
              <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
              {product.variantName && <p className="text-xs text-gray-500 mt-1">Varian: {product.variantName}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bagaimana kualitas produk ini?</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    <StarIcon filled={star <= rating} className="w-10 h-10" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-primary font-bold mt-2">
                {rating === 5 ? 'Sangat Puas' : rating === 4 ? 'Puas' : rating === 3 ? 'Lumayan' : rating === 2 ? 'Kurang' : 'Kecewa'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ceritakan pengalamanmu</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Barang bagus, pengiriman cepat..."
                required
              ></textarea>
            </div>

            {/* Upload Media Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tambahkan Foto/Video (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="media-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Klik untuk upload foto/video</p>
                    <p className="text-xs text-gray-500 mt-1">Max 5 foto (5MB) + 2 video (20MB)</p>
                  </div>
                </label>
              </div>

              {/* Preview Media */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <video
                          src={preview.url}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          muted
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">
                        {preview.type === 'video' ? '📹' : '📷'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-primary text-black font-bold rounded-lg hover:bg-yellow-400 shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;