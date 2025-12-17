import React, { useState } from 'react';
import { Form, Container, Button, Row, Col, Card, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import emailjs from '@emailjs/browser';
import { supabase } from "../supabase"; // Note: Points to supabase.js in the parent folder

// Import the data we moved in Step 1
import { services, EMAILJS_CONFIG, countryOptions } from '../data';

const ImmigrationPage = () => {
  const service = services.find(s => s.id === 'immigration');
  const [immigrationFormSubmitted, setImmigrationFormSubmitted] = useState(false);
  const [hasImmigrationConsent, setHasImmigrationConsent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [immigrationFormData, setImmigrationFormData] = useState({
    fullName: '', email: '', age: '', education: '', workExperience: '', phone:'',
    languageProficiency: '', currentCountry: '', intendedProvince: '',
    familyInCanada: '', budget: '', citizenship:''
  });

  const handleImmigrationInputChange = (e) => {
    const { name, value } = e.target;
    setImmigrationFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildImmigrationResults = (data) => {
    const results = [];
    if (["bachelor", "master", "phd"].includes(data.education) && ["2-5", "6-10", "10+"].includes(data.workExperience) && ["advanced", "fluent"].includes(data.languageProficiency)) {
      results.push({ id: "express-entry", title: "Express Entry – Skilled Worker Pathway", tagline: "Strong candidate profile for points-based federal programs.", why: "Your combination of higher education, solid work experience, and good language skills aligns well with Express Entry-type programs.", next: "Check your CRS-like score, collect reference letters, and book your language test (IELTS/CELPIP/TEF)." });
    }
    if (data.intendedProvince) {
      results.push({ id: "pnp", title: "Provincial Nominee Program (PNP)", tagline: `Potential fit for ${data.intendedProvince.toUpperCase()}-based programs.`, why: "Choosing a specific province often opens additional PNP pathways aligned with local labour market needs.", next: "Research that province’s PNP streams and look for those matching your occupation and language level." });
    }
    if (data.familyInCanada === "yes") {
      results.push({ id: "family", title: "Leverage Family or Community Ties", tagline: "Existing support network in Canada is a strong asset.", why: "Having family in Canada can help with integration, proof of settlement support, and sometimes eligibility in specific programs.", next: "Talk to your relatives about where they live, and review programs tied to that province or region." });
    }
    if (results.length === 0) {
      results.push({ id: "general", title: "Book a Personalized Immigration Strategy Call", tagline: "Your profile needs a tailored review.", why: "Based on the information provided, the best next step is a 1:1 review to map realistic options and timelines.", next: "Prepare your CV, language test history (if any), and questions, then book a short consultation." });
    }
    return results;
  };

  const handleImmigrationSubmit = async (e) => {
    e.preventDefault();
    const results = buildImmigrationResults(immigrationFormData);
    const formattedResults = results.map((r, index) => `${index + 1}. ${r.title}\n${r.tagline}\nWhy: ${r.why}\nNext: ${r.next}`).join("\n\n");

    if (supabase) {
      try {
        await supabase.from("immigration_forms").insert([{ full_name: immigrationFormData.fullName, email: immigrationFormData.email, phone: immigrationFormData.phone, age: immigrationFormData.age, education: immigrationFormData.education, work_experience: immigrationFormData.workExperience, language: immigrationFormData.languageProficiency, current_country: immigrationFormData.currentCountry, intended_province: immigrationFormData.intendedProvince, family_in_canada: immigrationFormData.familyInCanada, budget: immigrationFormData.budget, citizenship: immigrationFormData.citizenship, assessment_result: formattedResults, submitted_at: new Date().toISOString() }]);
      } catch (err) { console.error("Supabase insert error:", err); }
    }

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.imm_templateID, { from_name: immigrationFormData.fullName, from_email: immigrationFormData.email, message: formattedResults }, EMAILJS_CONFIG.publicKey);
    } catch (err) { alert("We generated your assessment but couldn't send the email automatically."); }

    setImmigrationFormSubmitted(true);
    setHasImmigrationConsent(false);
    setImmigrationFormData({ fullName: "", email: "", age: "", education: "", workExperience: "", languageProficiency: "", currentCountry: "", intendedProvince: "", familyInCanada: "", budget: "", assessment_result: "", phone: "", citizenship:"" });
  };

  const handleResetImmigrationForm = () => {
    setImmigrationFormSubmitted(false);
    setHasImmigrationConsent(false);
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5"><h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1><p className="fs-5 text-muted">{service.description}</p></div>
      <Card className="shadow-lg border-0 p-4 p-md-5 mb-5" id="immigration-form">
        <Card.Body>
          <div className="text-center mb-5"><h2 className="display-6 fw-bold text-primary-dark-green mb-3">Find Your Perfect Canadian Immigration Program</h2><p className="text-muted mx-auto" style={{ maxWidth: '48rem' }}>Take our free assessment to discover which Canadian immigration program best matches your profile. You'll receive a personalized analysis with program recommendations directly to your email .</p></div>
          {immigrationFormSubmitted ? (
            <div className="text-center">
              <Alert variant="success" className="text-center"><i className="bi bi-check-circle-fill display-3 text-success mb-3"></i><Alert.Heading>Assessment Submitted Successfully!</Alert.Heading><p>Check your email for results.</p></Alert>
              <Button variant="main" size="lg" className="mt-3" onClick={handleResetImmigrationForm}><i className="bi bi-arrow-repeat me-2"></i>Submit Another Request</Button>
            </div>
          ) : (
            <Form onSubmit={handleImmigrationSubmit}>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={6}><Form.Label>Full Name *</Form.Label><Form.Control type="text" name="fullName" value={immigrationFormData.fullName} onChange={handleImmigrationInputChange} required /></Form.Group>
                <Form.Group as={Col} md={6}><Form.Label>Email Address *</Form.Label><Form.Control type="email" name="email" value={immigrationFormData.email} onChange={handleImmigrationInputChange} required /></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Phone Number *</Form.Label>
                  <PhoneInput international defaultCountry="CA" value={immigrationFormData.phone} onChange={(value) => { setImmigrationFormData(prev => ({ ...prev, phone: value })); if(!value) setPhoneError("Required"); else if(value.length < 10) setPhoneError("Too short"); else setPhoneError(""); }} className="PhoneInput form-control" />
                  {phoneError && <div style={{ color: "red", fontSize: "0.9rem" }}>{phoneError}</div>}
                </Form.Group>
                <Form.Group as={Col} md={6}><Form.Label>Current Country Of Residence *</Form.Label>
                  <Form.Select name="currentCountry" value={immigrationFormData.currentCountry} onChange={handleImmigrationInputChange} required>
                    <option value="">Select country</option><option value="Canada">Canada</option>
                    {countryOptions.filter((c) => c.label !== "Canada").map((c) => (<option key={c.value} value={c.label}>{c.label}</option>))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                 <Form.Group as={Col} md={6}><Form.Label>Age *</Form.Label><Form.Select name="age" value={immigrationFormData.age} onChange={handleImmigrationInputChange} required><option value="">Select age</option><option value="18-24">18-24</option><option value="25-35">25-35</option><option value="36-45">36-45</option><option value="46-55">46-55</option><option value="55+">55+</option></Form.Select></Form.Group>
                 <Form.Group as={Col} md={6}><Form.Label>Education *</Form.Label><Form.Select name="education" value={immigrationFormData.education} onChange={handleImmigrationInputChange} required><option value="">Select level</option><option value="high-school">High School</option><option value="bachelor">Bachelor's</option><option value="master">Master's</option><option value="phd">PhD</option><option value="diploma">Diploma</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={6}><Form.Label>Work Experience *</Form.Label><Form.Select name="workExperience" value={immigrationFormData.workExperience} onChange={handleImmigrationInputChange} required><option value="">Select years</option><option value="0-1">0-1</option><option value="2-5">2-5</option><option value="6-10">6-10</option><option value="10+">10+</option></Form.Select></Form.Group>
                <Form.Group as={Col} md={6}><Form.Label>Language Proficiency *</Form.Label><Form.Select name="languageProficiency" value={immigrationFormData.languageProficiency} onChange={handleImmigrationInputChange} required><option value="">Select level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="fluent">Fluent</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={6}><Form.Label>Country Of Citizenship *</Form.Label><Form.Select name="citizenship" value={immigrationFormData.citizenship} onChange={handleImmigrationInputChange} required><option value="">Select citizenship</option>{countryOptions.filter((c) => c.label !== "Canada").map((c) => (<option key={c.value} value={c.label}>{c.label}</option>))}</Form.Select></Form.Group>
                <Form.Group as={Col} md={6}><Form.Label>Intended Province *</Form.Label><Form.Select name="intendedProvince" value={immigrationFormData.intendedProvince} onChange={handleImmigrationInputChange} required><option value="">Select province</option><option value="ontario">Ontario</option><option value="bc">BC</option><option value="quebec">Quebec</option><option value="alberta">Alberta</option><option value="manitoba">Manitoba</option><option value="saskatchewan">Saskatchewan</option><option value="nova-scotia">Nova Scotia</option><option value="new-brunswick">New Brunswick</option><option value="pei">PEI</option><option value="newfoundland">Newfoundland</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-4">
                 <Form.Group as={Col} md={6}><Form.Label>Family in Canada? *</Form.Label><Form.Select name="familyInCanada" value={immigrationFormData.familyInCanada} onChange={handleImmigrationInputChange} required><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></Form.Select></Form.Group>
                 <Form.Group as={Col} md={6}><Form.Label>Budget (CAD) *</Form.Label><Form.Select name="budget" value={immigrationFormData.budget} onChange={handleImmigrationInputChange} required><option value="">Select range</option><option value="5000-10000">$5k - $10k</option><option value="10000-20000">$10k - $20k</option><option value="20000-30000">$20k - $30k</option><option value="30000+">$30k+</option></Form.Select></Form.Group>
              </Row>

              <Alert variant="info" className="small">
                <strong>Note:</strong> This assessment is free and confidential and will be emailed to you. <br />
                This tool provides an <strong>informational eligibility assessment only</strong>. It is not legal advice and does not guarantee immigration approval.
                <ul className="mt-2 mb-0" style={{ paddingLeft: "20px" }}>
                  <li>Uses publicly available IRCC and provincial government sources</li>
                  <li>May contain outdated information — always verify on official sites</li>
                  <li>Your data is collected for this assessment and may be stored securely to improve our services.</li>
                  <li>For definitive advice, consult a licensed RCIC or immigration lawyer.</li>
                </ul>
              </Alert>

              <Form.Check id="immigration-consent" type="checkbox" className="mb-4" checked={hasImmigrationConsent} onChange={(e) => setHasImmigrationConsent(e.target.checked)} label="I understand and consent to proceed" />
              <div className="d-grid mt-4"><Button variant="main" type="submit" size="lg" disabled={!hasImmigrationConsent}><i className="bi bi-send me-2"></i>Get My Free Assessment</Button></div>
            </Form>
          )}
        </Card.Body>
      </Card>

      {/* PROCESS */}
      <div className="bg-white rounded-3 p-4 p-md-5 mb-5 shadow-sm">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Our Immigration Process</h2>
        <Row xs={1} md={2} lg={4} className="g-4 text-center">
          {service.details.process.map((step) => (
            <Col key={step.step}><Card className="h-100 shadow-sm border-light p-4"><Card.Body><div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", backgroundColor: "#0f4d3a", color: "white", fontWeight: "bold", fontSize: "1.25rem" }}>{step.step}</div><h5 className="fw-bold text-primary-dark-green mb-2">{step.title}</h5><p className="text-muted small mb-0">{step.description}</p></Card.Body></Card></Col>
          ))}
        </Row>
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-light rounded-3 p-4 p-md-5 mb-5">
        <h2 className="text-center display-6 fw-bold text-primary-dark-green mb-5">Success Stories</h2>
        <Row xs={1} md={2} className="g-4">
          {service.details.testimonials.map((t, i) => (
            <Col key={i}><Card className="shadow-sm border-0 h-100"><Card.Body className="p-4"><div className="d-flex align-items-center mb-3"><div className="icon-box-fix bg-primary-dark-green text-white fs-4 me-3"><i className="bi bi-person"></i></div><div><h6 className="fw-bold text-primary-dark-green mb-0">{t.name}</h6><div className="text-warning"><i className="bi bi-star-fill small"></i><i className="bi bi-star-fill small"></i><i className="bi bi-star-fill small"></i><i className="bi bi-star-fill small"></i><i className="bi bi-star-fill small"></i></div></div></div><p className="text-muted fst-italic">"{t.text}"</p></Card.Body></Card></Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default ImmigrationPage;