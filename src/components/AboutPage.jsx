import React from 'react';
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage = () => (
  <Container className="py-5">
    <div className="text-center mb-5"><h1 className="display-4 fw-bold text-primary-dark-green mb-3">About ThriveBridge</h1><p className="fs-5 text-muted">Our mission, vision, and team behind your success.</p></div>
    <Row className="align-items-center g-5 mb-5">
      <Col lg={6}><h2 className="display-6 fw-bold text-primary-dark-green mb-4">Our Mission</h2><p className="text-muted mb-3">At ThriveBridge, we believe that every newcomer to Canada deserves the opportunity to not just survive, but truly thrive.We provide comprehensive, integrated support services that address the full spectrum of needs faced by immigrants and newcomers as they build their new lives in Canada.From the moment you arrive with dreams and aspirations, to the day you receive your keys to your new home and your Canadian citizenship certificate, we're here to guide you every step of the way.</p><p className="text-muted mb-4"></p><Card bg="success" text="white" className="p-2 mb-3" style={{ maxWidth: "720px" }}><Card.Body className="p-2"><p className="m-0 fw-semibold">"We don't just help you navigate the system – we help you build your future."</p></Card.Body></Card></Col>
      <Col lg={6}><img src="/About_us.jpg" alt="Team and mission" className="img-fluid rounded-3" style={{ width: "100%", height: "400px", objectFit: "cover" }} /></Col>
    </Row>
    <Row className="text-center g-4 mb-5">
      <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-geo-alt"></i></div><h5 className="fw-bold text-primary-dark-green">Nationwide Support</h5><p className="text-muted">Serving newcomers across all provinces</p></Col>
      <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-briefcase"></i></div><h5 className="fw-bold text-primary-dark-green">Expert Team</h5><p className="text-muted">Certified and experienced professionals</p></Col>
      <Col md={4}><div className="icon-box-fix bg-primary-dark-green text-white fs-4 mx-auto mb-3"><i className="bi bi-building"></i></div><h5 className="fw-bold text-primary-dark-green">Integrated Approach</h5><p className="text-muted">Seamless coordination between services</p></Col>
    </Row>
    <Card className="shadow-lg border-0 p-4 p-md-5 text-center">
      <h2 className="display-6 fw-bold text-primary-dark-green mb-5">Meet Our Leadership Team</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {[ { name: 'Semira Tesfai', role: 'Founder & Managing Partner', expertise: 'Immigration Law, RCIC' }, { name: 'Meklit Gebregiorgis', role: 'IT & Infrastructure Strategist', expertise: 'Technology Solutions' }, { name: 'Anna Sagulenko', role: 'Research & Insights Analyst', expertise: 'Market Research' }, { name: 'Rob Milthon', role: 'Enterprise Development Lead', expertise: 'Business Strategy' } ].map((m, i) => (
          <Col key={i}><div className="placeholder-avatar mx-auto mb-3"></div><h5 className="fw-bold text-primary-dark-green mb-1">{m.name}</h5><p className="text-success fw-semibold mb-2">{m.role}</p><p className="text-muted small">{m.expertise}</p></Col>
        ))}
      </Row>
    </Card>
  </Container>
);

export default AboutPage;