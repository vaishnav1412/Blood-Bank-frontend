import { useState, useEffect, useRef, useMemo } from "react";
import HealthStatusForm from "../form/health-status-form/HealthStatusForm";

import EditProfileForm from "../form/edit-profile-form/EditProfileForm";
import DonationUploadForm from "../form/donation-upload-form/DonationUploadForm";
import { useNavigate } from "react-router-dom";
import OtpVerificationModal from "./otpVerificationModel";
import CertificateModal from "./certificateModal";
import DeleteAccountModal from "./deleteAccountModal";
import ImagePreviewModal from "./imagePreviewModal";
import {
  FaUser,
  FaCamera,
  FaHistory,
  FaAward,
  FaCertificate,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeartbeat,
  FaEdit,
  FaBell,
  FaMedal,
  FaStar,
  FaSpinner,
  FaCheckCircle,
  FaUserFriends,
  FaCog,
  FaHandHoldingHeart,
  FaWhatsapp,
  FaPlusCircle,
  FaTimes,
  FaUpload,
  FaClock,
  FaFileImage,
  FaTrash,
  FaEye,
  FaBan,
  FaFilter,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaKey,
  FaShieldAlt,
  FaGem,
  FaTint,
} from "react-icons/fa";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import toast from "react-hot-toast";
import {
  sendForgotOtp,
  updateDonorProfile,
  deleteDonorAccount,
  updateHealthStatus,
  getDonorProfileDetails,
  uploadProfilePhoto,
  uploadDonationProof,
  removeProfilePhoto,
  fetchDonationHistory,
  deleteDonationProof,
  fetchAllCampRequests,
} from "../../../services/donorServices";
import "./donerProfile.scss";

// --- Main Component ---

const DonorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showDonationUpload, setShowDonationUpload] = useState(false);
  const [allDonations, setAllDonations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [camp, setCamp] = useState([]);

  const [uploadForm, setUploadForm] = useState({
    donationDate: "",
    donationCenter: "",
    bloodGroup: "",
    units: "1",
    image: null,
    imagePreview: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fileInputRef = useRef(null);

  // FIX: Made filter case-insensitive (verified vs Verified)
  const certificates = useMemo(() => {
    return allDonations
      .filter((donation) => donation.status?.toLowerCase() === "verified")
      .map((donation, index) => ({
        id: donation._id,
        title:
          index === 0
            ? "First Blood Donation Certificate"
            : `Blood Donation Certificate #${index + 1}`,
        date: donation.donationDate,
        center: donation.donationCenter,
        certificateId: `CERT-${index + 1}-${donation._id.slice(-5)}`,
        downloadable: true,
        shareable: true,
      }));
  }, [allDonations]);

  const clearImage = () => {
    if (uploadForm.imagePreview) {
      URL.revokeObjectURL(uploadForm.imagePreview);
    }
    setUploadForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFilteredDonations = () => {
    if (filterStatus === "all") {
      return allDonations;
    }
    return allDonations.filter((donation) => donation.status === filterStatus);
  };

  const filteredDonations = getFilteredDonations();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = filteredDonations.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  useEffect(() => {
    return () => {
      if (uploadForm.imagePreview) {
        URL.revokeObjectURL(uploadForm.imagePreview);
      }
    };
  }, [uploadForm.imagePreview]);

  // Add this state near your other useState declarations
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUserId, setOtpUserId] = useState(null);

  // Add this handler function
  const handleOpenOtpModal = async () => {
    const email = user?.email;
    if (!email) {
      toast.error("User email not found. Please login again.");
      return;
    }

    try {
      const toastId = toast.loading("Sending OTP to your email...");
      const response = await sendForgotOtp(email);

      if (response.success) {
        toast.success("OTP sent successfully! Please check your email.", {
          id: toastId,
          duration: 3000,
        });
        setOtpUserId(response.userId);
        setShowOtpModal(true);
      } else {
        toast.error(response.message || "Failed to send OTP", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    }
  };

  const handleOtpSuccess = () => {
    toast.success(
      "Password reset successful! Please login with your new password.",
    );
    // Optionally log out the user
    setTimeout(() => {
      navigate("/donor-profile");
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadForm.imagePreview) {
      URL.revokeObjectURL(uploadForm.imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleDeleteUpload = async (donationId) => {
    try {
      const toastId = toast.loading("Removing donation proof...");

      await deleteDonationProof(donationId);

      setAllDonations((prev) =>
        prev.filter((donation) => donation._id !== donationId),
      );

      toast.success("Upload removed successfully!", {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to remove upload");
    }
  };

  const loadDonationHistory = async () => {
    try {
      const data = await fetchDonationHistory();

      setAllDonations(data.history || []);
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
      toast.error("Failed to fetch donation history");
    }
  };

  const handleUploadDonation = async () => {
    if (
      !uploadForm.donationDate ||
      !uploadForm.donationCenter ||
      !uploadForm.image
    ) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }
    try {
      const toastId = toast.loading("Uploading donation proof...");
      const formData = new FormData();
      formData.append("donationDate", uploadForm.donationDate);
      formData.append("donationCenter", uploadForm.donationCenter);
      formData.append("bloodGroup", uploadForm.bloodGroup || user?.bloodGroup);
      formData.append("units", uploadForm.units);
      formData.append("image", uploadForm.image);
      const data = await uploadDonationProof(formData);
      const savedDonation = data.proof;

      setAllDonations((prev) => [savedDonation, ...prev]);

      toast.success("Donation proof uploaded successfully!", {
        id: toastId,
        duration: 3000,
      });
      clearImage();
      setUploadForm({
        donationDate: "",
        donationCenter: "",
        bloodGroup: "",
        units: "1",
        image: null,
        imagePreview: null,
      });
      setShowDonationUpload(false);
    } catch (error) {
      console.error("Donation Upload Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload donation proof",
      );
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowPhotoOptions(false);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setIsUploading(true);
      await uploadProfilePhoto(formData);
      toast.success("Profile photo updated!");
      profileDetails();
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsUploading(true);
      await removeProfilePhoto();

      setUser((prev) => ({
        ...prev,
        profilePic: null,
      }));

      toast.success("Profile photo removed successfully!");
      setShowPhotoOptions(false);
    } catch (error) {
      console.error("Remove photo error:", error);
      toast.error(error.response?.data?.message || "Failed to remove photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddHealthStatus = async (healthData) => {
    const toastId = toast.loading("Updating health status...");
    try {
      await updateHealthStatus(healthData);
      setHealth(healthData);
      setShowHealthForm(false);
      toast.success("Health status updated successfully!", {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Health status update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update health status",
        { id: toastId },
      );
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteDonorAccount();
      toast.success("Account deleted successfully!");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Delete Account Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    if (updatedData.email !== updatedData.reEmail) {
      toast.error("Emails do not match!");
      return;
    }
    try {
      const toastId = toast.loading("Updating profile...");
      const data = await updateDonorProfile(updatedData);
      toast.success("Profile Updated Successfully!", {
        id: toastId,
        duration: 3000,
      });
      setUser(data.donor);
      setShowEditProfile(false);
      profileDetails();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", {
        duration: 3000,
      });
    }
  };

  const profileDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getDonorProfileDetails();

      console.log("profile", data);

      const { donor, health } = data;
      setUser(donor);
      setHealth(health || {});
    } catch (error) {
      console.log(
        "Error fetching profile:",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const campDetails = async () => {
    try {
      const data = await fetchAllCampRequests();
      setCamp(data.camps);
    } catch (error) {
      console.error("Error fetching camp requests:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await profileDetails();
      await loadDonationHistory();
      await campDetails();
    };

    loadAllData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <WrapperSection>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaHeartbeat className="text-pink-600 text-2xl animate-pulse" />
              </div>
            </div>
            <p className="text-slate-600">Loading donor profile...</p>
          </div>
        </div>
      </WrapperSection>
    );
  }

  if (!user) {
    return (
      <WrapperSection>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Profile Not Found
          </h3>
          <p className="text-slate-600">
            Please log in to view your donor profile.
          </p>
        </div>
      </WrapperSection>
    );
  }

  const latestDonation = user?.latestDonatedDate;

  let nextEligibleDate = null;
  let remainingDays = 0;

  if (latestDonation) {
    const lastDate = new Date(latestDonation);

    nextEligibleDate = new Date(lastDate);
    nextEligibleDate.setDate(lastDate.getDate() + 90);

    remainingDays = Math.max(
      0,
      Math.ceil((nextEligibleDate - new Date()) / (1000 * 60 * 60 * 24)),
    );
  }

  let progress = 0;

  if (latestDonation) {
    const lastDate = new Date(latestDonation);
    const today = new Date();

    const passedDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    progress = Math.min((passedDays / 90) * 100, 100);
  }

  return (
    <WrapperSection>
      <div className="donor-profile-wrapper relative md:-mt-[480px] -mt-[480px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 rounded-3xl blur-xl opacity-75 animate-gradient-xy"></div>

        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/50">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

          {/* Profile Header with Cover - ADDED z-20 HERE */}
          <div className="relative z-20 mb-8">
            <div className="h-48 md:h-56 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                  }}
                ></div>
              </div>
            </div>

            {/* Profile Avatar - Responsive Positioning */}
            <div className="absolute -bottom-12 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>

                {/* MOVED ONCLICK TO PARENT CONTAINER */}
                <div
                  className="relative w-28 h-28 bg-white rounded-full p-1 cursor-pointer"
                  onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {isUploading ? (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-white text-2xl" />
                      </div>
                    ) : user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Camera Icon - Now sits inside clickable parent */}
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-50 transition-colors">
                    <FaCamera className="text-pink-600 text-sm" />
                  </div>
                </div>

                {showPhotoOptions && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-30">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          document.getElementById("profile-upload").click();
                          setShowPhotoOptions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-lg text-sm flex items-center text-gray-700"
                      >
                        <FaCamera className="mr-3 text-pink-600" />
                        Upload New Photo
                      </button>

                      {user?.profilePic && (
                        <button
                          onClick={handleRemovePhoto}
                          className="w-full text-left px-4 py-3 hover:bg-rose-50 rounded-lg text-sm flex items-center text-rose-600"
                        >
                          <FaTrash className="mr-3" />
                          Remove Photo
                        </button>
                      )}

                      <button
                        onClick={() => setShowPhotoOptions(false)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-sm flex items-center text-gray-500"
                      >
                        <FaTimes className="mr-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Badges - Hidden on Mobile to prevent overlap, shown on Desktop */}
            <div className="hidden md:flex absolute bottom-0 right-8 text-right pb-4 gap-3 justify-end">
              <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full text-sm font-bold shadow-lg border border-yellow-300">
                {user?.level || "Bronze Donor"}
              </span>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-slate-600 text-sm">Member since </span>
                <span className="font-bold text-pink-600">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-16 md:mt-20">
            {/* Left Column - Profile Card */}
            <div className="lg:w-1/3 w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    ID: {user?._id?.slice(0, 8)}
                  </p>

                  {/* Mobile Only Badges */}
                  <div className="md:hidden mt-3 flex flex-col items-center gap-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full text-sm font-bold shadow-lg border border-yellow-300">
                      {user?.level || "Bronze Donor"}
                    </span>
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-xs">
                      <span className="text-slate-600">Member since </span>
                      <span className="font-bold text-pink-600">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      label: "Donations",
                      value: user?.donationCount || 0,
                      icon: <FaHeartbeat />,
                      color: "from-pink-500 to-pink-600",
                    },
                    {
                      label: "Points",
                      value: user?.points || (user?.donationCount || 0) * 250,
                      icon: <FaGem />,
                      color: "from-amber-500 to-amber-600",
                    },
                    {
                      label: "Blood",
                      value: user?.bloodGroup,
                      icon: <FaTint />,
                      color: "from-emerald-500 to-emerald-600",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setHoveredStat(index)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity`}
                      ></div>
                      <div className="relative bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 text-center border border-pink-100">
                        <div className="text-2xl mb-2 text-pink-600">
                          {stat.icon}
                        </div>
                        <div className="text-xl font-bold text-slate-800">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Health Status Card */}
                <div className="mb-6 p-4 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FaHeartbeat className="text-pink-600 text-lg mr-2" />
                      <span className="font-bold text-slate-800">
                        Health Status
                      </span>
                    </div>
                    <button
                      onClick={() => setShowHealthForm(true)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-all hover:scale-105"
                    >
                      <FaPlusCircle className="mr-1" />
                      Update
                    </button>
                  </div>

                  {!health || Object.keys(health).length === 0 ? (
                    <p className="text-sm text-yellow-600 text-center py-2">
                      No health data added yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-2 rounded-lg">
                        <span className="text-xs text-slate-500">Weight</span>
                        <p className="font-bold text-slate-800">
                          {health?.weight} kg
                        </p>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <span className="text-xs text-slate-500">Platelet</span>
                        <p className="font-bold text-slate-800">
                          {health?.platelet}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: <FaPhone />, value: user?.mobile },
                    {
                      icon: <FaWhatsapp />,
                      value: user?.whatsapp || user?.mobile,
                    },
                    { icon: <FaEnvelope />, value: user?.email },
                    {
                      icon: <FaMapMarkerAlt />,
                      value: `${user?.district}, ${user?.taluk}`,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-pink-600">{item.icon}</span>
                      </div>
                      <span className="text-sm text-slate-700 truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowEditProfile(true)}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center text-sm transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:w-2/3 w-full">
              {/* Premium Tabs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 mb-6 border border-pink-100 overflow-x-auto">
                <div className="flex flex-wrap gap-1 min-w-max">
                  {[
                    { id: "overview", label: "Overview", icon: <FaUser /> },
                    { id: "history", label: "History", icon: <FaHistory /> },
                    {
                      id: "certificates",
                      label: "Certificates",
                      icon: <FaCertificate />,
                    },
                    {
                      id: "achievements",
                      label: "Achievements",
                      icon: <FaAward />,
                    },
                    { id: "settings", label: "Settings", icon: <FaCog /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Next Donation Card */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                              Next Eligible Donation
                            </h3>
                            <p className="text-3xl font-bold text-pink-600">
                              {nextEligibleDate
                                ? nextEligibleDate.toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Not available"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-slate-800">
                              <div className="text-4xl font-bold text-slate-800">
                                {remainingDays}
                                <span className="text-lg text-slate-500 ml-1">
                                  days
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500">remaining</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowDonationUpload(true)}
                          className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-2xl"
                        >
                          <div className="absolute inset-0 opacity-10">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                                backgroundSize: "20px 20px",
                              }}
                            ></div>
                          </div>
                          <div className="relative">
                            <FaUpload className="text-3xl mb-3" />
                            <h4 className="text-lg font-bold mb-1">
                              Upload Donation Proof
                            </h4>
                            <p className="text-sm opacity-90">
                              Add new donation record
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveTab("certificates")}
                          className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-2xl"
                        >
                          <div className="absolute inset-0 opacity-10">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                                backgroundSize: "20px 20px",
                              }}
                            ></div>
                          </div>
                          <div className="relative">
                            <FaCertificate className="text-3xl mb-3" />
                            <h4 className="text-lg font-bold mb-1">
                              View Certificates
                            </h4>
                            <p className="text-sm opacity-90">
                              {certificates.length} available
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Upcoming Camps */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <FaCalendarAlt className="mr-2 text-pink-600" />
                        Upcoming Donation Camps
                      </h3>
                      <div className="space-y-3">
                        {camp.map((camp, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors border border-gray-200"
                          >
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-4 mb-2 sm:mb-0">
                              <FaCalendarAlt className="text-pink-600 text-xl" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800">
                                {camp?.organizationName}
                              </h4>
                              <div className="flex items-center text-sm text-slate-600 mt-1">
                                <FaMapMarkerAlt className="mr-1 text-pink-500" />
                                {camp?.venue} •
                                {camp?.eventDate
                                  ? new Date(camp.eventDate).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      },
                                    )
                                  : "Date not available"}{" "}
                                • {camp?.eventTime}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h3 className="text-xl font-bold text-slate-800">
                        Donation History
                      </h3>

                      <div className="relative">
                        <button
                          onClick={() => setShowFilterMenu(!showFilterMenu)}
                          className="flex items-center bg-white border-2 border-pink-200 text-slate-700 px-4 py-2 rounded-xl font-medium text-sm hover:border-pink-400 transition-colors"
                        >
                          <FaFilter className="mr-2 text-pink-600" />
                          {filterStatus === "all"
                            ? "All Donations"
                            : filterStatus === "pending"
                              ? "Pending"
                              : filterStatus === "verified"
                                ? "Verified"
                                : "Rejected"}
                        </button>

                        {showFilterMenu && (
                          <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-2xl z-10">
                            {["all", "pending", "verified", "rejected"].map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    setFilterStatus(status);
                                    setShowFilterMenu(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-pink-50 text-sm first:rounded-t-xl last:rounded-b-xl capitalize"
                                >
                                  {status === "all" ? "All Donations" : status}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {currentDonations.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaFileImage className="text-3xl text-slate-400" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">
                          No Donations Found
                        </h4>
                        <p className="text-slate-600 mb-4">
                          Start your journey by uploading your first donation
                          proof
                        </p>
                        <button
                          onClick={() => setShowDonationUpload(true)}
                          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                        >
                          Upload Donation Proof
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {currentDonations.map((donation) => (
                            <div
                              key={donation._id}
                              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-xl transition-all hover:scale-[1.02]"
                            >
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div
                                  className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                                  onClick={() => {
                                    setSelectedImage(
                                      donation.proofImage || donation.image,
                                    );
                                    setShowImagePreview(true);
                                  }}
                                >
                                  <img
                                    src={donation.proofImage || donation.image}
                                    alt="Donation"
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                    <span className="font-bold text-slate-800">
                                      {new Date(
                                        donation.donationDate,
                                      ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </span>

                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        donation.status === "verified"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : donation.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-rose-100 text-rose-700"
                                      }`}
                                    >
                                      {donation.status === "verified" && (
                                        <FaCheckCircle className="inline mr-1" />
                                      )}
                                      {donation.status === "pending" && (
                                        <FaClock className="inline mr-1" />
                                      )}
                                      {donation.status === "rejected" && (
                                        <FaBan className="inline mr-1" />
                                      )}
                                      {donation.status.charAt(0).toUpperCase() +
                                        donation.status.slice(1)}
                                    </span>
                                  </div>

                                  <p className="text-slate-600 text-sm mb-2">
                                    {donation.donationCenter}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {donation.bloodGroup || user?.bloodGroup} •{" "}
                                    {donation.units} Unit
                                  </p>

                                  {donation.adminRemarks && (
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                      <p className="text-sm text-slate-600">
                                        <span className="font-bold">
                                          Admin Remark:
                                        </span>{" "}
                                        {donation.adminRemarks}
                                      </p>
                                    </div>
                                  )}

                                  {donation.status === "pending" && (
                                    <div className="flex gap-3 mt-3">
                                      <button
                                        onClick={() => {
                                          setSelectedImage(
                                            donation.proofImage ||
                                              donation.image,
                                          );
                                          setShowImagePreview(true);
                                        }}
                                        className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center"
                                      >
                                        <FaEye className="mr-1" /> View
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteUpload(donation._id)
                                        }
                                        className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center"
                                      >
                                        <FaTrash className="mr-1" /> Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                              onClick={prevPage}
                              disabled={currentPage === 1}
                              className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              <FaChevronLeft className="mr-2" /> Previous
                            </button>

                            <div className="flex items-center gap-2">
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                              ).map((number) => (
                                <button
                                  key={number}
                                  onClick={() => paginate(number)}
                                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                    currentPage === number
                                      ? "bg-pink-600 text-white shadow-lg"
                                      : "bg-white border border-slate-300 text-slate-700 hover:bg-pink-50"
                                  }`}
                                >
                                  {number}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={nextPage}
                              disabled={currentPage === totalPages}
                              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              Next <FaChevronRight className="ml-2" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {activeTab === "certificates" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">
                        My Certificates
                      </h3>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">
                        {certificates.length} Total
                      </span>
                    </div>

                    {certificates.length === 0 ? (
                      <div className="text-center py-12">
                        {/* ... Empty state code ... */}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {certificates.map((certificate) => (
                          <div
                            key={certificate.id}
                            className="group relative bg-gradient-to-br from-pink-50 to-white rounded-xl p-5 border border-pink-200 hover:shadow-2xl transition-all hover:scale-[1.02]"
                          >
                            {/* THE FIX: Added 'pointer-events-none' to the line below */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>

                            <div className="flex items-start justify-between mb-3">
                              <FaCertificate className="text-3xl text-pink-600" />
                              <FaAward className="text-2xl text-yellow-500" />
                            </div>

                            <h4 className="font-bold text-slate-800 mb-2">
                              {certificate.title}
                            </h4>

                            <p className="text-sm text-slate-600 mb-3">
                              {new Date(certificate.date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  console.log("View button clicked");
                                  setSelectedCertificate(certificate);
                                  setShowCertificateModal(true);
                                }}
                                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                              >
                                View
                              </button>

                              <button
                                onClick={() => {
                                  console.log("Download button clicked");
                                  setSelectedCertificate(certificate);
                                  setShowCertificateModal(true);
                                }}
                                className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "achievements" && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                      Achievements & Milestones
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        {
                          title: "First Donation",
                          icon: <FaStar />,
                          unlocked: (user?.donationCount || 0) >= 1,
                          color: "from-yellow-400 to-yellow-500",
                        },
                        {
                          title: "5 Donations",
                          icon: <FaMedal />,
                          unlocked: (user?.donationCount || 0) >= 5,
                          color: "from-purple-400 to-purple-500",
                        },
                        {
                          title: "Emergency Hero",
                          icon: <FaHandHoldingHeart />,
                          unlocked: true,
                          color: "from-rose-400 to-rose-500",
                        },
                        {
                          title: "Platinum Donor",
                          icon: <FaGem />,
                          unlocked: (user?.donationCount || 0) >= 10,
                          color: "from-emerald-400 to-emerald-500",
                        },
                        {
                          title: "Life Saver",
                          icon: <FaHeartbeat />,
                          unlocked: (user?.donationCount || 0) >= 3,
                          color: "from-pink-400 to-pink-500",
                        },
                        {
                          title: "Campaign Leader",
                          icon: <FaUserFriends />,
                          unlocked: false,
                          color: "from-stone-400 to-stone-500",
                        },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`relative group ${!achievement.unlocked && "opacity-50"}`}
                        >
                          <div
                            className={`absolute -inset-0.5 bg-gradient-to-r ${achievement.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity`}
                          ></div>
                          <div className="relative bg-white rounded-xl p-5 text-center border border-slate-200">
                            <div
                              className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center text-white text-2xl shadow-lg`}
                            >
                              {achievement.icon}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">
                              {achievement.title}
                            </h4>
                            {achievement.unlocked ? (
                              <span className="text-xs text-emerald-600 flex items-center justify-center">
                                <FaCheckCircle className="mr-1" /> Unlocked
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                      Account Settings
                    </h3>

                    {/* Notifications */}
                    <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                        <FaBell className="mr-2 text-pink-600" />
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-pink-50 transition-colors">
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 text-pink-600"
                            defaultChecked
                          />
                          <span className="text-sm text-slate-700">
                            Email updates about donation camps
                          </span>
                        </label>
                        <label className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-pink-50 transition-colors">
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 text-pink-600"
                            defaultChecked
                          />
                          <span className="text-sm text-slate-700">
                            SMS reminders for next eligible date
                          </span>
                        </label>
                        <label className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-pink-50 transition-colors">
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 text-pink-600"
                          />
                          <span className="text-sm text-slate-700">
                            WhatsApp notifications
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                        <FaShieldAlt className="mr-2 text-pink-600" />
                        Security
                      </h4>
                      <button
                        onClick={handleOpenOtpModal}
                        className="flex items-center bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-105"
                      >
                        <FaKey className="mr-2" />
                        Reset Password
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-6 border border-rose-200">
                      <h4 className="font-bold text-rose-600 mb-2 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        Danger Zone
                      </h4>
                      <p className="text-sm text-rose-600 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CertificateModal
          selectedCertificate={selectedCertificate}
          showCertificateModal={showCertificateModal}
          setShowCertificateModal={setShowCertificateModal}
          user={user}
        />
        <DeleteAccountModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteAccount={handleDeleteAccount}
          isDeleting={isDeleting}
        />
        <OtpVerificationModal
          showModal={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={user?.email}
          userId={otpUserId}
          onSuccess={handleOtpSuccess}
        />
        {showHealthForm && (
          <HealthStatusForm
            onClose={() => setShowHealthForm(false)}
            onSubmit={handleAddHealthStatus}
          />
        )}
        {showEditProfile && (
          <EditProfileForm
            user={user}
            setShowEditProfile={setShowEditProfile}
            handleSaveProfile={handleSaveProfile}
          />
        )}
        {showDonationUpload && (
          <DonationUploadForm
            showDonationUpload={showDonationUpload}
            setShowDonationUpload={setShowDonationUpload}
            uploadForm={uploadForm}
            setUploadForm={setUploadForm}
            handleUploadDonation={handleUploadDonation}
            handleImageUpload={handleImageUpload}
            fileInputRef={fileInputRef}
            clearImage={clearImage}
            bloodGroup={user?.bloodGroup}
          />
        )}
        <ImagePreviewModal
          showImagePreview={showImagePreview}
          setShowImagePreview={setShowImagePreview}
          selectedImage={selectedImage}
        />
      </div>
    </WrapperSection>
  );
};

export default DonorProfile;
