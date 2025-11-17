// src/App.jsx
// ===================================================================================
// What changed vs your last full working version:
// 1) Added a small searchIndex so search can match extra terms (names/phrases).
// 2) Search now shows “We couldn’t find …” if nothing matches (auto-hides).
// 3) Added floating ChatWidget (site-wide) + anchors for smooth jumps.
// 4) Email js keys added for submit inquiry (contact us form) - not functional yet
// ===================================================================================

import React, { useState, useEffect } from 'react';

// We use your existing React-Bootstrap components (already in your project)
import {
  Navbar, Container, Nav, Button, Row, Col, Card, Form, Alert
} from 'react-bootstrap';

// Keep your CSS import
import './App.css';
import emailjs from '@emailjs/browser';
import { supabase } from "./superbase";
import keyMoment from "./newcomers_canada_group_toronto.png";


// === EMAILJS CONFIG (Contact form only) ===
// Replace YOUR_TEMPLATE_ID and YOUR_PUBLIC_KEY with your EmailJS values
const EMAILJS = {
  serviceId: 'service_7ar5nu7',     // your service ID
  templateId: 'template_nyy9tj3',   // e.g., 'template_contact'
  publicKey: '3njlzxYwwviO68EmZ',     // from EmailJS dashboard → Account → API Keys
};

