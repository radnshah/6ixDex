"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  TORONTO_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
  DEFAULT_BEARING,
  MAP_STYLE,
  BUILDINGS_MIN_ZOOM,
} from "@/lib/mapbox-config";
import { ORGANIZATIONS, PLACES, EVENTS } from "@/data/mock-data";
import { ENTITY_COLORS } from "@/lib/labels";
import {
  isEventVisible,
  isOrganizationVisible,
  isPlaceVisible,
} from "@/lib/map-filter";
import type { GeoPoint, MapEntity } from "@/types/entities";

export interface MapHandle {
  flyTo: (location: GeoPoint) => void;
}

const FLY_TO_ZOOM = 15.5;

function createMarkerElement(
  color: string,
  interactive: boolean,
  kind: string,
) {
  // Mapbox positions this root element via its own CSS transform, so the
  // hover scale effect is applied to an inner child instead of overwriting it.
  const root = document.createElement("div");
  root.className = `entity-marker entity-marker-${kind}`;
  root.style.width = "12px";
  root.style.height = "12px";
  root.style.cursor = interactive ? "pointer" : "default";

  const dot = document.createElement("div");
  dot.style.width = "100%";
  dot.style.height = "100%";
  dot.style.borderRadius = "9999px";
  dot.style.background = color;
  dot.style.border = "1px solid rgba(255,255,255,0.5)";
  dot.style.boxShadow = `0 0 12px 4px ${color}66`;
  dot.style.transition = "transform 0.15s ease-out";

  root.addEventListener("mouseenter", () => {
    dot.style.transform = "scale(1.4)";
  });
  root.addEventListener("mouseleave", () => {
    dot.style.transform = "scale(1)";
  });

  root.appendChild(dot);
  return root;
}

interface MapProps {
  enabledLeaves: Set<string>;
  initialCenter?: GeoPoint;
  onSelectEntity?: (entity: MapEntity) => void;
}

const Map = forwardRef<MapHandle, MapProps>(function Map(
  { enabledLeaves, initialCenter, onSelectEntity },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectEntityRef = useRef(onSelectEntity);
  onSelectEntityRef.current = onSelectEntity;
  // Only read at mount time, matching mapboxgl's own one-shot constructor options.
  const initialCenterRef = useRef(initialCenter);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useImperativeHandle(ref, () => ({
    flyTo(location: GeoPoint) {
      mapRef.current?.flyTo({
        center: [location.lng, location.lat],
        zoom: FLY_TO_ZOOM,
        essential: true,
      });
    },
  }));

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      setError("Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      return;
    }

    if (mapRef.current || !containerRef.current) return;

    mapboxgl.accessToken = token;

    const initial = initialCenterRef.current;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: initial ? [initial.lng, initial.lat] : TORONTO_CENTER,
      zoom: initial ? FLY_TO_ZOOM : DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      antialias: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "bottom-right",
    );

    map.on("load", () => {
      const labelLayerId = map
        .getStyle()
        ?.layers?.find(
          (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
        )?.id;

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: BUILDINGS_MIN_ZOOM,
          paint: {
            "fill-extrusion-color": "#2a2a30",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              BUILDINGS_MIN_ZOOM,
              0,
              BUILDINGS_MIN_ZOOM + 0.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              BUILDINGS_MIN_ZOOM,
              0,
              BUILDINGS_MIN_ZOOM + 0.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.7,
          },
        },
        labelLayerId,
      );
    });

    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Re-syncs markers whenever the active filter set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    for (const place of PLACES) {
      if (!isPlaceVisible(place, enabledLeaves)) continue;
      const el = createMarkerElement(ENTITY_COLORS.place, true, "place");
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectEntityRef.current?.({ kind: "place", data: place });
      });
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([place.location.lng, place.location.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }

    for (const event of EVENTS) {
      if (!isEventVisible(event, enabledLeaves)) continue;
      const el = createMarkerElement(ENTITY_COLORS.event, true, "event");
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectEntityRef.current?.({ kind: "event", data: event });
      });
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([event.location.lng, event.location.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }

    for (const organization of ORGANIZATIONS) {
      if (!isOrganizationVisible(organization, enabledLeaves)) continue;
      const el = createMarkerElement(
        ENTITY_COLORS.organization,
        true,
        "organization",
      );
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectEntityRef.current?.({ kind: "organization", data: organization });
      });
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([organization.location.lng, organization.location.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
    };
  }, [enabledLeaves, mapReady]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-zinc-400">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
});

export default Map;
