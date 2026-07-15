export const ORGANIZATION_TAXONOMY: Record<string, string[]> = {
  Company: ["Startup", "Scale-up", "Enterprise"],
  Community: ["Founder Community", "Developer Community", "Student Community"],
  Investor: ["Venture Capital", "Angel Network"],
  Ecosystem: ["Accelerator", "Incubator", "Coworking Space", "Innovation Hub"],
  Education: ["University", "College"],
};

export const PLACE_TAXONOMY: Record<string, string[]> = {
  Workspace: ["Office", "Coworking Space", "Library"],
  "Food & Drink": ["Coffee Shop"],
};

export const EVENT_TAXONOMY: Record<string, string[]> = {
  Networking: ["Meetup", "Coffee Chat", "Founder Meetup"],
  Learning: ["Workshop", "Webinar"],
  Competition: ["Hackathon", "Demo Day", "Pitch Competition"],
  Conference: [],
};

// The entity kinds that render as pins on the map, each with its
// category -> subtype taxonomy. Person/Content/Journal are excluded since
// they don't have their own map pins today.
export const MAP_KIND_TAXONOMY = {
  organization: { label: "Organizations", categories: ORGANIZATION_TAXONOMY },
  place: { label: "Places", categories: PLACE_TAXONOMY },
  event: { label: "Events", categories: EVENT_TAXONOMY },
} as const;

export type MapKind = keyof typeof MAP_KIND_TAXONOMY;
