export const DonateBloodPageDetails = {
    quote: {
      classHint: "quote",
      quoteText: `“By donating money, you provide nourishment. By donating blood, you give the gift of life. Join us in this noble cause today!”`,
    },
    why_donate_blood: {
      subheadingText: "Donate blood today",
      headingText: "Why should you donate blood?",
      classHint: "side-col-image why-donate-blood",
      paraText: `Donating blood is a selfless act that has the power to save lives. Here are a few reasons why you should consider donating blood:
            \n― You could help save up to three lives with just one donation.
            ― Blood is always needed in emergency situations, such as natural disasters and accidents.
            ― Blood is needed for patients undergoing surgeries, cancer treatment, and other medical procedures.
            ― Blood cannot be manufactured, which means that the only source of blood is through donations from volunteers.
            ― Donating blood can also have health benefits for the donor, such as reducing the risk of heart disease and cancer.`,
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Donate Now",
      buttonLink: "/donate-blood",
      buttonHave: true,
    },
    eligiblity_criteria: {
      subheadingText: "Are you ready?",
      headingText: "Eligibility Criteria",
      classHint: "side-col-image eligibility-criteria",
      paraText: [
        `18-50 years, above 50 Kg.`,
        `Normal temperature, pulse and blood pressure.`,
        `No Respiratory Diseases`,
        `Above 12.5 g/dL Hemoglobin`,
        `No skin disease, puncture or scars`,
        `No history of transmissible disease`,
      ],
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Donate Now",
      buttonLink: "/donate-blood",
      buttonHave: false,
    },
    hero: {
      subheadingText: "",
      headingText: "",
      classHint: "donate-blood-page-hero",
    },
    stepsText: {
      subheadingText: "Donation Process",
      headingText: "Step-by-Step Guide to Donating Blood",
    },
  };


  export const stepDetails = [
    {
      key: "register-donor",
      stepNumber: "01",
      stepName: "Register as a Donor",
      stepDescription:
        "Sign up on our platform by providing your personal and medical details to create your donor profile.",
    },
    {
      key: "listed-on-seeker-portal",
      stepNumber: "02",
      stepName: "Get Listed on Seeker Portal",
      stepDescription:
        "Once registered, your profile becomes visible to seekers who may need your blood group.",
    },
    {
      key: "contacted-by-seeker",
      stepNumber: "03",
      stepName: "Get Contacted by a Seeker",
      stepDescription:
        "Blood seekers will reach out to you based on compatibility and urgency.",
    },
    {
      key: "donate-blood",
      stepNumber: "04",
      stepName: "Donate Blood",
      stepDescription:
        "Go to the specified hospital, complete the required steps, and donate blood.",
    },
    {
      key: "mark-donated",
      stepNumber: "05",
      stepName: "Mark as Donated",
      stepDescription:
        "After donation, update your status in the platform to track your eligibility cooldown.",
    },
    {
      key: "cooldown-period",
      stepNumber: "06",
      stepName: "3-Month Cooldown",
      stepDescription:
        "You’ll become temporarily inactive for 3 months post-donation. After this period, your profile will be reactivated.",
    },
  ];