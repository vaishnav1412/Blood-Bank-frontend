import { useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaImages,
  FaUsers,
  FaAward,
  FaArrowRight,
  FaPlay,
  FaInstagram,
  FaShareAlt,
  FaHeart as FaSolidHeart,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaRegBookmark,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaVolumeUp,
  FaVolumeMute,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaRegClock,
  FaEye,
  FaRegSmile,
  FaRegFlag,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import "./donation-gallery.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const DonationGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(new Set());
  const [savedItems, setSavedItems] = useState(new Set());
  const [autoplay, setAutoplay] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [itemComments, setItemComments] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const galleryRef = useRef(null);
  const videoRefs = useRef({});

  // Gallery data with enhanced content
  const galleryItems = [
    {
      id: 1,
      type: "photo",
      category: "donation-drive",
      title: "Annual Blood Donation Camp 2024",
      description:
        "Record-breaking 500+ donors participated in our annual drive. The event was organized in collaboration with Red Cross and local hospitals.",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Jan 15, 2024",
      location: "City Center, Bangalore",
      donors: 524,
      likes: 1234,
      comments: 89,
      shares: 234,
      views: "15.2K",
      featured: true,
      tags: ["donation", "camp", "record"],
      donorsList: [
        { name: "Rajesh Kumar", bloodGroup: "O+", time: "10:30 AM" },
        { name: "Priya Singh", bloodGroup: "A+", time: "11:45 AM" },
        { name: "Anand Sharma", bloodGroup: "B+", time: "12:15 PM" },
      ],
    },
    {
      id: 2,
      type: "photo",
      category: "volunteer",
      title: "Young Volunteers Making a Difference",
      description: "College students organizing donation awareness program across 5 campuses. Over 1000 students pledged to donate.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Feb 3, 2024",
      location: "University Campus",
      donors: 120,
      likes: 2189,
      comments: 132,
      shares: 456,
      views: "25.1K",
    },
    {
      id: 3,
      type: "video",
      category: "motivational",
      title: "Survivor Story: How Blood Saved My Life",
      description: "Heartwarming testimonial from a blood recipient. Watch how a stranger's donation gave a second chance at life.",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      videoUrl: "https://example.com/video.mp4",
      date: "Mar 10, 2024",
      duration: "2:45",
      views: "45.2K",
      likes: 12.4,
      comments: 567,
    },
    {
      id: 4,
      type: "photo",
      category: "recognition",
      title: "Platinum Donor Award Ceremony",
      description: "Honoring donors with 50+ donations. 42 heroes recognized for their lifetime contribution.",
      image: "https://images.unsplash.com/photo-1584467735871-8db9ac8d0916?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1584467735871-8db9ac8d0916?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Apr 22, 2024",
      location: "Town Hall",
      donors: 42,
      likes: 3156,
      comments: 228,
      shares: 567,
      views: "38.5K",
    },
    {
      id: 5,
      type: "quote",
      category: "motivational",
      title: "Inspirational Quote",
      content:
        "The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you.",
      author: "Anonymous Donor",
      bgColor: "bg-white",
      pattern: "dots",
    },
    {
      id: 6,
      type: "photo",
      category: "campaign",
      title: "World Blood Donor Day Celebration",
      description: "Global celebration with awareness programs and donor felicitation across 15 cities.",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Jun 14, 2024",
      location: "Multiple Cities",
      donors: 1200,
      likes: 7892,
      comments: 1124,
      shares: 2345,
      views: "125K",
    },
    {
      id: 7,
      type: "photo",
      category: "community",
      title: "Corporate Donation Drive",
      description: "Tech companies joining hands for blood donation. 50+ companies participated.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Jul 8, 2024",
      location: "IT Park",
      donors: 320,
      likes: 3245,
      comments: 442,
      shares: 876,
      views: "45.2K",
    },
    {
      id: 8,
      type: "stats",
      category: "achievements",
      title: "2024 Impact Report",
      stats: {
        totalDonors: "10,234",
        livesSaved: "30,702",
        campsOrganized: "156",
        satisfactionRate: "98%",
        bloodUnits: "25,678",
        activeVolunteers: "3,456",
      },
      bgColor: "bg-white",
    },
    {
      id: 9,
      type: "photo",
      category: "donation-drive",
      title: "Rural Health Camp",
      description: "First-ever donation camp in remote village. 200+ first-time donors.",
      image: "https://images.unsplash.com/photo-1581595220892-8ba8d0e80f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1581595220892-8ba8d0e80f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Aug 19, 2024",
      location: "Village Center",
      donors: 245,
      likes: 1876,
      comments: 234,
      shares: 567,
      views: "28.9K",
    },
    {
      id: 10,
      type: "video",
      category: "motivational",
      title: "Donor's Journey: A Day in Life",
      description: "Follow a regular donor's journey and see how they make time to save lives.",
      thumbnail: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      videoUrl: "https://example.com/video2.mp4",
      date: "Sep 5, 2024",
      duration: "4:30",
      views: "32.1K",
      likes: 8.9,
      comments: 345,
    },
  ];

  const filters = [
    { id: "all", label: "All", icon: <FaImages />, count: galleryItems.length },
    { id: "donation-drive", label: "Donation Drives", icon: <FaHeart />, count: 5 },
    { id: "motivational", label: "Motivational", icon: <FaQuoteLeft />, count: 3 },
    { id: "recognition", label: "Recognition", icon: <FaAward />, count: 2 },
    { id: "volunteer", label: "Volunteers", icon: <FaUsers />, count: 2 },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  // Mouse move effect for parallax
  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Autoplay slideshow
  useEffect(() => {
    let interval;
    if (autoplay && selectedImage) {
      interval = setInterval(() => {
        const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % galleryItems.length;
        setSelectedImage(galleryItems[nextIndex]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, selectedImage, galleryItems]);

  const handleLike = (id) => {
    const newLiked = new Set(likedImages);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedImages(newLiked);
  };

  const handleSave = (id) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  const handleShare = (item) => {
    setShareItem(item);
    setShowShareModal(true);
  };

  const addComment = (itemId) => {
    if (!commentText.trim()) return;
    
    const newComments = { ...itemComments };
    if (!newComments[itemId]) newComments[itemId] = [];
    newComments[itemId].push({
      id: Date.now(),
      text: commentText,
      user: "Anonymous",
      time: "Just now",
      likes: 0,
    });
    setItemComments(newComments);
    setCommentText("");
  };

  const handleFullscreen = (item) => {
    setSelectedImage(item);
    setShowFullscreen(true);
  };

  const handlePrevImage = () => {
    const currentIndex = galleryItems.findIndex(item => item.id === selectedImage?.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedImage(galleryItems[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = galleryItems.findIndex(item => item.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedImage(galleryItems[nextIndex]);
  };

  const renderGalleryItem = (item) => {
    const isLiked = likedImages.has(item.id);
    const isSaved = savedItems.has(item.id);
    const comments = itemComments[item.id] || [];
    const isHovered = hoveredItem === item.id;

    switch (item.type) {
      case "photo":
        return (
          <div
            className="gallery-item photo-item"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              transform: isHovered 
                ? `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateY(-10px)`
                : 'none',
            }}
          >
            <div className="item-media">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="media-image"
                loading="lazy"
              />
              
              {/* Overlay with gradient */}
              <div className="media-overlay">
                <div className="overlay-gradient" />
                
                {/* Quick actions */}
                <div className="quick-actions">
                  <button 
                    className={`action-btn ${isLiked ? 'active' : ''}`}
                    onClick={() => handleLike(item.id)}
                  >
                    <FaHeart />
                    <span className="action-count">{item.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setShowComments(true)}
                  >
                    <FaRegCommentDots />
                    <span className="action-count">{item.comments + comments.length}</span>
                  </button>
                  <button 
                    className={`action-btn ${isSaved ? 'active' : ''}`}
                    onClick={() => handleSave(item.id)}
                  >
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>

                {/* View button */}
                <button 
                  className="view-btn"
                  onClick={() => handleFullscreen(item)}
                >
                  <FaExpand />
                </button>

                {/* Featured badge */}
                {item.featured && (
                  <div className="featured-badge">
                    <FaStar />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Video indicator for videos */}
              {item.type === 'video' && (
                <div className="video-indicator">
                  <FaPlay />
                </div>
              )}
            </div>

            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-meta">
                <div className="meta-item">
                  <FaMapMarkerAlt className="meta-icon" />
                  <span>{item.location}</span>
                </div>
                <div className="meta-item">
                  <FaRegClock className="meta-icon" />
                  <span>{item.date}</span>
                </div>
                <div className="meta-item">
                  <FaEye className="meta-icon" />
                  <span>{item.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {item.tags && (
                <div className="item-tags">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Donors list preview */}
              {item.donorsList && (
                <div className="donors-preview">
                  <div className="donors-avatars">
                    {item.donorsList.slice(0, 3).map((donor, idx) => (
                      <div key={idx} className="donor-avatar">
                        {donor.name.charAt(0)}
                      </div>
                    ))}
                    {item.donorsList.length > 3 && (
                      <div className="donor-avatar more">
                        +{item.donorsList.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="donors-text">
                    {item.donorsList.length} donors participated
                  </span>
                </div>
              )}

              <div className="item-footer">
                <button 
                  className={`footer-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(item.id)}
                >
                  {isLiked ? <FaSolidHeart /> : <FaHeart />}
                  <span>{item.likes + (isLiked ? 1 : 0)}</span>
                </button>
                <button 
                  className="footer-btn"
                  onClick={() => {
                    setSelectedImage(item);
                    setShowComments(true);
                  }}
                >
                  <FaRegCommentDots />
                  <span>{item.comments + comments.length}</span>
                </button>
                <button 
                  className="footer-btn"
                  onClick={() => handleShare(item)}
                >
                  <FaShareAlt />
                  <span>{item.shares || 0}</span>
                </button>
                <button 
                  className={`footer-btn ${isSaved ? 'saved' : ''}`}
                  onClick={() => handleSave(item.id)}
                >
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>
            </div>
          </div>
        );

      case "video":
        return (
          <div
            className="gallery-item video-item"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              transform: isHovered ? 'translateY(-10px)' : 'none',
            }}
          >
            <div className="item-media">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="media-image"
                loading="lazy"
              />
              
              <div className="media-overlay">
                <div className="overlay-gradient" />
                
                {/* Video controls */}
                <button className="play-btn">
                  <FaPlay />
                </button>

                <div className="video-duration">{item.duration}</div>

                <div className="video-stats">
                  <span>{item.views} views</span>
                  <span>•</span>
                  <span>{item.likes}K likes</span>
                </div>
              </div>
            </div>

            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-footer">
                <button className="footer-btn">
                  <FaHeart />
                  <span>{item.likes}K</span>
                </button>
                <button className="footer-btn">
                  <FaRegCommentDots />
                  <span>{item.comments}</span>
                </button>
                <button className="footer-btn">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>
        );

      case "quote":
        return (
          <div className={`gallery-item quote-item ${item.bgColor}`}>
            <div className="quote-pattern" />
            
            <FaQuoteLeft className="quote-icon" />
            
            <blockquote className="quote-content">
              "{item.content}"
            </blockquote>
            
            <cite className="quote-author">— {item.author}</cite>

            <button 
              className="share-quote"
              onClick={() => handleShare(item)}
            >
              <FaShareAlt />
            </button>
          </div>
        );

      case "stats":
        return (
          <div className={`gallery-item stats-item ${item.bgColor}`}>
            <h3 className="stats-title">{item.title}</h3>
            
            <div className="stats-grid">
              {Object.entries(item.stats).map(([key, value], idx) => (
                <div key={key} className="stat-card">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>

            <button className="stats-cta">
              View Full Report
              <FaArrowRight />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Fullscreen Viewer Component
  const FullscreenViewer = () => {
    if (!showFullscreen || !selectedImage) return null;

    return (
      <div className="fullscreen-viewer">
        <div className="viewer-header">
          <button 
            className="header-btn"
            onClick={() => setShowFullscreen(false)}
          >
            <FaTimes />
          </button>
          
          <div className="header-controls">
            <button 
              className={`header-btn ${autoplay ? 'active' : ''}`}
              onClick={() => setAutoplay(!autoplay)}
            >
              {autoplay ? '⏸️' : '▶️'}
            </button>
            <button className="header-btn">
              <FaDownload />
            </button>
            <button className="header-btn">
              <FaShareAlt />
            </button>
          </div>
        </div>

        <button className="nav-btn prev" onClick={handlePrevImage}>
          <FaChevronLeft />
        </button>

        <button className="nav-btn next" onClick={handleNextImage}>
          <FaChevronRight />
        </button>

        <div className="viewer-content">
          <img
            src={selectedImage.image}
            alt={selectedImage.title}
            className="viewer-image"
          />
        </div>

        <div className="viewer-footer">
          <div className="viewer-info">
            <h3>{selectedImage.title}</h3>
            <p>{selectedImage.description}</p>
          </div>

          <div className="viewer-actions">
            <button 
              className={`action ${likedImages.has(selectedImage.id) ? 'active' : ''}`}
              onClick={() => handleLike(selectedImage.id)}
            >
              <FaHeart />
              <span>{selectedImage.likes + (likedImages.has(selectedImage.id) ? 1 : 0)}</span>
            </button>
            <button className="action">
              <FaRegCommentDots />
              <span>{selectedImage.comments}</span>
            </button>
            <button className="action">
              <FaBookmark />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!showShareModal || !shareItem) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
        <div className="share-modal" onClick={e => e.stopPropagation()}>
          <button 
            className="modal-close"
            onClick={() => setShowShareModal(false)}
          >
            <FaTimes />
          </button>

          <h3>Share this {shareItem.type}</h3>

          <div className="share-preview">
            <img 
              src={shareItem.thumbnail || shareItem.image} 
              alt={shareItem.title}
            />
            <div className="preview-info">
              <h4>{shareItem.title}</h4>
              <p>{shareItem.description}</p>
            </div>
          </div>

          <div className="share-options">
            <button className="share-option">
              <div className="option-icon facebook">
                <FaFacebookF />
              </div>
              <span>Facebook</span>
            </button>

            <button className="share-option">
              <div className="option-icon twitter">
                <FaTwitter />
              </div>
              <span>Twitter</span>
            </button>

            <button className="share-option">
              <div className="option-icon whatsapp">
                <FaWhatsapp />
              </div>
              <span>WhatsApp</span>
            </button>

            <button className="share-option">
              <div className="option-icon instagram">
                <FaInstagram />
              </div>
              <span>Instagram</span>
            </button>
          </div>

          <div className="share-link">
            <input 
              type="text" 
              value={window.location.href} 
              readOnly 
            />
            <button className="copy-btn">
              <FaLink />
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Comments Modal Component
  const CommentsModal = () => {
    if (!showComments || !selectedImage) return null;

    const comments = itemComments[selectedImage.id] || [];

    return (
      <div className="modal-overlay" onClick={() => setShowComments(false)}>
        <div className="comments-modal" onClick={e => e.stopPropagation()}>
          <div className="comments-header">
            <h3>Comments ({selectedImage.comments + comments.length})</h3>
            <button 
              className="close-btn"
              onClick={() => setShowComments(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.user.charAt(0)}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-user">{comment.user}</span>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button className="comment-action">
                      <FaHeart /> {comment.likes}
                    </button>
                    <button className="comment-action">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-input">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              onKeyPress={(e) => e.key === 'Enter' && addComment(selectedImage.id)}
            />
            <button 
              className="send-btn"
              onClick={() => addComment(selectedImage.id)}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <WrapperSection>
      <div className="donation-gallery bg-white/60 rounded-2xl md:-mt-[480px] -mt-[500px]" ref={galleryRef}>
        {/* Light Background Pattern */}
        <div className="gallery-background light">
          <div className="bg-gradient-light" />
          <div className="bg-particles-light">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle-light" />
            ))}
          </div>
        </div>

        <div className="gallery-container">
          {/* Header */}
          <div className="gallery-header">
            <div className="header-content">
              <span className="subtitle">Our Impact Gallery</span>
              <h2 className="title">
                <span className="gradient-text">Gallery</span> of Hope & Heroes
              </h2>
              <p className="description">
                Witness the moments that save lives. Explore our donation drives,
                meet our heroes, and get inspired by stories of compassion.
              </p>
            </div>

            {/* Stats banner */}
            <div className="stats-banner light">
              <div className="stat-item">
                <div className="stat-value">500+</div>
                <div className="stat-label">Events Organized</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">25K+</div>
                <div className="stat-label">Photos & Videos</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50K+</div>
                <div className="stat-label">Donors Featured</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">1M+</div>
                <div className="stat-label">Social Reach</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="gallery-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`grid-item ${item.type === 'stats' || item.type === 'quote' ? 'span-2' : ''}`}
              >
                {renderGalleryItem(item)}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="gallery-cta light">
            <h3>Share Your Donation Story!</h3>
            <p>Have photos or videos from a donation drive? Share them with us and inspire others.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">
                <FaInstagram />
                Share on Instagram
              </button>
              <button className="cta-btn secondary">
                Submit Photos
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <FullscreenViewer />
        <ShareModal />
        <CommentsModal />
      </div>
    </WrapperSection>
  );
};

export default DonationGallery;