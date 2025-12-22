import React from 'react';
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { services } from '../data';

const keyMoment = "/newcomers_canada_group_toronto.png";

const HomePage = ({ setActiveTab, goTo, setShowBookingModal, setShowResourcesChoiceModal, setShowCommunityModal }) => {
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-hero-gradient text-white py-5">
        <Container className="py-md-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Your Bridge to Thriving in Canada</h1>
              <p className="fs-5 mb-4 opacity-90">
                Personalized immigration guidance, career and education support, and newcomer‑friendly mortgage advice—so you can build a stable, successful life in Canada.
              </p>
              
              {/* === THE CLEAN 3-BUTTON LAYOUT === */}
              <div className="d-grid gap-3 d-sm-flex flex-wrap">
                <Button variant="accent" size="lg" onClick={() => setShowBookingModal(true)}>
                  Book Expert Appointment
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => setShowResourcesChoiceModal(true)}>
                  Explore Free Resources
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => goTo('about')}>
                  About Us
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
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '48rem' }}>
              Whether you’re planning your move, newly arrived, or ready to buy your first home, ThriveBridge gives you step‑by‑step support to navigate life in Canada.
            </p>
          </div>
          
          <Row xs={1} md={2} lg={4} className="g-4">
            {services.map((service) => (
              <Col key={service.id}>
                <Card className="h-100 shadow-sm border-light card-hover" onClick={() => goTo(service.id)} style={{ cursor: 'pointer' }}>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="icon-box-fix bg-primary-dark-green text-white fs-4 mb-3"><i className={`bi ${service.icon}`} aria-hidden="true"></i></div>
                    <h4 className="fw-bold text-primary-dark-green mb-2">{service.title}</h4>
                    <p className="text-muted mb-3 flex-grow-1">{service.description}</p>
                    <span className="text-accent-yellow fw-semibold text-decoration-none mt-auto">
                      {service.linkText || "Learn More"} <i className="bi bi-arrow-right" aria-hidden="true"></i>
                    </span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* COMMUNITY SECTION (Spacing reduced, Original text restored) */}
      <section className="pb-5 pt-3"> 
        <Container className="py-md-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="display-5 fw-bold text-primary-dark-green mb-4">Building Community Together</h2>
              <p className="fs-5 text-muted mb-4">
                Get exclusive invitations to community events, special offers, and the latest tips and trends for newcomers.
              </p>
              
              {/* BUTTON: Clean and simple */}
              <Button variant="main" size="lg" onClick={() => setShowCommunityModal(true)}>
                Join Our Community
              </Button>
            </Col>
            <Col lg={6}>
              <img src="/community_hub.jpg" alt="Community hub" className="img-fluid rounded-3" style={{ width: "100%", height: "400px", objectFit: "cover" }} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;