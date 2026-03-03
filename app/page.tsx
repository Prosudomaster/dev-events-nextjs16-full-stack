import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/lib/constants"


const page = () => {
  return (
    <section>
      <h1 className="text-center">The hub for every dev <br/> Event you can't miss</h1>
      <p className="text-center mt-5">Hackathones, Meetups,  and conferences all at one place</p>

      <ExploreBtn/>

    <div className="mt-20 space-y-7"></div>
      <h3>Featured Events</h3>

      <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>

    </section>
  )
}

export default page