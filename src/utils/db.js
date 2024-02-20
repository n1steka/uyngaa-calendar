
import mongoose, { ConnectOptions } from 'mongoose';

const MONGO_URI = "mongodb+srv://admin:nDSv7Hu54CU8E6LM@cluster0.wee5qjg.mongodb.net/uyngaa" || 'your-mongodb-uri';

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectMongo;