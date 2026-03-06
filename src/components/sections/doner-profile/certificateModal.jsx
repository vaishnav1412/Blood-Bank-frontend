import { useRef, useState } from "react";
import {
  FaDownload,
  FaShareAlt,
  FaLink,
  FaSpinner,
  FaTrophy,
  FaCertificate as FaCertificateIcon,
  FaAward,
} from "react-icons/fa";
import toast from "react-hot-toast";

const CertificateModal = ({
  selectedCertificate,
  showCertificateModal,
  setShowCertificateModal,
  user,
}) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!selectedCertificate || !showCertificateModal) return null;

  const getMilestoneTitle = () => {
    const count = user?.donationCount || 0;
    if (count === 1) return "First Donation";
    if (count === 2) return "Second Donation";
    if (count === 3) return "Third Donation";
    if (count === 4) return "Fourth Donation";
    if (count >= 5 && count <= 9) return `${count} Donations`;
    if (count >= 10) return "Platinum Donor";
    return "Blood Donation Hero";
  };

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
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
    const shareText = `I just received my ${getMilestoneTitle()} certificate for blood donation! 🩸❤️`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Blood Donation Certificate",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={() => setShowCertificateModal(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Content */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-br from-stone-50 via-white to-amber-50 p-8 md:p-12"
        >
          {/* Decorative Border */}
          <div className="absolute inset-4 border-2 border-amber-200/60 rounded-2xl"></div>
          <div className="absolute inset-6 border border-amber-300/40 rounded-xl"></div>
          
          {/* Corner Ornaments */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-amber-400/50 rounded-tl-2xl"></div>
          <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-amber-400/50 rounded-tr-2xl"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-amber-400/50 rounded-bl-2xl"></div>
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-amber-400/50 rounded-br-2xl"></div>

          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20px 20px, #ec4899 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">🩸</span>
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-800">
                    Kannur Blood Link
                  </h2>
                  <p className="text-xs text-stone-500 tracking-wider">Life is in your blood</p>
                </div>
              </div>

              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
                  Certificate of Appreciation
                </h1>
                <div className="w-32 h-0.5 bg-gradient-to-r from-amber-400 via-pink-400 to-amber-400 mx-auto"></div>
              </div>

              <p className="text-xs text-stone-400 mt-4 font-mono">
                Certificate ID: <span className="text-stone-600 font-semibold">{selectedCertificate.certificateId}</span>
              </p>
            </div>

            {/* Recipient Section */}
            <div className="text-center mb-8">
              <p className="text-stone-600 text-lg mb-3 font-serif italic">This is proudly presented to</p>
              
              <div className="relative inline-block">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 px-8 pb-4 border-b-2 border-amber-300">
                  {user?.name}
                </h3>
                <div className="absolute -top-3 -left-4 text-amber-400 text-2xl">❝</div>
                <div className="absolute -bottom-3 -right-4 text-amber-400 text-2xl">❞</div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-white px-6 py-2 rounded-full text-lg font-bold shadow-md">
                {getMilestoneTitle()}
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8 space-y-2">
              <p className="text-stone-600 text-lg">For their noble contribution of blood donation on</p>
              <p className="text-3xl font-serif font-bold text-pink-700">
                {new Date(selectedCertificate.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-stone-600">
                at <span className="font-semibold text-stone-800">{selectedCertificate.center}</span>
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-amber-200">
                <p className="text-2xl font-bold text-pink-600">{user?.bloodGroup}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Blood Group</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-amber-200">
                <p className="text-2xl font-bold text-pink-600">{user?.donationCount}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Donations</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-amber-200">
                <p className="text-2xl font-bold text-pink-600">{(user?.donationCount || 0) * 150}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Life Points</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-amber-200">
              <div className="flex-1 text-center">
                <div className="mb-2">
                  <svg className="w-40 h-16 mx-auto" viewBox="0 0 140 50">
                    <path
                      d="M15,35 Q40,15 65,35 T115,35"
                      stroke="#ec4899"
                      fill="none"
                      strokeWidth="2"
                    />
                    <text x="25" y="40" className="text-lg fill-stone-600 font-signature">
                      Dr. Priya Sharma
                    </text>
                  </svg>
                </div>
                <p className="font-serif font-bold text-stone-800">Medical Director</p>
                <p className="text-xs text-stone-500">Kannur Blood Link</p>
              </div>

              <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-300 to-transparent"></div>

              <div className="flex-1 text-center">
                <p className="text-2xl font-serif font-bold text-stone-800 mb-1">
                  {new Date().toLocaleDateString()}
                </p>
                <p className="font-serif font-bold text-stone-800">Date of Issue</p>
                <p className="text-xs text-stone-500">Valid Forever</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="absolute bottom-8 left-8">
              <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-md border border-amber-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${selectedCertificate.certificateId}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-stone-400 text-center mt-1">Scan to verify</p>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 right-8 text-right">
              <p className="text-xs text-stone-400">
                Digitally generated • Valid online
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-stone-50 to-white p-6 rounded-b-3xl border-t border-amber-200">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {isDownloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              Download
            </button>

            <button
              onClick={handleShare}
              className="px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-xl font-medium flex items-center gap-2 hover:bg-pink-50 hover:scale-105 transition-all"
            >
              <FaShareAlt /> Share
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedCertificate.certificateId);
                toast.success("Certificate ID copied!");
              }}
              className="px-6 py-3 border-2 border-stone-300 text-stone-600 rounded-xl font-medium flex items-center gap-2 hover:bg-stone-50 hover:scale-105 transition-all"
            >
              <FaLink /> Copy ID
            </button>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="px-6 py-3 bg-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-300 hover:scale-105 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;