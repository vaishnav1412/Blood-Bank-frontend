import { useState, useEffect } from "react";
import { 
  FaUser,
  FaTint,
  FaHistory,
  FaAward,
  FaCertificate,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeartbeat,
  FaShieldAlt,
  FaDownload,
  FaShareAlt,
  FaEdit,
  FaQrcode,
  FaBell,
  FaChartLine,
  FaMedal,
  FaStar,
  FaFilePdf,
  FaSpinner,
  FaPrint,
  FaClipboardCheck,
  FaCheckCircle,
  FaUserFriends,
  FaCog,
  FaUserCheck,
  FaIdCard,
  FaHandHoldingHeart
} from "react-icons/fa";
import "./donerProfile.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const DonorProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [donorData, setDonorData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock donor data
  useEffect(() => {
    const loadDonorData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDonor = {
        id: "DON123456",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91 98765 43210",
        bloodGroup: "O+",
        age: 28,
        gender: "Male",
        weight: "72 kg",
        height: "175 cm",
        location: "Bangalore, Karnataka",
        lastDonation: "2024-02-15",
        nextEligibleDate: "2024-04-10",
        totalDonations: 7,
        lifeSavers: 21, // 7 donations * 3 lives each
        donorLevel: "Platinum",
        levelIcon: <FaMedal className="text-yellow-500" />,
        points: 1750,
        healthStatus: "Excellent",
        isVerified: true,
        registrationDate: "2022-06-10",
        emergencyContact: "+91 91234 56789",
        preferredCenters: ["City Blood Bank", "General Hospital"],
        medicalConditions: "None",
        allergies: "None",
        lastHealthCheck: "2024-01-20"
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
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT001"
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
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT002"
        },
        {
          id: "CERT003",
          title: "Platinum Donor Award",
          date: "2024-01-10",
          donationType: "Award",
          center: "Blood Donation Society",
          certificateId: "PLA20240110001",
          downloadable: true,
          shareable: true,
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT003"
        },
        {
          id: "CERT004",
          title: "Emergency Donor",
          date: "2024-02-15",
          donationType: "Emergency Response",
          center: "Emergency Blood Bank",
          certificateId: "EMG20240215001",
          downloadable: true,
          shareable: true,
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DON123456-CERT004"
        }
      ];

      setDonorData(mockDonor);
      setCertificates(mockCertificates);
      setIsLoading(false);
    };

    loadDonorData();
  }, []);

  const donationHistory = [
    { date: "2024-02-15", type: "Whole Blood", center: "Emergency Blood Bank", status: "Completed" },
    { date: "2023-12-10", type: "Whole Blood", center: "General Hospital", status: "Completed" },
    { date: "2023-08-20", type: "Whole Blood", center: "General Hospital", status: "Completed" },
    { date: "2023-05-05", type: "Whole Blood", center: "City Blood Bank", status: "Completed" },
    { date: "2023-01-15", type: "Whole Blood", center: "City Blood Bank", status: "Completed" },
    { date: "2022-09-20", type: "Whole Blood", center: "City Blood Bank", status: "Completed" },
    { date: "2022-06-15", type: "Whole Blood", center: "City Blood Bank", status: "Completed" }
  ];

  const upcomingCamps = [
    { date: "2024-04-05", name: "World Health Day Camp", location: "City Center", time: "9 AM - 5 PM" },
    { date: "2024-04-14", name: "World Blood Donor Day Prep", location: "Town Hall", time: "10 AM - 6 PM" },
    { date: "2024-04-20", name: "Corporate Blood Drive", location: "Tech Park", time: "8 AM - 4 PM" }
  ];

  const handleDownloadCertificate = (certificate) => {
    console.log("Downloading certificate:", certificate.id);
    // In real app, this would download a PDF
    alert(`Downloading certificate: ${certificate.title}`);
  };

  const handleShareCertificate = (certificate) => {
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: `Check out my blood donation certificate: ${certificate.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${certificate.title} - ${window.location.href}`);
      alert("Certificate link copied to clipboard!");
    }
  };

  const handleGenerateCertificate = () => {
    // Generate new certificate for recent donation
    const newCertificate = {
      id: `CERT00${certificates.length + 1}`,
      title: "Recent Donation Certificate",
      date: new Date().toISOString().split('T')[0],
      donationType: "Whole Blood",
      center: "City Blood Bank",
      certificateId: `BDB${Date.now().toString().slice(-9)}`,
      downloadable: true,
      shareable: true,
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NEW-CERT"
    };
    
    setCertificates([newCertificate, ...certificates]);
    setSelectedCertificate(newCertificate);
    setShowCertificateModal(true);
    alert("New certificate generated for your recent donation!");
  };

  const CertificateModal = () => {
    if (!selectedCertificate || !showCertificateModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-pink-600 to-red-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{selectedCertificate.title}</h3>
                <p className="text-pink-100">Certificate ID: {selectedCertificate.certificateId}</p>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="p-8">
            <div className="border-4 border-pink-200 rounded-2xl p-8 text-center">
              <div className="mb-8">
                <FaAward className="text-6xl text-pink-500 mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-gray-800 mb-2">
                  Certificate of Appreciation
                </h4>
                <p className="text-xl text-gray-600 mb-6">
                  Presented to <span className="font-bold text-pink-600">{donorData?.name}</span>
                </p>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-2">
                  For their noble contribution of blood donation on
                </p>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {new Date(selectedCertificate.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-600">
                  at <span className="font-semibold">{selectedCertificate.center}</span>
                </p>
              </div>

              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{donorData?.bloodGroup}</div>
                  <div className="text-gray-600">Blood Group</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{donorData?.totalDonations}</div>
                  <div className="text-gray-600">Total Donations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{donorData?.lifeSavers}</div>
                  <div className="text-gray-600">Lives Saved</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-8">
                <img 
                  src={selectedCertificate.qrCode} 
                  alt="QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Scan to verify certificate authenticity
                </p>
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="font-bold text-gray-800">Dr. Priya Sharma</div>
                  <div className="text-gray-600">Medical Director</div>
                  <div className="text-sm text-gray-500">Blood Donation Network</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">Date</div>
                  <div className="text-gray-600">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Issued On</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handleDownloadCertificate(selectedCertificate)}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center"
              >
                <FaDownload className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => handleShareCertificate(selectedCertificate)}
                className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-xl font-bold flex items-center justify-center"
              >
                <FaShareAlt className="mr-2" />
                Share Certificate
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold flex items-center justify-center">
                <FaPrint className="mr-2" />
                Print
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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-pink-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading donor profile...</p>
          </div>
        </div>
      </WrapperSection>
    );
  }

  if (!donorData) {
    return (
      <WrapperSection>
        <div className="text-center py-12">
          <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h3>
          <p className="text-gray-600">Please log in to view your donor profile.</p>
        </div>
      </WrapperSection>
    );
  }

  return (
    <WrapperSection>
      <div className="donor-profile-wrapper bg-gradient-to-b from-white to-pink-50 md:-mt-80 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-pink-500/10">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left Column - Profile Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              {/* Profile Header */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {donorData.name.charAt(0)}
                  </div>
                  {donorData.isVerified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <FaUserCheck className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{donorData.name}</h2>
                    <span className="ml-3 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      {donorData.donorLevel} Donor
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Donor ID: {donorData.id}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <FaUserFriends className="mr-1" />
                    Member since {new Date(donorData.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">{donorData.totalDonations}</div>
                  <div className="text-sm text-gray-600">Donations</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{donorData.lifeSavers}</div>
                  <div className="text-sm text-gray-600">Lives Saved</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{donorData.points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>

              {/* Blood Group Badge */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaTint className="text-red-500 text-xl mr-3" />
                    <div>
                      <div className="font-bold text-gray-800">Blood Group</div>
                      <div className="text-3xl font-bold text-red-600">{donorData.bloodGroup}</div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${donorData.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {donorData.healthStatus}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-3 text-gray-400" />
                  {donorData.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-3 text-gray-400" />
                  {donorData.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-3 text-gray-400" />
                  {donorData.location}
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setShowEditProfile(true)}
                className="w-full mt-6 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-xl font-bold flex items-center justify-center"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Health Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaHeartbeat className="mr-3 text-pink-600" />
                Health Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-bold">{donorData.weight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Height</span>
                  <span className="font-bold">{donorData.height}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Health Check</span>
                  <span className="font-bold">{donorData.lastHealthCheck}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Conditions</span>
                  <span className="font-bold text-green-600">{donorData.medicalConditions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Allergies</span>
                  <span className="font-bold text-green-600">{donorData.allergies}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
              {[
                { id: "overview", label: "Overview", icon: <FaUser /> },
                { id: "certificates", label: "Certificates", icon: <FaCertificate /> },
                { id: "history", label: "Donation History", icon: <FaHistory /> },
                { id: "achievements", label: "Achievements", icon: <FaAward /> },
                { id: "settings", label: "Settings", icon: <FaCog /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id 
                    ? "text-pink-600 border-b-2 border-pink-600" 
                    : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-h-[500px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Next Donation Info */}
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Next Donation</h3>
                        <p className="text-gray-600">
                          You're eligible to donate again from
                        </p>
                        <p className="text-2xl font-bold text-pink-600 mt-2">
                          {new Date(donorData.nextEligibleDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">
                          {Math.ceil((new Date(donorData.nextEligibleDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </div>
                        <div className="text-gray-600">remaining</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
                          style={{ width: '65%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Camps */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaCalendarAlt className="mr-3 text-pink-600" />
                      Upcoming Blood Donation Camps
                    </h3>
                    <div className="space-y-3">
                      {upcomingCamps.map((camp, index) => (
                        <div key={index} className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                            <FaCalendarAlt className="text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{camp.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <FaMapMarkerAlt className="mr-1" />
                              {camp.location} • {camp.time}
                            </div>
                          </div>
                          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium">
                            Register
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 p-4 rounded-xl font-bold flex flex-col items-center">
                        <FaQrcode className="text-2xl mb-2" />
                        Donor ID Card
                      </button>
                      <button 
                        onClick={handleGenerateCertificate}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 p-4 rounded-xl font-bold flex flex-col items-center"
                      >
                        <FaCertificate className="text-2xl mb-2" />
                        Generate Certificate
                      </button>
                      <button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 p-4 rounded-xl font-bold flex flex-col items-center">
                        <FaChartLine className="text-2xl mb-2" />
                        View Statistics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "certificates" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">My Certificates</h3>
                    <button
                      onClick={handleGenerateCertificate}
                      className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-3 rounded-xl font-bold flex items-center"
                    >
                      <FaCertificate className="mr-2" />
                      Generate New Certificate
                    </button>
                  </div>

                  {certificates.length === 0 ? (
                    <div className="text-center py-12">
                      <FaCertificate className="text-6xl text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-800 mb-2">No Certificates Yet</h4>
                      <p className="text-gray-600 mb-6">
                        Complete your first blood donation to earn certificates!
                      </p>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold">
                        Find Donation Camp
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certificates.map(certificate => (
                        <div key={certificate.id} className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">{certificate.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{certificate.certificateId}</p>
                            </div>
                            <FaAward className="text-pink-500 text-2xl" />
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <FaCalendarAlt className="mr-2" />
                              {new Date(certificate.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaMapMarkerAlt className="mr-2" />
                              {certificate.center}
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setSelectedCertificate(certificate);
                                setShowCertificateModal(true);
                              }}
                              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDownloadCertificate(certificate)}
                              className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 rounded-lg font-medium"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleShareCertificate(certificate)}
                              className="px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg"
                            >
                              <FaShareAlt />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Donation History</h3>
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-bold text-pink-600">{donationHistory.length} donations</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-gray-600 font-semibold">Date</th>
                          <th className="text-left py-3 text-gray-600 font-semibold">Type</th>
                          <th className="text-left py-3 text-gray-600 font-semibold">Center</th>
                          <th className="text-left py-3 text-gray-600 font-semibold">Status</th>
                          <th className="text-left py-3 text-gray-600 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donationHistory.map((donation, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4">
                              <div className="font-medium">{new Date(donation.date).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(donation.date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center">
                                <FaTint className="text-red-500 mr-2" />
                                {donation.type}
                              </div>
                            </td>
                            <td className="py-4">{donation.center}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {donation.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Stats Summary */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-pink-600">{donationHistory.length}</div>
                      <div className="text-sm text-gray-600">Total Donations</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {donationHistory.filter(d => d.type === "Whole Blood").length}
                      </div>
                      <div className="text-sm text-gray-600">Whole Blood</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {new Date(donationHistory[0].date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-sm text-gray-600">Last Donation</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {donationHistory.length * 3}
                      </div>
                      <div className="text-sm text-gray-600">Lives Impacted</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievements & Badges</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[
                      { title: "First Donation", icon: <FaStar />, unlocked: true, date: "2022-06-15" },
                      { title: "5 Donations", icon: <FaMedal />, unlocked: true, date: "2023-08-20" },
                      { title: "Emergency Hero", icon: <FaHandHoldingHeart />, unlocked: true, date: "2024-02-15" },
                      { title: "Platinum Donor", icon: <FaAward />, unlocked: true, date: "2024-01-10" },
                      { title: "10 Donations", icon: <FaMedal />, unlocked: false, progress: "7/10" },
                      { title: "Birthday Donor", icon: <FaStar />, unlocked: false },
                      { title: "Campaign Leader", icon: <FaUserFriends />, unlocked: false },
                      { title: "Year Round Hero", icon: <FaCalendarAlt />, unlocked: false },
                      { title: "Life Saver", icon: <FaHeartbeat />, unlocked: true, date: "2023-12-10" },
                    ].map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`rounded-xl p-6 text-center transition-all ${achievement.unlocked 
                          ? 'bg-gradient-to-br from-pink-50 to-white border border-pink-200 shadow-sm' 
                          : 'bg-gray-50 border border-gray-200 opacity-60'}`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${achievement.unlocked 
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white' 
                          : 'bg-gray-300 text-gray-500'}`}>
                          <div className="text-2xl">{achievement.icon}</div>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">{achievement.title}</h4>
                        {achievement.unlocked ? (
                          <div className="text-sm text-green-600 flex items-center justify-center">
                            <FaCheckCircle className="mr-1" /> Unlocked
                            {achievement.date && (
                              <span className="text-gray-500 ml-2">
                                {new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {achievement.progress || "Locked"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FaBell className="mr-3 text-pink-600" />
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Email notifications for donation camps</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>SMS reminders for eligibility</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span>Promotional emails</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FaShieldAlt className="mr-3 text-pink-600" />
                        Privacy Settings
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Show in public donor directory</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span>Allow hospitals to contact me directly</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FaIdCard className="mr-3 text-pink-600" />
                        Donor ID Card
                      </h4>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold">
                        Download Digital ID Card
                      </button>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h4 className="font-bold text-red-800 mb-2">Danger Zone</h4>
                      <p className="text-red-700 text-sm mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-bold">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        <CertificateModal />

        {/* Edit Profile Modal (Simplified) */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={donorData.name}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={donorData.phone}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      defaultValue={donorData.emergencyContact}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    defaultValue={donorData.location}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WrapperSection>
  );
};

export default DonorProfile;