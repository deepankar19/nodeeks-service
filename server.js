const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from NovaPeak Labs API service!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/home", (req, res) => {
  res.json({
    brand: "NovaPeak Labs",
    hero: {
      title: "We Build, Scale, and Run Modern SaaS Products",
      subtitle:
        "From multi-tenant SaaS platforms to AI automation and cloud-native DevOps, we build products engineered for enterprise scale and measurable business impact.",
      ctaPrimary: "Book a Strategy Session",
      ctaSecondary: "Let's Discuss Your Project",
    },
    metrics: [
      { label: "Faster release cycles via CI/CD", value: "70%" },
      { label: "Uptime across SaaS systems", value: "99.9%" },
      { label: "Faster onboarding with scalable architecture", value: "45%" },
      { label: "Lower cloud cost with optimization", value: "30%" },
    ],
    servicePillars: [
      {
        title: "Digital Products for Scalable Growth",
        description:
          "Rapid prototyping, full-stack development, and platform engineering to move ideas into production quickly.",
      },
      {
        title: "Data and AI for Smarter Decisions",
        description:
          "Modern data architecture, machine learning, and analytics workflows for real-time insights.",
      },
      {
        title: "Strategic Transformation",
        description:
          "Technology roadmaps and operating models aligned to business outcomes and long-term resilience.",
      },
      {
        title: "Cloud Foundations",
        description:
          "Secure cloud infrastructure, DevOps automation, and reliability engineering for high-growth systems.",
      },
    ],
    industries: [
      "Media & Advertising",
      "Transportation & Logistics",
      "Agritech",
      "Fintech",
      "Healthcare & Life Sciences",
      "Retail & Commerce",
      "Travel & Hospitality",
    ],
    caseStudies: [
      {
        title: "Digital Transformation for Maritime Intelligence Platform",
        result: "6x release velocity and 7.8B+ data values processed daily.",
      },
      {
        title: "Cloud Migration for Global Media Leader",
        result: "10PB+ data migrated and 350+ services modernized.",
      },
      {
        title: "AI Onboarding Automation in Construction",
        result: "2x faster onboarding and 95%+ trade mapping accuracy.",
      },
    ],
    insights: [
      "Modernization: Transforming Legacy Systems into AI-Fueled Innovation Engines",
      "Choosing Between Multi-Cloud vs. Hybrid Cloud: What Enterprise CIOs Should Ask",
      "The Ultimate Guide to Node.js Enterprise App Development",
    ],
    updatedAt: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Node service running on http://localhost:${PORT}`);
});
