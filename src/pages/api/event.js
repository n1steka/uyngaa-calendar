import connectMongo from '@/utils/db';
import Event from '../models/event-model'; // Assuming Event is exported as default from '@/utils/db'

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                await connectMongo();
                const newEvent = await Event.create({ ...req.body });
                console.log("req body :", req.body)
                return res.status(201).json({ success: true, data: newEvent });
            } catch (error) {
                console.error('Error adding event:', error);
                return res.status(500).json({ success: false, error: 'Error adding event' });
            }
        case 'GET':
            try {
                await connectMongo();
                const allEvents = await Event.find();
                return res.status(200).json({ success: true, data: allEvents });
            } catch (error) {
                console.error('Error fetching events:', error);
                return res.status(500).json({ success: false, error: 'Error fetching events' });
            }
        default:
            return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
}
