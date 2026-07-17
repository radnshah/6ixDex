import {
  EVENT_TAXONOMY,
  ORGANIZATION_TAXONOMY,
  PLACE_TAXONOMY,
} from "./taxonomy";
import type { EntityTypeKey } from "./db";

// Maps the singular "kind" used throughout the UI (MapEntity.kind, browse
// page `kind` props) to the plural key the API/db layer uses.
export const KIND_TO_API_TYPE: Record<string, EntityTypeKey> = {
  organization: "organizations",
  person: "people",
  place: "places",
  event: "events",
  content: "content",
  journal: "journal",
};

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "tags"
  | "select"
  | "geopoint"
  | "links";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

const ORG_CATEGORIES = Object.keys(ORGANIZATION_TAXONOMY);
const ORG_SUBTYPES = Object.values(ORGANIZATION_TAXONOMY).flat();
const PLACE_CATEGORIES = Object.keys(PLACE_TAXONOMY);
const PLACE_SUBTYPES = Object.values(PLACE_TAXONOMY).flat();
const EVENT_CATEGORIES = Object.keys(EVENT_TAXONOMY);
const EVENT_SUBTYPES = Object.values(EVENT_TAXONOMY).flat();

export const ENTITY_FIELDS: Record<EntityTypeKey, FieldDef[]> = {
  organizations: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ORG_CATEGORIES,
      required: true,
    },
    {
      key: "subtype",
      label: "Subtype",
      type: "select",
      options: ORG_SUBTYPES,
      required: true,
    },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "industry", label: "Industry", type: "text" },
    { key: "logo", label: "Logo URL", type: "text" },
    { key: "location", label: "Location", type: "geopoint", required: true },
    { key: "website", label: "Website", type: "text" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "founded", label: "Founded (year)", type: "number" },
    { key: "employeeCount", label: "Team size", type: "number" },
    { key: "stage", label: "Stage", type: "text" },
    { key: "headquarters", label: "Headquarters", type: "text" },
    { key: "techStack", label: "Tech stack", type: "tags" },
    { key: "aiStack", label: "AI stack", type: "tags" },
    { key: "founderIds", label: "Founder IDs", type: "tags" },
    { key: "placeId", label: "Place ID", type: "text" },
    { key: "eventIds", label: "Event IDs", type: "tags" },
  ],
  people: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "role", label: "Role", type: "text", required: true },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "organizationIds", label: "Organization IDs", type: "tags" },
  ],
  places: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: PLACE_CATEGORIES,
      required: true,
    },
    {
      key: "subtype",
      label: "Subtype",
      type: "select",
      options: PLACE_SUBTYPES,
      required: true,
    },
    { key: "image", label: "Image URL", type: "text" },
    { key: "location", label: "Location", type: "geopoint", required: true },
    { key: "address", label: "Address", type: "text" },
  ],
  events: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: EVENT_CATEGORIES,
      required: true,
    },
    {
      key: "subtype",
      label: "Subtype",
      type: "select",
      options: EVENT_SUBTYPES,
    },
    { key: "image", label: "Image URL", type: "text" },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "location", label: "Location", type: "geopoint", required: true },
    { key: "organizationIds", label: "Organization IDs", type: "tags" },
  ],
  content: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["Video", "Image", "Livestream"],
      required: true,
    },
    { key: "links", label: "Platform links", type: "links", required: true },
    { key: "publishedAt", label: "Published", type: "date", required: true },
    { key: "relatedOrganizationIds", label: "Related organization IDs", type: "tags" },
    { key: "relatedEventIds", label: "Related event IDs", type: "tags" },
  ],
  journal: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["LinkedIn Post", "X Post", "Notes"],
      required: true,
    },
    { key: "body", label: "Body", type: "textarea", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "relatedOrganizationIds", label: "Related organization IDs", type: "tags" },
    { key: "relatedEventIds", label: "Related event IDs", type: "tags" },
  ],
};
