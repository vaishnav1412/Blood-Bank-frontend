import { useEffect, useState } from "react";
import {
  FiImage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiShare2,
  FiSearch,
  FiX,
  FiCheck,
  FiStar,
  FiHeart,
  FiCalendar,
  FiMapPin,
  FiUpload,
  FiFolder,
  FiClock,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiFilm,
} from "react-icons/fi";
import {
  FaHeart,
  FaQuoteLeft,
  FaUsers,
  FaPlay,
  FaRegFileImage,
  FaRegFileVideo,
} from "react-icons/fa";
import "./gallery-management.scss";
import {
  uploadGalleryMedia,
  getGalleryItems,
  updateGalleryMedia,
  deleteGalleryMedia,
} from "../../../services/adminServices";

// Helper hook for responsive design
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default function GalleryManagement() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);

  // Categories
  const categories = [
    { id: "all", label: "All", icon: <FiImage />, count: galleryItems.length },
    {
      id: "donation-drive",
      label: "Drives",
      icon: <FaHeart />,
      count: galleryItems.filter((i) => i.category === "donation-drive").length,
    },
    {
      id: "volunteer",
      label: "Volunteers",
      icon: <FaUsers />,
      count: galleryItems.filter((i) => i.category === "volunteer").length,
    },
    {
      id: "recognition",
      label: "Awards",
      icon: <FiAward />,
      count: galleryItems.filter((i) => i.category === "recognition").length,
    },
    {
      id: "motivational",
      label: "Stories",
      icon: <FaQuoteLeft />,
      count: galleryItems.filter((i) => i.category === "motivational").length,
    },
    {
      id: "campaign",
      label: "Campaigns",
      icon: <FiCalendar />,
      count: galleryItems.filter((i) => i.category === "campaign").length,
    },
  ];

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory =
      activeFilter === "all" || item.category === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "most-liked":
        return b.likes - a.likes;
      case "most-viewed":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Pagination
  const itemsPerPage = isMobile ? 4 : 8;
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: galleryItems.length,
    photos: galleryItems.filter((i) => i.type === "photo").length,
    videos: galleryItems.filter((i) => i.type === "video").length,
    featured: galleryItems.filter((i) => i.featured).length,
    totalViews: galleryItems.reduce((acc, i) => acc + (i.views || 0), 0),
  };

  // Handlers
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedItems.length === 0) return;
      const deletePromises = selectedItems.map((id) => deleteGalleryMedia(id));
      await Promise.all(deletePromises);

      setGalleryItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item._id))
      );
      setSelectedItems([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Bulk Delete Error:", error);
      alert("Failed to delete selected items");
    }
  };

  const handleToggleFeatured = (id) => {
    setGalleryItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "video/mp4",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, MP4, and MOV files are allowed");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be below 50MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGalleryItems();
        if (response.success) {
          setGalleryItems(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      }
    };

    fetchGallery();
  }, []);

  // Upload Modal
  const UploadModal = () => {
    const [uploadData, setUploadData] = useState({
      title: "",
      description: "",
      category: "donation-drive",
      type: "photo",
      date: new Date().toISOString().split("T")[0],
      location: "",
      tags: "",
      content: "",
      author: "",
      featured: false,
      status: "draft",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!uploadData.title.trim()) {
        alert("Title is required");
        return;
      }
      if (uploadData.type !== "quote" && !selectedFile) {
        alert("Please select a file");
        return;
      }
      if (uploadData.type === "quote" && !uploadData.content.trim()) {
        alert("Quote content is required");
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();

        if (selectedFile) formData.append("media", selectedFile);

        formData.append("title", uploadData.title);
        formData.append("description", uploadData.description);
        formData.append("category", uploadData.category);
        formData.append("type", uploadData.type);
        formData.append("date", uploadData.date);
        formData.append("location", uploadData.location);
        formData.append("featured", uploadData.featured ? "true" : "false");
        formData.append("status", uploadData.status);

        const tagsArray = uploadData.tags
          ? uploadData.tags.split(",").map((t) => t.trim())
          : [];
        formData.append("tags", JSON.stringify(tagsArray));

        if (uploadData.type === "quote") {
          formData.append("content", uploadData.content);
          formData.append("author", uploadData.author);
        }

        const response = await uploadGalleryMedia(formData);

        if (response.success) {
          setGalleryItems((prev) => [response.data, ...prev]);
          resetUpload();
          setShowUploadModal(false);
        } else {
          alert(response.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    const resetUpload = () => {
      setSelectedFile(null);
      setFilePreview(null);
      setUploadData({
        title: "",
        description: "",
        category: "donation-drive",
        type: "photo",
        date: new Date().toISOString().split("T")[0],
        location: "",
        tags: "",
        content: "",
        author: "",
        featured: false,
        status: "draft",
      });
    };

    return (
      <div
        className="modal-overlay"
        onClick={() => !isUploading && setShowUploadModal(false)}
      >
        <div
          className="modal-content upload-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <FiUpload className="modal-icon" /> Upload New Media
            </h3>
            <button
              className="close-btn"
              onClick={() => !isUploading && setShowUploadModal(false)}
              disabled={isUploading}
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Enhanced File Upload Area */}
            {uploadData.type !== "quote" && (
              <div className="file-upload-section">
                {!selectedFile ? (
                  <div className="upload-zone">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                      <div className="upload-icon-circle">
                        <FiUpload className="upload-icon" />
                      </div>
                      <div className="upload-text">
                        <span className="primary-text">
                          Click to upload or drag and drop
                        </span>
                        <span className="secondary-text">
                          JPG, PNG, MP4 or MOV (Max 50MB)
                        </span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="file-preview-card">
                    <div className="preview-header">
                      <span className="file-name">
                        {selectedFile.type.startsWith("image/") ? (
                          <FiImage />
                        ) : (
                          <FiFilm />
                        )}
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className="preview-content">
                      {selectedFile.type.startsWith("image/") ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                      ) : (
                        <video controls className="video-preview">
                          <source src={filePreview} type={selectedFile.type} />
                        </video>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quote Type Preview */}
            {uploadData.type === "quote" && uploadData.content && (
              <div className="quote-preview-section">
                <div className="quote-preview">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="quote-text">"{uploadData.content}"</p>
                  {uploadData.author && (
                    <p className="quote-author">— {uploadData.author}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Fields - Responsive Grid handled by SCSS */}
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, title: e.target.value })
                  }
                  placeholder="Enter a descriptive title"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => {
                      setUploadData({ ...uploadData, type: e.target.value });
                      setSelectedFile(null); // Reset file on type change
                    }}
                    disabled={isUploading}
                  >
                    <option value="photo">📷 Photo</option>
                    <option value="video">🎥 Video</option>
                    <option value="quote">💬 Quote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, category: e.target.value })
                    }
                    disabled={isUploading}
                  >
                    <option value="donation-drive">🚗 Donation Drive</option>
                    <option value="volunteer">👥 Volunteers</option>
                    <option value="recognition">🏆 Recognition</option>
                    <option value="motivational">💪 Motivational</option>
                    <option value="campaign">📢 Campaign</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a description..."
                  disabled={isUploading}
                />
              </div>

              {uploadData.type === "quote" && (
                <>
                  <div className="form-group full-width">
                    <label>Quote Content *</label>
                    <textarea
                      rows="3"
                      value={uploadData.content}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          content: e.target.value,
                        })
                      }
                      placeholder="Enter the quote..."
                      required
                      disabled={isUploading}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Author</label>
                    <input
                      type="text"
                      value={uploadData.author}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          author: e.target.value,
                        })
                      }
                      placeholder="Who said this?"
                      disabled={isUploading}
                    />
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={uploadData.location}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, location: e.target.value })
                    }
                    placeholder="Location"
                    disabled={isUploading}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={uploadData.status}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, status: e.target.value })
                    }
                    disabled={isUploading}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={uploadData.tags}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, tags: e.target.value })
                  }
                  placeholder="e.g., blood-donation, camp, volunteers"
                  disabled={isUploading}
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={uploadData.featured}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        featured: e.target.checked,
                      })
                    }
                    disabled={isUploading}
                  />
                  <span className="checkbox-text">Mark as Featured</span>
                </label>
              </div>
            </div>

            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="progress-text">
                  {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                </span>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  resetUpload();
                  setShowUploadModal(false);
                }}
                disabled={isUploading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-upload"
                disabled={
                  isUploading || (uploadData.type !== "quote" && !selectedFile)
                }
              >
                {isUploading ? (
                  <>
                    <span className="spinner" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload /> Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Modal
  const EditModal = ({ item, onClose }) => {
    const [editData, setEditData] = useState(() => ({
      title: item?.title || "",
      description: item?.description || "",
      category: item?.category || "donation-drive",
      type: item?.type || "photo",
      date: item?.date
        ? new Date(item.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      location: item?.location || "",
      tags: item?.tags?.join(", ") || "",
      content: item?.content || "",
      author: item?.author || "",
      featured: item?.featured || false,
      status: item?.status || "draft",
    }));

    // Local state for file selection inside Edit Modal
    const [newMediaFile, setNewMediaFile] = useState(null);
    const [newMediaPreview, setNewMediaPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEditFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validations
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/quicktime"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type");
        return;
      }
      
      setNewMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };

    const clearNewMedia = () => {
        setNewMediaFile(null);
        setNewMediaPreview(null);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!editData.title.trim()) {
        alert("Title is required");
        return;
      }

      if (editData.type === "quote" && !editData.content.trim()) {
        alert("Quote content is required");
        return;
      }

      try {
        setIsSaving(true);

        const formData = new FormData();

        formData.append("title", editData.title);
        formData.append("description", editData.description);
        formData.append("category", editData.category);
        formData.append("type", editData.type);
        formData.append("date", editData.date);
        formData.append("location", editData.location);
        formData.append("featured", editData.featured ? "true" : "false");
        formData.append("status", editData.status);

        const tagsArray = editData.tags
          ? editData.tags.split(",").map((t) => t.trim())
          : [];

        formData.append("tags", JSON.stringify(tagsArray));

        if (editData.type === "quote") {
          formData.append("content", editData.content);
          formData.append("author", editData.author);
        }

        // Append new file if selected
        if (newMediaFile) {
          formData.append("media", newMediaFile);
        }

        const response = await updateGalleryMedia(item._id, formData);

        if (response.success) {
          setGalleryItems((prev) =>
            prev.map((i) => (i._id === item._id ? response.data : i))
          );
          onClose();
        } else {
          alert("Update failed");
        }
      } catch (error) {
        console.error("Update Error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsSaving(false);
      }
    };

    const handleDelete = async () => {
      try {
        setIsSaving(true);
        const response = await deleteGalleryMedia(item._id);

        if (response.success) {
          setGalleryItems((prev) => prev.filter((i) => i._id !== item._id));
          onClose();
        } else {
          alert("Delete failed");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsSaving(false);
      }
    };

    if (!item) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content edit-modal upload-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <FiEdit2 className="modal-icon" /> Edit{" "}
              {item.type === "quote" ? "Story" : "Media"}
            </h3>
            <button className="close-btn" onClick={onClose} disabled={isSaving}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Media Section */}
            {editData.type !== "quote" && (
              <div className="file-upload-section">
                 
                 {/* Show Existing or New Preview */}
                <div className="file-preview-card">
                   <div className="preview-header">
                     <span className="file-name">
                       {editData.type === "photo" ? <FiImage /> : <FiFilm />}
                       {newMediaFile ? "New Media Preview" : "Current Media"}
                     </span>
                     {newMediaFile && (
                        <button type="button" className="remove-file-btn" onClick={clearNewMedia}>
                            <FiX /> Cancel Change
                        </button>
                     )}
                   </div>
                   <div className="preview-content">
                     {newMediaFile ? (
                        newMediaFile.type.startsWith("image/") ? (
                            <img src={newMediaPreview} alt="New Preview" className="image-preview" />
                        ) : (
                            <video controls className="video-preview">
                                <source src={newMediaPreview} type={newMediaFile.type} />
                            </video>
                        )
                     ) : (
                        <>
                            {editData.type === "photo" && item.image && (
                            <img
                                src={item.image}
                                alt={editData.title}
                                className="image-preview"
                            />
                            )}
                            {editData.type === "video" && (
                            <video controls width="100%">
                                <source src={item.videoUrl} type="video/mp4" />
                            </video>
                            )}
                        </>
                     )}
                   </div>
                </div>

                {/* Change Media Action */}
                {!newMediaFile && (
                    <div className="upload-zone small">
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleEditFileSelect} 
                            id="edit-file-upload" 
                        />
                        <label htmlFor="edit-file-upload" className="upload-label">
                            <FiUpload /> <span>Click to change media</span>
                        </label>
                    </div>
                )}
              </div>
            )}

            {/* Quote Type Preview */}
            {editData.type === "quote" && editData.content && (
              <div className="quote-preview-section">
                <div
                  className="quote-preview"
                  style={{ backgroundColor: item.bgColor || "#f3f4f6" }}
                >
                  <FaQuoteLeft className="quote-icon" />
                  <p className="quote-text">"{editData.content}"</p>
                  {editData.author && (
                    <p className="quote-author">— {editData.author}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Title *</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="Enter a descriptive title"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={editData.type}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                    disabled={isSaving}
                  >
                    <option value="photo">📷 Photo</option>
                    <option value="video">🎥 Video</option>
                    <option value="quote">💬 Quote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    disabled={isSaving}
                  >
                    <option value="donation-drive">🚗 Donation Drive</option>
                    <option value="volunteer">👥 Volunteers</option>
                    <option value="recognition">🏆 Recognition</option>
                    <option value="motivational">💪 Motivational</option>
                    <option value="campaign">📢 Campaign</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Add a description..."
                  disabled={isSaving}
                />
              </div>

              {editData.type === "quote" && (
                <>
                  <div className="form-group full-width">
                    <label>Quote Content *</label>
                    <textarea
                      rows="3"
                      value={editData.content}
                      onChange={(e) =>
                        setEditData({ ...editData, content: e.target.value })
                      }
                      placeholder="Enter the quote..."
                      required
                      disabled={isSaving}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Author</label>
                    <input
                      type="text"
                      value={editData.author}
                      onChange={(e) =>
                        setEditData({ ...editData, author: e.target.value })
                      }
                      placeholder="Who said this?"
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) =>
                      setEditData({ ...editData, location: e.target.value })
                    }
                    placeholder="Location"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    disabled={isSaving}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) =>
                    setEditData({ ...editData, tags: e.target.value })
                  }
                  placeholder="e.g., blood-donation, camp, volunteers"
                  disabled={isSaving}
                />
              </div>

              <div className="form-row checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editData.featured}
                    onChange={(e) =>
                      setEditData({ ...editData, featured: e.target.checked })
                    }
                    disabled={isSaving}
                  />
                  <span className="checkbox-text">Mark as Featured</span>
                </label>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    className="delete-trigger-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSaving}
                  >
                    <FiTrash2 /> Delete Item
                  </button>
                ) : (
                  <div className="delete-confirm">
                    <span className="delete-warning">Delete this item?</span>
                    <button
                      type="button"
                      className="delete-confirm-btn"
                      onClick={handleDelete}
                      disabled={isSaving}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="delete-cancel-btn"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isSaving}
                    >
                      No
                    </button>
                  </div>
                )}
              </div>

              {(item.views !== undefined || item.likes !== undefined) && (
                <div className="stats-preview">
                  <h4>Statistics</h4>
                  <div className="stats-row">
                    {item.views !== undefined && (
                      <span>
                        <FiEye /> {item.views} views
                      </span>
                    )}
                    {item.likes !== undefined && (
                      <span>
                        <FiHeart /> {item.likes} likes
                      </span>
                    )}
                    {item.comments !== undefined && (
                      <span>
                        <FiMessageSquare /> {item.comments} comments
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button type="submit" className="btn-save" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Preview Modal
  const PreviewModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content preview-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{item.title}</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <div className="preview-content">
            {item.type === "photo" && (
              <div className="preview-image-container">
                <img
                  src={item.image}
                  alt={item.title}
                  className="preview-image"
                />
              </div>
            )}
            {item.type === "video" && (
              <div className="preview-video-container">
                <video controls width="100%">
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
              </div>
            )}
            {item.type === "quote" && (
              <div className={`quote-preview ${item.bgColor}`}>
                <FaQuoteLeft className="quote-icon" />
                <p className="quote-text">"{item.content}"</p>
                <p className="quote-author">— {item.author}</p>
              </div>
            )}

            <div className="preview-details">
              <div className="detail-row">
                <FiCalendar /> {new Date(item.date).toLocaleDateString()}
              </div>
              {item.location && (
                <div className="detail-row">
                  <FiMapPin /> {item.location}
                </div>
              )}
              <div className="detail-stats">
                <span>
                  <FiHeart /> {item.likes}
                </span>
                <span>
                  <FiEye /> {item.views}
                </span>
                <span>
                  <FiMessageSquare /> {item.comments}
                </span>
              </div>
            </div>
          </div>

          <div className="preview-actions">
            <button
              className="btn-edit"
              onClick={() => {
                onClose();
                setSelectedImage(item);
                setShowEditModal(true);
              }}
            >
              <FiEdit2 /> Edit
            </button>
            <button className="btn-share">
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Modal
  const DeleteModal = () => (
    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-icon">
          <FiTrash2 />
        </div>
        <h3>Delete Items</h3>
        <p>Are you sure you want to delete {selectedItems.length} item(s)?</p>
        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-gallery-management">
      {/* Header */}
      <div className="header-section">
        <div className="header-text">
          <h1 className="page-title">
            <FiImage className="title-icon" />
            Gallery
          </h1>
          <p className="page-subtitle">Manage photos, videos & stories</p>
        </div>
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          <FiPlus /> {isMobile ? "Add" : "Add New"}
        </button>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card photos">
          <div className="stat-info">
            <span className="stat-value">{stats.photos}</span>
            <span className="stat-label">Photos</span>
          </div>
        </div>
        <div className="stat-card videos">
          <div className="stat-info">
            <span className="stat-value">{stats.videos}</span>
            <span className="stat-label">Videos</span>
          </div>
        </div>
        <div className="stat-card featured">
          <div className="stat-info">
            <span className="stat-value">{stats.featured}</span>
            <span className="stat-label">Featured</span>
          </div>
        </div>
      </div>

      {/* Filters - Responsive Layout */}
      <div className="filters-section">
        <div className="filter-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="view-actions">
            <div className="sort-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-liked">Most Liked</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>

            {!isMobile && (
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiImage />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <FiFolder />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Filters - Scrollable on mobile */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeFilter === category.id ? "active" : ""}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span className="selected-count">
              {selectedItems.length} selected
            </span>
          </div>
          <div className="bulk-buttons">
            <button className="bulk-btn featured" onClick={() => {}}>
              <FiStar /> Feature
            </button>
            <button
              className="bulk-btn delete"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiTrash2 /> Delete
            </button>
            <button
              className="bulk-btn clear"
              onClick={() => setSelectedItems([])}
            >
              <FiX /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid - Responsive handled by class */}
      <div className={`gallery-view ${viewMode}`}>
        {paginatedItems.map((item) => (
          <div key={item._id} className={`gallery-item ${item.type}`}>
            {/* Selection Checkbox */}
            <div
              className="item-checkbox"
              onClick={() => handleSelectItem(item._id)}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => {}}
              />
            </div>

            {/* Status Badge */}
            <div className={`status-badge ${item.status}`}>
              {item.status === "published" ? <FiCheck /> : <FiClock />}
            </div>

            {/* Featured Badge */}
            {item.featured && (
              <div className="featured-badge">
                <FiStar />
              </div>
            )}

            {/* Quick Actions - Visible on hover or mobile touch */}
            <div className="quick-actions">
              <button
                onClick={() => handleToggleFeatured(item._id)}
                title="Toggle Featured"
              >
                <FiStar />
              </button>
              <button
                onClick={() => {
                  setSelectedImage(item);
                  setShowPreviewModal(true);
                }}
                title="Preview"
              >
                <FiEye />
              </button>
              <button
                onClick={() => {
                  setSelectedImage(item);
                  setShowEditModal(true);
                }}
                title="Edit"
              >
                <FiEdit2 />
              </button>
            </div>

            {/* Item Preview */}
            {item.type === "photo" && (
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
            )}
            {item.type === "video" && (
              <div className="item-image video-thumb">
                <video>
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
                <div className="play-icon-overlay">
                    <FaPlay />
                </div>
              </div>
            )}
            {item.type === "quote" && (
              <div className={`item-quote ${item.bgColor}`}>
                <FaQuoteLeft className="quote-icon" />
                <p className="quote-text">
                  "{item.content?.substring(0, 60)}..."
                </p>
              </div>
            )}

            <div className="item-info">
              <h4 className="item-title">{item.title}</h4>
              <div className="item-meta">
                <span>
                  <FiHeart /> {item.likes}
                </span>
                <span>
                  <FiEye /> {item.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {paginatedItems.length === 0 && (
        <div className="no-results">
          <FiImage className="no-results-icon" />
          <h3>No items found</h3>
          <p>Try adjusting your filters or upload new media</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-nav"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>

          <span className="page-info">
            {currentPage} / {totalPages}
          </span>

          <button
            className="page-nav"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      {showUploadModal && <UploadModal />}
      {showEditModal && (
        <EditModal
          item={selectedImage}
          onClose={() => {
            setShowEditModal(false);
            setSelectedImage(null);
          }}
        />
      )}
      {showPreviewModal && (
        <PreviewModal
          item={selectedImage}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedImage(null);
          }}
        />
      )}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
}