import { useState, useEffect } from "react";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import PropTypes from "prop-types";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaUser, FaTint, FaCalendarAlt, FaClock, FaExclamationTriangle, FaWhatsapp } from "react-icons/fa";
import "./search-blood-stock.scss";
import { districtsData, bloodGroups, whatsappGroups } from "../../../data/content/need-blood";
import { searchDonors } from "../../../services/donorServices";

const SearchBloodStockComponent = ({
  subheadingText,
  headingText,
  classHint,
}) => {
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgentNeed, setUrgentNeed] = useState(false);
  const [allDonors, setAllDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [error, setError] = useState(null);
  
  // Emergency modal state
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isSendingEmergency, setIsSendingEmergency] = useState(false);
  const [emergencySuccess, setEmergencySuccess] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    bloodGroup: '',
    units: '1',
    hospital: '',
    location: '',
    contactNumber: '',
    contactPerson: '',
    relationship: '',
    urgencyReason: '',
    additionalInfo: ''
  });

  // Fetch all donors on initial load
  useEffect(() => {
    const fetchAllDonors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchDonors(); 
        // Assuming backend returns { donors: [...] }
        const donors = data.donors || data || []; 
        setAllDonors(donors);
        setFilteredDonors(donors);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setError("Failed to load donors. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDonors();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowNoResults(false);
    setError(null);

    try {
      // Build filter object only with selected values
      const filters = {};
      if (district) filters.district = district;
      if (taluk) filters.taluk = taluk;
      if (bloodGroup) filters.bloodGroup = bloodGroup;
      if (urgentNeed) filters.readyToDonate = true;

      // Call backend API with filters
      const data = await searchDonors(filters);
      const donors = data.donors || data || [];

      setFilteredDonors(donors);
      setShowNoResults(donors.length === 0);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
      setFilteredDonors([]);
      setShowNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setDistrict("");
    setTaluk("");
    setBloodGroup("");
    setUrgentNeed(false);
    setShowNoResults(false);
    setError(null);

    // Optimistically reset to cached donors for instant UI response
    setFilteredDonors(allDonors);

    // Optional: Fetch fresh data in background
    setIsLoading(true);
    try {
      const data = await searchDonors();
      const donors = data.donors || data || [];
      setAllDonors(donors);
      setFilteredDonors(donors);
    } catch (error) {
      console.log("Reset fetch failed, showing cached data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format emergency message for WhatsApp
  const formatWhatsAppMessage = () => {
    const message = `
🚨 *URGENT BLOOD REQUIREMENT* 🚨

*Patient Details:*
• Name: ${emergencyForm.patientName}
• Blood Group: ${emergencyForm.bloodGroup}
• Units Needed: ${emergencyForm.units}
• Hospital: ${emergencyForm.hospital}
• Location: ${emergencyForm.location}

*Contact Information:*
• Requester: ${emergencyForm.contactPerson}
• Relationship: ${emergencyForm.relationship}
• Contact: ${emergencyForm.contactNumber}

*Reason:*
 ${emergencyForm.urgencyReason}

 ${emergencyForm.additionalInfo ? `*Additional Info:*\n${emergencyForm.additionalInfo}` : ''}

⏰ *Time Sensitive* - Please respond ASAP if you can donate or share with potential donors.

📍 *Location Shared* - Click to view: https://maps.google.com/?q=${emergencyForm.location}

*Please forward to all blood donor groups.*
🙏 Every share can save a life!
    `;
    
    return encodeURIComponent(message.trim());
  };

  // Send to specific donor via WhatsApp
  const sendToDonorWhatsApp = (donorWhatsapp, donorName) => {
    const message = `
🆘 *EMERGENCY BLOOD REQUEST* 🆘

Hello ${donorName},

We have an urgent requirement for blood. Details below:

*Patient:* ${emergencyForm.patientName}
*Blood Group:* ${emergencyForm.bloodGroup}
*Units:* ${emergencyForm.units}
*Hospital:* ${emergencyForm.hospital}
*Location:* ${emergencyForm.location}
*Contact:* ${emergencyForm.contactNumber}

Can you please help? Your timely response could save a life.

📍 Location: https://maps.google.com/?q=${emergencyForm.location}
    `;
    
    const whatsappUrl = `https://wa.me/${donorWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Send to multiple WhatsApp groups
  const sendToAllWhatsAppGroups = () => {
    const message = formatWhatsAppMessage();
    
    whatsappGroups.forEach(group => {
      if (group.active) {
        const whatsappUrl = `${group.groupLink}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      }
    });
  };

  // Submit emergency request
  const submitEmergencyRequest = async (e) => {
    e.preventDefault();
    setIsSendingEmergency(true);

    try {
      // Simulate API call to log emergency
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find matching donors for this blood group from the loaded list
      const matchingDonors = allDonors.filter(donor => 
        donor.bloodGroup === emergencyForm.bloodGroup && 
        donor.readyToDonate
      );

      console.log('Emergency Request:', {
        ...emergencyForm,
        matchingDonorsFound: matchingDonors.length,
        timestamp: new Date().toISOString()
      });

      setEmergencySuccess(true);

      // Automatically open WhatsApp groups after success
      setTimeout(() => {
        sendToAllWhatsAppGroups();
        
        // Also open individual chats with matching donors (optional)
        matchingDonors.slice(0, 3).forEach(donor => {
          const waNumber = donor.whatsapp || donor.phone || donor.contact;
          if(waNumber) sendToDonorWhatsApp(waNumber, donor.name);
        });
      }, 2000);

    } catch (error) {
      console.error('Emergency request failed:', error);
      alert('Failed to process request. Please try again or call 108 immediately.');
    } finally {
      setIsSendingEmergency(false);
    }
  };

  const handleEmergencyRequest = () => {
    setShowEmergencyModal(true);
    setEmergencySuccess(false);
    setEmergencyForm({
      patientName: '',
      bloodGroup: '',
      units: '1',
      hospital: '',
      location: '',
      contactNumber: '',
      contactPerson: '',
      relationship: '',
      urgencyReason: '',
      additionalInfo: ''
    });
  };

  // Helper to get donor ID safely
  const getDonorId = (donor) => donor._id || donor.id;

  return (
    <WrapperSection>
      <div className={`${classHint} search-wrapper md:-mt-[480px] -mt-[680px] bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 w-full relative p-4 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-pink-100`}>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <GroupedHeadingComponent
            subheadingText={subheadingText}
            headingText={headingText}
            mode="dark"
            position="center"
          />
          
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Find life-saving blood donors near you. Our network connects blood seekers with verified donors in real-time.
          </p>
        </div>

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">{allDonors.length}+</div>
            <div className="text-sm text-gray-600">Verified Donors</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">50+</div>
            <div className="text-sm text-gray-600">Hospitals</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">24/7</div>
            <div className="text-sm text-gray-600">Emergency Support</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">{whatsappGroups.length}+</div>
            <div className="text-sm text-gray-600">WhatsApp Groups</div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
              <FaSearch className="inline mr-3 text-pink-600" />
              Search Blood Donors
            </h3>
            
            <button
              onClick={handleEmergencyRequest}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <FaExclamationTriangle className="mr-2" />
              Emergency Request
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District Select */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-pink-500" />
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setTaluk("");
                  }}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="">All Districts</option>
                  {districtsData.map((dist) => (
                    <option key={dist.id} value={dist.name}>{dist.name}</option>
                  ))}
                </select>
              </div>

              {/* Taluk Select */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-pink-500" />
                  Taluk/Area
                </label>
                <select
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  disabled={!district}
                >
                  <option value="">All Taluks</option>
                  {district && districtsData
                    .find(d => d.name === district)
                    ?.taluks.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                </select>
              </div>

              {/* Blood Group Select */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <FaTint className="mr-2 text-pink-500" />
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentNeed}
                  onChange={(e) => setUrgentNeed(e.target.checked)}
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <span className="text-gray-700 font-medium">
                  Show only immediate/emergency donors
                </span>
              </label>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-3" />
                    Search Blood Donors
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-4 border-2 border-pink-300 text-pink-700 hover:bg-pink-50 rounded-xl font-bold transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              <FaUser className="inline mr-3 text-pink-600" />
              Available Donors ({filteredDonors.length})
            </h3>
            
            <div className="text-sm text-gray-600">
              <FaClock className="inline mr-2" />
              Last updated: Just now
            </div>
          </div>

          {showNoResults ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-700 mb-2">No Donors Found</h4>
              <p className="text-gray-600 mb-6">
                We couldn't find any donors matching your criteria. Try expanding your search area or use emergency request.
              </p>
              <button
                onClick={handleEmergencyRequest}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                Request Emergency Assistance
              </button>
            </div>
          ) : (
            <>
              {/* Donors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonors.map((donor) => (
                  <div 
                    key={getDonorId(donor)} 
                    className={`bg-gradient-to-br ${donor.readyToDonate ? 'from-pink-50 to-white' : 'from-gray-50 to-white'} rounded-xl border ${donor.readyToDonate ? 'border-pink-200' : 'border-gray-200'} p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{donor.name}</h4>
                          {donor.verified && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <FaMapMarkerAlt className="mr-2" />
                          {donor.distance ? `${donor.distance} away • ` : ''}{donor.district}, {donor.taluk}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full ${donor.bloodGroup && donor.bloodGroup.includes('+') ? 'bg-pink-100' : 'bg-pink-50'} flex items-center justify-center`}>
                          <span className="text-2xl font-bold text-pink-700">{donor.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-3" />
                        <span className="font-medium">{donor.contact || donor.phone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">
                          Last donation: {donor.lastDonation || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-3" />
                        <span className={`text-sm font-medium ${donor.readyToDonate ? 'text-green-600' : 'text-yellow-600'}`}>
                          {donor.availability || (donor.readyToDonate ? 'Available' : 'Contact for availability')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a 
                        href={`tel:${donor.contact || donor.phone}`}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <FaPhone className="mr-2" />
                        Contact
                      </a>
                      
                      <button 
                        onClick={() => {
                          const waNumber = donor.whatsapp || donor.phone || donor.contact;
                          if (waNumber) {
                            const whatsappUrl = `https://wa.me/${waNumber.replace(/\D/g, '')}`;
                            window.open(whatsappUrl, '_blank');
                          }
                        }}
                        className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <FaWhatsapp className="mr-2" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Groups Section */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FaWhatsapp className="mr-2 text-green-600" />
                  Join Our WhatsApp Groups
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {whatsappGroups.map((group, index) => (
                    <a
                      key={index}
                      href={group.groupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-white p-3 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium text-gray-700">{group.name}</span>
                      <FaWhatsapp className="text-green-600 text-xl" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-white rounded-2xl border border-pink-100">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaExclamationTriangle className="mr-3 text-pink-600" />
                  Important Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-700">Before Contacting Donors</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Verify hospital requirements</li>
                      <li>• Check donor eligibility</li>
                      <li>• Prepare necessary documents</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-700">Emergency Contacts</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Emergency: 108</li>
                      <li>• Blood Bank: 1910</li>
                      <li>• Red Cross: +91-XXX-XXX-XXXX</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-700">WhatsApp Groups</h5>
                    <p className="text-sm text-gray-600">
                      Join our WhatsApp groups for instant alerts and connect with donors in your area.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Emergency Request Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-pink-600 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  Emergency Blood Request
                </h3>
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {emergencySuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Request Sent Successfully!</h4>
                  <p className="text-gray-600 mb-4">
                    Your emergency request has been posted to all WhatsApp blood donor groups.
                  </p>
                  <div className="bg-green-50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-green-800 mb-2">
                      <FaWhatsapp className="inline mr-2" />
                      WhatsApp groups are now opening in new tabs...
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submitEmergencyRequest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Patient Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.patientName}
                        onChange={(e) => setEmergencyForm({...emergencyForm, patientName: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                        placeholder="Full name"
                      />
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Blood Group Required *
                      </label>
                      <select
                        required
                        value={emergencyForm.bloodGroup}
                        onChange={(e) => setEmergencyForm({...emergencyForm, bloodGroup: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>

                    {/* Units Needed */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Units Needed *
                      </label>
                      <select
                        required
                        value={emergencyForm.units}
                        onChange={(e) => setEmergencyForm({...emergencyForm, units: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Hospital */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Hospital Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.hospital}
                        onChange={(e) => setEmergencyForm({...emergencyForm, hospital: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                        placeholder="Hospital name"
                      />
                    </div>

                    {/* Location/Area */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Location/Area *
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.location}
                        onChange={(e) => setEmergencyForm({...emergencyForm, location: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                        placeholder="Area, City, Landmark"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={emergencyForm.contactNumber}
                        onChange={(e) => setEmergencyForm({...emergencyForm, contactNumber: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyForm.contactPerson}
                        onChange={(e) => setEmergencyForm({...emergencyForm, contactPerson: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Relationship to Patient *
                      </label>
                      <select
                        required
                        value={emergencyForm.relationship}
                        onChange={(e) => setEmergencyForm({...emergencyForm, relationship: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl"
                      >
                        <option value="">Select</option>
                        <option value="self">Self</option>
                        <option value="family">Family Member</option>
                        <option value="friend">Friend</option>
                        <option value="medical">Medical Staff</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Urgency Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Reason for Emergency *
                    </label>
                    <textarea
                      required
                      value={emergencyForm.urgencyReason}
                      onChange={(e) => setEmergencyForm({...emergencyForm, urgencyReason: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      rows="2"
                      placeholder="Surgery, accident, medical condition..."
                    />
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      value={emergencyForm.additionalInfo}
                      onChange={(e) => setEmergencyForm({...emergencyForm, additionalInfo: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      rows="2"
                      placeholder="Any other important details..."
                    />
                  </div>

                  {/* WhatsApp Groups Info */}
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h5 className="font-bold text-green-800 mb-2 flex items-center">
                      <FaWhatsapp className="mr-2" />
                      This request will be sent to:
                    </h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {whatsappGroups.map((group, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {group.name}
                        </li>
                      ))}
                      <li className="flex items-center mt-2 text-xs">
                        <span>📍 Matching donors will also be contacted directly via WhatsApp</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSendingEmergency}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {isSendingEmergency ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaWhatsapp className="mr-2" />
                          Send to WhatsApp Groups
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmergencyModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Emergency Note */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    This is an emergency request. Your details will be shared with WhatsApp blood donor groups.
                    For immediate medical emergency, please call 108.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </WrapperSection>
  );
};

SearchBloodStockComponent.propTypes = {
  subheadingText: PropTypes.string.isRequired,
  headingText: PropTypes.string.isRequired,
  classHint: PropTypes.string,
};

SearchBloodStockComponent.defaultProps = {
  classHint: "",
};

export default SearchBloodStockComponent;