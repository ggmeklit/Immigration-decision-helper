import React from 'react';
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { services } from '../data';

const CoachingPage = ({ setActiveTab }) => {
  const service = services.find(s => s.id === 'coaching');
  return (
    <Container className="py-5">
      <div className="text-center mb-5"><h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1><p className="fs-5 text-muted">{service.description}</p></div>
      <div className="mb-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">{service.details.framework.name}</h2>
        <Row xs={1} md={2} lg={3} xl={6} className="g-4">{service.details.framework.steps.map((step) => (
          <Col key={step.letter}><div className="thrive-card"><div className="thrive-icon">{step.letter}</div><h6 className="fw-bold text-primary-dark-green mb-2">{step.title}</h6><p className="text-muted small">{step.description}</p></div></Col>
        ))}</Row>
      </div>
      <div className="mt-5 mb-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Meet Our Expert Coaches</h2>
        <Row xs={1} md={3} className="g-4">
          {[ { name: 'Sarah Johnson', role: 'Career Coach', exp: 'Tech Industry, Resume Writing' }, { name: 'Michael Chen', role: 'Life Coach', exp: 'Cultural Integration' }, { name: 'Aisha Patel', role: 'Executive Coach', exp: 'Leadership Development' } ].map((c, i) => (
            <Col key={i}><Card className="text-center h-100 shadow-sm border-light p-4"><div className="placeholder-avatar mx-auto mb-3"></div><h5 className="fw-bold text-primary-dark-green">{c.name}</h5><p className="text-success fw-semibold mb-2">{c.role}</p><p className="text-muted small">{c.exp}</p></Card></Col>
          ))}
        </Row>
      </div>
      <div className="text-center"><Button variant="main" size="lg" onClick={() => setActiveTab('contact')}>Book Your Coaching Session</Button></div>
    </Container>
  );
};

export default CoachingPage;