import { FaTimes } from "react-icons/fa";

const ImagePreviewModal = ({
  showImagePreview,
  setShowImagePreview,
  selectedImage,
}) => {
  if (!showImagePreview) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[60] p-4"
      onClick={() => setShowImagePreview(false)}
    >
      <div className="relative w-full max-w-5xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50"></div>
        <div className="relative bg-white rounded-2xl overflow-hidden">
          <img
            src={selectedImage}
            alt="Donation Proof"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-110"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;