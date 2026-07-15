import type { Company, Event, Person, Place } from "@/types/entities";

export const PEOPLE: Person[] = [
  {
    id: "person-aisha-bello",
    name: "Aisha Bello",
    role: "Founder & CEO",
    bio: "Robotics engineer turned founder, building autonomous systems for last-mile logistics.",
    companyIds: ["company-northbound-robotics"],
  },
  {
    id: "person-marcus-chen",
    name: "Marcus Chen",
    role: "Founder",
    bio: "Ex-fintech engineer focused on embedded ledger infrastructure for SMBs.",
    companyIds: ["company-ledgerly"],
  },
  {
    id: "person-priya-nair",
    name: "Priya Nair",
    role: "Co-founder",
    bio: "Building distributed energy storage software for the grid of tomorrow.",
    companyIds: ["company-greengrid-energy"],
  },
  {
    id: "person-devon-clarke",
    name: "Devon Clarke",
    role: "Founder",
    bio: "Former clinician building diagnostic tooling for primary care.",
    companyIds: ["company-wavelength-health"],
  },
  {
    id: "person-sofia-marchetti",
    name: "Sofia Marchetti",
    role: "Founder",
    bio: "Data scientist building analytics infrastructure for logistics networks.",
    companyIds: ["company-kelp-analytics"],
  },
  {
    id: "person-jordan-lee",
    name: "Jordan Lee",
    role: "Founder",
    bio: "Building commerce tooling for independent Canadian retailers.",
    companyIds: ["company-loop-commerce"],
  },
];

export const PLACES: Place[] = [
  {
    id: "place-mars-discovery-district",
    name: "MaRS Discovery District",
    type: "incubator",
    location: { lat: 43.6596, lng: -79.3899 },
    address: "101 College St, Toronto",
  },
  {
    id: "place-one-eleven",
    name: "ONE ELEVEN",
    type: "coworking",
    location: { lat: 43.6448, lng: -79.4008 },
    address: "111 King St W, Toronto",
  },
  {
    id: "place-dmz",
    name: "DMZ",
    type: "accelerator",
    location: { lat: 43.6577, lng: -79.3788 },
    address: "10 Dundas St E, Toronto",
  },
];

export const COMPANIES: Company[] = [
  {
    id: "company-northbound-robotics",
    name: "Northbound Robotics",
    description: "Autonomous delivery robots for dense urban environments.",
    industry: "Robotics",
    location: { lat: 43.644, lng: -79.403 },
    website: "https://northboundrobotics.example.com",
    techStack: ["ROS", "Python", "C++"],
    aiStack: ["PyTorch", "Computer Vision"],
    founderIds: ["person-aisha-bello"],
    eventIds: ["event-ai-builders-hackathon"],
  },
  {
    id: "company-ledgerly",
    name: "Ledgerly",
    description: "Embedded ledger infrastructure for small business banking.",
    industry: "Fintech",
    location: { lat: 43.6483, lng: -79.3805 },
    website: "https://ledgerly.example.com",
    techStack: ["TypeScript", "Postgres"],
    founderIds: ["person-marcus-chen"],
    eventIds: ["event-tech-week-meetup"],
  },
  {
    id: "company-greengrid-energy",
    name: "GreenGrid Energy",
    description: "Software for distributed energy storage and grid balancing.",
    industry: "Clean Energy",
    location: { lat: 43.6385, lng: -79.421 },
    website: "https://greengridenergy.example.com",
    techStack: ["Rust", "Kubernetes"],
    founderIds: ["person-priya-nair"],
  },
  {
    id: "company-wavelength-health",
    name: "Wavelength Health",
    description: "Diagnostic decision-support tooling for primary care clinics.",
    industry: "Health Tech",
    location: { lat: 43.659, lng: -79.388 },
    website: "https://wavelengthhealth.example.com",
    aiStack: ["Clinical NLP"],
    founderIds: ["person-devon-clarke"],
    placeId: "place-mars-discovery-district",
    eventIds: ["event-ai-builders-hackathon"],
  },
  {
    id: "company-kelp-analytics",
    name: "Kelp Analytics",
    description: "Analytics infrastructure for logistics and supply chain networks.",
    industry: "Data & AI",
    location: { lat: 43.6503, lng: -79.3596 },
    website: "https://kelpanalytics.example.com",
    techStack: ["Snowflake", "dbt"],
    founderIds: ["person-sofia-marchetti"],
  },
  {
    id: "company-loop-commerce",
    name: "Loop Commerce",
    description: "Commerce tooling built for independent Canadian retailers.",
    industry: "E-commerce",
    location: { lat: 43.6455, lng: -79.399 },
    website: "https://loopcommerce.example.com",
    techStack: ["Next.js", "Shopify APIs"],
    founderIds: ["person-jordan-lee"],
    placeId: "place-one-eleven",
    eventIds: ["event-tech-week-meetup"],
  },
];

export const EVENTS: Event[] = [
  {
    id: "event-ai-builders-hackathon",
    name: "AI Builders Hackathon",
    type: "hackathon",
    date: "2026-08-15",
    location: { lat: 43.6596, lng: -79.3899 },
    companyIds: ["company-northbound-robotics", "company-wavelength-health"],
  },
  {
    id: "event-tech-week-meetup",
    name: "Toronto Tech Week Meetup",
    type: "networking",
    date: "2026-09-10",
    location: { lat: 43.6448, lng: -79.4008 },
    companyIds: ["company-ledgerly", "company-loop-commerce"],
  },
];

export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((company) => company.id === id);
}

export function getPersonById(id: string): Person | undefined {
  return PEOPLE.find((person) => person.id === id);
}

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id);
}

export function getEventById(id: string): Event | undefined {
  return EVENTS.find((event) => event.id === id);
}
