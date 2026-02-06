import "./donerProfile.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import getData from "../../utility-functions/fetch-data-doner";
import { useEffect, useState } from "react";

const DonerProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getData(setUser);
  }, []);

  console.log(user);

  const lastDonationDate = new Date("2025-03-20");
  const today = new Date();
  const daysSinceLastDonation =
    (today - lastDonationDate) / (1000 * 60 * 60 * 24);
  const isEligible = daysSinceLastDonation >= 90;
  return (
    <WrapperSection>
      <div className="profile-wrapper w-full px-4 py-10 bg-dark_gray/90 -mt-[500px]">
        <div className="profile-background bg-light rounded-xl shadow-2xl max-w-5xl mx-auto p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="md:w-1/3 text-center space-y-4">
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile"
                className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full border-4 border-white shadow-md transition-transform duration-300 hover:scale-105"
              />
              <div className="text-green font-bold text-xl sm:text-2xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span>
                  {user?.name?.length > 12
                    ? user.name.slice(0, 10) + "..."
                    : user?.name}
                </span>
                {user?.dob && (
                  <span className="text-sm sm:text-base font-medium text-off_white">
                    (
                    {Math.floor(
                      (new Date() - new Date(user.dob)) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )}{" "}
                    years old)
                  </span>
                )}
              </div>

              <div className="flex justify-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isEligible ? "bg-green" : "bg-red"
                  } text-white`}
                >
                  {isEligible ? "✅ Eligible to Donate" : "⏳ Not Eligible Yet"}
                </span>
              </div>

              <div className="mt-6 text-left bg-gray-100 bg-white/10  rounded-rmd p-4 space-y-3">
                <h2 className="text-lg font-semibold text-light_red">
                  Donation Status
                </h2>
                <div className="text-dark dark:text-off_white text-sm space-y-1">
                  <p>
                    <strong>Total Donations:</strong>
                    {user?.donationCount}
                  </p>
                  <p>
                    <strong>Last Donation Date:</strong> March 20, 2025
                  </p>
                  <p className="text-xs text-gray-500">
                    You will be hidden from seekers for 3 months after each
                    donation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="min-w-[140px] flex items-center justify-center gap-2 bg-white text-green border border-green hover:bg-green hover:text-white transition-all px-4 py-2 rounded-lg font-semibold shadow-md">
                    ✅ <span>Donated</span>
                  </button>
                  <button className="min-w-[140px] flex items-center  justify-center gap-2 bg-white text-yellow-600 border border-off_white hover:bg-red hover:text-white transition-all px-4 py-2 rounded-lg font-semibold shadow-md">
                    ↩️ <span>Undo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-2/3 space-y-6 bg-white/5 border border-white/10 rounded-rsm p-6 text-sm shadow-md">
              {/* Personal Details */}
              <div className="bg-white/10 rounded-rsm p-4 shadow-inner">
                <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/20 pb-2">
                  🧍 Personal Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-off_white">
                  <div>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {user?.bloodGroup}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {user?.gender}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>
                    {user?.weight} kg
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {user?.dob && new Date(user.dob).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Communication Details */}
              <div className="bg-white/10 rounded-rsm p-4 shadow-inner">
                <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/20 pb-2">
                  📞 Communication Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-off_white">
                  {[
                    { label: "District", value: user?.district },
                    { label: "Taluk", value: user?.taluk },
                    { label: "Mobile", value: user?.mobile },
                    { label: "WhatsApp", value: user?.whatsapp },
                    { label: "Email", value: user?.email },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white/5 border border-white/10 px-3 py-2 rounded-md hover:bg-white/10 transition"
                    >
                      <strong>{label}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="flex-1 min-w-[160px] rounded-md border border-off_white/50 bg-white text-dark hover:bg-red hover:text-white hover:border-red px-6 py-2 font-semibold transition">
                  ✏️ Edit Profile
                </button>
                <button className="flex-1 min-w-[160px] rounded-md border border-green bg-green text-white hover:bg-green/90 px-6 py-2 font-semibold transition">
                  🎓 Apply for Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrapperSection>
  );
};

export default DonerProfile;
