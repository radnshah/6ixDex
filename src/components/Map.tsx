"use client";

import { useEffect, useRef, useState } from "react";
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

export default function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      setError("Missing NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      return;
    }

    if (mapRef.current || !containerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: TORONTO_CENTER,
      zoom: DEFAULT_ZOOM,
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-zinc-400">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
