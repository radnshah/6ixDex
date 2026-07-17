export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface BaseEntity {
  entityId: string;
  name: string;
}

export type OrganizationCategory =
  | "Company"
  | "Community"
  | "Investor"
  | "Ecosystem"
  | "Education";

export type OrganizationSubtype =
  | "Startup"
  | "Scale-up"
  | "Enterprise"
  | "Founder Community"
  | "Developer Community"
  | "Student Community"
  | "Venture Capital"
  | "Angel Network"
  | "Accelerator"
  | "Incubator"
  | "Coworking Space"
  | "Innovation Hub"
  | "University"
  | "College";

export interface Organization extends BaseEntity {
  category: OrganizationCategory;
  subtype: OrganizationSubtype;
  description: string;
  location: GeoPoint;
  logo?: string;
  website?: string;
  linkedin?: string;
  founded?: number;
  employeeCount?: number;
  industry?: string;
  stage?: string;
  headquarters?: string;
  techStack?: string[];
  aiStack?: string[];
  founderIds?: string[];
  placeId?: string;
  eventIds?: string[];
}

export interface Person extends BaseEntity {
  role: string;
  bio?: string;
  linkedin?: string;
  organizationIds?: string[];
}

export type PlaceCategory = "Workspace" | "Food & Drink";

export type PlaceSubtype =
  | "Office"
  | "Coworking Space"
  | "Library"
  | "Coffee Shop";

export interface Place extends BaseEntity {
  category: PlaceCategory;
  subtype: PlaceSubtype;
  location: GeoPoint;
  address?: string;
}

export type EventCategory =
  | "Networking"
  | "Learning"
  | "Competition"
  | "Conference";

export type EventSubtype =
  | "Meetup"
  | "Coffee Chat"
  | "Founder Meetup"
  | "Workshop"
  | "Webinar"
  | "Hackathon"
  | "Demo Day"
  | "Pitch Competition";

export interface Event extends BaseEntity {
  category: EventCategory;
  subtype?: EventSubtype;
  date: string;
  location: GeoPoint;
  organizationIds?: string[];
}

export type ContentCategory = "Video" | "Image" | "Livestream";

export interface ContentLink {
  platform: string;
  url: string;
}

export interface Content extends BaseEntity {
  category: ContentCategory;
  links: ContentLink[];
  publishedAt: string;
  relatedOrganizationIds?: string[];
  relatedEventIds?: string[];
}

export type JournalCategory = "LinkedIn Post" | "X Post" | "Notes";

export interface Journal extends BaseEntity {
  category: JournalCategory;
  body: string;
  date: string;
  relatedOrganizationIds?: string[];
  relatedEventIds?: string[];
}

// The subset of entities that render as pins on the map (have a location,
// directly or indirectly, and a detail panel today).
export type MapEntity =
  | { kind: "organization"; data: Organization }
  | { kind: "person"; data: Person }
  | { kind: "place"; data: Place }
  | { kind: "event"; data: Event };

// The full entity model, including kinds not yet surfaced in the UI.
export type Entity =
  | MapEntity
  | { kind: "content"; data: Content }
  | { kind: "journal"; data: Journal };
