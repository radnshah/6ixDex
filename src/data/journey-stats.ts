import { COMPANIES, EVENTS, PEOPLE } from "./mock-data";

export interface JourneyStat {
  label: string;
  value: number;
}

export const JOURNEY_STATS: JourneyStat[] = [
  { label: "Days on journey", value: 58 },
  { label: "Startups visited", value: COMPANIES.length },
  { label: "Events attended", value: EVENTS.length },
  { label: "Content created", value: 4 },
  { label: "People met", value: PEOPLE.length },
];
