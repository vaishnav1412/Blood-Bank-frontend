import { useState, useEffect } from "react";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import PropTypes from "prop-types";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUser, 
  FaTint, 
  FaCalendarAlt, 
  FaClock, 
  FaExclamationTriangle, 
  FaWhatsapp,
  FaFilter,
  FaRedoAlt,
  FaCheckCircle,
  FaHeartbeat,
  FaAmbulance,
  FaHospital,
  FaDownload,
  FaUsers,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaWeight,
  FaSyringe
} from "react-icons/fa";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const itemsPerPage = 10;
  
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

  // Sorting function
  const sortedDonors = () => {
    const sortableDonors = [...filteredDonors];
    if (sortConfig.key) {
      sortableDonors.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'lastDonation') {
          aValue = a.lastDonation ? new Date(a.lastDonation) : new Date(0);
          bValue = b.lastDonation ? new Date(b.lastDonation) : new Date(0);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableDonors;
  };

  // Pagination
  const currentDonors = sortedDonors().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowNoResults(false);
    setError(null);
    setCurrentPage(1);

    try {
      const filters = {};
      if (district) filters.district = district;
      if (taluk) filters.taluk = taluk;
      if (bloodGroup) filters.bloodGroup = bloodGroup;
      if (urgentNeed) filters.readyToDonate = true;

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
    setCurrentPage(1);
    setFilteredDonors(allDonors);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />;
  };

  const handleViewDonor = (donor) => {
    setSelectedDonor(donor);
    setShowDonorModal(true);
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
      await new Promise(resolve => setTimeout(resolve, 1500));

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

      setTimeout(() => {
        sendToAllWhatsAppGroups();
        
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
      <div className={`${classHint} search-wrapper md:-mt-[480px] -mt-[480px] w-full max-w-7xl mx-auto relative`}>
        {/* Animated gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 rounded-3xl blur-xl opacity-75 animate-gradient-xy"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm p-4 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <GroupedHeadingComponent
              subheadingText={subheadingText}
              headingText={headingText}
              mode="dark"
              position="center"
            />
            
            {/* Responsive Stats Grid */}
            <div className="mt-6 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
              <div className="stats-card">
                <FaUsers className="stats-icon" />
                <div>
                  <span className="stats-value">{allDonors.length}+</span>
                  <span className="stats-label">Verified Donors</span>
                </div>
              </div>
              <div className="stats-card">
                <FaHospital className="stats-icon" />
                <div>
                  <span className="stats-value">50+</span>
                  <span className="stats-label">Hospitals</span>
                </div>
              </div>
              <div className="stats-card">
                <FaAmbulance className="stats-icon" />
                <div>
                  <span className="stats-value">24/7</span>
                  <span className="stats-label">Emergency</span>
                </div>
              </div>
              <div className="stats-card">
                <FaWhatsapp className="stats-icon" />
                <div>
                  <span className="stats-value">{whatsappGroups.length}+</span>
                  <span className="stats-label">WA Groups</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="search-form-container">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="form-title">
                <FaSearch className="title-icon" />
                Find Blood Donors
              </h3>
              
              <button
                onClick={handleEmergencyRequest}
                className="emergency-button w-full sm:w-auto"
              >
                <FaExclamationTriangle className="mr-2" />
                Emergency Request
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="filter-grid">
                {/* District Select */}
                <div className="filter-item">
                  <label className="filter-label">
                    <FaMapMarkerAlt className="filter-icon" />
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setTaluk("");
                    }}
                    className="filter-select"
                  >
                    <option value="">All Districts</option>
                    {districtsData.map((dist) => (
                      <option key={dist.id} value={dist.name}>{dist.name}</option>
                    ))}
                  </select>
                </div>

                {/* Taluk Select */}
                <div className="filter-item">
                  <label className="filter-label">
                    <FaMapMarkerAlt className="filter-icon" />
                    Taluk/Area
                  </label>
                  <select
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    className="filter-select"
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
                <div className="filter-item">
                  <label className="filter-label">
                    <FaTint className="filter-icon" />
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="filter-select"
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={urgentNeed}
                    onChange={(e) => setUrgentNeed(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Show only emergency donors</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <FaExclamationTriangle className="mr-2" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="search-button"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch className="mr-2" />
                      Search Donors
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="reset-button"
                >
                  <FaRedoAlt className="mr-2" />
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Section with Table */}
          <div className="results-container">
            <div className="results-header">
              <h3 className="results-title">
                <FaUsers className="mr-2" />
                Available Donors
                <span className="donor-count">{filteredDonors.length}</span>
              </h3>
              
              <div className="table-controls">
                <button className="table-control-btn" title="Download CSV">
                  <FaDownload />
                </button>
                <button className="table-control-btn" title="Print">
                  <FaPrint />
                </button>
              </div>
            </div>

            {showNoResults ? (
              <div className="no-results">
                <FaExclamationTriangle className="no-results-icon" />
                <h4>No Donors Found</h4>
                <p>Try expanding your search area or use emergency request.</p>
                <button
                  onClick={handleEmergencyRequest}
                  className="emergency-button mt-4 w-full sm:w-auto"
                >
                  Request Emergency Assistance
                </button>
              </div>
            ) : (
              <>
                {/* Premium Table with Responsive Card Transformation */}
                <div className="table-wrapper">
                  <table className="donor-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')}>
                          Donor {getSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('bloodGroup')}>
                          Blood Group {getSortIcon('bloodGroup')}
                        </th>
                        <th onClick={() => handleSort('district')}>
                          Location {getSortIcon('district')}
                        </th>
                        <th onClick={() => handleSort('lastDonation')}>
                          Last Donation {getSortIcon('lastDonation')}
                        </th>
                        <th onClick={() => handleSort('readyToDonate')}>
                          Status {getSortIcon('readyToDonate')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDonors.map((donor) => (
                        <tr key={getDonorId(donor)} className={donor.readyToDonate ? 'emergency-row' : ''}>
                          <td data-label="Donor">
                            <div className="donor-info">
                              <div className="donor-avatar">
                                {donor.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="donor-name">{donor.name}</div>
                                <div className="donor-badge">
                                  {donor.verified && <FaCheckCircle className="verified-icon" />}
                                  {donor.distance && <span>{donor.distance} km</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Blood Group">
                            <span className={`blood-badge ${donor.bloodGroup?.includes('+') ? 'positive' : 'negative'}`}>
                              {donor.bloodGroup}
                            </span>
                          </td>
                          <td data-label="Location">
                            <div className="location-info">
                              <FaMapMarkerAlt className="location-icon" />
                              <span>{donor.district}, {donor.taluk}</span>
                            </div>
                          </td>
                          <td data-label="Last Donation">
                            <div className="donation-info">
                              <FaCalendarAlt className="calendar-icon" />
                              <span>{donor.lastDonation || 'N/A'}</span>
                            </div>
                          </td>
                          <td data-label="Status">
                            {donor.readyToDonate ? (
                              <span className="status-badge available">
                                <FaHeartbeat className="mr-1" />
                                Available
                              </span>
                            ) : (
                              <span className="status-badge unavailable">
                                <FaClock className="mr-1" />
                                Check
                              </span>
                            )}
                          </td>
                          <td data-label="Actions">
                            <div className="action-group">
                              <button 
                                onClick={() => handleViewDonor(donor)}
                                className="action-btn view"
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              <a 
                                href={`tel:${donor.contact || donor.phone}`}
                                className="action-btn call"
                                title="Call"
                              >
                                <FaPhone />
                              </a>
                              <button 
                                onClick={() => {
                                  const waNumber = donor.whatsapp || donor.phone || donor.contact;
                                  if (waNumber) {
                                    window.open(`https://wa.me/${waNumber.replace(/\D/g, '')}`, '_blank');
                                  }
                                }}
                                className="action-btn whatsapp"
                                title="WhatsApp"
                              >
                                <FaWhatsapp />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <FaChevronLeft />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}

                {/* WhatsApp Groups Section */}
                <div className="whatsapp-section">
                  <h4>
                    <FaWhatsapp className="whatsapp-icon" />
                    Join WhatsApp Groups
                  </h4>
                  <div className="whatsapp-grid">
                    {whatsappGroups.map((group, index) => (
                      <a
                        key={index}
                        href={group.groupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-card"
                      >
                        <span>{group.name}</span>
                        <FaWhatsapp className="whatsapp-link-icon" />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Donor Details Modal */}
      {showDonorModal && selectedDonor && (
        <div className="modal-overlay" onClick={() => setShowDonorModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDonorModal(false)}>×</button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedDonor.name?.charAt(0).toUpperCase()}
              </div>
              <div className="modal-header-text">
                <h3>{selectedDonor.name}</h3>
                <p>{selectedDonor.email || 'Email not available'}</p>
              </div>
              {selectedDonor.verified && (
                <span className="verified-badge">
                  <FaCheckCircle /> Verified
                </span>
              )}
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <FaTint className="info-icon" />
                  <div>
                    <label>Blood Group</label>
                    <span className="blood-group-display">{selectedDonor.bloodGroup}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaBirthdayCake className="info-icon" />
                  <div>
                    <label>Age</label>
                    <span>{selectedDonor.age || 'N/A'} years</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaVenusMars className="info-icon" />
                  <div>
                    <label>Gender</label>
                    <span>{selectedDonor.gender || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaWeight className="info-icon" />
                  <div>
                    <label>Weight</label>
                    <span>{selectedDonor.weight || 'N/A'} kg</span>
                  </div>
                </div>

                <div className="info-item full-width">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <label>Location</label>
                    <span>{selectedDonor.district}, {selectedDonor.taluk}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaSyringe className="info-icon" />
                  <div>
                    <label>Last Donation</label>
                    <span>{selectedDonor.lastDonation || 'Never'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaClock className="info-icon" />
                  <div>
                    <label>Availability</label>
                    <span className={selectedDonor.readyToDonate ? 'text-green-600' : 'text-amber-600'}>
                      {selectedDonor.readyToDonate ? 'Available Now' : 'Contact for availability'}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <FaHeartbeat className="info-icon" />
                  <div>
                    <label>Total Donations</label>
                    <span>{selectedDonor.donationCount || 0} times</span>
                  </div>
                </div>
              </div>

              <div className="contact-section">
                <h4>Contact Information</h4>
                <div className="contact-grid">
                  <a href={`tel:${selectedDonor.phone || selectedDonor.contact}`} className="contact-btn phone">
                    <FaPhone /> Call
                  </a>
                  <a href={`https://wa.me/${(selectedDonor.whatsapp || selectedDonor.phone || selectedDonor.contact).replace(/\D/g, '')}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="contact-btn whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a href={`mailto:${selectedDonor.email}`} className="contact-btn email">
                    <FaEnvelope /> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Request Modal */}
      {showEmergencyModal && (
        <div className="modal-overlay" onClick={() => setShowEmergencyModal(false)}>
          <div className="modal-content emergency-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEmergencyModal(false)}>×</button>
            
            {emergencySuccess ? (
              <div className="success-content">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <h3>Request Sent Successfully!</h3>
                <p>Your emergency request has been posted to all WhatsApp blood donor groups.</p>
                <div className="whatsapp-notice">
                  <FaWhatsapp />
                  <span>WhatsApp groups are now opening...</span>
                </div>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="close-button"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitEmergencyRequest}>
                <h3 className="modal-title">
                  <FaExclamationTriangle className="title-icon" />
                  Emergency Blood Request
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      required
                      value={emergencyForm.patientName}
                      onChange={(e) => setEmergencyForm({...emergencyForm, patientName: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Blood Group *</label>
                    <select
                      required
                      value={emergencyForm.bloodGroup}
                      onChange={(e) => setEmergencyForm({...emergencyForm, bloodGroup: e.target.value})}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Units Needed *</label>
                    <select
                      required
                      value={emergencyForm.units}
                      onChange={(e) => setEmergencyForm({...emergencyForm, units: e.target.value})}
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Hospital Name *</label>
                    <input
                      type="text"
                      required
                      value={emergencyForm.hospital}
                      onChange={(e) => setEmergencyForm({...emergencyForm, hospital: e.target.value})}
                      placeholder="Hospital name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location/Area *</label>
                    <input
                      type="text"
                      required
                      value={emergencyForm.location}
                      onChange={(e) => setEmergencyForm({...emergencyForm, location: e.target.value})}
                      placeholder="Area, City, Landmark"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={emergencyForm.contactNumber}
                      onChange={(e) => setEmergencyForm({...emergencyForm, contactNumber: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={emergencyForm.contactPerson}
                      onChange={(e) => setEmergencyForm({...emergencyForm, contactPerson: e.target.value})}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Relationship *</label>
                    <select
                      required
                      value={emergencyForm.relationship}
                      onChange={(e) => setEmergencyForm({...emergencyForm, relationship: e.target.value})}
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

                <div className="form-group full-width">
                  <label>Reason for Emergency *</label>
                  <textarea
                    required
                    value={emergencyForm.urgencyReason}
                    onChange={(e) => setEmergencyForm({...emergencyForm, urgencyReason: e.target.value})}
                    rows="2"
                    placeholder="Surgery, accident, medical condition..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Additional Information</label>
                  <textarea
                    value={emergencyForm.additionalInfo}
                    onChange={(e) => setEmergencyForm({...emergencyForm, additionalInfo: e.target.value})}
                    rows="2"
                    placeholder="Any other important details..."
                  />
                </div>

                <div className="whatsapp-groups-info">
                  <FaWhatsapp className="info-icon" />
                  <div>
                    <h4>This request will be sent to:</h4>
                    <ul>
                      {whatsappGroups.map((group, index) => (
                        <li key={index}>{group.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                    disabled={isSendingEmergency}
                    className="submit-button"
                  >
                    {isSendingEmergency ? (
                      <>
                        <div className="spinner"></div>
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
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>

                <p className="emergency-note">
                  This is an emergency request. Your details will be shared with WhatsApp blood donor groups.
                  For immediate medical emergency, please call 108.
                </p>
              </form>
            )}
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