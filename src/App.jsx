import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Container, Nav, Form, Button, Alert, Row, Col, Modal, Card } from "react-bootstrap";
import './App.css';

// 1. IMPORT DATA
import { navigation, searchIndex } from './data';

// 2. IMPORT COMPONENTS
import HomePage from './components/HomePage';
import ImmigrationPage from './components/ImmigrationPage';
//import MortgagePage from './components/MortgagePage';
import CoachingPage from './components/CoachingPage';
import ResourcesPage from './components/ResourcesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

// YOUR LINKS
const CALENDLY_URL = "https://calendly.com/infothrivebridge";
const NEWSLETTER_URL = "https://thrivebridges-newsletter.beehiiv.com/"; 

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchNotFound, setSearchNotFound] = useState('');
  
  // Ref for managing focus when switching tabs
  const mainContentRef = useRef(null);

  // === MODAL STATE ===
  const [showBookingModal, setShowBookingModal] = useState(false);       
  const [showResourcesChoiceModal, setShowResourcesChoiceModal] = useState(false); 
  const [showCommunityModal, setShowCommunityModal] = useState(false);   

  // === NAVIGATION HELPER (Updated for Accessibility) ===
  const goTo = (tabId, anchorId) => {
    setActiveTab(tabId);
    
    // Accessibility: Move focus to main content area after switching tabs
    // This allows keyboard users to immediately interact with the new page
    setTimeout(() => {
      if (anchorId) {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.focus({ preventScroll: true }); // Set focus if element is focusable
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Move focus to main container
        if (mainContentRef.current) {
          mainContentRef.current.focus();
        }
      }
    }, 100);
  };

  // === SEARCH HANDLER ===
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const navMatch = navigation.find(n => n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
    const idxMatch = searchIndex.find(entry => entry.keyword.includes(q));

    if (navMatch) {
      goTo(navMatch.id);
    } else if (idxMatch) {
      goTo(idxMatch.target);
    } else {
      setSearchNotFound(`We couldn’t find “${searchQuery}”. Try: home, immigration, mortgage...`);
      setTimeout(() => setSearchNotFound(''), 4000);
      return;
    }
    setSearchQuery('');
    setSearchNotFound('');
  };

  // === FIX: SYNC BROWSER URL ===
  useEffect(() => {
    if (activeTab) window.location.hash = activeTab;
  }, [activeTab]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light-gray position-relative">
      {/* ACCESSIBILITY STYLES: 
        Ensures outline is visible for keyboard users (Tab) but doesn't break layout.
      */}
      <style>{`
        .icon-box-fix { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 12px; overflow: visible; line-height: 1; } 
        .icon-box-fix .bi { font-size: 28px; line-height: 1; display: inline-block; vertical-align: middle; }
        
        /* Skip Link Style */
        .skip-link {
          position: absolute; top: -40px; left: 0; background: #FFB300; color: #000; padding: 8px; z-index: 2000; transition: top 0.2s; font-weight: bold; text-decoration: none;
        }
        .skip-link:focus { top: 0; }

        /* Prevent Layout Shifts on Focus */
        *:focus-visible {
          outline: 3px solid #FFB300 !important; /* High contrast Gold */
          outline-offset: 2px;
        }
        /* Ensure Main Content is focusable programmatically but has no outline unless tabbed */
        main:focus { outline: none !important; }
      `}</style>

      {/* === ACCESSIBILITY: SKIP TO CONTENT === */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* NAVBAR */}
      <Navbar bg="white" expand="md" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" onClick={(e) => { e.preventDefault(); goTo('home'); }} className="fw-bold fs-4 text-primary-dark-green">
            ThriveBridge
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="ms-auto">
              {navigation.map((item) => (
                <Nav.Link 
                  key={item.id} 
                  as="button" 
                  active={activeTab === item.id} 
                  onClick={() => goTo(item.id)} 
                  className="fw-medium"
                  aria-current={activeTab === item.id ? 'page' : undefined} // Tells screen readers which page is active
                >
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
            <Form className="d-flex ms-md-3 mt-3 mt-md-0" onSubmit={handleSearchSubmit} role="search">
              <Form.Control size="sm" type="search" placeholder="Search..." className="me-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search" />
              <Button size="sm" variant="outline-main" type="submit"><i className="bi bi-search"></i></Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {searchNotFound && <Container className="mt-3"><Alert variant="warning" className="py-2 mb-0">{searchNotFound}</Alert></Container>}

      {/* CONTENT AREA */}
      {/* 'tabIndex="-1"' allows us to focus this container with JS, ensuring 'Tab' goes to the first link inside it */}
      <main 
        id="main-content" 
        className="flex-grow-1" 
        ref={mainContentRef} 
        tabIndex="-1"
      >
        <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
          <HomePage 
            setActiveTab={setActiveTab} // Keeping this for internal component buttons
            goTo={goTo} // Passing new accessible goTo function
            setShowBookingModal={setShowBookingModal} 
            setShowResourcesChoiceModal={setShowResourcesChoiceModal} 
            setShowCommunityModal={setShowCommunityModal} 
          />
        </div>
        <div style={{ display: activeTab === 'immigration' ? 'block' : 'none' }}>
          <ImmigrationPage />
        </div>
        {/*<div style={{ display: activeTab === 'mortgage' ? 'block' : 'none' }}>
          <MortgagePage />
        </div>*/}
        <div style={{ display: activeTab === 'coaching' ? 'block' : 'none' }}>
          <CoachingPage setActiveTab={setActiveTab} />
        </div>
        <div style={{ display: activeTab === 'resources' ? 'block' : 'none' }}>
          <ResourcesPage />
        </div>
        <div style={{ display: activeTab === 'about' ? 'block' : 'none' }}>
          <AboutPage />
        </div>
        <div style={{ display: activeTab === 'contact' ? 'block' : 'none' }}>
          <ContactPage />
        </div>
      </main>

      {/* === STICKY BUTTON === */}
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1050 }}>
        <Button 
          variant="warning" 
          className="shadow-lg rounded-pill fw-bold py-3 px-4 d-flex align-items-center gap-2 border-0"
          style={{ transform: 'scale(1.05)', fontSize: '1.1rem' }} 
          onClick={() => setShowBookingModal(true)}
          aria-label="Book an appointment with an expert"
        >
          <i className="bi bi-person-check-fill fs-4" aria-hidden="true"></i>
          <span>Speak to an Expert</span>
        </Button>
      </div>

      {/* FOOTER */}
      <footer className="bg-primary-dark-green text-white py-5 mt-auto">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <h4 className="fs-3 fw-bold mb-3">ThriveBridge</h4>
              <p className="text-white-50">Your trusted partner in building a successful life in Canada.</p>
            </Col>
            
            <Col md={3}>
              <h5 className="fw-semibold mb-3">Quick Links</h5>
              <Nav className="flex-column">
                {navigation.map((item) => (
                  <Nav.Link key={item.id} as="button" onClick={() => goTo(item.id)} className="p-0 mb-2 footer-link text-start">{item.name}</Nav.Link>
                ))}
              </Nav>
            </Col>
            
            <Col md={3}>
              <h5 className="fw-semibold mb-3">Contact Info</h5>
              <ul className="list-unstyled text-white-50">
                <li className="mb-2"><i className="bi bi-envelope me-2"></i>semiratesfai11@gmail.com</li>
                <li className="mb-2"><i className="bi bi-telephone me-2"></i>647-896-8004</li>
                <li><i className="bi bi-geo-alt me-2"></i>Toronto, ON</li>
              </ul>
            </Col>
          </Row>
          <div className="border-top border-secondary mt-4 pt-4 text-center text-white-50"><p>&copy; 2024 ThriveBridge. All rights reserved.</p></div>
        </Container>
      </footer>

      {/* === 1. BOOK APPOINTMENT MODAL (UPDATED WITH COACHING) === */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Book an Expert Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="fs-5 mb-4">Select a service to schedule your consultation:</p>
          <Alert variant="info" className="small py-2 border-0 mb-4">
            <i className="bi bi-info-circle me-2"></i>
            Paid sessions include detailed strategy & analysis (<strong>$200 CAD</strong>).
          </Alert>
          <div className="d-grid gap-3">
            <Button variant="main" size="lg" href={CALENDLY_URL} target="_blank">Immigration Consultation</Button>
            {/* RENAMED BUTTON BELOW */}
            {/*<Button variant="main" size="lg" href={CALENDLY_URL} target="_blank">Mortgage Advice Session</Button>*/}
            <Button variant="main" size="lg" href={CALENDLY_URL} target="_blank">Career & Life Coaching</Button>
          </div>
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted mb-2">Looking for free options first?</p>
            <Button variant="link" className="p-0 text-decoration-none" onClick={() => { setShowBookingModal(false); setShowResourcesChoiceModal(true); }}>Explore Free Resources</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* === 2. NEW "EXPLORE RESOURCES" CHOICE MODAL === */}
      <Modal show={showResourcesChoiceModal} onHide={() => setShowResourcesChoiceModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Explore Free Tools & Resources</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          <Row className="g-4">
             {/* OPTION A: IMMIGRATION */}
             <Col md={6}>
                <Card className="h-100 border-0 shadow-sm text-center">
                    <Card.Body className="d-flex flex-column">
                        <div className="text-primary-dark-green fs-1 mb-2"><i className="bi bi-globe-americas"></i></div>
                        <h6 className="fw-bold">Free Immigration Assessment</h6>
                        <p className="small text-muted mb-4" style={{fontSize: '0.85rem'}}>
                            See how you may qualify for various Canadian immigration pathways.
                        </p>
                        <Button variant="outline-main" className="mt-auto w-100" onClick={() => { setShowResourcesChoiceModal(false); goTo('immigration', 'immigration-form'); }}>Start Assessment</Button>
                    </Card.Body>
                </Card>
             </Col>
             
             {/* OPTION B: MORTGAGE */}
             {/*}
             <Col md={4}>
                <Card className="h-100 border-0 shadow-sm text-center">
                    <Card.Body className="d-flex flex-column">
                        <div className="text-primary-dark-green fs-1 mb-2"><i className="bi bi-house-check"></i></div>
                        <h6 className="fw-bold">Free Mortgage Prequalification</h6>
                        <p className="small text-muted mb-4" style={{fontSize: '0.85rem'}}>
                            Estimate your purchasing power and eligibility without affecting your credit.
                        </p>
                        <Button variant="outline-main" className="mt-auto w-100" onClick={() => { setShowResourcesChoiceModal(false); goTo('mortgage', 'mortgage-form'); }}>Check Eligibility</Button>
                    </Card.Body>
                </Card>
             </Col>
             */}

             {/* OPTION C: EDUCATION */}
             <Col md={6}>
                <Card className="h-100 border-0 shadow-sm text-center">
                    <Card.Body className="d-flex flex-column">
                        <div className="text-primary-dark-green fs-1 mb-2"><i className="bi bi-journal-bookmark"></i></div>
                        <h6 className="fw-bold">Free Educational Resources</h6>
                        <p className="small text-muted mb-4" style={{fontSize: '0.85rem'}}>
                            Access free study plans, newcomer guides, and downloadable PDF tools.
                        </p>
                        <Button variant="outline-main" className="mt-auto w-100" onClick={() => { setShowResourcesChoiceModal(false); setActiveTab('resources'); }}>Browse Resources</Button>
                    </Card.Body>
                </Card>
             </Col>
          </Row>
          
          <div className="text-center mt-4 pt-3 border-top">
             <span className="text-muted small me-2">Need personalized help?</span>
             <Button variant="link" className="p-0 text-decoration-none fw-bold small" onClick={() => { setShowResourcesChoiceModal(false); setShowBookingModal(true); }}>Book with an Expert</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* === 3. NEWSLETTER MODAL === */}
      <Modal show={showCommunityModal} onHide={() => setShowCommunityModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Join Our Community</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div style={{ width: '100%', height: '600px', overflow: 'hidden' }}>
            <iframe src={NEWSLETTER_URL} width="100%" height="100%" frameBorder="0" style={{ border: 0 }} title="Newsletter"></iframe>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default App;