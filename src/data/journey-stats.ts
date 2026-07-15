import { CONTENT, EVENTS, ORGANIZATIONS, PEOPLE } from "./mock-data";

export interface JourneyStat {
  label: string;
  value: number;
}

export const JOURNEY_STATS: JourneyStat[] = [
  { label: "Days on journey", value: 58 },
  { label: "Startups visited", value: ORGANIZATIONS.length },
  { label: "Events attended", value: EVENTS.length },
  { label: "Content created", value: CONTENT.length },
  { label: "People met", value: PEOPLE.length },
];
