// database/event.model.ts
// Event schema with strict typing, slug generation, and normalization hooks

import mongoose, { Document, Model, Schema } from "mongoose";

/* ----------------------------- ATTRIBUTES ----------------------------- */

export interface EventAttrs {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

/* ----------------------------- DOCUMENT ----------------------------- */

export interface EventDoc extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/* ----------------------------- MODEL ----------------------------- */

export interface EventModel extends Model<EventDoc> {
  build(attrs: EventAttrs): EventDoc;
}

/* ----------------------------- HELPERS ----------------------------- */

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTime(input: string): string {
  const match = input.match(/(\d{1,2}):(\d{2})/);

  if (!match) return input;

  let hour = parseInt(match[1], 10);
  const minute = match[2];

  if (hour < 0) hour = 0;
  if (hour > 23) hour = 23;

  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

/* ----------------------------- SCHEMA ----------------------------- */

const eventSchema = new Schema<EventDoc, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },

    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },

    venue: { type: String, required: true },
    location: { type: String, required: true },

    date: { type: String, required: true },
    time: { type: String, required: true },

    mode: { type: String, required: true },
    audience: { type: String, required: true },

    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },

    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

/* ----------------------------- INDEX ----------------------------- */

eventSchema.index({ slug: 1 }, { unique: true });

/* ----------------------------- PRE SAVE HOOK ----------------------------- */

eventSchema.pre("save", async function () {
  const doc = this as EventDoc;

  if (
    !doc.title ||
    !doc.description ||
    !doc.overview ||
    !doc.image ||
    !doc.venue ||
    !doc.location ||
    !doc.date ||
    !doc.time ||
    !doc.mode ||
    !doc.audience ||
    !doc.agenda?.length ||
    !doc.organizer ||
    !doc.tags?.length
  ) {
    throw new Error("Missing required fields");
  }

  if (doc.isModified("title") || doc.isNew) {
    doc.slug = generateSlug(doc.title);
  }

  if (doc.isModified("date")) {
    const parsed = new Date(doc.date);

    if (isNaN(parsed.getTime())) {
      throw new Error("Invalid date format");
    }

    doc.date = parsed.toISOString();
  }

  if (doc.isModified("time")) {
    doc.time = normalizeTime(doc.time);
  }
});

/* ----------------------------- STATIC BUILD ----------------------------- */

eventSchema.statics.build = (attrs: EventAttrs) => {
  return new Event(attrs);
};

/* ----------------------------- MODEL EXPORT ----------------------------- */

const Event =
  (mongoose.models.Event as EventModel) ||
  mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };