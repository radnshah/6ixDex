"use client";

import { useState, type FormEvent } from "react";
import { FloatingPanel } from "./FloatingPanel";
import { ENTITY_FIELDS, type FieldDef } from "@/lib/entity-schema";
import type { EntityTypeKey } from "@/lib/db";

interface ContentLinkRow {
  platform: string;
  url: string;
}

interface GeoPointRow {
  lat: string;
  lng: string;
}

function toDisplayValue(field: FieldDef, raw: unknown): unknown {
  switch (field.type) {
    case "tags":
      return Array.isArray(raw) ? raw.join(", ") : "";
    case "geopoint": {
      const point = raw as { lat?: number; lng?: number } | undefined;
      return {
        lat: point?.lat !== undefined ? String(point.lat) : "",
        lng: point?.lng !== undefined ? String(point.lng) : "",
      };
    }
    case "links":
      return Array.isArray(raw) && raw.length > 0
        ? raw
        : [{ platform: "", url: "" }];
    case "number":
      return raw === undefined || raw === null ? "" : String(raw);
    case "select":
      return raw ?? field.options?.[0] ?? "";
    default:
      return raw ?? "";
  }
}

function buildInitialValues(
  fields: FieldDef[],
  initialData?: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field.key] = toDisplayValue(field, initialData?.[field.key]);
  }
  return values;
}

function serializeValues(
  fields: FieldDef[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const value = values[field.key];
    switch (field.type) {
      case "tags": {
        const parsed = String(value ?? "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        if (parsed.length > 0) payload[field.key] = parsed;
        break;
      }
      case "geopoint": {
        const point = value as GeoPointRow;
        payload[field.key] = {
          lat: parseFloat(point.lat) || 0,
          lng: parseFloat(point.lng) || 0,
        };
        break;
      }
      case "links": {
        const rows = (value as ContentLinkRow[]).filter(
          (row) => row.platform.trim() && row.url.trim(),
        );
        payload[field.key] = rows;
        break;
      }
      case "number": {
        if (value !== "" && value !== undefined) payload[field.key] = Number(value);
        break;
      }
      default: {
        if (value !== "") payload[field.key] = value;
      }
    }
  }
  return payload;
}

function inputClass() {
  return "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none";
}

function LinksField({
  rows,
  onChange,
}: {
  rows: ContentLinkRow[];
  onChange: (rows: ContentLinkRow[]) => void;
}) {
  function updateRow(index: number, patch: Partial<ContentLinkRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-2">
          <input
            className={inputClass()}
            type="text"
            placeholder="Platform (e.g. YouTube)"
            value={row.platform}
            onChange={(e) => updateRow(index, { platform: e.target.value })}
          />
          <input
            className={inputClass()}
            type="text"
            placeholder="URL"
            value={row.url}
            onChange={(e) => updateRow(index, { url: e.target.value })}
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            aria-label="Remove link"
            className="shrink-0 rounded-lg border border-white/10 px-2 text-zinc-400 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { platform: "", url: "" }])}
        className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
      >
        + Add platform link
      </button>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
        {field.label}
        {field.required && <span className="text-cyan-400"> *</span>}
      </label>

      {field.type === "textarea" && (
        <textarea
          className={`${inputClass()} min-h-[80px]`}
          value={value as string}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" && (
        <select
          className={inputClass()}
          value={value as string}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.type === "geopoint" && (
        <div className="flex gap-2">
          <input
            className={inputClass()}
            type="number"
            step="any"
            placeholder="Lat"
            value={(value as GeoPointRow).lat}
            required={field.required}
            onChange={(e) =>
              onChange({ ...(value as GeoPointRow), lat: e.target.value })
            }
          />
          <input
            className={inputClass()}
            type="number"
            step="any"
            placeholder="Lng"
            value={(value as GeoPointRow).lng}
            required={field.required}
            onChange={(e) =>
              onChange({ ...(value as GeoPointRow), lng: e.target.value })
            }
          />
        </div>
      )}

      {field.type === "links" && (
        <LinksField rows={value as ContentLinkRow[]} onChange={onChange} />
      )}

      {(field.type === "text" ||
        field.type === "number" ||
        field.type === "date") && (
        <input
          className={inputClass()}
          type={field.type}
          value={value as string}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "tags" && (
        <input
          className={inputClass()}
          type="text"
          placeholder="Comma-separated"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function EntityFormModal({
  apiType,
  entityId,
  initialData,
  onClose,
  onSaved,
}: {
  apiType: EntityTypeKey;
  entityId?: string;
  initialData?: Record<string, unknown>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const fields = ENTITY_FIELDS[apiType];
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildInitialValues(fields, initialData),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(entityId);

  function setFieldValue(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = serializeValues(fields, values);
      const res = await fetch(
        isEditing ? `/api/${apiType}/${entityId}` : `/api/${apiType}`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      onSaved();
    } catch {
      setError("Something went wrong saving this entry.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!entityId) return;
    if (!confirm("Delete this entry? This can't be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/${apiType}/${entityId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      onSaved();
    } catch {
      setError("Something went wrong deleting this entry.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <FloatingPanel className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-zinc-50">
            {isEditing ? "Edit entry" : "New entry"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) => setFieldValue(field.key, value)}
            />
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </FloatingPanel>
    </div>
  );
}
