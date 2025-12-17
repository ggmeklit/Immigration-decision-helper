import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from "react-bootstrap";
import emailjs from '@emailjs/browser';
import { services, EMAILJS_CONFIG } from '../data';

const ResourcesPage = () => {
  const service = services.find(s => s.id === 'resources');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceUser, setResourceUser] = useState({ fullName: "", email: "" });

  const handleSendResource = async () => {
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, { is_resource: true, from_email: resourceUser.email, full_name: resourceUser.fullName, resource_title: selectedResource.title, file_url: selectedResource.fileUrl }, EMAILJS_CONFIG.publicKey);
      alert("The file has been emailed to you!");
      setShowResourceModal(false);
      setResourceUser({ fullName: "", email: "" });
    } catch (err) { alert("Could not send the file. Please try again."); }
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5"><h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1><p className="fs-5 text-muted">{service.description}</p></div>
      <div className="mb-5" id="resources-downloads">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Available Resources</h2>
        <Row xs={1} md={2} className="g-4">{service.details.resources.map((r, i) => (
          <Col key={i}><Card className="h-100 shadow-sm border-light"><Card.Body className="p-4"><div className="d-flex mb-3"><div className="icon-box-fix bg-primary-dark-green text-white fs-4 me-3"><i className="bi bi-download"></i></div><div><h5 className="fw-bold text-primary-dark-green mb-1">{r.title}</h5><p className="text-accent-yellow fw-semibold mb-2">{r.type}</p></div></div><p className="text-muted">{r.description}</p><Button variant="outline-main" className="mt-auto" onClick={() => { setSelectedResource(r); setShowResourceModal(true); }}>Download Now <i className="bi bi-download ms-1"></i></Button></Card.Body></Card></Col>
        ))}</Row>
      </div>
      <div className="bg-light rounded-3 p-4 p-md-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Structured Study Plans</h2>
        <Row xs={1} md={3} className="g-4">{service.details.studyPlans.map((p, i) => (<Col key={i}><Card className="text-center h-100 shadow-sm border-0 p-3"><Card.Body><i className="bi bi-calendar-event text-primary-dark-green display-6 mb-3"></i><h5 className="fw-bold text-primary-dark-green mb-2">{p.title}</h5><div className="d-flex justify-content-center gap-4 text-muted small mb-3"><span><i className="bi bi-clock me-1"></i>{p.duration}</span><span><i className="bi bi-mortarboard me-1"></i>{p.level}</span></div><Button variant="main">Enroll Now</Button></Card.Body></Card></Col>))}</Row>
      </div>

      <Modal show={showResourceModal} onHide={() => setShowResourceModal(false)}>
        <Modal.Header closeButton><Modal.Title>Receive Your File</Modal.Title></Modal.Header>
        <Modal.Body><Form><Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={resourceUser.fullName} onChange={(e) => setResourceUser({ ...resourceUser, fullName: e.target.value })} required /></Form.Group><Form.Group className="mb-3"><Form.Label>Email Address</Form.Label><Form.Control type="email" value={resourceUser.email} onChange={(e) => setResourceUser({ ...resourceUser, email: e.target.value })} required /></Form.Group></Form></Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowResourceModal(false)}>Cancel</Button><Button variant="main" onClick={handleSendResource}>Send File</Button></Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResourcesPage;