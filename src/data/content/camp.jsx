import {
  FaSchool,
  FaUniversity,
  FaUsersCog,
  FaUsers,
  FaHospital,
} from "react-icons/fa";

 

export const organizationTypes = [
  {
    id: "school",
    label: "School",
    icon: <FaSchool />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "college",
    label: "College",
    icon: <FaUniversity />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "corporate",
    label: "Corporate",
    icon: <FaUsersCog />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "ngo",
    label: "NGO/Club",
    icon: <FaUsers />,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "government",
    label: "Govt. Organization",
    icon: <FaHospital />,
    color: "from-indigo-500 to-blue-500",
  },
];


export const stepDetails = [
    {
      key: "submit-application",
      stepNumber: "01",
      stepName: "Submit Application",
      stepDescription:
        "Institutions fill out the form with contact and location details.",
    },
    {
      key: "get-a-call",
      stepNumber: "02",
      stepName: "Coordinator Call",
      stepDescription:
        "Our team will contact you to discuss and schedule the camp.",
    },
    {
      key: "camp-setup",
      stepNumber: "03",
      stepName: "Camp & Awareness Program",
      stepDescription:
        "We conduct the blood donation camp and an optional awareness session.",
    },
  ];


  export const HostBloodDrivePageDetails = {
    quote: {
      classHint: "quote host-drive-quote",
      quoteText: `“Your decision to host a blood drive with us can be the reason someone smiles today, tomorrow, and for many years to come. Let's make a difference together!”`,
    },
    benefits_host_drive: {
      subheadingText: "Being a Hero",
      headingText: "Benefits of Hosting a Blood Drive",
      classHint: "side-col-image benefits-host-drive",
      paraText: `Hosting a blood drive is a great way to give back to your community and help save lives.
			By providing a convenient location for people to donate, you can help ensure that there is a steady supply of blood for those in need.
			Blood drives also provide an opportunity for team building and community involvement, and can boost morale and engagement among employees or group members.`,
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Host Now",
      buttonLink: "/host-blood-drive",
      buttonHave: true,
    },

    hosting_blood_drive: {
      subheadingText: "Collaborate for a Cause",
      headingText: "Host a Blood Donation Camp",
      classHint: "side-col-image hosting-blood-drive",
      paraText: `Are you an institution or organization looking to make a real impact? Partner with us to host a blood donation camp and awareness program at your premises. 
	Simply submit your interest through the form — our coordinator will get in touch to plan and organize the entire event with you.`,
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Apply to Host",
      buttonLink: "/host-blood-drive",
      buttonHave: true,
    },

    hero: {
      subheadingText: "",
      headingText: "",
      classHint: "host-blood-drive-page-hero",
    },
    stepsText: {
      subheadingText: "Guide for Hosting",
      headingText: "Promoting Your Blood Drive",
    },
  };




/* Organization Type UI Mapping */
export const organizationTypeUI = {
  school: {
    label: "School",
    icon: <FaSchool />,
    badge: "bg-blue-100 text-blue-800",
  },
  college: {
    label: "College / University",
    icon: <FaUniversity />,
    badge: "bg-purple-100 text-purple-800",
  },
  corporate: {
    label: "Corporate",
    icon: <FaUsersCog />,
    badge: "bg-green-100 text-green-800",
  },
  ngo: {
    label: "NGO / Club",
    icon: <FaUsers />,
    badge: "bg-orange-100 text-orange-800",
  },
  government: {
    label: "Government",
    icon: <FaHospital />,
    badge: "bg-indigo-100 text-indigo-800",
  },
};

/* Status UI Mapping */
export const statusUI = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
};

