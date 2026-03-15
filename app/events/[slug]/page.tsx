import EventDetails from "@/components/EventDetails"
import suspensee from "react/suspense"

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

  const slug = params.then(p => p.slug);
 return (
    <main>
      <suspense fallback={<div>Loading...</div>}>
        <EventDetails params={slug} />
      </suspense>
    </main>
 )
}

export default EventDetailsPage