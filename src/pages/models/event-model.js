import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
    event_date: { type: Date, required: true },
    event_title: { type: String, required: true },
    event_theme: { type: String, required: true }
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
