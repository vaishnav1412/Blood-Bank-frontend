import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiDroplet, 
  FiCalendar, 
  FiAward,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiUserPlus,
  FiActivity,
} from "react-icons/fi";
import { FaTint, FaHeartbeat, FaHandHoldingHeart } from "react-icons/fa";
import "./dashboard.scss";
import { fetchBloodGroupCount,fetchDashboardStats } from "../../../services/adminServices";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [bloodCount, setBloodCount] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);  

  const [dashboardStats, setDashboardStats] = useState(null);
const [recentActivities, setRecentActivities] = useState([]);
const [upcomingCamps, setUpcomingCamps] = useState([]);
console.log(upcomingCamps,"camp");


  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Stats cards data
  const statsCards = [
  {
    title: "Total Donors",
    value: dashboardStats?.totalDonors || 0,
    icon: <FiUsers />,
  },
  {
    title: "Blood Requests",
    value: dashboardStats?.totalRequests || 0,
    icon: <FiDroplet />,
  },
  {
    title: "Active Camps",
    value: dashboardStats?.activeCamps || 0,
    icon: <FiCalendar />,
  },
  {
    title: "Lives Saved",
    value: dashboardStats?.livesSaved || 0,
    icon: <FaHeartbeat />,
  },
];

  // Recent activities
  

  // Upcoming camps
  

  const allBloodGroups = [
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-"
  ];

  const formatBloodStock = (apiData) => {
    // Convert array into object for easy lookup
    const map = {};

    apiData.forEach((item) => {
      map[item._id] = item.count;
    });

    // Find max count (for percentage calculation)
    const maxCount = Math.max(...Object.values(map), 1);

    // Build full bloodStock array
    return allBloodGroups.map((group) => {
      const count = map[group] || 0;

      // Percentage based on max availability
      const percentage = Math.round((count / maxCount) * 100);

      // Status Logic
      let status = "good";
      if (percentage < 30) status = "critical";
      else if (percentage < 60) status = "low";

      return {
        group,
        count,
        percentage,
        status,
      };
    });
  };

  const loadBloodGroupCount = async () => {
    try {
      const data = await fetchBloodGroupCount();
      setBloodCount(data);
      
      // FIX: Format the data and set bloodStock
      if (data && data.length > 0) {
        const formattedData = formatBloodStock(data);
        setBloodStock(formattedData);
      }
    } catch (error) {
      console.error("Sidebar Blood Count Error:", error);
    }
  };

  const loadDashboardData = async () => {
  try {
    const data = await fetchDashboardStats();

    setDashboardStats(data.stats);
    setRecentActivities(data.recentActivities);
    setUpcomingCamps(data.upcomingCamps);

  } catch (error) {
    console.error("Dashboard Data Error:", error);
  }
};


  useEffect(() => {
    loadBloodGroupCount();
    loadDashboardData();
  }, []);



  // Calculate totals for the summary
  const totalUnits = bloodStock.reduce((sum, item) => sum + item.count, 0);
  const criticalCount = bloodStock.filter(item => item.status === "critical").length;
  const lowCount = bloodStock.filter(item => item.status === "low").length;

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div>
            <h1 className="welcome-title">
              {greeting}, <span className="admin-name">Admin</span>
            </h1>
            <p className="welcome-subtitle">
              Here's what's happening with your blood donation platform today.
            </p>
          </div>
          
          {/* Time & Date Card */}
          <div className="time-card">
            <div className="time-card-content">
              <FiClock className="time-icon" />
              <div>
                <div className="time">{formattedTime}</div>
                <div className="date">{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        {["day", "week", "month", "year"].map(period => (
          <button
            key={period}
            className={`period-btn ${selectedPeriod === period ? "active" : ""}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-left">
                <div className={`stat-icon ${stat.bgColor} ${stat.textColor}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                </div>
              </div>
              <div className="stat-right">
                <span className={`stat-change ${stat.trend === 'up' ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
                <FiTrendingUp className={`trend-icon ${stat.trend}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Blood Stock Section */}
        <div className="card blood-stock-card">
          <div className="card-header">
            <h2 className="card-title">
              <FaTint className="card-icon" />
               Blood Group Availability
            </h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="blood-stock-list">
            {bloodStock.length > 0 ? (
              bloodStock.map((blood, index) => (
                <div key={index} className="blood-stock-item">
                  <div className="blood-info">
                    <span className="blood-group">{blood.group}</span>
                    <span className="blood-count">{blood.count} units</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${blood.status}`}
                      style={{ width: `${blood.percentage}%` }}
                    ></div>
                  </div>
                  <span className={`status-badge ${blood.status}`}>
                    {blood.percentage}%
                  </span>
                </div>
              ))
            ) : (
              <div className="loading-state">Loading blood stock data...</div>
            )}
          </div>

          <div className="stock-summary">
            <div className="summary-item">
              <span className="summary-label">Total Units</span>
              <span className="summary-value">{totalUnits}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Critical</span>
              <span className="summary-value critical">{criticalCount}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Low</span>
              <span className="summary-value low">{lowCount}</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card activities-card">
          <div className="card-header">
            <h2 className="card-title">
              <FiActivity className="card-icon" />
              Recent Activities
            </h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="activities-list">
           {recentActivities.map((activity, index) => (
  <div key={index} className="activity-item">
    <div className="activity-details">
      <p className="activity-action">{activity.action}</p>
      <p className="activity-user">{activity.user}</p>
      <span className="activity-time">
        {new Date(activity.time).toLocaleString()}
      </span>
    </div>
  </div>
))}
          </div>
        </div>

        {/* Upcoming Camps */}
        <div className="card camps-card">
          <div className="card-header">
            <h2 className="card-title">
              <FiCalendar className="card-icon" />
              Upcoming Donation Camps
            </h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="camps-list">
            {upcomingCamps.map((camp, index) => (
  <div key={index} className="camp-item">
    <div className="camp-details">
      <h3>{camp.name}</h3>
      <p>{camp.location}</p>
      <p>
        Date: {new Date(camp.eventDate).toDateString()}
      </p>
      <p>{camp.expectedDonors} donors expected</p>
    </div>
  </div>
))}

          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions-card">
          <div className="card-header">
            <h2 className="card-title">
              <FaHandHoldingHeart className="card-icon" />
              Quick Actions
            </h2>
          </div>

          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <FiUserPlus className="action-icon" />
              <span>Add Donor</span>
            </button>
            <button className="quick-action-btn">
              <FiDroplet className="action-icon" />
              <span>New Request</span>
            </button>
            <button className="quick-action-btn">
              <FiCalendar className="action-icon" />
              <span>Schedule Camp</span>
            </button>
            <button className="quick-action-btn">
              <FiAward className="action-icon" />
              <span>Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}