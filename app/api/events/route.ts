import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb'
import { Event } from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';
import { getPostHogClient } from "@/lib/posthog-server";



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

        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', Folder: 'Devevent' }, (error, results) => {
                if (error) return reject(error);

                resolve(results);

            }).end(buffer);
        }
        );

        event.image = uploadResult.secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        const posthog = getPostHogClient();
        posthog.capture({
            distinctId: "anonymous",
            event: "event_created",
            properties: {
                title: createdEvent.title,
                slug: createdEvent.slug,
                location: createdEvent.location,
                mode: createdEvent.mode,
                tags: createdEvent.tags,
            },
        });
        await posthog.shutdown();

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, {status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: 'Error Creation Failed', error: error instanceof Error ? error.message : 'unknown'

        }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });
        
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Event fetching failed', error: error }, { status: 500 })

    }
}

