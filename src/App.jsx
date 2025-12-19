import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, Button, Alert, Row, Col, Modal } from "react-bootstrap";
import './App.css';

// 1. IMPORT DATA
import { navigation, searchIndex } from './data';

// 2. IMPORT COMPONENTS
import HomePage from './components/HomePage';
import ImmigrationPage from './components/ImmigrationPage';
import MortgagePage from './components/MortgagePage';
import CoachingPage from './components/CoachingPage';
import ResourcesPage from './components/ResourcesPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
// Keeping this import but not rendering it
import ImmigrationHelperBot from "./components/ImmigrationHelperBot"; 

// YOUR LINKS
const CALENDLY_URL = "https://calendly.com/infothrivebridge";

// *** YOUR BEEHIIV NEWSLETTER LINK ***
const NEWSLETTER_URL = "https://thrivebridges-newsletter.beehiiv.com/"; 

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchNotFound, setSearchNotFound] = useState('');
  
  // === MODAL STATE ===
  const [showBookingModal, setShowBookingModal] = useState(false);       // Paid Appointment
  const [showAssessmentModal, setShowAssessmentModal] = useState(false); // Free Assessment
  const [showCommunityModal, setShowCommunityModal] = useState(false);   // Beehiiv Newsletter

  // === NAVIGATION HELPER ===
  const goTo = (tabId, anchorId) => {
    setActiveTab(tabId);
    setTimeout(() => {
      if (anchorId) {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setActiveTab(navMatch.id);
    } else if (idxMatch) {
      setActiveTab(idxMatch.target);
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
    <div className="d-flex flex-column min-vh-100 bg-light-gray">
      <style>{`.icon-box-fix { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 12px; overflow: visible; line-height: 1; } .icon-box-fix .bi { font-size: 28px; line-height: 1; display: inline-block; vertical-align: middle; }`}</style>

      {/* NAVBAR */}
      <Navbar bg="white" expand="md" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="fw-bold fs-4 text-primary-dark-green">
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
                  onClick={() => setActiveTab(item.id)} 
                  className="fw-medium"
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
      <main className="flex-grow-1">
        <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
          {/* Passing all modal setters */}
          <HomePage 
            setActiveTab={setActiveTab} 
            setShowBookingModal={setShowBookingModal} 
            setShowAssessmentModal={setShowAssessmentModal} 
            setShowCommunityModal={setShowCommunityModal} 
            goTo={goTo} 
          />
        </div>
        <div style={{ display: activeTab === 'immigration' ? 'block' : 'none' }}>
          <ImmigrationPage />
        </div>
        <div style={{ display: activeTab === 'mortgage' ? 'block' : 'none' }}>
          <MortgagePage />
        </div>
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

      {/* FOOTER */}
      <footer className="bg-primary-dark-green text-white py-5 mt-auto">
        <Container>
          <Row className="g-4">
            <Col md={6}><h4 className="fs-3 fw-bold mb-3">ThriveBridge</h4><p className="text-white-50">Your trusted partner in building a successful life in Canada.</p></Col>
            <Col md={3}><h5 className="fw-semibold mb-3">Quick Links</h5>
              <Nav className="flex-column">
                {navigation.map((item) => (
                  <Nav.Link key={item.id} as="button" onClick={() => setActiveTab(item.id)} className="p-0 mb-2 footer-link text-start">{item.name}</Nav.Link>
                ))}
              </Nav>
            </Col>
            <Col md={3}><h5 className="fw-semibold mb-3">Contact Info</h5><ul className="list-unstyled text-white-50"><li className="mb-2"><i className="bi bi-envelope me-2"></i>semiratesfai11@gmail.com</li><li className="mb-2"><i className="bi bi-telephone me-2"></i>647-896-8004</li><li><i className="bi bi-geo-alt me-2"></i>Toronto, ON</li></ul></Col>
          </Row>
          <div className="border-top border-secondary mt-4 pt-4 text-center text-white-50"><p>&copy; 2024 ThriveBridge. All rights reserved.</p></div>
        </Container>
      </footer>

      {/* === 1. BOOK APPOINTMENT MODAL (PAID) === */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Welcome to ThriveBridge</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="fs-5 mb-4">We are excited to welcome you! Which service would you like to book an appointment for?</p>
          <Alert variant="info" className="small py-2 border-0 mb-4">
            <i className="bi bi-info-circle me-2"></i>
            Note: This is for paid appointments only (<strong>$200 CAD</strong>).
          </Alert>
          <div className="d-grid gap-3">
            <Button variant="main" size="lg" href={CALENDLY_URL} target="_blank">Immigration Appointment</Button>
            <Button variant="main" size="lg" href={CALENDLY_URL} target="_blank">Mortgage Appointment</Button>
          </div>
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted mb-2">Not ready to book yet?</p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="link" className="p-0 text-decoration-none" onClick={() => { setShowBookingModal(false); setShowAssessmentModal(true); }}>Take Free Assessment</Button>
              <span className="text-muted">|</span>
              <Button variant="link" className="p-0 text-decoration-none" onClick={() => { setShowBookingModal(false); goTo('contact', 'contact-form'); }}>Have questions? Contact us</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* === 2. FREE ASSESSMENT MODAL === */}
      <Modal show={showAssessmentModal} onHide={() => setShowAssessmentModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Select Your Free Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="mb-4">Choose the assessment that best fits your needs to get started:</p>
          <div className="d-grid gap-3">
            <Button variant="main" size="lg" onClick={() => { setShowAssessmentModal(false); goTo('immigration', 'immigration-form'); }}>Free Immigration Assessment</Button>
            <Button variant="main" size="lg" onClick={() => { setShowAssessmentModal(false); goTo('mortgage', 'mortgage-form'); }}>Free Mortgage Assessment</Button>
            <div className="text-muted small my-1">- OR -</div>
            <Button variant="accent" size="lg" onClick={() => { setShowAssessmentModal(false); setShowBookingModal(true); }}>Book Appointment with Expert (Paid)</Button>
          </div>
          <div className="mt-4 pt-3 border-top">
             <Button variant="link" className="p-0 text-decoration-none" onClick={() => { setShowAssessmentModal(false); goTo('contact', 'contact-form'); }}>Have questions? Contact us</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* === 3. COMMUNITY / NEWSLETTER MODAL (BEEHIIV) === */}
      <Modal show={showCommunityModal} onHide={() => setShowCommunityModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Join Our Community</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {/* LOADS YOUR BEEHIIV PAGE */}
          <div style={{ width: '100%', height: '600px', overflow: 'hidden' }}>
            <iframe 
              src={NEWSLETTER_URL} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }}
              title="Newsletter Subscription"
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default App;