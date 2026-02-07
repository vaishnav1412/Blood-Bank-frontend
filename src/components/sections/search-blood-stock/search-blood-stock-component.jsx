import { useState, useEffect } from "react";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import PropTypes from "prop-types";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaUser, FaTint, FaCalendarAlt, FaClock, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import "./search-blood-stock.scss";

const SearchBloodStockComponent = ({
  subheadingText,
  headingText,
  classHint,
}) => {
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [searchRadius, setSearchRadius] = useState("10");
  const [urgentNeed, setUrgentNeed] = useState(false);
  const [availableDonors, setAvailableDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  
  // Sample districts and taluks data (you can fetch this from API)
  const districtsData = [
    { id: "district1", name: "District 1", taluks: ["Taluk 1", "Taluk 2", "Taluk 3"] },
    { id: "district2", name: "District 2", taluks: ["Taluk A", "Taluk B", "Taluk C"] },
    { id: "district3", name: "District 3", taluks: ["Taluk X", "Taluk Y", "Taluk Z"] },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const searchRadii = ["5", "10", "25", "50", "100"]; // in kilometers

  useEffect(() => {
    // This could be an API call to get initial data
    const initialDonors = [
      { 
        id: 1, 
        name: "Rahul Sharma", 
        bloodGroup: "A+", 
        district: "District 1", 
        taluk: "Taluk 1", 
        contact: "+91 98765 43210",
        lastDonation: "3 months ago",
        availability: "Available",
        distance: "2.5 km",
        verified: true,
        readyToDonate: true
      },
      { 
        id: 2, 
        name: "Aisha Khan", 
        bloodGroup: "B-", 
        district: "District 2", 
        taluk: "Taluk A", 
        contact: "+91 91234 56780",
        lastDonation: "6 months ago",
        availability: "Available in 2 days",
        distance: "8.3 km",
        verified: true,
        readyToDonate: false
      },
      { 
        id: 3, 
        name: "Manu Nair", 
        bloodGroup: "A+", 
        district: "District 1", 
        taluk: "Taluk 1", 
        contact: "+91 99988 87776",
        lastDonation: "1 month ago",
        availability: "Available now",
        distance: "1.2 km",
        verified: true,
        readyToDonate: true
      },
    ];
    setAvailableDonors(initialDonors);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowNoResults(false);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter logic
    const filteredDonors = availableDonors.filter(donor => {
      const matchesBloodGroup = !bloodGroup || donor.bloodGroup === bloodGroup;
      const matchesDistrict = !district || donor.district === district;
      const matchesTaluk = !taluk || donor.taluk === taluk;
      const matchesUrgency = !urgentNeed || donor.readyToDonate;
      
      return matchesBloodGroup && matchesDistrict && matchesTaluk && matchesUrgency;
    });

    setAvailableDonors(filteredDonors);
    setShowNoResults(filteredDonors.length === 0);
    setIsLoading(false);
  };

  const handleReset = () => {
    setDistrict("");
    setTaluk("");
    setBloodGroup("");
    setSearchRadius("10");
    setUrgentNeed(false);
    // Reset to initial donors or fetch all donors
    const allDonors = [
      { id: 1, name: "Rahul Sharma", bloodGroup: "A+", district: "District 1", taluk: "Taluk 1", contact: "+91 98765 43210", lastDonation: "3 months ago", availability: "Available", distance: "2.5 km", verified: true, readyToDonate: true },
      { id: 2, name: "Aisha Khan", bloodGroup: "B-", district: "District 2", taluk: "Taluk A", contact: "+91 91234 56780", lastDonation: "6 months ago", availability: "Available in 2 days", distance: "8.3 km", verified: true, readyToDonate: false },
      { id: 3, name: "Manu Nair", bloodGroup: "A+", district: "District 1", taluk: "Taluk 1", contact: "+91 99988 87776", lastDonation: "1 month ago", availability: "Available now", distance: "1.2 km", verified: true, readyToDonate: true },
    ];
    setAvailableDonors(allDonors);
    setShowNoResults(false);
  };

  const handleEmergencyRequest = () => {
    // Handle emergency blood request
    alert("Emergency request sent to nearby hospitals and available donors!");
  };

  return (
    <WrapperSection>
      <div className={`${classHint} search-wrapper md:-mt-[400px] bg-pink-50 w-full relative p-4 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-pink-100`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    setTaluk(""); // Reset taluk when district changes
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

              {/* Search Radius */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-pink-500" />
                  Search Radius (km)
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  {searchRadii.map((radius) => (
                    <option key={radius} value={radius}>{radius} km</option>
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
              Available Donors ({availableDonors.length})
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
                We couldn't find any donors matching your criteria. Try expanding your search area or contact emergency services.
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
                {availableDonors.map((donor) => (
                  <div 
                    key={donor.id} 
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
                          {donor.distance} away • {donor.district}, {donor.taluk}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full ${donor.bloodGroup.includes('+') ? 'bg-pink-100' : 'bg-pink-50'} flex items-center justify-center`}>
                          <span className="text-2xl font-bold text-pink-700">{donor.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-3" />
                        <span className="font-medium">{donor.contact}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">
                          Last donation: {donor.lastDonation}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-3" />
                        <span className={`text-sm font-medium ${donor.readyToDonate ? 'text-green-600' : 'text-yellow-600'}`}>
                          {donor.availability}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                        <FaPhone className="mr-2" />
                        Contact
                      </button>
                      
                      <button className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                        <FaArrowRight className="mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                ))}
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
                    <h5 className="font-bold text-gray-700">Need Help?</h5>
                    <p className="text-sm text-gray-600">
                      Call our 24/7 helpline or use the emergency request button above for immediate assistance.
                    </p>
                    <button className="mt-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
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