const App = () => {
  // === MAIN VIEW STATE ===
  // Controls which page (tab) is visible on screen
  const [activeTab, setActiveTab] = useState('home');

  // === SEARCH STATE ===
  // Stores what the user types in the navbar search box
  const [searchQuery, setSearchQuery] = useState('');
  // Stores a small message when search finds nothing
  const [searchNotFound, setSearchNotFound] = useState('');

  // === FORMS STATE (YOUR ORIGINAL) ===
  // Stores values for the Immigration form
  const [immigrationFormData, setImmigrationFormData] = useState({
    fullName: '', email: '', age: '', education: '', workExperience: '',
    languageProficiency: '', currentCountry: '', intendedProvince: '',
    familyInCanada: '', budget: ''
  });
  // Stores values for the Mortgage form
  const [mortgageFormData, setMortgageFormData] = useState({
    fullName: '', email: '', phone: '', employmentStatus: '', annualIncome: '',
    creditScore: '', downPayment: '', propertyType: '', propertyLocation: '',
    firstTimeBuyer: '', newcomerStatus: ''
  });
  // Controls “submitted” success messages after each form submit
  const [immigrationFormSubmitted, setImmigrationFormSubmitted] = useState(false);
  const [mortgageFormSubmitted, setMortgageFormSubmitted] = useState(false);

  // === CONTACT FORM STATE (EmailJS - NEW) ===
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');



  // === CONTENT DATA (YOUR ORIGINAL) ===
  // All service content lives here and is used across pages
  const services = [
    {
      id: 'immigration',
      title: 'Immigration Consulting',
      description: 'Permanent Residency, Citizenship, Family Sponsorship',
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
      
      icon: 'bi-credit-card',
      details: {
        features: [
          'Specialized newcomer mortgage programs',
          'First-time home buyer incentives',
          'Pre-approval within 24 hours',
          'Bilingual mortgage specialists',
          'Flexible down payment options'
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
      title: 'Life Coaching & Career Development',
      description: 'Interview Prep, Professional Networking, Confidence Building',
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
      title: 'Educational Resources',
      description: 'Parent-Child Learning Tools, Canadian School System Navigation',
      icon: 'bi-book',
      details: {
        resources: [
          { title: 'Canadian School System Guide', type: 'PDF Guide', description: 'Comprehensive overview of K-12 education in Canada' },
          { title: 'Parent-Child Activity Kit', type: 'Downloadable', description: 'Fun activities to support language learning and bonding' },
          { title: 'University Application Workbook', type: 'Interactive PDF', description: 'Step-by-step guide for post-secondary applications' },
          { title: 'Cultural Integration Tips', type: 'Video Series', description: 'Practical advice for navigating Canadian culture' }
        ],
        studyPlans: [
          { title: 'English Language Learning', duration: '12 weeks', level: 'Beginner to Intermediate' },
          { title: 'Professional Certification Prep', duration: '8 weeks', level: 'Advanced' },
          { title: 'Canadian Workplace Culture', duration: '6 weeks', level: 'All levels' }
        ]
      }
    }
  ];

  // === NAVIGATION TABS (YOUR ORIGINAL) ===
  // Top navigation uses this list to render each clickable link
  const navigation = [
    { name: 'Home', id: 'home' }, { name: 'Immigration', id: 'immigration' }, { name: 'Mortgage', id: 'mortgage' },
    { name: 'Coaching', id: 'coaching' }, { name: 'Resources', id: 'resources' }, { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  // === SEARCH INDEX (NEW) ===
  // Add extra words/names → which page they should open.
  // You can extend this list anytime without changing the rest of the code.
  const searchIndex = [
    // Core pages
    { keyword: 'home', target: 'home' },
    { keyword: 'about', target: 'about' },
    { keyword: 'mission', target: 'about' },
    { keyword: 'contact', target: 'contact' },

    // Services
    { keyword: 'immigration', target: 'immigration' },
    { keyword: 'mortgage', target: 'mortgage' },
    { keyword: 'coaching', target: 'coaching' },
    { keyword: 'resources', target: 'resources' },

    // Common phrases
    { keyword: 'first-time home buyer', target: 'mortgage' },
    { keyword: 'first time buyer', target: 'mortgage' },
    { keyword: 'credit', target: 'mortgage' },
    { keyword: 'study plan', target: 'resources' },
    { keyword: 'education', target: 'resources' },

    // People names (so typing a name finds the right page)
    { keyword: 'maria rodriguez', target: 'immigration' },
    { keyword: 'ahmed hassan', target: 'immigration' },
    { keyword: 'sarah johnson', target: 'coaching' },
    { keyword: 'michael chen', target: 'coaching' },
    { keyword: 'aisha patel', target: 'coaching' },

    // Brandy terms
    { keyword: 'thrive', target: 'home' },
    { keyword: 'thrivebridge', target: 'home' },

    // Leadership names
    { keyword: 'semira', target: 'about' },
    { keyword: 'meklit', target: 'about' },
    { keyword: 'anna', target: 'about' },
    { keyword: 'rob', target: 'about' },
    { keyword: 'semira tesfai', target: 'about' },
    { keyword: 'meklit gebregiorgis', target: 'about' },
    { keyword: 'anna sagulenko', target: 'about' },
    { keyword: 'rob milthon', target: 'about' },
  ];

  // === FORM INPUT HANDLERS (YOUR ORIGINAL) ===
  // This updates the Immigration form values as you type
  const handleImmigrationInputChange = (e) => {
    const { name, value } = e.target;
    setImmigrationFormData(prev => ({ ...prev, [name]: value }));
  };
  // This updates the Mortgage form values as you type
  const handleMortgageInputChange = (e) => {
    const { name, value } = e.target;
    setMortgageFormData(prev => ({ ...prev, [name]: value }));
  };

  // === CONTACT INPUT HANDLERS (NEW) ===
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // === FORM SUBMIT HANDLERS (YOUR ORIGINAL) ===
  // This handles Immigration form submit and shows a success message
  const handleImmigrationSubmit = async (e) => {
    e.preventDefault();
    setImmigrationFormSubmitted(false);

    try {
      // Insert into Supabase
      const { error } = await supabase
        .from("immigration_forms")
        .insert([
          {
            full_name: immigrationFormData.fullName,
            email: immigrationFormData.email,
            age: immigrationFormData.age,
            education: immigrationFormData.education,
            work_experience: immigrationFormData.workExperience,
            language_proficiency: immigrationFormData.languageProficiency,
            current_country: immigrationFormData.currentCountry,
            intended_province: immigrationFormData.intendedProvince,
            family_in_canada: immigrationFormData.familyInCanada,
            budget: immigrationFormData.budget,
          }
        ]);

      if (error) {
        console.error("Insert error:", error);
        alert("❌ Something went wrong saving your form.");
        return;
      }

      // Success
      setImmigrationFormSubmitted(true);
      alert("✅ Your assessment report has been saved!");

      setImmigrationFormData({
        fullName: "",
        email: "",
        age: "",
        education: "",
        workExperience: "",
        languageProficiency: "",
        currentCountry: "",
        intendedProvince: "",
        familyInCanada: "",
        budget: "",
      });

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("⚠️ Something went wrong. Try again later.");
    }
  };   // ✅ THIS BRACE WAS MISSING


  // This handles Mortgage form submit and shows a success message
  

  // === CONTACT SUBMIT HANDLER (EmailJS - NEW) ===


const handleMortgageSubmit = async (e) => {
  e.preventDefault();

  // INSERT INTO SUPABASE
  const { data, error } = await supabase
    .from('mortgage_forms')
    .insert([
      {
        full_name: mortgageFormData.fullName,
        email: mortgageFormData.email,
        phone: mortgageFormData.phone,
        employment_status: mortgageFormData.employmentStatus,
        income: mortgageFormData.annualIncome,
        credit_score: mortgageFormData.creditScore,
        down_payment: mortgageFormData.downPayment,
        property_type: mortgageFormData.propertyType,
        location: mortgageFormData.propertyLocation,
        first_time_buyer: mortgageFormData.firstTimeBuyer,
        newcomer_status: mortgageFormData.newcomerStatus,
      }
    ]);

  if (error) {
    console.error(error);
    alert("Could not save form to database.");
    return;
  }

  // SUCCESS UI
  setMortgageFormSubmitted(true);

  // RESET FORM AFTER 5s
  setTimeout(() => {
    setMortgageFormSubmitted(false);
    setMortgageFormData({
      fullName: '',
      email: '',
      phone: '',
      employmentStatus: '',
      annualIncome: '',
      creditScore: '',
      downPayment: '',
      propertyType: '',
      propertyLocation: '',
      firstTimeBuyer: '',
      newcomerStatus: '',
    });
  }, 5000);

  alert("Form submitted successfully!");
};
  // === CONTACT SUBMIT HANDLER (EmailJS - NEW) ===
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSent(false);
    setContactSending(true);

    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          phone: contactForm.phone,
          service_of_interest: contactForm.service,
          message: contactForm.message,
        },
        EMAILJS.publicKey
      );

      setContactSent(true);
      setContactForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      console.error(err);
      setContactError('Sorry, something went wrong sending your message. Please try again.');
    } finally {
      setContactSending(false);
    }
  };


  // === SEARCH HANDLER (UPDATED WITH INDEX) ===
  // When you type "home", "mortgage", etc., this jumps to that page.
  // If nothing is found, it shows a small "not found" message near the top.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // 1) Try navigation pages first (Home, Immigration, Mortgage, Coaching, Resources, About, Contact)
    const navMatch = navigation.find(n =>
      n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
    );
    if (navMatch) {
      setActiveTab(navMatch.id);
      setSearchQuery('');
      setSearchNotFound('');
      return;
    }

    // 2) Try service titles next
    const svcMatch = services.find(s =>
      s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
    if (svcMatch) {
      setActiveTab(svcMatch.id);
      setSearchQuery('');
      setSearchNotFound('');
      return;
    }

    // 3) Try extra keywords from the index (names/phrases)
    const idxMatch = searchIndex.find(entry => entry.keyword.includes(q));
    if (idxMatch) {
      setActiveTab(idxMatch.target);
      setSearchQuery('');
      setSearchNotFound('');
      return;
    }

    // 4) Nothing matched → show a friendly message for 4 seconds
    setSearchNotFound(`We couldn’t find “${searchQuery}”. Try: home, immigration, mortgage, coaching, resources, about, contact.`);
    setTimeout(() => setSearchNotFound(''), 4000);
  };

  // === NAVIGATION HELPER ===
  // Smoothly switch tab and (optionally) scroll to an anchor on that page
  const goTo = (tabId, anchorId) => {
    setActiveTab(tabId);
    // Use setTimeout to allow React to re-render the correct tab content first
    setTimeout(() => {
      if (anchorId) {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log(`Scrolled to #${anchorId} on tab ${tabId}`); // Debug log
        } else {
          console.warn(`Element with ID #${anchorId} not found on tab ${tabId}`); // Debug log
        }
      } else {
         window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top if no anchor
         console.log(`Scrolled to top on tab ${tabId}`); // Debug log
      }
    }, 100); // Small delay might be needed
  };

  // === TIDIO EVENT LISTENER ===
  // This runs once when the app loads and listens for messages from Tidio
  useEffect(() => {
    // Define the function that handles messages from Tidio
    const handleTidioMessage = (event) => {
      // Check if the message is from Tidio and has the format we expect
      if (event.data && typeof event.data === 'string' && event.data.startsWith('tidio_navigate::')) {
        console.log("Received Tidio navigation message:", event.data); // Debug log
        // Extract the target tab and anchor ID from the message
        // Format: "tidio_navigate::tabId::anchorId" or "tidio_navigate::tabId"
        const parts = event.data.split('::');
        const tabId = parts[1];
        const anchorId = parts[2] || null; // Anchor ID is optional

        if (tabId) {
          goTo(tabId, anchorId); // Use the goTo function to navigate
        }
      }
    };

    // Add the listener to the window
    window.addEventListener('message', handleTidioMessage);

    // Clean up the listener when the component unmounts (important!)
    return () => {
      window.removeEventListener('message', handleTidioMessage);
    };
  }, []); // The empty array [] means this effect runs only once on mount

  // === HASH LINK LISTENER (NEW) ===
  // Supports URLs like /#immigration:immigration-form and /#mortgage:mortgage-form
  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace('#', '');
      if (!raw) return;
      const [tabId, anchorId] = raw.split(':');
      if (!tabId) return;
      setActiveTab(tabId);
      setTimeout(() => {
        if (anchorId) {
          const el = document.getElementById(anchorId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    };
    window.addEventListener('hashchange', applyHash);
    applyHash(); // handle initial load with a hash
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // === HOME PAGE ===
  // This adds the home/landing content: hero, services grid, community section.
  const renderHome = () => (
    <>
      {/* HERO SECTION (big intro at the top of Home) */}
      <div className="bg-hero-gradient text-white py-5">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Your Bridge to Thriving in Canada</h1>
              <p className="fs-5 mb-4 opacity-90">
                Comprehensive support for immigrants and newcomers seeking stability, professional growth, and home ownership in Canada.
              </p>
              <div className="d-grid gap-3 d-sm-flex">
                <Button variant="accent" size="lg" onClick={() => setActiveTab('contact')}>Get Started Today</Button>
                <Button variant="outline-light" size="lg" onClick={() => setActiveTab('about')}>Learn More</Button>
              </div>
            </Col>
            <Col lg={6}>
              <img
                src={keyMoment}
                alt="Diverse group of newcomers in Canada smiling and holding Canadian flags in Toronto skyline"
                className="img-fluid rounded-3"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* SERVICES CARDS (4 cards that link to each service) */}
      <section className="py-5">
        <Container className="py-md-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary-dark-green mb-3">Our Comprehensive Services</h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '48rem' }}>
              Everything you need to build your new life in Canada, from arrival to establishment and beyond.
            </p>
          </div>

          <Row xs={1} md={2} lg={4} className="g-4">
            {services.map((service) => (
              <Col key={service.id}>
                {/* Clicking this card takes you to that service page */}
                <Card
                  className="h-100 shadow-sm border-light card-hover"
                  onClick={() => setActiveTab(service.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="p-4">
                    {/* ICON — this wrapper stops icons from being cut off */}
                    <div className="icon-box-fix bg-primary-dark-green text-white fs-4 mb-3">
                      <i className={`bi ${service.icon}`} aria-hidden="true"></i>
                    </div>
                    <h4 className="fw-bold text-primary-dark-green mb-2">{service.title}</h4>
                    <p className="text-muted mb-3">{service.description}</p>
                    <span className="text-accent-yellow fw-semibold text-decoration-none">
                      Learn More <i className="bi bi-arrow-right" aria-hidden="true"></i>
                    </span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* COMMUNITY SECTION (simple promo area) */}
      <section className="py-5">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="display-5 fw-bold text-primary-dark-green mb-4">Building Community Together</h2>
              <p className="fs-5 text-muted mb-4">
                Connect with fellow newcomers, share experiences, and build lasting relationships in a supportive environment.
              </p>
              <p className="mb-4">
                Our community hub provides workshops, networking events, and resources to help you feel at home in Canada from day one.
              </p>
              <Button variant="main" size="lg">Join Our Community</Button>
            </Col>
            <Col lg={6}>
              <div className="placeholder-image rounded-3 border border-2 border-dashed p-4">
                IMG-005: Community Hub
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );

  // === IMMIGRATION PAGE ===
  // This adds the Immigration service page: steps, testimonials, and the immigration form.
  const renderImmigration = () => {
    const service = services.find(s => s.id === 'immigration');
    return (
      <Container className="py-5">
        {/* TOP TITLE + DESCRIPTION */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
          <p className="fs-5 text-muted">{service.description}</p>
        </div>

        {/* PROCESS STEPS (4 cards) */}
        <div className="mb-5">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Our Immigration Process</h2>
          <Row xs={1} md={2} lg={4} className="g-4">
            {service.details.process.map((step) => (
              <Col key={step.step}>
                <Card className="text-center h-100 shadow-sm border-light p-3">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-center bg-accent-yellow rounded-circle mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
                      <span className="text-primary-dark-green fw-bold fs-5">{step.step}</span>
                    </div>
                    <h5 className="fw-bold text-primary-dark-green mb-2">{step.title}</h5>
                    <p className="text-muted small">{step.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* TESTIMONIALS (2 cards) */}
        <div className="bg-light rounded-3 p-4 p-md-5 mb-5">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Success Stories</h2>
          <Row xs={1} md={2} className="g-4">
            {service.details.testimonials.map((testimonial, index) => (
              <Col key={index}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-box-fix bg-primary-dark-green text-white fs-4 me-3">
                        <i className="bi bi-person" aria-hidden="true"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-primary-dark-green mb-0">{testimonial.name}</h6>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (<i key={i} className="bi bi-star-fill small" aria-hidden="true"></i>))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted fst-italic">"{testimonial.text}"</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* IMMIGRATION FORM (the actual form users fill out) */}
        <Card className="shadow-lg border-0 p-4 p-md-5" id="immigration-form">
          <Card.Body>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold text-primary-dark-green mb-3">Find Your Perfect Canadian Immigration Program</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '48rem' }}>
                Take our free assessment to discover which Canadian immigration program best matches your profile. You'll receive a personalized analysis with program recommendations directly to your email.
              </p>
            </div>

            {immigrationFormSubmitted ? (
              // SUCCESS MESSAGE (shows after the form is submitted)
              <Alert variant="success" className="text-center">
                <i className="bi bi-check-circle-fill display-3 text-success mb-3" aria-hidden="true"></i>
                <Alert.Heading>Assessment Submitted Successfully!</Alert.Heading>
                <p>Thank you for completing our immigration assessment. Our team will analyze your profile and send your personalized program recommendations to your email shortly.</p>
              </Alert>
            ) : (
              // IMMIGRATION FORM FIELDS
              <Form onSubmit={handleImmigrationSubmit}>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control type="text" name="fullName" value={immigrationFormData.fullName} onChange={handleImmigrationInputChange} required placeholder="Enter your full name" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control type="email" name="email" value={immigrationFormData.email} onChange={handleImmigrationInputChange} required placeholder="Enter your email" />
                  </Form.Group>
                </Row>

                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Age *</Form.Label><Form.Select name="age" value={immigrationFormData.age} onChange={handleImmigrationInputChange} required><option value="">Select your age range</option><option value="18-24">18-24 years</option><option value="25-35">25-35 years</option><option value="36-45">36-45 years</option><option value="46-55">46-55 years</option><option value="55+">55+ years</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Highest Education Level *</Form.Label><Form.Select name="education" value={immigrationFormData.education} onChange={handleImmigrationInputChange} required><option value="">Select your education level</option><option value="high-school">High School</option><option value="bachelor">Bachelor's Degree</option><option value="master">Master's Degree</option><option value="phd">PhD/Doctorate</option><option value="diploma">Diploma/Certificate</option></Form.Select></Form.Group>
                </Row>

                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Work Experience *</Form.Label><Form.Select name="workExperience" value={immigrationFormData.workExperience} onChange={handleImmigrationInputChange} required><option value="">Select your experience level</option><option value="0-1">0-1 years</option><option value="2-5">2-5 years</option><option value="6-10">6-10 years</option><option value="10+">10+ years</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Language Proficiency (English/French) *</Form.Label><Form.Select name="languageProficiency" value={immigrationFormData.languageProficiency} onChange={handleImmigrationInputChange} required><option value="">Select your proficiency level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="fluent">Fluent/Native</option></Form.Select></Form.Group>
                </Row>

                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Current Country of Residence *</Form.Label><Form.Control type="text" name="currentCountry" value={immigrationFormData.currentCountry} onChange={handleImmigrationInputChange} required placeholder="Enter your current country" /></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Intended Province in Canada *</Form.Label><Form.Select name="intendedProvince" value={immigrationFormData.intendedProvince} onChange={handleImmigrationInputChange} required><option value="">Select your preferred province</option><option value="ontario">Ontario</option><option value="bc">British Columbia</option><option value="quebec">Quebec</option><option value="alberta">Alberta</option><option value="manitoba">Manitoba</option><option value="saskatchewan">Saskatchewan</option><option value="nova-scotia">Nova Scotia</option><option value="new-brunswick">New Brunswick</option><option value="pei">Prince Edward Island</option><option value="newfoundland">Newfoundland and Labrador</option></Form.Select></Form.Group>
                </Row>

                <Row className="g-3 mb-4">
                  <Form.Group as={Col} md={6}><Form.Label>Do you have family members in Canada? *</Form.Label><Form.Select name="familyInCanada" value={immigrationFormData.familyInCanada} onChange={handleImmigrationInputChange} required><option value="">Select an option</option><option value="yes">Yes</option><option value="no">No</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Approximate Budget (CAD) *</Form.Label><Form.Select name="budget" value={immigrationFormData.budget} onChange={handleImmigrationInputChange} required><option value="">Select your budget range</option><option value="5000-10000">$5,000 - $10,000</option><option value="10000-20000">$10,000 - $20,000</option><option value="20000-30000">$20,000 - $30,000</option><option value="30000+">$30,000+</option></Form.Select></Form.Group>
                </Row>

                <Alert variant="info" className="small">
                  <strong>Note:</strong> This assessment is free and confidential. Your information will only be used to provide personalized recommendations.
                </Alert>

                <div className="d-grid mt-4">
                  <Button variant="main" type="submit" size="lg">
                    <i className="bi bi-send me-2" aria-hidden="true"></i>Get My Free Immigration Assessment
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  };

  // === MORTGAGE PAGE ===
  // This adds the Mortgage service page: features, FAQ, and the mortgage form.
  const renderMortgage = () => {
    const service = services.find(s => s.id === 'mortgage');
    return (
      <Container className="py-5">
        {/* TOP TITLE + DESCRIPTION */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
          <p className="fs-5 text-muted">{service.description}</p>
        </div>

        {/* FEATURE LIST (3x columns) */}
        <div className="mb-5">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Why Choose Our Mortgage Services?</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {service.details.features.map((feature, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-sm border-light">
                  <Card.Body className="d-flex align-items-center p-4">
                    <i className="bi bi-check-circle-fill text-success fs-4 me-3" aria-hidden="true"></i>
                    <span className="text-muted">{feature}</span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQ LIST (simple Q&A items) */}
        <div className="bg-light rounded-3 p-4 p-md-5 mb-5">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Frequently Asked Questions</h2>
          <Row xs={1} md={1} className="g-4">
            {service.details.faq.map((item, index) => (
              <Col key={index}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold text-primary-dark-green mb-2">{item.question}</h5>
                    <p className="text-muted mb-0">{item.answer}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* MORTGAGE FORM (the actual form users fill out) */}
        <Card className="shadow-lg border-0 p-4 p-md-5" id="mortgage-form">
          <Card.Body>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold text-primary-dark-green mb-3">Discover Your Mortgage Options</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '48rem' }}>
                Complete our free mortgage assessment to understand what you may qualify for as a newcomer to Canada.
              </p>
            </div>

            {mortgageFormSubmitted ? (
              // SUCCESS MESSAGE (shows after the form is submitted)
              <Alert variant="success" className="text-center">
                <i className="bi bi-check-circle-fill display-3 text-success mb-3" aria-hidden="true"></i>
                <Alert.Heading>Assessment Submitted Successfully!</Alert.Heading>
                <p>Thank you for completing our mortgage assessment. Our specialists will review your profile and send personalized options to your email within 24 hours.</p>
              </Alert>
            ) : (
              // MORTGAGE FORM FIELDS
              <Form onSubmit={handleMortgageSubmit}>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Full Name *</Form.Label><Form.Control type="text" name="fullName" value={mortgageFormData.fullName} onChange={handleMortgageInputChange} required/></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Email Address *</Form.Label><Form.Control type="email" name="email" value={mortgageFormData.email} onChange={handleMortgageInputChange} required/></Form.Group>
                </Row>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Phone Number *</Form.Label><Form.Control type="tel" name="phone" value={mortgageFormData.phone} onChange={handleMortgageInputChange} required/></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Employment Status *</Form.Label><Form.Select name="employmentStatus" value={mortgageFormData.employmentStatus} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="employed-full-time">Employed Full-Time</option><option value="employed-part-time">Employed Part-Time</option><option value="self-employed">Self-Employed</option><option value="unemployed">Unemployed</option></Form.Select></Form.Group>
                </Row>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Annual Household Income (CAD) *</Form.Label><Form.Select name="annualIncome" value={mortgageFormData.annualIncome} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="under-40k">Under $40,000</option><option value="40k-80k">$40k - $80k</option><option value="80k-150k">$80k - $150k</option><option value="150k+">$150,000+</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Credit Score (if known) *</Form.Label><Form.Select name="creditScore" value={mortgageFormData.creditScore} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="excellent">Excellent (740+)</option><option value="good">Good (670-739)</option><option value="fair">Fair (580-669)</option><option value="no-canadian-credit">No Canadian Credit</option></Form.Select></Form.Group>
                </Row>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Available Down Payment (CAD) *</Form.Label><Form.Select name="downPayment" value={mortgageFormData.downPayment} onChange={handleMortgageInputChange} required><option value="">Under $10,000</option><option value="10k-50k">$10k - $50k</option><option value="50k-100k">$50k - $100k</option><option value="100k+">$100,000+</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Property Type *</Form.Label><Form.Select name="propertyType" value={mortgageFormData.propertyType} onChange={handleMortgageInputChange} required><option value="">Detached</option><option value="townhouse">Townhouse</option><option value="condo">Condo</option></Form.Select></Form.Group>
                </Row>
                <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Preferred Property Location *</Form.Label><Form.Select name="propertyLocation" value={mortgageFormData.propertyLocation} onChange={handleMortgageInputChange} required><option value="">Toronto & GTA</option><option value="vancouver">Vancouver</option><option value="other">Other</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>First-Time Home Buyer? *</Form.Label><Form.Select name="firstTimeBuyer" value={mortgageFormData.firstTimeBuyer} onChange={handleMortgageInputChange} required><option value="">Yes</option><option value="no">No</option></Form.Select></Form.Group>
                </Row>
                <Form.Group className="mb-4"><Form.Label>Are you a newcomer to Canada? *</Form.Label><Form.Select name="newcomerStatus" value={mortgageFormData.newcomerStatus} onChange={handleMortgageInputChange} required><option value="">Permanent Resident</option><option value="work-permit">Work Permit</option><option value="planning-to-immigrate">Planning to Immigrate</option></Form.Select></Form.Group>

                <Alert variant="info" className="small">
                  <strong>Note:</strong> This mortgage assessment is completely free and confidential. We specialize in newcomer mortgages.
                </Alert>
                <div className="d-grid mt-4">
                  <Button variant="main" type="submit" size="lg"><i className="bi bi-send me-2" aria-hidden="true"></i>Get My Free Mortgage Assessment</Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  };

  // === COACHING PAGE ===
  // This adds the Coaching page: THRIVE framework + mentors + call-to-action.

  const renderCoaching = () => {
  const service = services.find(s => s.id === 'coaching');
  return (
    <Container className="py-5">
      
      {/* TOP TITLE + DESCRIPTION */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
        <p className="fs-5 text-muted">{service.description}</p>
      </div>

      {/* THRIVE FRAMEWORK (6 letters / steps) */}
      <div className="mb-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">
          {service.details.framework.name}
        </h2>

        <Row xs={1} md={2} lg={3} xl={6} className="g-4">
          {service.details.framework.steps.map((step) => (
            <Col key={step.letter}>
              <div className="thrive-card">
                <div className="thrive-icon">{step.letter}</div>

                <h6 className="fw-bold text-primary-dark-green mb-2">
                  {step.title}
                </h6>

                <p className="text-muted small">{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* === MEET OUR EXPERT COACHES (section you were missing) === */}
      <div className="mt-5 mb-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">
          Meet Our Expert Coaches
        </h2>

        <Row xs={1} md={3} className="g-4">
          {/* Coach 1 */}
          <Col>
            <Card className="text-center h-100 shadow-sm border-light p-4">
              <div className="placeholder-avatar mx-auto mb-3"></div>
              <h5 className="fw-bold text-primary-dark-green">Sarah Johnson</h5>
              <p className="text-success fw-semibold mb-2">Career Coach</p>
              <p className="text-muted small">Tech Industry, Resume Writing</p>
            </Card>
          </Col>

          {/* Coach 2 */}
          <Col>
            <Card className="text-center h-100 shadow-sm border-light p-4">
              <div className="placeholder-avatar mx-auto mb-3"></div>
              <h5 className="fw-bold text-primary-dark-green">Michael Chen</h5>
              <p className="text-success fw-semibold mb-2">Life Coach</p>
              <p className="text-muted small">Cultural Integration, Confidence Building</p>
            </Card>
          </Col>

          {/* Coach 3 */}
          <Col>
            <Card className="text-center h-100 shadow-sm border-light p-4">
              <div className="placeholder-avatar mx-auto mb-3"></div>
              <h5 className="fw-bold text-primary-dark-green">Aisha Patel</h5>
              <p className="text-success fw-semibold mb-2">Executive Coach</p>
              <p className="text-muted small">Leadership Development, Networking</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* BOOKING BUTTON (CTA) */}
      <div className="text-center">
        <Button variant="main" size="lg" onClick={() => setActiveTab('contact')}>
          Book Your Coaching Session
        </Button>
      </div>

    </Container>
  );
};

  // === RESOURCES PAGE ===
  // This adds the Resources page: downloads list + study plans.
  const renderResources = () => {
    const service = services.find(s => s.id === 'resources');
    return (
      <Container className="py-5">
        {/* TOP TITLE + DESCRIPTION */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
          <p className="fs-5 text-muted">{service.description}</p>
        </div>

        {/* DOWNLOADABLE RESOURCES LIST */}
        <div className="mb-5" id="resources-downloads">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Available Resources</h2>
          <Row xs={1} md={2} className="g-4">
            {service.details.resources.map((resource, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-sm border-light">
                  <Card.Body className="p-4">
                    <div className="d-flex mb-3">
                      <div className="icon-box-fix bg-primary-dark-green text-white fs-4 me-3">
                        <i className="bi bi-download" aria-hidden="true"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold text-primary-dark-green mb-1">{resource.title}</h5>
                        <p className="text-accent-yellow fw-semibold mb-2">{resource.type}</p>
                      </div>
                    </div>
                    <p className="text-muted">{resource.description}</p>
                    <Button variant="outline-main" className="mt-auto">
                      Download Now <i className="bi bi-download ms-1" aria-hidden="true"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* STUDY PLANS GRID */}
        <div className="bg-light rounded-3 p-4 p-md-5">
          <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Structured Study Plans</h2>
          <Row xs={1} md={3} className="g-4">
            {service.details.studyPlans.map((plan, index) => (
              <Col key={index}>
                <Card className="text-center h-100 shadow-sm border-0 p-3">
                  <Card.Body>
                    <i className="bi bi-calendar-event text-primary-dark-green display-6 mb-3" aria-hidden="true"></i>
                    <h5 className="fw-bold text-primary-dark-green mb-2">{plan.title}</h5>
                    <div className="d-flex justify-content-center gap-4 text-muted small mb-3">
                      <span><i className="bi bi-clock me-1" aria-hidden="true"></i>{plan.duration}</span>
                      <span><i className="bi bi-mortarboard me-1" aria-hidden="true"></i>{plan.level}</span>
                    </div>
                    <Button variant="main">Enroll Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    );
  };

  // === ABOUT PAGE ===
  // This adds the About page: includes the clearly labeled “OUR MISSION” section.
  const renderAbout = () => (
    <Container className="py-5">
      {/* PAGE HEADER */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary-dark-green mb-3">About ThriveBridge</h1>
        <p className="fs-5 text-muted">Our mission, vision, and the team behind your success</p>
      </div>

      {/* OUR MISSION SECTION (left text + right placeholder image) */}
      <Row className="align-items-center g-5 mb-5">
        <Col lg={6}>
          {/* === OUR MISSION SECTION (inside About page) === */}
          <h2 className="display-6 fw-bold text-primary-dark-green mb-4">Our Mission</h2>
          <p className="text-muted mb-3">
            At ThriveBridge, we believe that every newcomer to Canada deserves the opportunity to not just survive, but truly thrive. We provide comprehensive, integrated support services that address the full spectrum of needs faced by immigrants and newcomers as they build their new lives in Canada.
          </p>
          <p className="text-muted mb-4">
            From the moment you arrive with dreams and aspirations, to the day you receive your keys to your new home and your Canadian citizenship certificate, we're here to guide you every step of the way.
          </p>
          <Card bg="success" text="white" className="p-3">
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>"We don't just help you navigate the system – we help you build your future."</p>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <div className="placeholder-image rounded-3 border border-2 border-dashed p-4">IMG-004: The Bridge Metaphor</div>
        </Col>
      </Row>

      {/* THREE FEATURE ICONS (Nationwide / Expert Team / Integrated) */}
      <Row className="text-center g-4 mb-5">
        <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-geo-alt" aria-hidden="true"></i></div><h5 className="fw-bold text-primary-dark-green">Nationwide Support</h5><p className="text-muted">Serving newcomers across all provinces</p></Col>
        <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-briefcase" aria-hidden="true"></i></div><h5 className="fw-bold text-primary-dark-green">Expert Team</h5><p className="text-muted">Certified and experienced professionals</p></Col>
        <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-building" aria-hidden="true"></i></div><h5 className="fw-bold text-primary-dark-green">Integrated Approach</h5><p className="text-muted">Seamless coordination between services</p></Col>
      </Row>

      {/* LEADERSHIP GRID (4 people) */}
      <Card className="shadow-lg border-0 p-4 p-md-5 text-center">
        <h2 className="display-6 fw-bold text-primary-dark-green mb-5">Meet Our Leadership Team</h2>
        <Row xs={1} md={2} lg={4} className="g-4">
          {[
            { name: 'Semira Tesfai', role: 'Founder & Managing Partner', expertise: 'Immigration Law, RCIC' },
            { name: 'Meklit Gebregiorgis', role: 'IT & Infrastructure Strategist', expertise: 'Technology Solutions' },
            { name: 'Anna Sagulenko', role: 'Research & Insights Analyst', expertise: 'Market Research' },
            { name: 'Rob Milthon', role: 'Enterprise Development Lead', expertise: 'Business Strategy' }
          ].map((member, index) => (
            <Col key={index}>
              <div className="placeholder-avatar mx-auto mb-3"></div>
              <h5 className="fw-bold text-primary-dark-green mb-1">{member.name}</h5>
              <p className="text-success fw-semibold mb-2">{member.role}</p>
              <p className="text-muted small">{member.expertise}</p>
            </Col>
          ))}
        </Row>
        <div className="border-top mt-5 pt-4">
          <p className="h4 fw-bold text-primary-dark-green fst-italic">"Designing movements, systems, and services that empower lives."</p>
        </div>
      </Card>
    </Container>
  );

  // === CONTACT PAGE ===
  // This adds the Contact page: your contact info + a simple inquiry form.
  const renderContact = () => (
    <Container className="py-5" style={{ maxWidth: '960px' }}>
      {/* PAGE HEADER */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary-dark-green mb-3">Contact Us</h1>
        <p className="fs-5 text-muted">Get in touch with our team to discuss how we can support your goals.</p>
      </div>

      {/* TWO COLUMNS: left info / right form */}
      <Row className="g-5">
        {/* CONTACT INFO BOX */}
        <Col lg={5}>
          <h2 className="h3 fw-bold text-primary-dark-green mb-4">Get in Touch</h2>
          <ul className="list-unstyled text-muted fs-5">
            <li className="mb-3"><i className="bi bi-telephone text-primary-dark-green me-3" aria-hidden="true"></i>647-896-8004</li>
            <li className="mb-3"><i className="bi bi-envelope text-primary-dark-green me-3" aria-hidden="true"></i>semiratesfai11@gmail.com</li>
            <li className="mb-4"><i className="bi bi-geo-alt text-primary-dark-green me-3" aria-hidden="true"></i>Toronto, Ontario, Canada</li>
          </ul>
          <Card bg="light" className="border-0">
            <Card.Body>
              <h5 className="fw-bold text-primary-dark-green mb-3">Office Hours</h5>
              <p className="text-muted mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-muted mb-1">Saturday: 10:00 AM - 2:00 PM</p>
              <p className="text-muted mb-0">Sunday: Closed</p>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTACT FORM — EmailJS wired (ONLY this form) */}
        <Col lg={7}>
          <Card className="p-4 shadow-sm border-0" id="contact-form">
            {contactSent && (
              <Alert variant="success" className="mb-4">
                Thanks! Your inquiry has been sent. We’ll get back to you shortly.
              </Alert>
            )}
            {contactError && (
              <Alert variant="danger" className="mb-4">
                {contactError}
              </Alert>
            )}

            <Form onSubmit={handleContactSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactInputChange}
                      placeholder="Enter your phone"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Service of Interest</Form.Label>
                    <Form.Select
                      name="service"
                      value={contactForm.service}
                      onChange={handleContactInputChange}
                      required
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      placeholder="Tell us about your needs..."
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="d-grid">
                  <Button variant="main" type="submit" size="lg" disabled={contactSending}>
                    {contactSending ? 'Sending…' : 'Submit Inquiry'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  // === PAGE SWITCHER ===
  // This chooses which page to show based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'immigration': return renderImmigration();
      case 'mortgage': return renderMortgage();
      case 'coaching': return renderCoaching();
      case 'resources': return renderResources();
      case 'about': return renderAbout();
      case 'contact': return renderContact();
      default: return renderHome();
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light-gray">
      {/* === LOCAL ICON FIX CSS (kept tiny and safe) === */}
      <style>{`
        .icon-box-fix {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          overflow: visible;
          line-height: 1;
        }
        .icon-box-fix .bi {
          font-size: 28px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>

      {/* === TOP NAVBAR === */}
      <Navbar bg="white" expand="md" sticky="top" className="shadow-sm">
        <Container>
          {/* BRAND (clicking goes to Home) */}
          <Navbar.Brand
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
            className="fw-bold fs-4 text-primary-dark-green"
          >
            ThriveBridge
          </Navbar.Brand>

          {/* MOBILE TOGGLER */}
          <Navbar.Toggle aria-controls="main-navbar-nav" />

          <Navbar.Collapse id="main-navbar-nav">
            {/* MAIN NAV LINKS */}
            <Nav className="ms-auto">
              {navigation.map((item) => (
                <Nav.Link
                  key={item.id}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="fw-medium"
                >
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>

            {/* SEARCH FORM (type a page name then press Enter) */}
            <Form className="d-flex ms-md-3 mt-3 mt-md-0" onSubmit={handleSearchSubmit} role="search">
              <Form.Control
                size="sm"
                type="search"
                placeholder="Search pages..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <Button size="sm" variant="outline-main" type="submit">
                <i className="bi bi-search" aria-hidden="true"></i>
                <span className="visually-hidden">Search</span>
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* OPTIONAL SEARCH 'NOT FOUND' MESSAGE (auto hides after a few seconds) */}
      {searchNotFound && (
        <Container className="mt-3">
          <Alert variant="warning" className="py-2 mb-0">{searchNotFound}</Alert>
        </Container>
      )}

      {/* MAIN PAGE CONTENT */}
      <main className="flex-grow-1">
        {renderContent()}
      </main>

      {/* FOOTER (site-wide) */}
      
      <footer className="bg-primary-dark-green text-white py-5 mt-auto">
      <Container>
        <Row className="g-4">
          <Col md={6}>
            <h4 className="fs-3 fw-bold mb-3">ThriveBridge</h4>
            <p className="text-white-50">
              Your trusted partner in building a successful life in Canada. From immigration to homeownership, we're here for your entire journey.
            </p>
          </Col>

          {/* ✅ Quick Links with highlight-on-click */}
          <Col md={3}>
            <h5 className="fw-semibold mb-3">Quick Links</h5>
            <Nav className="flex-column">
              {navigation.map((item) => (
                <Nav.Link
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-0 mb-2 footer-link"
                >
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
          </Col>
          

          {/* Contact Section */}
          <Col md={3}>
            <h5 className="fw-semibold mb-3">Contact Info</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>semiratesfai11@gmail.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>647-896-8004
              </li>
              <li>
                <i className="bi bi-geo-alt me-2"></i>Toronto, ON
              </li>
            </ul>
          </Col>
        </Row>

        {/* COPYRIGHT */}
        <div className="border-top border-secondary mt-4 pt-4 text-center text-white-50">
          <p>&copy; 2024 ThriveBridge. All rights reserved.</p>
        </div>
      </Container>
</footer>


      
    </div>
  );
};

export default App;
