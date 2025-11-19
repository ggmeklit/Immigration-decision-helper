import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Badge, Alert } from "react-bootstrap";

/**
 * Canada Immigration Program Helper (React)
 * Educational prototype only — NOT legal advice.
 */
const ImmigrationHelperBot = () => {
  const [form, setForm] = useState({
    age: "",
    eduLevel: "",
    canExp: "",
    outExp: "",
    hasCanadianEdu: "",
    langLevel: "",
  });
  const [validated, setValidated] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const mapEducationScore = (level) => {
    switch (level) {
      case "pg":
        return 5; // Master's/PhD
      case "bachelor":
        return 4;
      case "2y":
        return 3;
      case "1y":
        return 2;
      case "hs":
        return 1;
      default:
        return 0;
    }
  };

  const mapLanguageScore = (level) => {
    if (level === ">=9") return 3; // CLB9+
    if (level === "7-8") return 2; // CLB7–8
    return 1; // <7
  };

  const suggestPrograms = ({ age, eduLevel, canExp, outExp, hasCanadianEdu, langLevel }) => {
    const ageNum = Number(age);
    const canExpNum = Number(canExp);
    const outExpNum = Number(outExp);

    const eduScore = mapEducationScore(eduLevel);
    const langScore = mapLanguageScore(langLevel);
    const totalExp = (canExpNum || 0) + (outExpNum || 0);

    const suggestions = [];
    const notes = [];

    // Canadian Experience Class (CEC)
    if (canExpNum >= 1 && langScore >= 2) {
      suggestions.push({ key: "CEC", why: "≥1 year skilled Canadian experience and CLB 7+" });
    }

    // Federal Skilled Worker (FSW)
    if (outExpNum >= 1 && eduScore >= 3 && ageNum <= 45 && langScore >= 2) {
      suggestions.push({
        key: "FSW",
        why: "Foreign skilled experience, post-secondary education, CLB 7+, age ≤45",
      });
    }

    // Provincial Nominee Programs (PNP)
    if (totalExp >= 1) {
      suggestions.push({
        key: "PNP",
        why: "Work experience present — explore province-specific streams or those with job offers.",
      });
    }

    // Student → PGWP → CEC pathway hint
    if (hasCanadianEdu === "yes") {
      suggestions.push({
        key: "CEC (via PGWP)",
        why: "Canadian education can support work eligibility (PGWP) leading to CEC.",
      });
    } else if (totalExp < 1 && eduScore >= 3 && ageNum <= 35) {
      notes.push(
        "If no skilled experience yet, a study-then-work pathway may be viable (program choice & finances matter)."
      );
    }

    // Work-permit/job-offer angle
    if (langScore >= 2 && ageNum <= 50 && totalExp >= 2) {
      notes.push(
        "A job offer (LMIA or LMIA-exempt) could strengthen options, including certain PNPs."
      );
    }

    // Age considerations
    if (ageNum >= 46) {
      notes.push(
        "Age can reduce points in Express Entry; consider PNPs with employer ties, francophone streams, or study/work alternatives."
      );
    }

    // Language improvement
    if (langScore < 3) {
      notes.push("Improving language to CLB 9+ often boosts competitiveness in EE and some PNPs.");
    }

    if (suggestions.length === 0) {
      suggestions.push({
        key: "Explore PNP / Work / Study routes",
        why: "Profile may not be competitive for EE yet; alternatives can build eligibility.",
      });
    }

    return { suggestions, notes };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      setValidated(true);
      return;
    }

    const payload = {
      age: form.age,
      eduLevel: form.eduLevel,
      canExp: form.canExp,
      outExp: form.outExp,
      hasCanadianEdu: form.hasCanadianEdu,
      langLevel: form.langLevel,
    };

    const res = suggestPrograms(payload);
    setResult({ ...res, inputs: payload });

    // Optional GA4 event if gtag is present globally
    if (typeof window.gtag === "function") {
      window.gtag("event", "immigration_helper_result", {
        suggestion_keys: res.suggestions.map((s) => s.key).join(","),
      });
    }
  };

  const onReset = () => {
    setForm({
      age: "",
      eduLevel: "",
      canExp: "",
      outExp: "",
      hasCanadianEdu: "",
      langLevel: "",
    });
    setValidated(false);
    setResult(null);
  };

  return (
    <Card className="shadow-lg border-0">
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Quick Immigration Program Helper</h2>
          <p className="text-muted mb-0">
            High-level suggestions only — verify with official sources or a licensed professional.
          </p>
        </div>

        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Row className="g-3">
            <Form.Group as={Col} md={4}>
              <Form.Label>Age</Form.Label>
              <Form.Control
                required
                type="number"
                min={16}
                max={70}
                step="1"
                name="age"
                value={form.age}
                onChange={onChange}
                placeholder="e.g., 29"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid age (16–70).
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={8}>
              <Form.Label>Highest education (anywhere)</Form.Label>
              <Form.Select required name="eduLevel" value={form.eduLevel} onChange={onChange}>
                <option value="">Select…</option>
                <option value="hs">High school or less</option>
                <option value="1y">One-year post-secondary</option>
                <option value="2y">Two-year post-secondary</option>
                <option value="bachelor">Bachelor’s degree</option>
                <option value="pg">Post-graduate (Master’s/PhD/Professional)</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select your education.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label>Skilled work in Canada (years)</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                max={30}
                step="0.5"
                name="canExp"
                value={form.canExp}
                onChange={onChange}
                placeholder="e.g., 1.5"
              />
              <Form.Control.Feedback type="invalid">
                Enter years of Canadian skilled experience.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label>Skilled work outside Canada (years)</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                max={30}
                step="0.5"
                name="outExp"
                value={form.outExp}
                onChange={onChange}
                placeholder="e.g., 3"
              />
              <Form.Control.Feedback type="invalid">
                Enter years of foreign skilled experience.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label>Any Canadian post-secondary education?</Form.Label>
              <Form.Select
                required
                name="hasCanadianEdu"
                value={form.hasCanadianEdu}
                onChange={onChange}
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please choose an option.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={6}>
              <Form.Label>Approximate language level (CLB)</Form.Label>
              <Form.Select required name="langLevel" value={form.langLevel} onChange={onChange}>
                <option value="">Select…</option>
                <option value="<7">Below CLB 7</option>
                <option value="7-8">CLB 7–8</option>
                <option value=">=9">CLB 9+</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select your language level.
              </Form.Control.Feedback>
            </Form.Group>

            <Col xs={12} className="d-flex gap-2 mt-2">
              <Button type="submit" variant="primary">Get suggestions</Button>
              <Button type="button" variant="outline-secondary" onClick={onReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>

        {result && (
          <div className="mt-4">
            <h5 className="mb-2">Results (prototype)</h5>
            <div className="mb-2">
              {result.suggestions.map((s) => (
                <Badge key={s.key} bg="secondary" pill className="me-2">
                  {s.key}
                </Badge>
              ))}
            </div>
            <ul className="mb-0">
              {result.suggestions.map((s, i) => (
                <li key={i}>
                  <strong>{s.key}:</strong> {s.why}
                </li>
              ))}
            </ul>

            {!!result.notes?.length && (
              <Alert variant="info" className="mt-3 mb-0">
                <ul className="mb-0">
                  {result.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        )}

        <p className="text-muted small mt-4 mb-0">
          Disclaimer: This tool provides general, educational suggestions. It does not assess
          inadmissibility, NOC/TEER classification, spouse factors, provincial intake caps, or current
          draws. Verify with official sources and/or a licensed professional.
        </p>
      </Card.Body>
    </Card>
  );
};

export default ImmigrationHelperBot;
