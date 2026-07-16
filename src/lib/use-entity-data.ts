"use client";

import { useCallback, useEffect, useState } from "react";
import type { Event, Organization, Person, Place } from "@/types/entities";

export interface EntityData {
  organizations: Organization[];
  people: Person[];
  places: Place[];
  events: Event[];
}

const EMPTY: EntityData = {
  organizations: [],
  people: [],
  places: [],
  events: [],
};

export function useEntityData() {
  const [data, setData] = useState<EntityData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [organizations, people, places, events] = await Promise.all([
      fetch("/api/organizations").then((res) => res.json()),
      fetch("/api/people").then((res) => res.json()),
      fetch("/api/places").then((res) => res.json()),
      fetch("/api/events").then((res) => res.json()),
    ]);
    setData({ organizations, people, places, events });
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...data, loading, refetch };
}
