import React from 'react';
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { services } from '../data';

const keyMoment = "/newcomers_canada_group_toronto.png";

// Receives props from App.jsx to handle navigation and ALL modal triggers
const HomePage = ({ setActiveTab, goTo, setShowBookingModal, setShowAssessmentModal, setShowCommunityModal }) => {
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-hero-gradient text-white py-5">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Your Bridge to Thriving in Canada</h1>
              <p className="fs-5 mb-4 opacity-90">
                Comprehensive support for immigrants and newcomers seeking stability, professional growth, and home ownership in Canada.
              </p>
              
              {/* === THE 3 BUTTONS === */}
              <div className="d-grid gap-3 d-sm-flex flex-wrap">
                <Button variant="accent" size="lg" onClick={() => setShowBookingModal(true)}>
                  Book Appointment Today
                </Button>
                
                <Button variant="outline-light" size="lg" onClick={() => setShowAssessmentModal(true)}>
                  Take Free Assessment
                </Button>

                <Button variant="outline-light" size="lg" onClick={() => setActiveTab('about')}>
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <img src={keyMoment} alt="Newcomers in Canada" className="img-fluid rounded-3" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
            </Col>
          </Row>
        </Container>
      </div>

      {/* SERVICES CARDS */}
      <section className="py-5">
        <Container className="py-md-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary-dark-green mb-3">Support for Every Stage of Your Journey</h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '48rem' }}>Whether you’re planning your move, newly arrived, or ready to buy your first home, ThriveBridge gives you step‑by‑step support to navigate life in Canada.</p>
          </div>
          <Row xs={1} md={2} lg={4} className="g-4">
            {services.map((service) => (
              <Col key={service.id}>
                <Card className="h-100 shadow-sm border-light card-hover" onClick={() => setActiveTab(service.id)} style={{ cursor: 'pointer' }}>
                  <Card.Body className="p-4">
                    <div className="icon-box-fix bg-primary-dark-green text-white fs-4 mb-3"><i className={`bi ${service.icon}`} aria-hidden="true"></i></div>
                    <h4 className="fw-bold text-primary-dark-green mb-2">{service.title}</h4>
                    <p className="text-muted mb-3">{service.description}</p>
                    <span className="text-accent-yellow fw-semibold text-decoration-none">Learn More <i className="bi bi-arrow-right" aria-hidden="true"></i></span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-5">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="display-5 fw-bold text-primary-dark-green mb-4">Building Community Together</h2>
              <p className="fs-5 text-muted mb-4">Get exclusive invitations to community events, special offers, and the latest tips and trends for newcomers.</p>
              
              {/* === JOIN COMMUNITY BUTTON (Triggers Beehiiv Modal) === */}
              <Button variant="main" size="lg" onClick={() => setShowCommunityModal(true)}>
                Join Our Community
              </Button>
              
            </Col>
            <Col lg={6}>
              {/* Using your AI community image */}
              <img src="/community_hub.jpg" alt="Community hub" className="img-fluid rounded-3" style={{ width: "100%", height: "400px", objectFit: "cover" }} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;