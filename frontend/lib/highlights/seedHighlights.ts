import type { Highlight } from "./types";

/** Default highlights shipped with the site (read-only seed). */
export const defaultHighlights: Highlight[] = [
  {
    id: "promotion-swe",
    label: "Promotion",
    emoji: "🚀",
    title: "Promotion to Software Engineer",
    summary:
      "Recognized by leadership at Data Axle India for impact and growth—stepping up to Software Engineer with gratitude for mentors and teammates who made the journey possible.",
    href: "https://www.linkedin.com/posts/ayush-bhagat-00a79b22a_grateful-for-the-recognition-and-trust-from-share-7450593119760175104-nVOl?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADls10oBjgYWfBoOcF7PSlzafmiZzl1QrM4",
    ctaLabel: "View on LinkedIn",
  },
  {
    id: "starlight-award",
    label: "Starlight",
    emoji: "🌟",
    title: "Starlight Award at Data Axle",
    summary:
      "Honored with the Starlight Award at Data Axle India—recognition for contribution, learning, and the support of leadership and colleagues.",
    href: "https://www.linkedin.com/posts/ayush-bhagat-00a79b22a_starlightaward-dataaxle-yourspacetogrow-share-7372343262382227457-YKVt?utm_source=share&utm_medium=member_desktop&rcm=ACoAADls10oBjgYWfBoOcF7PSlzafmiZzl1QrM4",
    ctaLabel: "View on LinkedIn",
  },
  {
    id: "barclays-hackathon",
    label: "Barclays",
    emoji: "🏦",
    title: "Barclays Hackathon — Reward sharing pool",
    summary:
      "Participated in the Barclays hackathon with a smart reward pooling concept—system architecture spanning ingestion flows, microservices, and caching.",
    imageSrc: "/highlight-barclays-hackathon.png",
    imageAlt: "System architecture diagram for ingestion and user flows",
    attachmentHref: "/highlight-barclays-offer-pooling.pptx",
    attachmentLabel: "Download deck (PPTX)",
  },
  {
    id: "metlife-hackathon",
    label: "MetLife",
    emoji: "🛡️",
    title: "MetLife Hackathon — Claim & fraud detection",
    summary:
      "Hackathon build for an insurance claim and fraud detection architecture—OCR ingestion, ML scoring, rules engine, and decision paths for auto-process vs manual review.",
    imageSrc: "/highlight-metlife-hackathon.png",
    imageAlt: "Insurance claim and fraud detection system architecture diagram",
  },
];
