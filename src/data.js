import countryList from "react-select-country-list";

// ===================================================================================
// CONFIGURATION & HELPERS
// ===================================================================================

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  imm_templateID: import.meta.env.VITE_EMAILJS_IMM_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export const countryOptions = countryList().getData();

export const formatCurrencyCA = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

// ===================================================================================
// NAVIGATION & SEARCH
// ===================================================================================

export const navigation = [
  { name: 'Home', id: 'home' }, { name: 'Immigration', id: 'immigration' }, { name: 'Mortgage', id: 'mortgage' },
  { name: 'Coaching', id: 'coaching' }, { name: 'Resources', id: 'resources' }, { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' }
];

export const searchIndex = [
  { keyword: 'home', target: 'home' }, { keyword: 'about', target: 'about' }, { keyword: 'mission', target: 'about' },
  { keyword: 'contact', target: 'contact' }, { keyword: 'immigration', target: 'immigration' }, { keyword: 'mortgage', target: 'mortgage' },
  { keyword: 'coaching', target: 'coaching' }, { keyword: 'resources', target: 'resources' },
  { keyword: 'first-time home buyer', target: 'mortgage' }, { keyword: 'first time buyer', target: 'mortgage' },
  { keyword: 'credit', target: 'mortgage' }, { keyword: 'study plan', target: 'resources' }, { keyword: 'education', target: 'resources' },
  { keyword: 'maria rodriguez', target: 'immigration' }, { keyword: 'ahmed hassan', target: 'immigration' },
  { keyword: 'sarah johnson', target: 'coaching' }, { keyword: 'michael chen', target: 'coaching' }, { keyword: 'aisha patel', target: 'coaching' },
  { keyword: 'thrive', target: 'home' }, { keyword: 'thrivebridge', target: 'home' },
  { keyword: 'semira', target: 'about' }, { keyword: 'meklit', target: 'about' }, { keyword: 'anna', target: 'about' }, { keyword: 'rob', target: 'about' },
  { keyword: 'semira tesfai', target: 'about' }, { keyword: 'meklit gebregiorgis', target: 'about' },
  { keyword: 'anna sagulenko', target: 'about' }, { keyword: 'rob milthon', target: 'about' },
];

// ===================================================================================
// SERVICES DATA (FINAL)
// ===================================================================================

export const services = [
  {
    id: 'immigration',
    title: 'Immigration Consulting',
    description: 'Expert guidance on permanent residency, citizenship, and family sponsorship tailored to your journey.',
    linkText: 'Check Eligibility', 
    icon: 'bi-file-earmark-text',
    details: {
      process: [
        { step: 1, title: 'Initial Consultation', description: 'Assess your eligibility and create a personalized immigration strategy' },
        { step: 2, title: 'Document Preparation', description: 'Gather and organize all required documentation with expert guidance' },
        { step: 3, title: 'Application Submission', description: 'Complete and submit your application with confidence' },
        { step: 4, title: 'Follow-up Support', description: 'Ongoing support throughout the processing period' }
      ],
      testimonials: [
        { name: 'Maria Rodriguez', text: 'ThriveBridge helped me navigate the complex PR process with ease. Their expertise made all the difference!' },
        { name: 'Ahmed Hassan', text: 'From consultation to approval, the team was professional, responsive, and genuinely caring.' }
      ]
    }
  },
  {
    id: 'mortgage',
    title: 'Mortgage Finance',
    description: 'Understand mortgage rules, build your credit profile, and qualify sooner for your first Canadian home.',
    linkText: 'Get Pre-Approved',
    icon: 'bi-credit-card',
    details: {
      features: [
        'Specialized newcomer mortgage programs', 'First-time home buyer incentives',
        'Pre-approval within 24 hours', 'Bilingual mortgage specialists', 'Flexible down payment options'
      ],
      faq: [
        { question: 'Do I need Canadian credit history?', answer: 'No! We work with lenders who understand newcomer situations and can approve based on international credit history.' },
        { question: 'What down payment is required?', answer: 'As low as 5% for properties under $500,000, with flexible options for newcomers.' },
        { question: 'How long does approval take?', answer: 'Pre-approval typically takes 24-48 hours once all documents are submitted.' }
      ]
    }
  },
  {
    id: 'coaching',
    title: 'Career & Life Coaching',
    description: 'Prepare for the job market with resume coaching, interview prep, and confidence-building strategies.',
    linkText: 'View Coaching Plans', 
    icon: 'bi-people',
    details: {
      framework: {
        name: 'THRIVE Framework',
        steps: [
          { letter: 'T', title: 'Target', description: 'Define your career goals and aspirations' },
          { letter: 'H', title: 'Honesty', description: 'Assess your current skills and identify gaps' },
          { letter: 'R', title: 'Resources', description: 'Access tools and networks to support your growth' },
          { letter: 'I', title: 'Implementation', description: 'Create actionable steps with accountability' },
          { letter: 'V', title: 'Validation', description: 'Celebrate wins and adjust your approach' },
          { letter: 'E', title: 'Evolution', description: 'Continue growing and adapting to new opportunities' }
        ]
      },
      mentors: [
        { name: 'Sarah Johnson', role: 'Career Coach', expertise: 'Tech Industry, Resume Writing' },
        { name: 'Michael Chen', role: 'Life Coach', expertise: 'Cultural Integration, Confidence Building' },
        { name: 'Aisha Patel', role: 'Executive Coach', expertise: 'Leadership Development, Networking' }
      ]
    }
  },
  {
    id: 'resources',
    title: 'Education & Family',
    // UPDATED LINE BELOW:
    description: 'Free and practical tools for navigating the Canadian school system and supporting your family’s success.',
    linkText: 'Browse Resources',
    icon: 'bi-book',
    details: {
      resources: [
        { title: 'Canadian School System Guide', type: 'PDF Guide', description: 'Comprehensive overview of K-12 education in Canada', fileUrl: 'https://drive.google.com/uc?export=download&id=1vgd_LVDInuD90WVOCpb5LcRXVoiM-Z-E'},
        { title: "Newcomer's guide", type: 'PDF Guide', description: 'Step-by-step career roadmap for newcomers in Canada.', fileUrl:'https://drive.google.com/file/d/1aaLlS-8XueKFIoPsc2L-MVkSgAwViVEz/view?usp=sharing'},
        { title: 'University Application Workbook', type: 'Interactive PDF', description: 'Step-by-step guide for post-secondary applications',fileUrl:'https://drive.google.com/uc?export=download&id=197-x8heOsgf3ic0ibawpL_sDysOh-Bag' },
        { title: 'Cultural Integration Tips', type: 'Podcast', description: 'Practical advice for navigating Canadian culture', fileUrl: 'https://drive.google.com/drive/folders/1wxigscwbzew8d1rJQeitCIuH8_iTDl-l?usp=drive_link' }
      ],
      studyPlans: [
        { title: 'English Language Learning', duration: '12 weeks', level: 'Beginner to Intermediate' },
        { title: 'Professional Certification Prep', duration: '8 weeks', level: 'Advanced' },
        { title: 'Canadian Workplace Culture', duration: '6 weeks', level: 'All levels' }
      ]
    }
  }
];