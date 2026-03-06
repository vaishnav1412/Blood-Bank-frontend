import { FaExclamationTriangle, FaTimes, FaSpinner } from "react-icons/fa";

const DeleteAccountModal = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteAccount,
  isDeleting,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-rose-600 flex items-center">
            <FaExclamationTriangle className="mr-3 text-2xl" />
            Delete Account
          </h3>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="text-gray-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-slate-600 mb-8 leading-relaxed">
          Are you sure you want to delete your account? This action is
          <span className="font-bold text-red-600"> permanent </span>
          and cannot be undone. All your data will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 border-2 border-slate-300 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          You will be logged out and redirected to the login page.
        </p>
      </div>
    </div>
  );
};

export default DeleteAccountModal;