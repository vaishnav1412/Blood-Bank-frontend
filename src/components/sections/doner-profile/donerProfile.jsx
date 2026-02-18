import { useState, useEffect, useRef } from "react";
import HealthStatusForm from "../form/HealthStatusForm";
import EditProfileForm from "../form/EditProfileForm";
import DonationUploadForm from "../form/DonationUploadForm";
import { useNavigate } from "react-router-dom";
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
  FaDownload,
  FaShareAlt,
  FaEdit,
  FaBell,
  FaMedal,
  FaStar,
  FaSpinner,
  FaPrint,
  FaCheckCircle,
  FaUserFriends,
  FaCog,
  FaUserCheck,
  FaHandHoldingHeart,
  FaWhatsapp,
  FaLock,
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
} from "../../../services/donorServices";
import "./donerProfile.scss";

const DonorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [certificates, setCertificates] = useState([]);
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
  const [imagePreview, setImagePreview] = useState(null); // Added missing state

  const [uploadForm, setUploadForm] = useState({
    donationDate: "",
    donationCenter: "",
    bloodGroup: "",
    units: "1",
    image: null,
    imagePreview: null,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Add ref for file input
  const fileInputRef = useRef(null);

  // Clear image function
  const clearImage = () => {
    setUploadForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get filtered donations based on status
  const getFilteredDonations = () => {
    if (filterStatus === "all") {
      return allDonations;
    }
    return allDonations.filter((donation) => donation.status === filterStatus);
  };

  // Get verified donations for pagination
  const getVerifiedDonations = () => {
    return allDonations.filter((donation) => donation.status === "verified");
  };

  // Pagination for verified donations
  const verifiedDonations = getVerifiedDonations();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVerifiedDonations = verifiedDonations.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(verifiedDonations.length / itemsPerPage);

  const upcomingCamps = [
    {
      date: "2024-04-05",
      name: "World Health Day Camp",
      location: "City Center",
      time: "9 AM - 5 PM",
    },
    {
      date: "2024-04-14",
      name: "World Blood Donor Day Prep",
      location: "Town Hall",
      time: "10 AM - 6 PM",
    },
    {
      date: "2024-04-20",
      name: "Corporate Blood Drive",
      location: "Tech Park",
      time: "8 AM - 4 PM",
    },
  ];

  const handleDownloadCertificate = (certificate) => {
    toast.success("Certificate download started", { duration: 3000 });
  };

  // fetch certificates
  const loadCertificates = () => {
    try {
      const verifiedDonations = allDonations.filter(
        (donation) => donation.status === "verified",
      );

      const generatedCertificates = verifiedDonations.map(
        (donation, index) => ({
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
        }),
      );

      setCertificates(generatedCertificates);
      console.log("Certificates Generated:", generatedCertificates);
    } catch (error) {
      console.error("Failed to generate certificates:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setUploadForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  // delete donation pending state only
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

  // fetch donation history
  const loadDonationHistory = async () => {
    try {
      const data = await fetchDonationHistory();
      console.log("Donation History:", data.history);
      setAllDonations(data.history || []);
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
      toast.error("Failed to fetch donation history");
    }
  };

  // prof upload part
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
      console.log("Upload Response:", data);
      const savedDonation = data.proof;

      setAllDonations((prev) => [savedDonation, ...prev]);

      toast.success("Donation proof uploaded successfully!", {
        id: toastId,
        duration: 3000,
      });
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

  // update profile photo part
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
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

  // Handle photo removal
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

  // Password Reset Handler
  const handleResetPassword = async () => {
    const email = user?.email;
    if (!email) {
      toast.error("User email not found. Please login again.");
      return;
    }
    try {
      const toastId = toast.loading("Sending OTP to your email...");
      const response = await sendForgotOtp(email);
      toast.success(
        response.message || "OTP sent successfully! Redirecting...",
        {
          id: toastId,
          duration: 3000,
        },
      );
      localStorage.setItem("resetEmail", email);
      setTimeout(() => {
        navigate("/verify-otp"); // Fixed typo from "varify-otp" to "verify-otp"
      }, 1000);
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    }
  };

  // update health status
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

  // Delete Account part
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

  // edit profile part
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
      console.log("Updated Profile:", data);
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

  // retrieve profile part
  const profileDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getDonorProfileDetails();
      console.log("Profile Data:", data);
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

  useEffect(() => {
    const loadAllData = async () => {
      await profileDetails();
      await loadDonationHistory();
    };

    loadAllData();
  }, []);

  useEffect(() => {
    if (allDonations.length > 0) {
      loadCertificates();
    }
  }, [allDonations]);

  // Image Preview Modal
  const ImagePreviewModal = () => (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
      onClick={() => setShowImagePreview(false)}
    >
      <div className="relative w-full flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Donation Proof"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        <button
          onClick={() => setShowImagePreview(false)}
          className="absolute top-0 right-0 -mt-4 -mr-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 sm:absolute sm:top-2 sm:right-2 sm:mt-0 sm:mr-0"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );

  // Certificate Modal Component
  const CertificateModal = () => {
    const certificateRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!selectedCertificate || !showCertificateModal) return null;

    const getMilestoneTitle = () => {
      const count = user?.donationCount || 0;
      if (count === 1) return "1st Donation Hero";
      if (count === 2) return "2nd Donation Hero";
      if (count === 3) return "3rd Donation Hero";
      if (count === 4) return "4th Donation Hero";
      if (count >= 5 && count <= 9) return `${count} Donations Champion`;
      if (count >= 10) return "10 Donations Platinum Donor";
      return "Blood Donation Hero";
    };

    const handleDownloadPNG = async () => {
      if (!certificateRef.current) return;

      try {
        setIsDownloading(true);
        const html2canvas = (await import("html2canvas")).default;

        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: false,
          useCORS: true,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `certificate-${selectedCertificate.certificateId || "donation"}.png`;
        link.click();

        toast.success("Certificate downloaded successfully!");
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download certificate");
      } finally {
        setIsDownloading(false);
      }
    };

    const handleShare = async () => {
      const shareText = `I just received my ${getMilestoneTitle()} certificate for blood donation! 🩸❤️\n\nDonate blood, save lives!`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Blood Donation Certificate",
            text: shareText,
            url: shareUrl,
          });
        } catch (error) {
          console.log("Share cancelled");
        }
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        window.open(whatsappUrl, "_blank");
      }
    };

    const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow pop-ups to print");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Blood Donation Certificate</title>
            <style>
              body { 
                font-family: 'Georgia', serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
                background: #f5f5f5;
                padding: 20px;
              }
              .certificate-wrapper {
                max-width: 1000px;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <div class="certificate-wrapper">
              ${document.getElementById("certificate-content")?.innerHTML || ""}
            </div>
            <script>
              window.onload = () => window.print();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl animate-slideUp">
          <div
            id="certificate-content"
            ref={certificateRef}
            className="relative bg-gradient-to-br from-amber-50 via-white to-pink-50 p-6 sm:p-10"
          >
            <div className="absolute inset-4 border-2 border-pink-200/50 rounded-2xl pointer-events-none"></div>
            <div className="absolute inset-6 border border-pink-300/30 rounded-xl pointer-events-none"></div>

            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-pink-400/30 rounded-tl-3xl"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-pink-400/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-pink-400/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-pink-400/30 rounded-br-3xl"></div>

            <div className="text-center mb-8 relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">🩸</span>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-800">
                    Kannur Blood Link
                  </h2>
                  <p className="text-xs text-gray-500">Life is in your blood</p>
                </div>
              </div>

              <div className="relative">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-800 via-pink-600 to-red-800 bg-clip-text text-transparent mb-2">
                  Certificate of Appreciation
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-red-400 mx-auto rounded-full"></div>
              </div>

              <p className="text-sm text-gray-500 mt-3 font-mono">
                Cert. ID:{" "}
                <span className="font-semibold text-gray-700">
                  {selectedCertificate.certificateId}
                </span>
              </p>
            </div>

            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-3">
                This is proudly presented to
              </p>

              <div className="relative inline-block mb-4">
                <h3 className="text-4xl sm:text-5xl font-bold text-gray-800 px-8 py-2 border-b-4 border-pink-300">
                  {user?.name}
                </h3>
                <FaAward className="absolute -top-3 -left-4 text-3xl text-pink-400 rotate-[-15deg]" />
                <FaAward className="absolute -top-3 -right-4 text-3xl text-pink-400 rotate-[15deg]" />
              </div>

              <div className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg mb-6">
                {getMilestoneTitle()}
              </div>

              <div className="space-y-2 text-gray-700">
                <p className="text-lg">
                  For their noble contribution of blood donation on
                </p>
                <p className="text-3xl font-bold text-pink-700">
                  {new Date(selectedCertificate.date).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
                <p className="text-lg">
                  at{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedCertificate.center}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl p-4 text-center shadow-sm border border-pink-100">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {user?.bloodGroup}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Blood Group
                </div>
              </div>
              <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl p-4 text-center shadow-sm border border-pink-100">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {user?.donationCount}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Total Donations
                </div>
              </div>
              <div className="bg-gradient-to-b from-pink-50 to-white rounded-xl p-4 text-center shadow-sm border border-pink-100">
                <div className="text-3xl font-bold text-pink-600 mb-1">
                  {(user?.donationCount || 0) * 150}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Life Points
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t-2 border-dashed border-pink-200">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white p-1 rounded-lg shadow-md border border-gray-200">
                  <img
                    src={
                      selectedCertificate.qrCode ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedCertificate.certificateId}`
                    }
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan to verify</p>
              </div>

              <div className="flex-1 flex justify-between items-center px-4">
                <div className="text-center">
                  <div className="w-32 h-12 mb-1">
                    <svg className="w-full h-full" viewBox="0 0 120 40">
                      <path
                        d="M10,25 Q30,10 50,25 T90,25"
                        stroke="#ec4899"
                        fill="none"
                        strokeWidth="2"
                      />
                      <text
                        x="20"
                        y="35"
                        className="text-xs fill-gray-600 font-signature"
                      >
                        Dr. Priya Sharma
                      </text>
                    </svg>
                  </div>
                  <div className="font-bold text-gray-800 text-sm">
                    Medical Director
                  </div>
                  <div className="text-xs text-gray-500">Kannur Blood Link</div>
                </div>

                <div className="w-px h-12 bg-gray-300"></div>

                <div className="text-center">
                  <div className="font-bold text-gray-800 text-lg mb-1">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="font-bold text-gray-800 text-sm">
                    Date of Issue
                  </div>
                  <div className="text-xs text-gray-500">Valid Forever</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              <p>
                This certificate is digitally generated and can be verified
                online.
              </p>
              <p className="mt-1">
                © Kannur Blood Link - Every drop saves a life ❤️
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-b-2xl sm:rounded-b-3xl border-t border-gray-200">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <FaSpinner className="animate-spin mr-1 sm:mr-2" />
                ) : (
                  <FaDownload className="mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Download PNG</span>
                <span className="sm:hidden">DL</span>
              </button>

              <button
                onClick={handleShare}
                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm transition-all transform hover:scale-105"
              >
                <FaShareAlt className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Certificate link copied!");
                }}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm transition-all transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4 mr-1 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span className="hidden sm:inline">Copy Link</span>
                <span className="sm:hidden">Copy</span>
              </button>

              <button
                onClick={handlePrint}
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm transition-all transform hover:scale-105"
              >
                <FaPrint className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Print</span>
                <span className="sm:hidden">Print</span>
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Account Modal Component
  const DeleteAccountModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-red-600 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Delete Account
            </h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete your account? This action is
            <span className="font-bold text-red-600"> permanent </span>
            and cannot be undone. All your data will be permanently removed.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border-2 border-gray-300 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex-1 bg-orange-700 hover:bg-orange-800 text-white py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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

          <p className="text-xs text-gray-500 text-center mt-4">
            You will be logged out and redirected to the login page.
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <WrapperSection>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl sm:text-5xl text-pink-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600">
              Loading donor profile...
            </p>
          </div>
        </div>
      </WrapperSection>
    );
  }

  if (!user) {
    return (
      <WrapperSection>
        <div className="text-center py-12">
          <FaUser className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h3>
          <p className="text-sm text-gray-600">
            Please log in to view your donor profile.
          </p>
        </div>
      </WrapperSection>
    );
  }

  return (
    <WrapperSection>
      <div className="donor-profile-wrapper bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 md:-mt-[480px] -mt-[650px] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-pink-500/10 overflow-hidden max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-4">
                <div className="relative mb-3 sm:mb-0">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg ring-4 ring-white overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
                      {isUploading ? (
                        <FaSpinner className="animate-spin text-3xl" />
                      ) : user?.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                        <FaCamera className="text-white text-xl" />
                      </div>
                    </div>

                    {user?.isVerified && (
                      <div className="absolute bottom-1 right-1 w-7 h-7 bg-lime-600 rounded-full flex items-center justify-center border-3 border-white shadow-sm z-10">
                        <FaUserCheck className="text-white text-xs" />
                      </div>
                    )}
                  </div>

                  {showPhotoOptions && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-20">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            document.getElementById("profile-upload").click();
                            setShowPhotoOptions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center text-gray-700"
                        >
                          <FaCamera className="mr-2 text-pink-600" />
                          Upload New Photo
                        </button>

                        {user?.profilePic && (
                          <button
                            onClick={handleRemovePhoto}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center text-red-600"
                          >
                            <FaTrash className="mr-2" />
                            Remove Photo
                          </button>
                        )}

                        <button
                          onClick={() => setShowPhotoOptions(false)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center text-gray-500"
                        >
                          <FaTimes className="mr-2" />
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

                <div className="sm:ml-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {user?.name}
                    </h2>
                    <span className="inline-flex px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
                      {user?.level}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    ID: {user?._id?.slice(0, 8)}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start mt-1 text-xs text-gray-500">
                    <FaUserFriends className="mr-1" />
                    Since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-pink-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-pink-600">
                    {user?.donationCount}
                  </div>
                  <div className="text-xs text-gray-600">Donations</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-pink-600">
                    {user?.points || (user?.donationCount || 0) * 250}
                  </div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-pink-600">
                    {user?.bloodGroup}
                  </div>
                  <div className="text-xs text-gray-600">Blood</div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center w-full sm:w-auto">
                    <FaHeartbeat className="text-pink-600 text-lg mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">
                        Health Status
                      </div>
                      <div className="text-xs text-gray-600">
                        {!health || Object.keys(health).length === 0 ? (
                          <span className="text-yellow-600">Not updated</span>
                        ) : (
                          "Updated"
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHealthForm(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center"
                  >
                    <FaPlusCircle className="mr-1" />
                    Add
                  </button>
                </div>
                {health?.weight && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-pink-200">
                    <div>
                      <span className="text-xs text-gray-500">Weight</span>
                      <p className="font-medium text-gray-800 text-sm">
                        {health?.weight} kg
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Platelet</span>
                      <p className="font-medium text-gray-800 text-sm">
                        {health?.platelet}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <FaPhone className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user?.mobile}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaWhatsapp className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {user?.whatsapp || user?.mobile}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user?.taluk}</span>
                </div>
              </div>

              <button
                onClick={() => setShowEditProfile(true)}
                className="w-full mt-4 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-2.5 rounded-xl font-bold flex items-center justify-center text-sm"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:w-2/3 w-full">
            <div className="flex overflow-x-auto pb-2 mb-4 border-b border-gray-200 scrollbar-hide">
              {[
                { id: "overview", label: "Overview", icon: <FaUser /> },
                {
                  id: "certificates",
                  label: "Certificates",
                  icon: <FaCertificate />,
                },
                { id: "history", label: "History", icon: <FaHistory /> },
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
                  className={`flex items-center px-3 sm:px-4 py-2.5 font-medium whitespace-nowrap transition-colors text-sm flex-shrink-0 ${
                    activeTab === tab.id
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-200">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                          Next Donation
                        </h3>
                        <p className="text-xs text-gray-600">
                          You're eligible from
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-pink-600 mt-1">
                          {user?.nextEligibleDate
                            ? new Date(
                                user.nextEligibleDate,
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not available"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                          {user?.nextEligibleDate
                            ? Math.ceil(
                                (new Date(user.nextEligibleDate) - new Date()) /
                                  (1000 * 60 * 60 * 24),
                              )
                            : 0}
                          d
                        </div>
                        <div className="text-xs text-gray-600">remaining</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
                          style={{
                            width: user?.nextEligibleDate ? "65%" : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowDonationUpload(true)}
                        className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-xl font-bold flex flex-col items-center text-sm hover:shadow-lg transition-all hover:-translate-y-1"
                      >
                        <FaUpload className="text-2xl mb-2" />
                        <span>Upload Proof</span>
                        <span className="text-xs opacity-90 mt-1">
                          Add new donation
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab("certificates")}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl font-bold flex flex-col items-center text-sm hover:shadow-lg transition-all hover:-translate-y-1"
                      >
                        <FaCertificate className="text-2xl mb-2" />
                        <span>Certificates</span>
                        <span className="text-xs opacity-90 mt-1">
                          {certificates.length} available
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <FaCalendarAlt className="mr-2 text-pink-600 text-sm" />
                      Upcoming Camps
                    </h3>
                    <div className="space-y-2">
                      {upcomingCamps.slice(0, 2).map((camp, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-start sm:items-center p-3 border border-gray-200 rounded-xl gap-2"
                        >
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <FaCalendarAlt className="text-pink-600 text-xs" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm truncate">
                              {camp.name}
                            </h4>
                            <div className="flex items-center text-xs text-gray-600">
                              <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                              <span className="truncate">{camp.location}</span>
                            </div>
                          </div>
                          <button className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 w-full sm:w-auto">
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                        <FaHistory className="mr-2 text-pink-600 text-sm" />
                        Recent Activity
                      </h3>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center"
                      >
                        View All <FaChevronRight className="ml-1 text-xs" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {verifiedDonations.slice(0, 3).map((donation) => (
                        <div
                          key={donation._id}
                          className="flex items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <FaCheckCircle className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              Donation at {donation.donationCenter}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                donation.donationDate,
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {verifiedDonations.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No donation history yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Donation History
                    </h3>

                    <div className="relative w-full sm:w-auto">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                      >
                        <FaFilter className="mr-2" />
                        {filterStatus === "all"
                          ? "All Donations"
                          : filterStatus === "pending"
                            ? "Pending"
                            : filterStatus === "verified"
                              ? "Verified"
                              : "Rejected"}
                      </button>

                      {showFilterMenu && (
                        <div className="absolute top-full right-0 mt-1 w-full sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setFilterStatus("all");
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            All Donations
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("pending");
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("verified");
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Verified
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("rejected");
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <FaFilter className="text-pink-600 mr-2" />
                      {filterStatus === "all"
                        ? "All Donations"
                        : filterStatus === "pending"
                          ? "Pending Donations"
                          : filterStatus === "verified"
                            ? "Verified Donations"
                            : "Rejected Donations"}
                    </h4>

                    {getFilteredDonations().length === 0 ? (
                      <div className="text-center py-8">
                        <FaFileImage className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          No {filterStatus !== "all" ? filterStatus : ""}{" "}
                          donations found
                        </p>
                        <button
                          onClick={() => setShowDonationUpload(true)}
                          className="mt-3 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                          Upload New
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getFilteredDonations().map((donation) => (
                          <div
                            key={donation._id}
                            className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                              <div
                                className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 mx-auto sm:mx-0"
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

                              <div className="flex-1 min-w-0 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 gap-2">
                                  <span className="font-medium text-gray-800 text-sm">
                                    {new Date(
                                      donation.donationDate,
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>

                                  {donation.status === "pending" && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                      <FaClock className="mr-1 text-xs" />
                                      Pending
                                    </span>
                                  )}
                                  {donation.status === "verified" && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                      <FaCheckCircle className="mr-1 text-xs" />
                                      Verified
                                    </span>
                                  )}
                                  {donation.status === "rejected" && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                      <FaBan className="mr-1 text-xs" />
                                      Rejected
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-gray-600 truncate">
                                  {donation.donationCenter}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {donation.bloodGroup || user?.bloodGroup} •{" "}
                                  {donation.units} Unit
                                </p>

                                {donation.adminRemarks && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">
                                        Admin:
                                      </span>{" "}
                                      {donation.adminRemarks}
                                    </p>
                                  </div>
                                )}

                                {(donation.status === "pending" ||
                                  donation.status === "rejected") && (
                                  <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <button
                                      onClick={() => {
                                        setSelectedImage(
                                          donation.proofImage || donation.image,
                                        );
                                        setShowImagePreview(true);
                                      }}
                                      className="text-pink-600 hover:text-pink-700 text-xs font-medium flex items-center"
                                    >
                                      <FaEye className="mr-1" /> View
                                    </button>

                                    {donation.status === "pending" && (
                                      <button
                                        onClick={() =>
                                          handleDeleteUpload(donation._id)
                                        }
                                        className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center"
                                      >
                                        <FaTrash className="mr-1" /> Remove
                                      </button>
                                    )}

                                    {donation.status === "rejected" && (
                                      <button
                                        onClick={() => {
                                          setUploadForm({
                                            donationDate: donation.donationDate,
                                            donationCenter:
                                              donation.donationCenter,
                                            bloodGroup: donation.bloodGroup,
                                            units: donation.units,
                                            image: null,
                                            imagePreview: null,
                                          });
                                          setShowDonationUpload(true);
                                          handleDeleteUpload(donation._id);
                                        }}
                                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center"
                                      >
                                        <FaUpload className="mr-1" /> Re-upload
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {(filterStatus === "all" || filterStatus === "verified") &&
                    verifiedDonations.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-700 flex items-center">
                            <FaCheckCircle className="text-green-500 mr-2" />
                            Verified Donations
                          </h4>
                          <span className="text-xs text-gray-500">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(
                              indexOfLastItem,
                              verifiedDonations.length,
                            )}{" "}
                            of {verifiedDonations.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentVerifiedDonations.map((donation) => (
                            <div
                              key={donation._id}
                              className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <FaCheckCircle className="text-green-600 text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-gray-800 text-sm">
                                      {new Date(
                                        donation.donationDate,
                                      ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {donation.donationCenter}
                                    </span>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                    Verified
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === 1
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                              }`}
                            >
                              <FaChevronLeft className="mr-1 text-xs" />
                              Previous
                            </button>

                            <div className="flex items-center gap-2">
                              {[...Array(totalPages)].map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === i + 1
                                      ? "bg-pink-600 text-white"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages),
                                )
                              }
                              disabled={currentPage === totalPages}
                              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === totalPages
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                              }`}
                            >
                              Next
                              <FaChevronRight className="ml-1 text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {activeTab === "certificates" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      My Certificates
                    </h3>
                    <div className="text-sm text-gray-500">
                      {certificates.length} certificate
                      {certificates.length !== 1 ? "s" : ""} available
                    </div>
                  </div>

                  {certificates.length === 0 ? (
                    <div className="text-center py-8">
                      <FaCertificate className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        No certificates yet. Upload donation proofs to earn
                        certificates.
                      </p>
                      <button
                        onClick={() => setShowDonationUpload(true)}
                        className="mt-3 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        Upload Donation Proof
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {certificates.map((certificate) => (
                        <div
                          key={certificate.id}
                          className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-800 text-sm">
                                {certificate.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {new Date(certificate.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}{" "}
                                • {certificate.center}
                              </p>
                            </div>
                            <FaAward className="text-pink-500 text-xl flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                setSelectedCertificate(certificate);
                                setShowCertificateModal(true);
                              }}
                              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-1.5 rounded-lg text-xs font-medium"
                            >
                              View Certificate
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadCertificate(certificate)
                              }
                              className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-1.5 rounded-lg text-xs font-medium"
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Achievements
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        title: "First Donation",
                        icon: <FaStar />,
                        unlocked: (user?.donationCount || 0) >= 1,
                      },
                      {
                        title: "5 Donations",
                        icon: <FaMedal />,
                        unlocked: (user?.donationCount || 0) >= 5,
                      },
                      {
                        title: "Emergency Hero",
                        icon: <FaHandHoldingHeart />,
                        unlocked: true,
                      },
                      {
                        title: "Platinum Donor",
                        icon: <FaAward />,
                        unlocked: (user?.donationCount || 0) >= 10,
                      },
                      {
                        title: "10 Donations",
                        icon: <FaMedal />,
                        unlocked: (user?.donationCount || 0) >= 10,
                        progress: `${user?.donationCount || 0}/10`,
                      },
                      {
                        title: "Campaign Leader",
                        icon: <FaUserFriends />,
                        unlocked: false,
                      },
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className={`rounded-xl p-3 text-center ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-pink-50 to-white border border-pink-200"
                            : "bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            achievement.unlocked
                              ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          <div className="text-lg">{achievement.icon}</div>
                        </div>
                        <h4 className="font-bold text-gray-800 text-xs mb-1">
                          {achievement.title}
                        </h4>
                        {achievement.unlocked ? (
                          <span className="text-xs text-green-600 flex items-center justify-center">
                            <FaCheckCircle className="mr-1" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {achievement.progress || "Locked"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Settings
                  </h3>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm">
                      <FaBell className="mr-2 text-pink-600" />
                      Notifications
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          className="mr-2"
                          defaultChecked
                        />
                        <span>Email updates</span>
                      </label>
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          className="mr-2"
                          defaultChecked
                        />
                        <span>SMS reminders</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm">
                      <FaLock className="mr-2 text-pink-600" />
                      Security
                    </h4>
                    <button
                      onClick={handleResetPassword}
                      className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
                    >
                      <FaKey className="mr-2" />
                      Reset Password
                    </button>
                  </div>

                  <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
                    <h4 className="font-bold text-amber-800 mb-1 text-sm">
                      Danger Zone
                    </h4>
                    <p className="text-amber-700 text-xs mb-3">
                      Once you delete your account, there is no going back.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg font-bold text-xs"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CertificateModal />
        <DeleteAccountModal />
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
          />
        )}
        {showImagePreview && <ImagePreviewModal />}
      </div>
    </WrapperSection>
  );
};

export default DonorProfile;
