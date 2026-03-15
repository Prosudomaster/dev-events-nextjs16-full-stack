<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent platform. The setup includes client-side initialization via `instrumentation-client.ts` (using the Next.js 15.3+ pattern), a reverse proxy through Next.js rewrites to improve event delivery reliability, a shared `lib/posthog-server.ts` helper for server-side tracking with `posthog-node`, and event captures across all major user and business flows. Existing broken PostHog calls in `BookEvent.tsx` (where captures were placed after `return` statements) have been fixed. User identification has been added on the client using the booking email, and mirrored on the server side in the booking action.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" button on the homepage hero | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view its details (top of funnel) | `components/EventCard.tsx` |
| `event_booked` | User successfully books a spot for an event (conversion) | `components/BookEvent.tsx` |
| `booking_failed` | Event booking attempt fails — error captured via `captureException` | `components/BookEvent.tsx` |
| `event_details_viewed` | User views a specific event details page (server-side, funnel entry) | `app/events/[slug]/page.tsx` |
| `event_created` | A new event is successfully published via the API (server-side) | `app/api/events/route.ts` |
| `booking_created` | A booking is confirmed in the database (server-side, with user identify) | `lib/actions/bookingaction.action.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/343365/dashboard/1362946
- **Booking Conversion Funnel** (3-step funnel: card click → details → booked): https://us.posthog.com/project/343365/insights/nhWgqVgC
- **Daily Event Bookings** (daily trend of successful bookings): https://us.posthog.com/project/343365/insights/Vf3V3n3X
- **Events Created vs Bookings (Weekly)** (supply vs demand): https://us.posthog.com/project/343365/insights/sph7G3Y5
- **Homepage Engagement** (explore clicks & event card clicks): https://us.posthog.com/project/343365/insights/j8wNDvlT
- **Booking Failure Rate** (daily failed booking attempts): https://us.posthog.com/project/343365/insights/IBYPcpRO

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
