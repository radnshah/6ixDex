export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: GeoPoint;
  website?: string;
  techStack?: string[];
  aiStack?: string[];
  founderIds?: string[];
  placeId?: string;
  eventIds?: string[];
}

export interface Person {
  id: string;
  name: string;
  role: string;
  bio?: string;
  companyIds?: string[];
}

export type PlaceType =
  | "office"
  | "coworking"
  | "cafe"
  | "incubator"
  | "accelerator"
  | "university";

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  location: GeoPoint;
  address?: string;
}

export type EventType =
  | "hackathon"
  | "conference"
  | "networking"
  | "meetup"
  | "workshop";

export interface Event {
  id: string;
  name: string;
  type: EventType;
  date: string;
  location: GeoPoint;
  companyIds?: string[];
}

export type MapEntity =
  | { kind: "company"; data: Company }
  | { kind: "person"; data: Person }
  | { kind: "place"; data: Place }
  | { kind: "event"; data: Event };
