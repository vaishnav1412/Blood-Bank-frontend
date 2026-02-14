import { useState, useEffect, useRef } from "react";
import HealthStatusForm from "../form/HealthStatusForm";
import EditProfileForm from "../form/EditProfileForm";
import DonationUploadForm from "../form/DonationUploadForm";

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
} from "react-icons/fa";
import "./donerProfile.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import toast from "react-hot-toast";
import axios from "axios";

const DonorProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [donorData, setDonorData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showDonationUpload, setShowDonationUpload] = useState(false);
  const [uploadedDonations, setUploadedDonations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    donationDate: "",
    donationCenter: "",
    bloodGroup: "",
    units: "1",
    image: null,
    imagePreview: null,
  });

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

  // Mock donor data with all required fields
  useEffect(() => {
    const loadDonorData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockDonor = {
        id: "DON123456",
        name: "Rajesh Kumar",
        gender: "Male",
        bloodGroup: "O+",
        dob: "1995-05-15",
        weight: "",
        platelet: "",
        donationCount: 7,
        taluk: "Bangalore North",
        district: "Bangalore",
        mobile: "9876543210",
        whatsapp: "9876543210",
        email: "rajesh.kumar@example.com",
        location: "Bangalore, Karnataka",
        lastDonation: "2024-02-15",
        nextEligibleDate: "2024-04-10",
        donorLevel: "Platinum",
        points: 1750,
        healthStatus: "Not Added",
        isVerified: true,
        registrationDate: "2022-06-10",
        emergencyContact: "9123456789",
        preferredCenters: ["City Blood Bank", "General Hospital"],
        medicalConditions: "Not Specified",
        allergies: "Not Specified",
        lastHealthCheck: "Not Available",
      };

      const mockCertificates = [
        {
          id: "CERT001",
          title: "First Blood Donation",
          date: "2022-06-15",
          donationType: "Whole Blood",
          center: "City Blood Bank",
          certificateId: "BDB20220615001",
          downloadable: true,
          shareable: true,
          qrCode:
            "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT001",
        },
        {
          id: "CERT002",
          title: "5th Donation Milestone",
          date: "2023-08-20",
          donationType: "Whole Blood",
          center: "General Hospital",
          certificateId: "BDB20230820005",
          downloadable: true,
          shareable: true,
          qrCode:
            "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT002",
        },
      ];

      // Load uploaded donations from localStorage (simulating backend)
      const savedDonations = localStorage.getItem(`donations_${mockDonor.id}`);
      if (savedDonations) {
        setUploadedDonations(JSON.parse(savedDonations));
      } else {
        // Mock pending donations with different statuses
        const mockDonations = [
          {
            id: "DON1700000000001",
            donationDate: "2024-03-15",
            donationCenter: "City Blood Bank",
            bloodGroup: "O+",
            units: "1",
            image: "https://via.placeholder.com/150",
            uploadDate: "2024-03-15T10:30:00.000Z",
            status: "pending",
            statusText: "Pending Verification",
            adminRemarks: "",
          },
          {
            id: "DON1700000000002",
            donationDate: "2024-03-10",
            donationCenter: "General Hospital",
            bloodGroup: "O+",
            units: "1",
            image: "https://via.placeholder.com/150",
            uploadDate: "2024-03-10T14:20:00.000Z",
            status: "verified",
            statusText: "Verified",
            adminRemarks: "Approved by Dr. Sharma",
            verifiedDate: "2024-03-11T09:15:00.000Z",
          },
          {
            id: "DON1700000000003",
            donationDate: "2024-03-05",
            donationCenter: "Emergency Blood Bank",
            bloodGroup: "O+",
            units: "1",
            image: "https://via.placeholder.com/150",
            uploadDate: "2024-03-05T11:45:00.000Z",
            status: "rejected",
            statusText: "Rejected",
            adminRemarks: "Image not clear, please upload a clearer photo",
            rejectedDate: "2024-03-06T15:30:00.000Z",
          },
        ];
        setUploadedDonations(mockDonations);
        localStorage.setItem(
          `donations_${mockDonor.id}`,
          JSON.stringify(mockDonations),
        );
      }

      setDonorData(mockDonor);
      setCertificates(mockCertificates);
      setIsLoading(false);
    };

    loadDonorData();
  }, []);

  const getFilteredDonations = () => {
    if (filterStatus === "all") {
      return uploadedDonations;
    }

    return uploadedDonations.filter(
      (donation) => donation.status === filterStatus,
    );
  };

  const donationHistory = [
    {
      date: "2024-02-15",
      type: "Whole Blood",
      center: "Emergency Blood Bank",
      status: "Completed",
    },
    {
      date: "2023-12-10",
      type: "Whole Blood",
      center: "General Hospital",
      status: "Completed",
    },
    {
      date: "2023-08-20",
      type: "Whole Blood",
      center: "General Hospital",
      status: "Completed",
    },
    {
      date: "2023-05-05",
      type: "Whole Blood",
      center: "City Blood Bank",
      status: "Completed",
    },
    {
      date: "2023-01-15",
      type: "Whole Blood",
      center: "City Blood Bank",
      status: "Completed",
    },
    {
      date: "2022-09-20",
      type: "Whole Blood",
      center: "City Blood Bank",
      status: "Completed",
    },
    {
      date: "2022-06-15",
      type: "Whole Blood",
      center: "City Blood Bank",
      status: "Completed",
    },
  ];

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const previewUrl = URL.createObjectURL(file);

    setUploadForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      setIsUploading(true);
      const response = await axios.put(
        "http://localhost:5000/doner/profile-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      profileDetails();
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");

      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadDonation = async () => {
    // ✅ Validation
    if (
      !uploadForm.donationDate ||
      !uploadForm.donationCenter ||
      !uploadForm.image
    ) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again!");
      return;
    }

    try {
      // ✅ Show Loading Toast
      const toastId = toast.loading("Uploading donation proof...");

      // ✅ Create FormData (Important for Image Upload)
      const formData = new FormData();

      formData.append("donationDate", uploadForm.donationDate);
      formData.append("donationCenter", uploadForm.donationCenter);
      formData.append(
        "bloodGroup",
        uploadForm.bloodGroup || donorData?.bloodGroup,
      );
      formData.append("units", uploadForm.units);

      // ✅ Append Image File
      formData.append("image", uploadForm.image);

      // ✅ API Call to Backend
      const response = await axios.post(
        "http://localhost:5000/doner/upload-proof",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload Response:", response.data);

      // ✅ Backend returns saved proof
      const savedDonation = response.data.proof;

      // ✅ Update UI State (No localStorage)
      setUploadedDonations((prev) => [savedDonation, ...prev]);

      // ✅ Success Toast
      toast.success("Donation proof uploaded successfully!", {
        id: toastId,
        duration: 4000,
      });

      // ✅ Reset Form
      setUploadForm({
        donationDate: "",
        donationCenter: "",
        bloodGroup: "",
        units: "1",
        image: null,
        imagePreview: null,
      });

      // ✅ Close Modal
      setShowDonationUpload(false);
    } catch (error) {
      console.error("Donation Upload Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to upload donation proof",
      );
    }
  };

  const handleDeleteUpload = (donationId) => {
    const updatedDonations = uploadedDonations.filter(
      (d) => d.id !== donationId,
    );
    setUploadedDonations(updatedDonations);
    localStorage.setItem(
      `donations_${donorData.id}`,
      JSON.stringify(updatedDonations),
    );
    toast.success("Upload removed successfully");
  };

  const handleDownloadCertificate = (certificate) => {
    toast.success("Certificate download started", { duration: 3000 });
  };

  const handleShareCertificate = (certificate) => {
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: `Check out my blood donation certificate: ${certificate.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${certificate.title} - ${window.location.href}`,
      );
      toast.success("Certificate link copied to clipboard!", {
        duration: 3000,
      });
    }
  };

  const handleGenerateCertificate = () => {
    const newCertificate = {
      id: `CERT00${certificates.length + 1}`,
      title: "Recent Donation Certificate",
      date: new Date().toISOString().split("T")[0],
      donationType: "Whole Blood",
      center: "City Blood Bank",
      certificateId: `BDB${Date.now().toString().slice(-9)}`,
      downloadable: true,
      shareable: true,
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NEW-CERT",
    };

    setCertificates([newCertificate, ...certificates]);
    setSelectedCertificate(newCertificate);
    setShowCertificateModal(true);
    toast.success("New certificate generated successfully!", {
      duration: 3000,
    });
  };

  const profileDetails = async () => {
    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, please login again");
        return;
      }

      // ✅ API Call with Authorization Header
      const response = await axios.get(
        "http://localhost:5000/doner/profile-details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Profile Data:", response.data);

      // ✅ Extract donor + health details
      const { donor, health } = response.data;

      // ✅ Set state (example)
      setUser(donor);
      setHealth(health);
    } catch (error) {
      console.log(
        "Error fetching profile:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    profileDetails();
  }, []);

  const handleAddHealthStatus = async (healthData) => {
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Updating health status...");
    try {
      const response = await axios.post(
        "http://localhost:5000/doner/healthStatus",
        healthData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDonorData((prev) => ({
        ...prev,
        ...response.data.donor,
        healthStatus: "Good",
      }));
      setShowHealthForm(false);
      toast.success("Health status updated successfully!", {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      console.error("Health status update error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update health status";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleResetPassword = () => {
    const toastId = toast.loading("Sending password reset email...");
    setTimeout(() => {
      toast.success("Password reset link sent to your email!", { id: toastId });
    }, 1500);
  };

  const handleSaveProfile = async (updatedData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again!");
      return;
    }

    // ✅ Email match validation
    if (updatedData.email !== updatedData.reEmail) {
      toast.error("Emails do not match!");
      return;
    }

    try {
      const toastId = toast.loading("Updating profile...");

      // ✅ API Call to Backend
      const response = await axios.put(
        "http://localhost:5000/doner/update-profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Profile Updated Successfully!", {
        id: toastId,
        duration: 3000,
      });

      console.log("Updated Profile:", response.data);

      // ✅ Update frontend user state
      setUser(response.data.donor);

      // ✅ Close Edit Modal
      setShowEditProfile(false);

      // ✅ Refresh profile details (optional)
      profileDetails();
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(error.response?.data?.message || "Failed to update profile", {
        duration: 3000,
      });
    }
  };

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
    if (!selectedCertificate || !showCertificateModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 animate-slideUp">
          <div className="bg-gradient-to-r from-pink-600 to-red-600 p-4 sm:p-6 text-white rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {selectedCertificate.title}
                </h3>
                <p className="text-pink-100 text-xs sm:text-sm mt-1">
                  ID: {selectedCertificate.certificateId}
                </p>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-white hover:text-gray-200 text-2xl p-2"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="border-4 border-pink-200 rounded-2xl p-5 sm:p-8 text-center">
              <FaAward className="text-4xl sm:text-6xl text-pink-500 mx-auto mb-4" />
              <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                Certificate of Appreciation
              </h4>
              <p className="text-lg sm:text-xl text-gray-600 mb-5">
                Presented to{" "}
                <span className="font-bold text-pink-600">
                  {donorData?.name}
                </span>
              </p>

              <div className="mb-5">
                <p className="text-sm sm:text-base text-gray-700 mb-2">
                  For their noble contribution of blood donation on
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {new Date(selectedCertificate.date).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  at{" "}
                  <span className="font-semibold">
                    {selectedCertificate.center}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-5">
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-pink-600">
                    {donorData?.bloodGroup}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Blood Group
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-pink-600">
                    {donorData?.donationCount}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Donations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-pink-600">
                    {donorData?.points}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Points</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-5 pt-5 border-t border-gray-200">
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-sm sm:text-base">
                    Dr. Priya Sharma
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Medical Director
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800 text-sm sm:text-base">
                    Date
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
              <button
                onClick={() => handleDownloadCertificate(selectedCertificate)}
                className="bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm"
              >
                <FaDownload className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">DL</span>
              </button>
              <button
                onClick={() => handleShareCertificate(selectedCertificate)}
                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-2.5 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm"
              >
                <FaShareAlt className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </button>
              <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm">
                <FaPrint className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Print</span>
                <span className="sm:hidden">Print</span>
              </button>
            </div>
          </div>
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

  if (!donorData) {
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
      <div className="donor-profile-wrapper bg-gradient-to-b from-white to-pink-50 md:-mt-[430px] -mt-[650px] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-pink-500/10 overflow-hidden">
        {/* Profile Header - Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-4">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Avatar Container */}
                <div
                  className="relative mb-3 sm:mb-0 group cursor-pointer"
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  {/* Main Circle */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg ring-4 ring-white overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
                    {isUploading ? (
                      // Show Spinner while uploading
                      <FaSpinner className="animate-spin text-3xl" />
                    ) : user?.profilePic ? (
                      // Show Uploaded Image
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Show Initial Name Letter
                      user?.name?.charAt(0) || "U"
                    )}

                    {/* Hover Overlay (Camera Icon) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                      <FaCamera className="text-white text-xl" />
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {user?.isVerified && (
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-sm z-10">
                      <FaUserCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>

                <div className="sm:ml-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {user.name}
                    </h2>
                    <span className="inline-flex px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
                      {user?.level}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    ID: {user?._id?.slice(0, 8)}{" "}
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

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-pink-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-pink-600">
                    {user.donationCount}
                  </div>
                  <div className="text-xs text-gray-600">Donations</div>
                </div>
                <div className="bg-red-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-600">
                    {user.donationCount * 250}
                  </div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    {user.bloodGroup}
                  </div>
                  <div className="text-xs text-gray-600">Blood</div>
                </div>
              </div>

              {/* Health Status Card */}
              <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center w-full sm:w-auto">
                    <FaHeartbeat className="text-pink-600 text-lg mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">
                        Health Status
                      </div>
                      <div className="text-xs text-gray-600">
                        {!health ? (
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

              {/* Contact Info - Truncated for mobile */}
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <FaPhone className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user?.mobile}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaWhatsapp className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {user.whatsapp || user.mobile}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user.taluk}</span>
                </div>
              </div>

              {/* Edit Profile Button */}
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
            {/* Navigation Tabs - Scrollable without overflow */}
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

            {/* Tab Content - No overflow */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Next Donation Info */}
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
                          {new Date(
                            donorData.nextEligibleDate,
                          ).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                          {Math.ceil(
                            (new Date(donorData.nextEligibleDate) -
                              new Date()) /
                              (1000 * 60 * 60 * 24),
                          )}
                          d
                        </div>
                        <div className="text-xs text-gray-600">remaining</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
                          style={{ width: "65%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleGenerateCertificate}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 p-3 rounded-xl font-bold flex flex-col items-center text-sm"
                      >
                        <FaCertificate className="text-xl mb-1" />
                        Generate
                      </button>
                      <button
                        onClick={() => setShowDonationUpload(true)}
                        className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 p-3 rounded-xl font-bold flex flex-col items-center text-sm"
                      >
                        <FaUpload className="text-xl mb-1" />
                        Upload Proof
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Camps */}
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
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Donation History
                    </h3>

                    {/* Filter Button for Mobile */}
                    <div className="relative w-full sm:w-auto">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                      >
                        <FaFilter className="mr-2" />
                        {filterStatus === "all"
                          ? "All"
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
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            All
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("pending");
                              setShowFilterMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("verified");
                              setShowFilterMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Verified
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus("rejected");
                              setShowFilterMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm block"
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verified Donations (Regular History) */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      Verified Donations
                    </h4>
                    <div className="space-y-2">
                      {donationHistory.map((donation, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <FaCheckCircle className="text-green-600 text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-gray-800 text-sm">
                                  {new Date(donation.date).toLocaleDateString(
                                    "en-US",
                                    { day: "numeric", month: "short" },
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {donation.center
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                </span>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                {donation.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Uploaded Donations with Status */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <FaUpload className="text-pink-600 mr-2" />
                      Uploaded Donations
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
                            key={donation.id}
                            className="border border-gray-200 rounded-xl p-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                              {/* Image Thumbnail */}
                              <div
                                className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 mx-auto sm:mx-0"
                                onClick={() => {
                                  setSelectedImage(donation.image);
                                  setShowImagePreview(true);
                                }}
                              >
                                <img
                                  src={donation.image}
                                  alt="Donation"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Donation Details */}
                              <div className="flex-1 min-w-0 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 gap-2">
                                  <span className="font-medium text-gray-800 text-sm">
                                    {new Date(
                                      donation.donationDate,
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>

                                  {/* Status Badge */}
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
                                  {donation.bloodGroup || donorData.bloodGroup}{" "}
                                  • {donation.units} Unit
                                </p>

                                {/* Admin Remarks */}
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

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <button
                                    onClick={() => {
                                      setSelectedImage(donation.image);
                                      setShowImagePreview(true);
                                    }}
                                    className="text-pink-600 hover:text-pink-700 text-xs font-medium flex items-center"
                                  >
                                    <FaEye className="mr-1" /> View
                                  </button>
                                  {donation.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        handleDeleteUpload(donation.id)
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
                                        handleDeleteUpload(donation.id);
                                      }}
                                      className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center"
                                    >
                                      <FaUpload className="mr-1" /> Re-upload
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowDonationUpload(true)}
                      className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center text-sm"
                    >
                      <FaUpload className="mr-2" />
                      Upload New Donation Proof
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "certificates" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Certificates
                    </h3>
                    <button
                      onClick={handleGenerateCertificate}
                      className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center w-full sm:w-auto justify-center"
                    >
                      <FaCertificate className="mr-2" />
                      <span className="hidden sm:inline">Generate New</span>
                      <span className="sm:hidden">New</span>
                    </button>
                  </div>

                  {certificates.length === 0 ? (
                    <div className="text-center py-8">
                      <FaCertificate className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        No certificates yet
                      </p>
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
                              View
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
                        unlocked: true,
                      },
                      {
                        title: "5 Donations",
                        icon: <FaMedal />,
                        unlocked: true,
                      },
                      {
                        title: "Emergency Hero",
                        icon: <FaHandHoldingHeart />,
                        unlocked: true,
                      },
                      {
                        title: "Platinum Donor",
                        icon: <FaAward />,
                        unlocked: true,
                      },
                      {
                        title: "10 Donations",
                        icon: <FaMedal />,
                        unlocked: false,
                        progress: "7/10",
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
                      className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      Reset Password
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-800 mb-1 text-sm">
                      Danger Zone
                    </h4>
                    <p className="text-red-700 text-xs mb-3">
                      Once you delete your account, there is no going back.
                    </p>
                    <button className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-xs">
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
