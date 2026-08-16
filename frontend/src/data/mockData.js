export const stats = [
  { label: "Total Analyses", value: "128", change: "+12.4%", tone: "blue" },
  { label: "Scams Detected", value: "47", change: "+8.2%", tone: "red" },
  { label: "High-Risk Detections", value: "31", change: "+5.7%", tone: "amber" },
  { label: "Protection Rate", value: "96.8%", change: "+2.1%", tone: "green" },
];

export const recentAnalyses = [
  { title: "SBI verification request", category: "Phishing", score: 94, severity: "CRITICAL", time: "8 min ago", icon: "message" },
  { title: "Delivery address update", category: "Delivery Scam", score: 72, severity: "HIGH", time: "42 min ago", icon: "package" },
  { title: "Remote developer offer", category: "Job Scam", score: 28, severity: "LOW", time: "2 hrs ago", icon: "briefcase" },
  { title: "Prize confirmation", category: "Lottery / Prize", score: 86, severity: "CRITICAL", time: "4 hrs ago", icon: "gift" },
  { title: "Payment verification", category: "Banking Scam", score: 64, severity: "HIGH", time: "Yesterday", icon: "credit" },
];

export const categories = [
  { label: "Phishing", value: 42 },
  { label: "Banking", value: 27 },
  { label: "Job Scam", value: 18 },
  { label: "Payment", value: 9 },
  { label: "Other", value: 4 },
];

export const mockAnalysisResult = {
  success: true,
  data: {
    classification: "SCAM",
    riskScore: 94,
    confidence: 0.96,
    scamType: "PHISHING",
    severity: "CRITICAL",
    redFlags: [
      "Creates urgency around account verification",
      "Requests action through an unfamiliar channel",
      "Uses language commonly associated with credential theft",
      "Sender identity cannot be independently verified",
    ],
    attackPattern: ["Credential harvesting", "Social engineering", "Urgency manipulation"],
    explanation:
      "The message combines urgency, account verification language and an untrusted action path. These signals are strongly associated with phishing attempts designed to capture credentials.",
    recommendedActions: [
      "Do not click links or reply to the sender",
      "Verify the request using the organization's official website or app",
      "Never share OTPs, passwords or banking credentials",
    ],
  },
};

// Type-aware mock results so message / URL / screenshot submissions each
// return a contextually relevant Phase 1 mock report instead of one
// generic canned response.
export const mockAnalysisResults = {
  message: mockAnalysisResult,
  url: {
    success: true,
    data: {
      classification: "SCAM",
      riskScore: 81,
      confidence: 0.91,
      scamType: "MALICIOUS LINK",
      severity: "HIGH",
      redFlags: [
        "Domain mimics a well-known brand with a slight misspelling",
        "Uses a URL shortener or redirect chain to obscure the destination",
        "No valid TLS certificate for the claimed organization",
        "Landing page requests credentials outside the official domain",
      ],
      attackPattern: ["Domain spoofing", "Credential harvesting", "Redirect obfuscation"],
      explanation:
        "The link's domain does not match the organization it claims to represent, and the destination page is structured to collect login details. This pattern is typical of phishing infrastructure.",
      recommendedActions: [
        "Do not open the link or enter any credentials",
        "Type the organization's known web address directly instead of clicking through",
        "Report the link to your email or messaging provider",
      ],
    },
  },
  screenshot: {
    success: true,
    data: {
      classification: "SCAM",
      riskScore: 68,
      confidence: 0.87,
      scamType: "IMPERSONATION",
      severity: "HIGH",
      redFlags: [
        "Logo and formatting closely imitate an official notification",
        "Screenshot shows a request for payment or personal details",
        "Visible sender name does not match the claimed organization",
        "Low-resolution branding consistent with a copied template",
      ],
      attackPattern: ["Brand impersonation", "Visual spoofing", "Social engineering"],
      explanation:
        "The image reproduces the visual style of a trusted brand but includes inconsistencies in sender identity and formatting that are common in impersonation scams.",
      recommendedActions: [
        "Do not act on anything requested in the screenshot",
        "Confirm the message through the organization's official app or site",
        "Avoid forwarding the image with any personal details attached",
      ],
    },
  },
};

export const insights = [
  { title: "Urgency is a warning signal", text: "Scammers often create a short deadline to stop you from checking the source independently.", tag: "BEHAVIOUR" },
  { title: "Verify the destination", text: "A familiar logo or brand name does not make a link trustworthy. Inspect where the action actually leads.", tag: "LINK SAFETY" },
  { title: "Never share an OTP", text: "Legitimate support teams do not need your one-time password to reverse a transaction or unlock an account.", tag: "ACCOUNT SAFETY" },
];

export const history = recentAnalyses.map((item, index) => ({
  ...item,
  id: `SS-${String(128 - index).padStart(4, "0")}`,
  date: index === 0 ? "Today, 9:14 PM" : index === 1 ? "Today, 8:40 PM" : index === 2 ? "Today, 7:12 PM" : "Yesterday, 5:31 PM",
}));
