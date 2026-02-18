import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaComment, 
  FaPaperPlane, 
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaSpinner
} from "react-icons/fa";
import "./contact-form.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { contactInfo,subjects } from "../../../data/content/contact";
import { sendContactMessage } from "../../../services/donorServices"; 
import toast from "react-hot-toast";


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    return newErrors;
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Sending your message...");
    
    try {
      // AXIOS API CALL
      // Replace '/api/contact' with your actual backend endpoint
 

      const response = await sendContactMessage(formData);
      console.log("Form submitted successfully:", response.data);
      
      toast.success("Message sent successfully!", { id: toastId });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setErrors({});
      setIsSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Form submission error:", error);
      
      // Handle error response
      const errorMessage = error.response?.data?.message || "Failed to submit form. Please try again.";
      toast.error(errorMessage, { id: toastId });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'emergency':
        alert("Opening emergency contact...");
        break;
      case 'donor':
        setFormData(prev => ({ ...prev, subject: "Become a Donor" }));
        setActiveTab("form");
        break;
      case 'camp':
        setFormData(prev => ({ ...prev, subject: "Organize Blood Drive" }));
        setActiveTab("form");
        break;
      default:
        break;
    }
  };

  return (
    <WrapperSection>
      <div className="contact-form-wrapper  bg-gradient-to-br from-pink-300 via-pink-200  to-pink-100 md:-mt-[480px] -mt-[680px] rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-pink-500/10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            <span className="text-pink-600">Get in</span> Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help with all your blood donation queries.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Contact Info */}
          <div className="lg:w-2/5">
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaClock className="mr-2 text-pink-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickAction('emergency')}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-2">🆘</span>
                  <span className="font-bold text-sm">Emergency</span>
                </button>
                <button
                  onClick={() => handleQuickAction('donor')}
                  className="bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-2">❤️</span>
                  <span className="font-bold text-sm">Become Donor</span>
                </button>
                <button
                  onClick={() => handleQuickAction('camp')}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-2">🏥</span>
                  <span className="font-bold text-sm">Organize Camp</span>
                </button>
                <a
                  href="#faq"
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-2">❓</span>
                  <span className="font-bold text-sm">FAQ</span>
                </a>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.action}
                  target={info.action.includes('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group bg-white border border-gray-200 rounded-xl p-4 flex items-start hover:shadow-lg hover:border-pink-300 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform`}>
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-gray-600 font-medium mt-1">{info.details}</p>
                    <p className="text-sm text-gray-500 mt-1">{info.subtitle}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-pink-500 transition-colors">
                    →
                  </div>
                </a>
              ))}
            </div>

            {/* Stats Banner */}
            <div className="mt-8 bg-gradient-to-r from-pink-600 to-pink-500 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Our Response Time</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Phone Calls</span>
                  <span className="font-bold">Immediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>WhatsApp</span>
                  <span className="font-bold">Within 15 mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <span className="font-bold">Within 2 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-3/5">
            {/* Form Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-3 font-bold text-center transition-colors ${activeTab === "form" 
                  ? "text-pink-600 border-b-2 border-pink-600" 
                  : "text-gray-500 hover:text-gray-700"}`}
              >
                Send Message
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`flex-1 py-3 font-bold text-center transition-colors ${activeTab === "faq" 
                  ? "text-pink-600 border-b-2 border-pink-600" 
                  : "text-gray-500 hover:text-gray-700"}`}
              >
                Quick FAQ
              </button>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 flex items-start">
                <FaCheckCircle className="text-green-500 text-2xl mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 mb-1">Message Sent Successfully!</h4>
                  <p className="text-green-600">
                    Thank you for contacting us. We'll get back to you within 2 hours.
                    A confirmation email has been sent to {formData.email}.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-green-600 hover:text-green-800 ml-2"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Contact Form */}
            {activeTab === "form" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="mr-2 text-pink-500" />
                      Your Name *
                    </label>
                    <div className={`relative ${errors.name ? 'animate-shake' : ''}`}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-4 pl-12 border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                        placeholder="John Doe"
                      />
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        ⚠️ {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="mr-2 text-pink-500" />
                      Email Address *
                    </label>
                    <div className={`relative ${errors.email ? 'animate-shake' : ''}`}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-4 pl-12 border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                        placeholder="john@example.com"
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        ⚠️ {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="mr-2 text-pink-500" />
                      Phone Number *
                    </label>
                    <div className={`relative ${errors.phone ? 'animate-shake' : ''}`}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-4 pl-12 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                        placeholder="98765 43210"
                      />
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        ⚠️ {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaComment className="mr-2 text-pink-500" />
                      Subject *
                    </label>
                    <div className={`relative ${errors.subject ? 'animate-shake' : ''}`}>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full p-4 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none`}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>{subject}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        ▼
                      </div>
                    </div>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        ⚠️ {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <FaComment className="mr-2 text-pink-500" />
                    Your Message *
                  </label>
                  <div className={`relative ${errors.message ? 'animate-shake' : ''}`}>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full p-4 border ${errors.message ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none`}
                      placeholder="Please describe your query in detail..."
                    />
                    <div className="absolute bottom-3 right-3 text-gray-400 text-sm">
                      {formData.message.length}/500
                    </div>
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      ⚠️ {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-3" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div className="space-y-4">
                {[
                  {
                    q: "How often can I donate blood?",
                    a: "You can donate whole blood every 56 days (approximately every 2 months)."
                  },
                  {
                    q: "Is blood donation safe?",
                    a: "Yes! We use sterile, single-use equipment for every donation. The process is completely safe."
                  },
                  {
                    q: "How long does donation take?",
                    a: "The entire process takes about 45-60 minutes, with the actual donation taking only 8-10 minutes."
                  },
                  {
                    q: "Can I donate if I have a tattoo?",
                    a: "Yes, after 6 months from the date of getting a tattoo."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-colors">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mr-3 text-sm">
                        {index + 1}
                      </span>
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 ml-9">{faq.a}</p>
                  </div>
                ))}
                
                <div className="text-center mt-6">
                  <a 
                    href="#full-faq" 
                    className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                  >
                    View All FAQs →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WrapperSection>
  );
};

export default ContactForm;