import { useState } from "react";
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
} from "react-icons/fa";
import "./donation-gallery.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const DonationGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(new Set());

  // Gallery data
  const galleryItems = [
    {
      id: 1,
      type: "photo",
      category: "donation-drive",
      title: "Annual Blood Donation Camp 2024",
      description:
        "Record-breaking 500+ donors participated in our annual drive",
      image:
        "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Jan 15, 2024",
      location: "City Center, Bangalore",
      donors: 524,
      likes: 234,
      comments: 45,
      featured: true,
    },
    {
      id: 2,
      type: "photo",
      category: "volunteer",
      title: "Young Volunteers Making a Difference",
      description: "College students organizing donation awareness program",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Feb 3, 2024",
      location: "University Campus",
      donors: 120,
      likes: 189,
      comments: 32,
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
      date: "Mar 10, 2024",
      duration: "2:45",
      views: "15.2K",
      likes: 2.4,
    },
    {
      id: 4,
      type: "photo",
      category: "recognition",
      title: "Platinum Donor Award Ceremony",
      description: "Honoring donors with 50+ donations",
      image:
        "https://images.unsplash.com/photo-1584467735871-8db9ac8d0916?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Apr 22, 2024",
      location: "Town Hall",
      donors: 42,
      likes: 156,
      comments: 28,
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
      date: "Jun 14, 2024",
      location: "Multiple Cities",
      donors: 1200,
      likes: 892,
      comments: 124,
    },
    {
      id: 7,
      type: "photo",
      category: "community",
      title: "Corporate Donation Drive",
      description: "Tech companies joining hands for blood donation",
      image:
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "Jul 8, 2024",
      location: "IT Park",
      donors: 320,
      likes: 245,
      comments: 42,
    },
    {
      id: 8,
      type: "stats",
      category: "achievements",
      title: "Annual Milestone",
      stats: {
        totalDonors: "10,234",
        livesSaved: "30,702",
        campsOrganized: "156",
        satisfactionRate: "98%",
      },
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
  ];

  const filters = [
    { id: "all", label: "All", icon: <FaImages />, count: galleryItems.length },
    {
      id: "donation-drive",
      label: "Donation Drives",
      icon: <FaHeart />,
      count: 4,
    },
    {
      id: "motivational",
      label: "Motivational",
      icon: <FaQuoteLeft />,
      count: 2,
    },
    { id: "recognition", label: "Recognition", icon: <FaAward />, count: 2 },
    { id: "volunteer", label: "Volunteers", icon: <FaUsers />, count: 1 },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter,
  );

  const handleLike = (id) => {
    const newLiked = new Set(likedImages);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedImages(newLiked);
  };

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || item.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(`${item.title} - ${window.location.href}`);
      alert("Link copied to clipboard!");
    }
  };

  const renderGalleryItem = (item) => {
    switch (item.type) {
      case "photo":
        return (
          <div className="donation-gallery-item bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Image Container */}
            <div
              className="h-48 sm:h-56 md:h-64 relative overflow-hidden cursor-pointer image-container"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700"
                loading="lazy"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Quick Stats */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="flex items-center">
                    <FaHeart className="mr-1" /> {item.likes}
                  </span>
                  <span className="hidden sm:inline">
                    👥 {item.donors} donors
                  </span>
                </div>
                <span className="bg-pink-600 px-2 py-1 rounded-full text-xs">
                  {item.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.featured && (
                  <span className="hidden sm:inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-bold ml-2">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                <FaMapMarkerAlt className="mr-1 sm:mr-2" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center space-x-1 text-sm ${likedImages.has(item.id) ? "text-pink-600" : "text-gray-400 hover:text-pink-600"}`}
                >
                  {likedImages.has(item.id) ? <FaSolidHeart /> : <FaHeart />}
                  <span>{item.likes + (likedImages.has(item.id) ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => handleShare(item)}
                  className="text-gray-400 hover:text-pink-600 text-sm"
                >
                  <FaShareAlt />
                </button>

                <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="donation-gallery-item bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Video Thumbnail */}
            <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden cursor-pointer">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <FaPlay className="text-pink-600 text-lg sm:text-xl ml-0.5" />
                </button>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span>{item.duration}</span>
                  <span>▶️ {item.views} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-1">
                {item.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                <span>{item.date}</span>
                <span>👍 {item.likes}K likes</span>
              </div>
            </div>
          </div>
        );

      case "quote":
        return (
          <div
            className={`quote-card ${item.bgColor} rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-500 relative overflow-hidden`}
          >
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 bg-pink-200 rounded-full opacity-20" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-red-200 rounded-full opacity-20" />

            <div className="relative z-10">
              <FaQuoteLeft className="text-pink-500 text-3xl sm:text-4xl mb-4 opacity-50" />

              <blockquote className="text-lg sm:text-xl md:text-2xl font-serif text-gray-800 mb-4 sm:mb-6 italic leading-relaxed">
                "{item.content}"
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <cite className="text-gray-600 not-italic font-medium text-sm sm:text-base">
                  — {item.author}
                </cite>

                <button
                  onClick={() => handleShare(item)}
                  className="text-pink-600 hover:text-pink-700 self-end sm:self-auto"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div
            className={`stats-item ${item.bgColor} rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-500`}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              {item.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {Object.entries(item.stats).map(([key, value]) => (
                <div
                  key={key}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-1 sm:mb-2">
                    {value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <button className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm sm:text-base">
                View Annual Report
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Image Modal Component
  const ImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh]">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-10 sm:-top-12 right-0 text-white text-xl sm:text-2xl hover:text-pink-400 z-10 p-2"
          >
            ✕
          </button>

          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain"
            />

            <div className="p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {selectedImage.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                  <span>📅 {selectedImage.date}</span>
                  <span>📍 {selectedImage.location}</span>
                  <span>👥 {selectedImage.donors} donors</span>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <FaShareAlt />
                  </button>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <WrapperSection>
      <div className="donation-gallery bg-gradient-to-b from-pink-200 to-pink-100 md:-mt-[480px] -mt-[700px] rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-6 lg:p-8 xl:p-12 shadow-lg shadow-pink-500/20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            <span className="text-pink-600">Gallery</span> of Hope & Heroes
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            Witness the moments that save lives. Explore our donation drives,
            meet our heroes, and get inspired by stories of compassion.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                500+
              </div>
              <div className="text-pink-100 text-xs sm:text-sm">
                Events Organized
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                25K+
              </div>
              <div className="text-pink-100 text-xs sm:text-sm">
                Photos & Videos
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                50K+
              </div>
              <div className="text-pink-100 text-xs sm:text-sm">
                Donors Featured
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                1M+
              </div>
              <div className="text-pink-100 text-xs sm:text-sm">
                Social Reach
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 overflow-x-auto filter-container">
          <div className="flex space-x-2 pb-2 min-w-max sm:min-w-0">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn flex items-center px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl whitespace-nowrap transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-pink-600 text-white shadow-lg active"
                    : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
                }`}
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-base">
                  {filter.icon}
                </span>
                <span className="text-xs sm:text-sm md:text-base">
                  {filter.label}
                </span>
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={
                item.type === "stats" || item.type === "quote"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              {renderGalleryItem(item)}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-pink-200 border border-pink-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Share Your Donation Story!
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Have photos or videos from a donation drive? Share them with us and
            inspire others to become donors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg sm:rounded-xl font-bold transition-colors flex items-center justify-center text-sm sm:text-base">
              <FaInstagram className="mr-2" />
              Share on Instagram
            </button>
            <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 rounded-lg sm:rounded-xl font-bold transition-colors text-sm sm:text-base">
              Submit Photos
            </button>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal />
      </div>
    </WrapperSection>
  );
};

export default DonationGallery;
