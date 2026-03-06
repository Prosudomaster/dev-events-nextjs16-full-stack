import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb'
import { Event } from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData()

        let event;

        try {
            event = Object.fromEntries(formData.entries())
        } catch (error) {
            return NextResponse.json({ message: 'Invalid Json Data Format' }, {status: 400})
        }

        const createdEvent = await Event.create(event);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, {status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: 'Error Creation Failed', error: error instanceof Error ? error.message : 'unknown'

        }, { status: 500 })
    }
}