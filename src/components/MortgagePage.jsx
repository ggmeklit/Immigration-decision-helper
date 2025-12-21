import React, { useState } from 'react';
import { Form, Container, Button, Row, Col, Card, Alert } from "react-bootstrap";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import emailjs from '@emailjs/browser';
import { supabase } from "../supabase";

// Import data and helpers
import { services, EMAILJS_CONFIG, formatCurrencyCA } from '../data';

const MortgagePage = () => {
  const service = services.find(s => s.id === 'mortgage');
  const [mortgageFormSubmitted, setMortgageFormSubmitted] = useState(false);
  const [hasMortgageConsent, setHasMortgageConsent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [mortgageFormData, setMortgageFormData] = useState({
    fullName: "", email: "", phone: "", employmentStatus: "", annualIncome: "", creditScore: "",
    downPayment: "", propertyType: "", propertyLocation: "", firstTimeBuyer: "", newcomerStatus: "",
  });

  const handleMortgageInputChange = (e) => {
    const { name, value } = e.target;
    setMortgageFormData(prev => ({ ...prev, [name]: value }));
  };

  const estimateMortgageAmount = (data) => {
    let incomeApprox;
    switch (data.annualIncome) {
      case "under-40k": incomeApprox = 35000; break;
      case "40k-80k": incomeApprox = 60000; break;
      case "80k-150k": incomeApprox = 110000; break;
      case "150k+": incomeApprox = 170000; break;
      default: incomeApprox = 60000;
    }

    let downPaymentApprox;
    switch (data.downPayment) {
      case "under-10k": downPaymentApprox = 8000; break;
      case "50k-100k": downPaymentApprox = 75000; break;
      case "100k+": downPaymentApprox = 125000; break;
      default: downPaymentApprox = 30000;
    }

    let incomeFactor;
    if (data.creditScore === "excellent") incomeFactor = 5.0;
    else if (data.creditScore === "good") incomeFactor = 4.5;
    else if (data.creditScore === "fair") incomeFactor = 4.0;
    else incomeFactor = 3.5;

    const baseLoan = incomeApprox * incomeFactor;
    const lowMortgage = baseLoan * 0.9;
    const highMortgage = baseLoan * 1.1;
    const lowPurchase = lowMortgage + downPaymentApprox;
    const highPurchase = highMortgage + downPaymentApprox;

    return {
      mortgageRangeText: `${formatCurrencyCA(lowMortgage)} – ${formatCurrencyCA(highMortgage)}`,
      purchaseRangeText: `${formatCurrencyCA(lowPurchase)} – ${formatCurrencyCA(highPurchase)}`,
    };
  };

  const buildMortgageResults = (data) => {
    const results = [];
    const approx = estimateMortgageAmount(data);
    if (["80k-150k", "150k+"].includes(data.annualIncome) && ["excellent", "good"].includes(data.creditScore) && ["50k-100k", "100k+"].includes(data.downPayment)) {
      results.push({ id: "prime", title: "Strong Profile for Prime Mortgage Options", tagline: "You may qualify for competitive rates with mainstream lenders.", why: "Your income, credit history, and down payment size indicate a strong overall file for traditional mortgage products.", next: "Gather income documents (NOAs, pay stubs, employment letter) and speak with a mortgage specialist to compare rates and terms.", approxMortgage: `Approximate mortgage amount you might qualify for: ${approx.mortgageRangeText}.`, approxPurchase: `Approximate purchase price range (including your down payment): ${approx.purchaseRangeText}.` });
    }
    if (data.newcomerStatus === "work-permit" || data.creditScore === "no-canadian-credit") {
      results.push({ id: "newcomer", title: "Newcomer / Limited Credit Mortgage Programs", tagline: "Specialized programs are available for clients without long Canadian credit history.", why: "Many lenders have dedicated newcomer products that rely more on income, down payment, and overseas credit than on a long Canadian bureau.", next: "Prepare proof of status in Canada, work permit details (if applicable), and overseas credit statements if available.", approxMortgage: `Very rough mortgage range based on your income and down payment: ${approx.mortgageRangeText}. Final eligibility depends on the specific newcomer program.`, approxPurchase: `Approximate purchase price range: ${approx.purchaseRangeText}.` });
    }
    if (data.firstTimeBuyer === "yes") {
      results.push({ id: "first-time", title: "First-Time Home Buyer Programs & Incentives", tagline: "You may be eligible for rebates and incentives that reduce your upfront costs.", why: "First-time buyers may qualify for land transfer tax rebates and other programs depending on the province and purchase price.", next: "Ask a mortgage specialist to review first-time buyer incentives in your province and estimate your closing costs.", approxMortgage: `Approximate mortgage amount range: ${approx.mortgageRangeText}.`, approxPurchase: `Approximate purchase price range: ${approx.purchaseRangeText}.` });
    }
    if (["under-40k", "40k-80k"].includes(data.annualIncome) || data.downPayment === "under-10k") {
      results.push({ id: "budget", title: "Explore Entry-Level & Insured Mortgage Options", tagline: "Lower down payment usually means focusing on insured or lower-price properties.", why: "With a smaller down payment or more modest income, it’s important to align expectations with realistic price ranges and insured lending rules.", next: "Work with a mortgage specialist to determine your maximum purchase price and monthly payment comfort zone.", approxMortgage: `Current rough mortgage estimate: ${approx.mortgageRangeText}.`, approxPurchase: `Estimated purchase price range: ${approx.purchaseRangeText}.` });
    }
    if (results.length === 0) {
      results.push({ id: "general", title: "Book a Personalized Mortgage Strategy Call", tagline: "Your profile needs a tailored lender and product review.", why: "Based on the information provided, the best next step is a 1:1 review to map realistic budget, lenders, and timelines.", next: "Gather your income documents, down payment proof, and questions, then book a short consultation.", approxMortgage: `Based on your answers, a rough mortgage range might be around ${approx.mortgageRangeText}, but a specialist will refine this.`, approxPurchase: `That would translate into an estimated purchase price range of ${approx.purchaseRangeText}.` });
    }
    return results;
  };

  const handleMortgageSubmit = async (e) => {
    e.preventDefault();
    
    // 1. VALIDATION CHECK
    if (!mortgageFormData.phone || !isValidPhoneNumber(mortgageFormData.phone)) {
      setPhoneError("Please enter a valid phone number.");
      return; 
    }
    setPhoneError("");

    // --- NEW: Generate Results FIRST so we can save to DB ---
    const results = buildMortgageResults(mortgageFormData);
    const msg = results.map(r => `${r.title}\n${r.tagline}\nWhy: ${r.why}\nNext: ${r.next}\n${r.approxMortgage || ''}\n${r.approxPurchase || ''}`).join("\n\n------------------------\n\n");

    // 2. DATABASE INSERT
    if (supabase) {
      try {
        const { error } = await supabase.from("mortgage_forms").insert([
          { 
            full_name: mortgageFormData.fullName, 
            email: mortgageFormData.email, 
            phone: mortgageFormData.phone, 
            down_payment: mortgageFormData.downPayment,       
            property_location: mortgageFormData.propertyLocation, 
            newcomer_status: mortgageFormData.newcomerStatus, 
            credit_score: mortgageFormData.creditScore,       
            employment_status: mortgageFormData.employmentStatus, 
            property_type: mortgageFormData.propertyType,     
            first_time_buyer: mortgageFormData.firstTimeBuyer,
            annual_income: mortgageFormData.annualIncome, 
            assessment_result: msg, // <--- SAVING THE EMAIL RESULT TO DATABASE
            submitted_at: new Date().toISOString() 
          }
        ]);
        
        if (error) {
            console.error("Supabase Error Details:", error);
            alert("Database Error: " + error.message);
            return; 
        }
      } catch (err) { console.error("Supabase error (mortgage):", err); }
    }

    // 3. SEND EMAIL (Using the same 'msg')
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.imm_templateID, { from_name: mortgageFormData.fullName, from_email: mortgageFormData.email, message: msg }, EMAILJS_CONFIG.publicKey);
    } catch (err) { console.error("EmailJS Error", err); }
    
    setMortgageFormSubmitted(true);
  };

  const handleResetMortgageForm = () => {
    setMortgageFormSubmitted(false);
    setHasMortgageConsent(false);
    setMortgageFormData({ fullName: '', email: '', phone: '', employmentStatus: '', annualIncome: '', creditScore: '', downPayment: '', propertyType: '', propertyLocation: '', firstTimeBuyer: '', newcomerStatus: '' });
  };

  return (
    <Container className="py-5">
      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary-dark-green mb-3">{service.title}</h1>
        <p className="fs-5 text-muted">{service.description}</p>
      </div>

      {/* === COMPACT INFO SECTION (Side-by-Side) === */}
      <Row className="g-4 mb-5">
        
        {/* LEFT: Why Choose Us (Features) */}
        <Col lg={6}>
            <div className="bg-white rounded-3 p-4 shadow-sm border h-100">
                <h3 className="fw-bold text-primary-dark-green mb-4 text-start">Why Choose Our Mortgage Services?</h3>
                
                <div className="d-flex flex-column gap-3">
                    {service.details.features.map((f, i) => (
                        <div key={i} className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success fs-4 me-3 flex-shrink-0"></i>
                            <span className="text-muted">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Col>

        {/* RIGHT: Frequently Asked Questions (FAQ) */}
        <Col lg={6}>
            <div className="bg-light rounded-3 p-4 h-100 border">
                <h3 className="fw-bold text-primary-dark-green mb-4 text-center">Frequently Asked Questions</h3>
                <div className="d-flex flex-column gap-3">
                    {service.details.faq.map((item, i) => (
                        <Card key={i} className="border-0 shadow-sm">
                            <Card.Body className="p-3">
                                <h6 className="fw-bold text-primary-dark-green mb-1">{item.question}</h6>
                                <p className="text-muted small mb-0">{item.answer}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </Col>
      </Row>

      {/* === FORM SECTION (Full Width Bottom) === */}
      <Card className="shadow-lg border-0 p-4 p-md-5" id="mortgage-form">
        <Card.Body>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-primary-dark-green mb-3">Discover Your Mortgage Options</h2>
            <p className="text-muted mx-auto">Complete our free mortgage assessment to understand what you may qualify for as a newcomer to Canada.</p>
          </div>
          
          {mortgageFormSubmitted ? (
              <div className="text-center">
                <Alert variant="success"><i className="bi bi-check-circle-fill display-3 text-success mb-3"></i><Alert.Heading>Submitted Successfully!</Alert.Heading><p>Check your email for results.</p></Alert>
                <Button variant="main" size="lg" className="mt-3" onClick={handleResetMortgageForm}>Submit Another Request</Button>
              </div>
          ) : (
            <Form onSubmit={handleMortgageSubmit}>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={6}><Form.Label>Full Name *</Form.Label><Form.Control type="text" name="fullName" value={mortgageFormData.fullName} onChange={handleMortgageInputChange} required/></Form.Group>
                <Form.Group as={Col} md={6}><Form.Label>Email Address*</Form.Label><Form.Control type="email" name="email" value={mortgageFormData.email} onChange={handleMortgageInputChange} required/></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Phone Number *</Form.Label>
                    <PhoneInput 
                      international 
                      defaultCountry="CA" 
                      value={mortgageFormData.phone} 
                      onChange={(val) => { 
                        setMortgageFormData(prev => ({ ...prev, phone: val })); 
                        if (val && isValidPhoneNumber(val)) setPhoneError(""); 
                      }} 
                      className="PhoneInput form-control" 
                    />
                    {phoneError && <div style={{color:"#dc3545", fontSize:"0.875rem", marginTop: "0.25rem"}}>{phoneError}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Employment Status *</Form.Label><Form.Select name="employmentStatus" value={mortgageFormData.employmentStatus} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="employed-full-time">Full-Time</option><option value="employed-part-time">Part-Time</option><option value="self-employed">Self-Employed</option><option value="unemployed">Unemployed</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Annual Household Income (CAD) *</Form.Label><Form.Select name="annualIncome" value={mortgageFormData.annualIncome} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="under-40k">Under $40k</option><option value="40k-80k">$40k-$80k</option><option value="80k-150k">$80k-$150k</option><option value="150k+">$150k+</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Credit Score *</Form.Label><Form.Select name="creditScore" value={mortgageFormData.creditScore} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="excellent">Excellent (740+)</option><option value="good">Good (670-739)</option><option value="fair">Fair (580-669)</option><option value="no-canadian-credit">No Canadian Credit</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Available Down Payment (CAD) *</Form.Label><Form.Select name="downPayment" value={mortgageFormData.downPayment} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="Under100k">Under $10k</option><option value="10k-50k">$10k-$50k</option><option value="50k-100k">$50k-$100k</option><option value="100k+">$100k+</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Property Type *</Form.Label><Form.Select name="propertyType" value={mortgageFormData.propertyType} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="detached">Detached</option><option value="townhouse">Townhouse</option><option value="condo">Condo</option></Form.Select></Form.Group>
              </Row>
              <Row className="g-3 mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Preferred Property Location *</Form.Label><Form.Select name="propertyLocation" value={mortgageFormData.propertyLocation} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="toronto-gta">Toronto & GTA</option><option value="vancouver">Vancouver</option><option value="other">Other</option></Form.Select></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>First-Time Buyer? *</Form.Label><Form.Select name="firstTimeBuyer" value={mortgageFormData.firstTimeBuyer} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="yes">Yes</option><option value="no">No</option></Form.Select></Form.Group>
              </Row>
              <Form.Group className="mb-4"><Form.Label>Are you Newcomer to Canada? *</Form.Label><Form.Select name="newcomerStatus" value={mortgageFormData.newcomerStatus} onChange={handleMortgageInputChange} required><option value="">Select...</option><option value="permanent-resident">Permanent Resident</option><option value="work-permit">Work Permit</option><option value="planning-to-immigrate">Planning to Immigrate</option></Form.Select></Form.Group>

              <Alert variant="info" className="small">
                <strong>Note:</strong> This mortgage assessment is free and confidential and will be emailed to you.
                It is an <strong>informational pre-qualification tool only</strong> and does not constitute a mortgage approval.
                <ul className="mt-2 mb-0" style={{ paddingLeft: "20px" }}>
                  <li>Uses general lender guidelines and may not reflect all programs available in the market.</li>
                  <li>Results are estimates only and can change based on full underwriting and documentation.</li>
                  <li>Your data is collected securely and may be stored to help improve our services.</li>
                  <li>For firm approval, speak directly with a licensed mortgage professional.</li>
                </ul>
              </Alert>

              <Form.Check id="mortgage-consent" type="checkbox" className="mb-4" checked={hasMortgageConsent} onChange={(e) => setHasMortgageConsent(e.target.checked)} label="I understand this is an estimate only and consent to proceed" />
              <div className="d-grid mt-4"><Button variant="main" type="submit" size="lg" disabled={!hasMortgageConsent}><i className="bi bi-send me-2"></i>Get My Free Assessment</Button></div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MortgagePage;