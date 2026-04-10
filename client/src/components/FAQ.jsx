import React, { useState } from "react";

const faqs = [
  {
    question: "Who can participate in the hackathon?",
    answer:
      "Students, professionals, startups, MSMEs, researchers, and innovators are all eligible to participate. The hackathon is open to individuals and teams from around the world. "
  },
  {
    question: "How do I register?",
    answer:
      "Click on the Register or click on Apply Now on the homepage, fill in your details, verify your email, and complete your profile as well as details to submit the proposals to complete the Registrations. \n NOTE: Incomplete (draft) registrations are not considered for evaluation. Make sure to submit your proposal before the deadline."
  },
  {
    question: "Can I participate in a team other than my affiliated organization/institution?",
    answer:
      "Yes, you can participate individually or as part of a team. Such teams are advised to apply via Individual Category and details of the Team members can be filled in the form during registrations."
  },
  {
    question: "What are the focus areas?",
    answer:
      "Focus areas include Water Conservation, AI Solutions, Infrastructure, Sustainability, and Innovation."
  },
  {
    question: "Is there any registration fee?",
    answer:
      "No, participation in the hackathon is completely free of cost."
  },
  {
    question: "How will submissions be evaluated?",
    answer:
      "Submissions will be judged based on innovation, feasibility, scalability, and impact. These parameters are mentioned in the evaluation criteria section of the website. Make sure to go through it before submitting your proposal."
  }
  {
    question: "What is PoC-",
    answer:
      "Submissions will be judged based on innovation, feasibility, scalability, and impact. These parameters are mentioned in the evaluation criteria section of the website. Make sure to go through it before submitting your proposal."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#2563eb" }}>
        ❓ Frequently Asked Questions
      </h2>

      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}
        >
          {/* Question */}
          <div
            onClick={() => toggleFAQ(index)}
            style={{
              padding: "15px",
              cursor: "pointer",
              background: "#f9fafb",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {faq.question}
            <span>{activeIndex === index ? "▲" : "▼"}</span>
          </div>

          {/* Answer */}
          {activeIndex === index && (
            <div
              style={{
                padding: "15px",
                background: "white",
                color: "#374151",
                lineHeight: "1.6"
              }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQ;