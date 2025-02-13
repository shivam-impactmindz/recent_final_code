// src\app\utils\database.js
import mongoose from "mongoose";

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("Database connected!");
};

// ✅ Make sure we export it correctly
export { connectToDatabase };

