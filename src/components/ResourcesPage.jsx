import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form, Alert } from "react-bootstrap";
import emailjs from '@emailjs/browser';
import { supabase } from "../supabase"; 
import { services, EMAILJS_CONFIG } from '../data';

const ResourcesPage = () => {
  const service = services.find(s => s.id === 'resources');
  
  // === STATE MANAGEMENT ===
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "" });

  // === HANDLER: DOWNLOAD EXISTING RESOURCE ===
  const handleSendResource = async () => {
    if (!formData.email || !formData.fullName) return;

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, { 
        is_resource: true, 
        from_email: formData.email, 
        full_name: formData.fullName, 
        resource_title: selectedItem.title, 
        file_url: selectedItem.fileUrl 
      }, EMAILJS_CONFIG.publicKey);
      
      setShowResourceModal(false);
      setSuccessMessage(`We've successfully emailed "${selectedItem.title}" to you.`);
      setShowSuccessModal(true);
      setFormData({ fullName: "", email: "" });
    } catch (err) { alert("Could not send. Please try again."); }
  };

  // === HANDLER: JOIN WAITLIST ===
  const handleJoinWaitlist = async () => {
    if (!formData.email || !formData.fullName) return;

    if (supabase) {
        try {
            await supabase.from("waitlist").insert([
                { 
                    full_name: formData.fullName, 
                    email: formData.email, 
                    resource_title: selectedItem.title,
                    joined_at: new Date().toISOString()
                }
            ]);
        } catch (err) { console.error("Waitlist DB Error:", err); }
    }

    // Optional: Email Notification to Client
    try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, { 
            is_waitlist: true, 
            from_email: formData.email, 
            full_name: formData.fullName, 
            resource_title: selectedItem.title,
            message: "User joined the waitlist for this course."
        }, EMAILJS_CONFIG.publicKey);
    } catch (err) { console.error("EmailJS Error:", err); }

    setShowWaitlistModal(false);
    setSuccessMessage(`You are on the list! We will email you as soon as "${selectedItem.title}" is ready.`);
    setShowSuccessModal(true);
    setFormData({ fullName: "", email: "" });
  };

  return (
    <Container className="py-5">
      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
        <p className="fs-5 text-muted">{service.description}</p>
      </div>
      
      {/* === DOWNLOADABLE RESOURCES === */}
      <div className="mb-5" id="resources-downloads">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Available Resources</h2>
        <Row xs={1} md={2} className="g-4">
          {service.details.resources.map((r, i) => (
            <Col key={i}>
              <Card className="h-100 shadow-sm border-light hover-lift">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex mb-3">
                    <div className="icon-box-fix bg-primary-dark-green text-white fs-4 me-3">
                      <i className="bi bi-download"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold text-primary-dark-green mb-1">{r.title}</h5>
                      <p className="text-warning fw-semibold mb-2 small">{r.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="text-muted mb-4">{r.description}</p>
                  <div className="mt-auto">
                    <Button 
                        variant="warning" 
                        size="sm"
                        className="text-dark fw-bold px-4"
                        onClick={() => { setSelectedItem(r); setShowResourceModal(true); }}
                    >
                        <i className="bi bi-envelope-paper me-2"></i> Email Me This Guide
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* === STUDY PLANS (WAITLIST) === */}
      <div className="bg-light rounded-3 p-4 p-md-5 border">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Free Structured Study Plans</h2>
        <Row xs={1} md={3} className="g-4">
          {service.details.studyPlans.map((p, i) => (
            <Col key={i}>
              <Card className="text-center h-100 shadow-sm border-0 p-3 hover-lift">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <i className="bi bi-mortarboard-fill text-primary-dark-green display-4"></i>
                  </div>
                  <h5 className="fw-bold text-primary-dark-green mb-2">{p.title}</h5>
                  <div className="text-muted small mb-4">
                    <span className="d-block mb-1"><i className="bi bi-clock me-1"></i> {p.duration}</span>
                    <span className="d-block"><i className="bi bi-bar-chart me-1"></i> {p.level}</span>
                  </div>
                  <div className="mt-auto">
                    {/* WAITLIST BUTTON */}
                    <Button 
                        variant="outline-dark" 
                        size="sm"
                        className="px-4"
                        onClick={() => { setSelectedItem(p); setShowWaitlistModal(true); }}
                    >
                        Join Waitlist
                    </Button>
                    <div className="text-muted extra-small mt-2" style={{fontSize: '0.75rem'}}>Coming Soon</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* === MODAL 1: SEND RESOURCE === */}
      <Modal show={showResourceModal} onHide={() => setShowResourceModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Get Your Free Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">Where should we send <strong>{selectedItem?.title}</strong>?</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </Form.Group>
            {/* DISCLAIMER ADDED HERE TOO FOR SAFETY */}
            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
               We may also send other relevant tips or resources. You may opt out anytime.
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="warning" className="w-100 fw-bold" onClick={handleSendResource}>Send Now</Button>
        </Modal.Footer>
      </Modal>

      {/* === MODAL 2: JOIN WAITLIST (STUDY PLANS) === */}
      <Modal show={showWaitlistModal} onHide={() => setShowWaitlistModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary-dark-green">Join the Waitlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3"><strong>{selectedItem?.title}</strong> is coming soon! Enter your email to get notified first.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </Form.Group>
            
            {/* === NEW DISCLAIMER ADDED HERE === */}
            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
              We may also send other relevant tips or resources. You may opt out anytime.
            </p>

          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="dark" className="w-100 fw-bold" onClick={handleJoinWaitlist}>Notify Me</Button>
        </Modal.Footer>
      </Modal>

      {/* === MODAL 3: SUCCESS FEEDBACK === */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-3 text-success">
            <i className="bi bi-check-circle-fill display-1"></i>
          </div>
          <h3 className="fw-bold text-primary-dark-green mb-3">Success!</h3>
          <p className="text-muted mb-4">{successMessage}</p>
          <Button variant="outline-success" size="lg" onClick={() => setShowSuccessModal(false)}>Close</Button>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ResourcesPage;