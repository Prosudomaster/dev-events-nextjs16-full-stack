'use client';

import { createBooking } from '@/lib/actions/bookingaction.action';
import { useState } from 'react';
import posthog from 'posthog-js';


const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await createBooking({ eventId, slug, email });

    if (success) {
      return setSubmitted(true);

      posthog.capture('event_booked', { eventId, slug, email });
    }else {
      console.error('Booking failed');
      return alert('Booking failed. Please try again later.');
      posthog.captureException('Booking failed', { eventId, slug, email });
    }
  }

  return (
    <div className="" id="book-event">

      {submitted ? (
        <p>Thankyou for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button type="submit" className="button-submit">Submit</button>
        </form>)}
    </div>
  )
}

export default BookEvent