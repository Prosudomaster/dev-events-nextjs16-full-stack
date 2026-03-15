import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
// import { cacheLife } from "next/cache";
import { EventAttrs } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const page = async () => {
  // 'use cache';
  // cacheLife('hours');

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  return (
    <section>
      <h1 className="text-center">The hub for every dev <br/> Event you can't miss</h1>
      <p className="text-center mt-5">Hackathones, Meetups,  and conferences all at one place</p>

      <ExploreBtn/>

    <div className="mt-20 space-y-7"></div>
      <h3>Featured Events</h3>

      <ul className="events">
        {events && events.length > 0 && events.map((event: EventAttrs) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>

    </section>
  )
}

export default page