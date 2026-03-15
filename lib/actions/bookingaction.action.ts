'use server';

import connectDB from '@/lib/mongodb';
import { Booking } from "@/database/booking.model";
import { getPostHogClient } from "@/lib/posthog-server";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDB()

        await Booking.create({ eventId, slug, email });

        const posthog = getPostHogClient();
        posthog.identify({ distinctId: email, properties: { email } });
        posthog.capture({
            distinctId: email,
            event: "booking_created",
            properties: { eventId, slug, email },
        });
        await posthog.shutdown();

        return { success: true };

    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false };
    }
}