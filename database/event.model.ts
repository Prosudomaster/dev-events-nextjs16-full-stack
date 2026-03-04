// database/event.model.ts
// Defines the Event schema and model with strict typing, indexes and
// pre-save hooks for slug generation and normalization of date/time.

import mongoose, { Document, Model, Schema } from 'mongoose';

// Attributes required to create a new Event
export interface EventAttrs {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // will be normalized to ISO string in hook
  time: string; // will be normalized to HH:MM format in hook
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

// Document returned from Mongo for Event
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

// Model interface with build helper
export interface EventModel extends Model<EventDoc> {
  build(attrs: EventAttrs): EventDoc;
}

// simple slugify: lower-case, replace spaces with -, remove non-alphanumerics
function generateSlug(title: string): string {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ensure time is HH:MM 24h
function normalizeTime(input: string): string {
  const match = input.match(/(\d{1,2}):(\d{2})/);
  if (!match) return input; // leave as-is, validation will catch later
  let [_, h, m] = match;
  let hour = parseInt(h, 10);
  if (hour < 0) hour = 0;
  if (hour > 23) hour = 23;
  return `${hour.toString().padStart(2, '0')}:${m}`;
}

const eventSchema = new Schema<EventDoc,
  EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
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

// create unique index on slug explicitly (schema option also covers it)
eventSchema.index({ slug: 1 }, { unique: true });

// pre-save hook: generate/refresh slug and normalize date/time

eventSchema.pre('save', function (next) {
  const doc = this as EventDoc;

  // ensure required strings are not empty
  if (!doc.title || !doc.description || !doc.overview || !doc.image ||
      !doc.venue || !doc.location || !doc.date || !doc.time ||
      !doc.mode || !doc.audience || !doc.agenda?.length ||
      !doc.organizer || !doc.tags?.length) {
    return next(new Error('Missing required fields')); // validation will also catch
  }

  // slug only updated when title changes
  if (doc.isModified('title')) {
    doc.slug = generateSlug(doc.title);
  }

  // normalize date to ISO string if possible
  if (doc.isModified('date')) {
    const parsed = new Date(doc.date);
    if (isNaN(parsed.getTime())) {
      return next(new Error('Invalid date format')); // prevents save
    }
    doc.date = parsed.toISOString();
  }

  // normalize time formatting
  if (doc.isModified('time')) {
    doc.time = normalizeTime(doc.time);
  }

  next();
});

// builder utility for type safety

eventSchema.statics.build = (attrs: EventAttrs) => {
  return new Event(attrs);
};

const Event = mongoose.models.Event as EventModel ||
  mongoose.model<EventDoc, EventModel>('Event', eventSchema);

export { Event };
