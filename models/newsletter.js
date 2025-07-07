// models/Newsletter.js
import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  },
  
);

const Newsletter = mongoose.models.newsletter || mongoose.model("newsletter", NewsletterSchema);

export default Newsletter;
