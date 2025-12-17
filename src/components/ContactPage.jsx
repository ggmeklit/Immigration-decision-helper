import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from "react-bootstrap";
import emailjs from '@emailjs/browser';
import { services, EMAILJS_CONFIG } from '../data';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError(''); setContactSent(false); setContactSending(true);
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, { is_contact: true, from_name: contactForm.name, from_email: contactForm.email, service_of_interest: contactForm.service, message: contactForm.message }, EMAILJS_CONFIG.publicKey);
      setContactSent(true);
      setContactForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) { setContactError('Something went wrong. Please try again.'); } finally { setContactSending(false); }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '960px' }}>
      <div className="text-center mb-5"><h1 className="display-4 fw-bold text-primary-dark-green mb-3">Contact Us</h1><p className="fs-5 text-muted">Get in touch with our team.</p></div>
      <Row className="g-5">
        <Col lg={5}><h2 className="h3 fw-bold text-primary-dark-green mb-4">Get in Touch</h2><ul className="list-unstyled text-muted fs-5"><li className="mb-3"><i className="bi bi-telephone text-primary-dark-green me-3"></i>647-896-8004</li><li className="mb-3"><i className="bi bi-envelope text-primary-dark-green me-3"></i>semiratesfai11@gmail.com</li><li className="mb-4"><i className="bi bi-geo-alt text-primary-dark-green me-3"></i>Toronto, Ontario,Canada</li></ul><Card bg="light" className="border-0"><Card.Body><h5 className="fw-bold text-primary-dark-green mb-3">Office Hours</h5><p className="text-muted mb-1">Monday - Friday- 9am - 6pm</p><p className="text-muted mb-1">Saturday - 10am - 2pm</p><p className="text-muted mb-1">Sunday - Closed</p></Card.Body></Card></Col>
        <Col lg={7}><Card className="p-4 shadow-sm border-0" id="contact-form">
            {contactSent && <Alert variant="success">Inquiry sent successfully!</Alert>}
            {contactError && <Alert variant="danger">{contactError}</Alert>}
            <Form onSubmit={handleContactSubmit}>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>Name</Form.Label><Form.Control type="text" value={contactForm.name} onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={contactForm.email} onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))} required /></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Phone</Form.Label><Form.Control type="tel" value={contactForm.phone} onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))} /></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Service</Form.Label><Form.Select value={contactForm.service} onChange={(e) => setContactForm(prev => ({ ...prev, service: e.target.value }))} required><option value="">Select...</option>{services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}</Form.Select></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Message</Form.Label><Form.Control as="textarea" rows={4} value={contactForm.message} onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))} required /></Form.Group></Col>
                <Col md={12} className="d-grid"><Button variant="main" type="submit" size="lg" disabled={contactSending}>{contactSending ? 'Sending…' : 'Submit Inquiry'}</Button></Col>
              </Row>
            </Form>
        </Card></Col>
      </Row>
    </Container>
  );
};

export default ContactPage;