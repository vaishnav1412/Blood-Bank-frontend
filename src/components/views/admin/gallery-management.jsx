import { useState } from "react";
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
} from "react-icons/fi";
import { FaHeart, FaQuoteLeft, FaUsers, FaPlay } from "react-icons/fa";
import "./gallery-management.scss";
import { uploadGalleryMedia } from "../../../services/adminServices";

export default function GalleryManagement() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gallery data
  const [galleryItems, setGalleryItems] = useState([
    {
      id: 1,
      type: "photo",
      category: "donation-drive",
      title: "Annual Blood Donation Camp 2024",
      description:
        "Record-breaking 500+ donors participated in our annual drive",
      image:
        "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2024-01-15",
      location: "City Center, Bangalore",
      donors: 524,
      likes: 234,
      views: 1245,
      comments: 45,
      featured: true,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-01-16T10:30:00",
      tags: ["blood donation", "camp", "annual"],
    },
    {
      id: 2,
      type: "photo",
      category: "volunteer",
      title: "Young Volunteers Making a Difference",
      description: "College students organizing donation awareness program",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2024-02-03",
      location: "University Campus",
      donors: 120,
      likes: 189,
      views: 892,
      comments: 32,
      featured: false,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-02-04T14:20:00",
      tags: ["volunteers", "students", "awareness"],
    },
    {
      id: 3,
      type: "video",
      category: "motivational",
      title: "Survivor Story: How Blood Saved My Life",
      description: "Heartwarming testimonial from a blood recipient",
      thumbnail:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      videoUrl: "#",
      date: "2024-03-10",
      duration: "2:45",
      views: "15.2K",
      likes: 2400,
      comments: 89,
      featured: true,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-03-11T09:15:00",
      tags: ["testimonial", "survivor", "story"],
    },
    {
      id: 4,
      type: "photo",
      category: "recognition",
      title: "Platinum Donor Award Ceremony",
      description: "Honoring donors with 50+ donations",
      image:
        "https://images.unsplash.com/photo-1584467735871-8db9ac8d0916?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2024-04-22",
      location: "Town Hall",
      donors: 42,
      likes: 156,
      views: 743,
      comments: 28,
      featured: true,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-04-23T16:45:00",
      tags: ["awards", "donors", "ceremony"],
    },
    {
      id: 5,
      type: "quote",
      category: "motivational",
      title: "Inspirational Quote",
      content:
        "The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you.",
      author: "Anonymous Donor",
      bgColor: "bg-gradient-to-br from-pink-100 to-red-50",
      date: "2024-05-05",
      likes: 312,
      views: 2156,
      comments: 45,
      featured: false,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-05-06T11:20:00",
      tags: ["quote", "inspirational"],
    },
    {
      id: 6,
      type: "photo",
      category: "campaign",
      title: "World Blood Donor Day Celebration",
      description:
        "Global celebration with awareness programs and donor felicitation",
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2024-06-14",
      location: "Multiple Cities",
      donors: 1200,
      likes: 892,
      views: 3456,
      comments: 124,
      featured: false,
      status: "published",
      uploadedBy: "Admin User",
      uploadedAt: "2024-06-15T13:30:00",
      tags: ["world blood donor day", "celebration", "global"],
    },
  ]);

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
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
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
  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setGalleryItems(
        galleryItems.filter((item) => !selectedItems.includes(item.id)),
      );
      setSelectedItems([]);
      setShowDeleteModal(false);
    }
  };

  const handleToggleFeatured = (id) => {
    setGalleryItems(
      galleryItems.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item,
      ),
    );
  };

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
      featured: false,
      status: "draft",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(uploadData);

      if (!uploadData.title) {
        alert("Title is required");
        return;
      }

      if (!selectedFile && uploadData.type !== "quote") {
        alert("Please select a file");
        return;
      }

      try {
        setIsUploading(true);

        const formData = new FormData();

        // Append file
        if (selectedFile) {
          formData.append("media", selectedFile);
        }

        // Append other fields
        formData.append("title", uploadData.title);
        formData.append("description", uploadData.description);
        formData.append("category", uploadData.category);
        formData.append("type", uploadData.type);
        formData.append("date", uploadData.date);
        formData.append("location", uploadData.location);
        formData.append("featured", uploadData.featured);
        formData.append("status", uploadData.status);

        // Convert tags string to array
        const tagsArray = uploadData.tags
          ? uploadData.tags.split(",").map((t) => t.trim())
          : [];

        formData.append("tags", JSON.stringify(tagsArray));

        // ✅ Call Admin Service
        const response = await uploadGalleryMedia(formData);

        if (response.success) {
          // Optionally refresh gallery list from backend
          // fetchGalleryItems();

          setShowUploadModal(false);
        } else {
          alert(response.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
        <div
          className="modal-content upload-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-drag-handle" /> {/* Mobile drag indicator */}
          <div className="modal-header">
            <h3>
              <FiUpload /> Upload New Media
            </h3>
            <button
              className="close-btn"
              onClick={() => setShowUploadModal(false)}
            >
              <FiX />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="upload-area">
              <FiUpload className="upload-icon" />
              <p>Tap to upload</p>
              <span>JPG, PNG, MP4 (Max 50MB)</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, title: e.target.value })
                  }
                  required
                  placeholder="Enter title"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={uploadData.type}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, type: e.target.value })
                  }
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="quote">Quote</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, category: e.target.value })
                  }
                >
                  <option value="donation-drive">Donation Drive</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="recognition">Recognition</option>
                  <option value="motivational">Motivational</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-upload">
                <FiUpload /> Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Modal
  const EditModal = ({ item, onClose }) => {
    const [editData, setEditData] = useState({ ...item });

    const handleSubmit = (e) => {
      e.preventDefault();
      setGalleryItems(
        galleryItems.map((i) => (i.id === item.id ? { ...editData } : i)),
      );
      onClose();
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content edit-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-drag-handle" />
          <div className="modal-header">
            <h3>
              <FiEdit2 /> Edit Item
            </h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editData.featured}
                    onChange={(e) =>
                      setEditData({ ...editData, featured: e.target.checked })
                    }
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
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
          <div className="modal-drag-handle" />
          <div className="modal-header">
            <h3>{item.title}</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <div className="preview-content">
            {item.type === "photo" && (
              <img
                src={item.image}
                alt={item.title}
                className="preview-image"
              />
            )}
            {item.type === "video" && (
              <div className="video-preview">
                <img src={item.thumbnail} alt={item.title} />
                <div className="play-overlay">
                  <FaPlay />
                </div>
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
        <div className="modal-drag-handle" />
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
        <div>
          <h1 className="page-title">
            <FiImage className="title-icon" />
            Gallery
          </h1>
          <p className="page-subtitle">Manage photos, videos & stories</p>
        </div>
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          <FiPlus /> Add New
        </button>
      </div>

      {/* Statistics Cards */}
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

      {/* Filters */}
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
                <option value="most-liked">Popular</option>
              </select>
            </div>

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
              <FiStar />
            </button>
            <button
              className="bulk-btn delete"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiTrash2 />
            </button>
            <button
              className="bulk-btn clear"
              onClick={() => setSelectedItems([])}
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid/List View */}
      <div className={`gallery-view ${viewMode}`}>
        {paginatedItems.map((item) => (
          <div key={item.id} className={`gallery-item ${item.type}`}>
            {/* Selection Checkbox */}
            <div
              className="item-checkbox"
              onClick={() => handleSelectItem(item.id)}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => {}} // Handled by div click
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

            {/* Quick Actions - Visible on mobile within flow or hover on desktop */}
            <div className="quick-actions">
              <button onClick={() => handleToggleFeatured(item.id)}>
                <FiStar />
              </button>
              <button
                onClick={() => {
                  setSelectedImage(item);
                  setShowPreviewModal(true);
                }}
              >
                <FiEye />
              </button>
              <button
                onClick={() => {
                  setSelectedImage(item);
                  setShowEditModal(true);
                }}
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
                <img src={item.thumbnail} alt={item.title} />
                <div className="play-icon">
                  <FaPlay />
                </div>
              </div>
            )}
            {item.type === "quote" && (
              <div className={`item-quote ${item.bgColor}`}>
                <FaQuoteLeft className="quote-icon" />
                <p className="quote-text">
                  "{item.content?.substring(0, 40)}..."
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
          <p>Try adjusting your filters</p>
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
