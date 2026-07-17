"use client";

import { useCallback, useEffect, useState } from "react";
import type { Content, Event, Journal, Organization, Person, Place } from "@/types/entities";

export interface EntityData {
  organizations: Organization[];
  people: Person[];
  places: Place[];
  events: Event[];
  content: Content[];
  journal: Journal[];
}

const EMPTY: EntityData = {
  organizations: [],
  people: [],
  places: [],
  events: [],
  content: [],
  journal: [],
};

export function useEntityData() {
  const [data, setData] = useState<EntityData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [organizations, people, places, events, content, journal] = await Promise.all([
      fetch("/api/organizations").then((res) => res.json()),
      fetch("/api/people").then((res) => res.json()),
      fetch("/api/places").then((res) => res.json()),
      fetch("/api/events").then((res) => res.json()),
      fetch("/api/content").then((res) => res.json()),
      fetch("/api/journal").then((res) => res.json()),
    ]);
    setData({ organizations, people, places, events, content, journal });
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...data, loading, refetch };
}
