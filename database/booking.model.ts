// database/booking.model.ts
// Booking references an Event and stores attendee email. Validations
// enforce email format and existing event relationship.

import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { Event } from './event.model';

// Attributes required to create a booking
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

// Document stored in Mongo for booking
export interface BookingDoc extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Model with builder helper
export interface BookingModel extends Model<BookingDoc> {
  build(attrs: BookingAttrs): BookingDoc;
}

const bookingSchema = new Schema<BookingDoc, BookingModel>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    email: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// email regex (simple version)
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// pre-save hook: ensure event exists and email is valid
bookingSchema.pre('save', async function (next) {
  const doc = this as BookingDoc;

  if (!emailRegex.test(doc.email)) {
    return next(new Error('Invalid email address'));
  }

  // verify referenced event
  const exists = await Event.exists({ _id: doc.eventId });
  if (!exists) {
    return next(new Error('Referenced event does not exist'));
  }

  next();
});

bookingSchema.statics.build = (attrs: BookingAttrs) => {
  return new Booking(attrs);
};

const Booking = mongoose.models.Booking as BookingModel ||
  mongoose.model<BookingDoc, BookingModel>('Booking', bookingSchema);

export { Booking };
