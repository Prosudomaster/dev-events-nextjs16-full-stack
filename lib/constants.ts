export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    title: "React Conf 2025",
    image: "/images/event1.png",
    slug: "react-conf-2025",
    location: "Las Vegas, Nevada",
    date: "October 24-25, 2025",
    time: "09:00 AM - 05:00 PM PDT",
  },
  {
    title: "Next.js Conf",
    image: "/images/event2.png",
    slug: "nextjs-conf-2025",
    location: "San Francisco, California",
    date: "November 12-13, 2025",
    time: "08:30 AM - 06:00 PM PST",
  },
  {
    title: "HackMIT 2025",
    image: "/images/event3.png",
    slug: "hackmit-2025",
    location: "Cambridge, Massachusetts",
    date: "October 3-5, 2025",
    time: "06:00 PM - 12:00 AM EST",
  },
  {
    title: "Google I/O 2026",
    image: "/images/event4.png",
    slug: "google-io-2026",
    location: "Mountain View, California",
    date: "May 12-14, 2026",
    time: "09:00 AM - 06:00 PM PDT",
  },
  {
    title: "JavaScript Global Summit",
    image: "/images/event5.png",
    slug: "js-global-summit",
    location: "Dubai, UAE",
    date: "April 15-17, 2026",
    time: "10:00 AM - 05:00 PM GST",
  },
  {
    title: "Tech Leaders Conference",
    image: "/images/event6.png",
    slug: "tech-leaders-conf",
    location: "Austin, Texas",
    date: "June 1-3, 2026",
    time: "08:00 AM - 07:00 PM CDT",
  },
];
