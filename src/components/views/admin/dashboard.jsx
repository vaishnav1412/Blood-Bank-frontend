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

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("week");

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
      value: "2,456",
      change: "+12.5%",
      icon: <FiUsers />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "up"
    },
    {
      title: "Blood Requests",
      value: "189",
      change: "+23.1%",
      icon: <FiDroplet />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      trend: "up"
    },
    {
      title: "Active Camps",
      value: "12",
      change: "+4",
      icon: <FiCalendar />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "up"
    },
    {
      title: "Lives Saved",
      value: "7,368",
      change: "+28.3%",
      icon: <FaHeartbeat />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "up"
    }
  ];

  // Blood stock data
  const bloodStock = [
    { group: "A+", count: 45, percentage: 75, status: "good" },
    { group: "A-", count: 23, percentage: 38, status: "low" },
    { group: "B+", count: 38, percentage: 63, status: "good" },
    { group: "B-", count: 18, percentage: 30, status: "critical" },
    { group: "AB+", count: 15, percentage: 25, status: "critical" },
    { group: "AB-", count: 8, percentage: 13, status: "critical" },
    { group: "O+", count: 52, percentage: 87, status: "good" },
    { group: "O-", count: 12, percentage: 20, status: "critical" }
  ];

  // Recent activities
  const recentActivities = [
    { 
      id: 1, 
      action: "New donor registered", 
      user: "Rahul Sharma", 
      time: "5 minutes ago",
      icon: <FiUserPlus />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      id: 2, 
      action: "Blood request fulfilled", 
      user: "A+ blood - City Hospital", 
      time: "32 minutes ago",
      icon: <FiCheckCircle />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      id: 3, 
      action: "Urgent request", 
      user: "O- blood needed", 
      time: "1 hour ago",
      icon: <FiAlertCircle />,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    { 
      id: 4, 
      action: "Donation camp approved", 
      user: "Tech Park Drive", 
      time: "3 hours ago",
      icon: <FiCalendar />,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  // Upcoming camps
  const upcomingCamps = [
    { name: "Tech Park Blood Drive", date: "Mar 20, 2024", location: "IT Park", donors: 45 },
    { name: "University Camp", date: "Mar 22, 2024", location: "Campus", donors: 32 },
    { name: "Community Center", date: "Mar 25, 2024", location: "Downtown", donors: 28 }
  ];

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
              Blood Stock Status
            </h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="blood-stock-list">
            {bloodStock.map((blood, index) => (
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
            ))}
          </div>

          <div className="stock-summary">
            <div className="summary-item">
              <span className="summary-label">Total Units</span>
              <span className="summary-value">211</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Critical</span>
              <span className="summary-value critical">4</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Low</span>
              <span className="summary-value low">1</span>
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
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.bgColor} ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="activity-details">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-user">{activity.user}</p>
                  <span className="activity-time">{activity.time}</span>
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
                <div className="camp-date-badge">
                  <span className="camp-day">{camp.date.split(' ')[1]}</span>
                  <span className="camp-month">{camp.date.split(' ')[0]}</span>
                </div>
                <div className="camp-details">
                  <h3 className="camp-name">{camp.name}</h3>
                  <p className="camp-location">
                    <FiMapPin className="location-icon" />
                    {camp.location}
                  </p>
                  <div className="camp-donors">
                    <FiUsers className="donors-icon" />
                    <span>{camp.donors} donors expected</span>
                  </div>
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