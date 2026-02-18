export  const NeedBloodPageDetails = {
    quote: {
      classHint: "quote need-blood-quote",
      quoteText: `In a blood emergency? Tap below to contact our coordinator directly.`,
      buttonText: "Get Help Now",
      buttonLink: "tel:+919605368262",
      buttonHave: true,
    },
    tips_for_managing_blood_loss: {
      subheadingText: "",
      headingText: "Tips for Managing Blood Loss",
      classHint: "tips-for-managing-blood-loss",
      paraText: [
        `Stay calm and avoid any strenuous activity.`,
        `Elevate the affected area if possible to reduce blood flow.`,
        `Apply pressure to the wound to slow down or stop the bleeding.`,
        `Drink fluids such as water or sports drinks to help replenish lost fluids.`,
        `Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
        `Consider taking iron supplements if recommended by your doctor.`,
        `Keep a record of any symptoms and changes in condition to share with medical professionals.`,
      ],
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonHave: false,
    },
    hero: {
      subheadingText: "",
      headingText: "",
      classHint: "hero need-blood-page-hero",
    },
    stepsText: {
      subheadingText: "Finding Blood Donors",
      headingText:
        "Easily connect with nearby eligible donors in just a few steps.",
    },
    bloodStock: {
      subheadingText: "Find Blood Donors",
      headingText: "Search and connect with eligible donors in your area",
      classHint: "search-blood-stock",
    },
  };

  export const stepDetails = [
    {
      key: "need-blood",
      stepNumber: "01",
      stepName: "Go to 'Need Blood' Portal",
      stepDescription:
        "No registration required. Simply visit the 'Need Blood' section to start your search.",
    },
    {
      key: "filter-donor",
      stepNumber: "02",
      stepName: "Filter Donors",
      stepDescription:
        "Select your district, taluk, and required blood group to find eligible donors near you.",
    },
    {
      key: "view-donors",
      stepNumber: "03",
      stepName: "View Eligible Donors",
      stepDescription:
        "See the names and contact details of donors who live in your taluk and are eligible to donate (3+ months since last donation).",
    },
  ];


  export const districtsData = [
  {
    id: "district1",
    name: "Thiruvananthapuram",
    taluks: ["Chirayinkeezhu", "Kattakada", "Nedumangad", "Neyyattinkara", "Thiruvananthapuram", "Varkala"],
  },
  {
    id: "district2",
    name: "Kollam",
    taluks: ["Karunagappally", "Kollam", "Kottarakkara", "Kunnathur", "Pathanapuram", "Punalur"],
  },
  {
    id: "district3",
    name: "Pathanamthitta",
    taluks: ["Adoor", "Kozhencherry", "Mallappally", "Pathanamthitta", "Ranni", "Thiruvalla", "Konni"],
  },
  {
    id: "district4",
    name: "Alappuzha",
    taluks: ["Ambalappuzha", "Chengannur", "Cherthala", "Karthikappally", "Kuttanad", "Mavelikara"],
  },
  {
    id: "district5",
    name: "Kottayam",
    taluks: ["Changanassery", "Kanjirappally", "Kottayam", "Meenachil", "Vaikom"],
  },
  {
    id: "district6",
    name: "Idukki",
    taluks: ["Devikulam", "Idukki", "Peerumedu", "Thodupuzha", "Udumbanchola"],
  },
  {
    id: "district7",
    name: "Ernakulam",
    taluks: ["Aluva", "Kanayannur", "Kochi", "Kothamangalam", "Kunnathunad", "Muvattupuzha", "Paravur"],
  },
  {
    id: "district8",
    name: "Thrissur",
    taluks: ["Chavakkad", "Chalakudy", "Kodungallor", "Kunnamkulam", "Mukundapuram", "Thalappilly", "Thrissur"],
  },
  {
    id: "district9",
    name: "Palakkad",
    taluks: ["Alathur", "Chittur", "Mannarkkad", "Ottappalam", "Palakkad", "Pattambi"],
  },
  {
    id: "district10",
    name: "Malappuram",
    taluks: ["Eranad", "Kondotty", "Malappuram", "Nilambur", "Perinthalmanna", "Ponnani", "Tirur", "Tirurangadi", "Wandoor"],
  },
  {
    id: "district11",
    name: "Kozhikode",
    taluks: ["Kozhikode", "Koyilandy", "Thamarassery", "Vadakara"],
  },
  {
    id: "district12",
    name: "Wayanad",
    taluks: ["Mananthavady", "Sulthan Bathery", "Vythiri"],
  },
  {
    id: "district13",
    name: "Kannur",
    taluks: ["Kannur", "Kuthuparamba", "Payyannur", "Taliparamba", "Thalassery"],
  },
  {
    id: "district14",
    name: "Kasaragod",
    taluks: ["Hosdurg", "Kasaragod", "Manjeshwaram", "Vellarikundu"],
  },
];

  export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  export  const searchRadii = ["5", "10", "25", "50", "100"]; // in kilometers


  export  const whatsappGroups = [
    {
      name: "Blood Donors - City Central",
      groupLink: "https://chat.whatsapp.com/your-group-link-1",
      regions: ["District 1", "District 2"],
      active: true
    },
    {
      name: "Emergency Blood Network",
      groupLink: "https://chat.whatsapp.com/your-group-link-2", 
      regions: ["District 1", "District 3"],
      active: true
    },
    {
      name: "Universal Donors",
      groupLink: "https://chat.whatsapp.com/your-group-link-3",
      regions: ["District 2", "District 4"],
      active: true
    }
  ];