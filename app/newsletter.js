// app/newsletter/page.tsx
import connectDB from "@/config/db";
import Newsletter from "@/models/newsletter";
import NewsletterClient from "./NewsletterClient";

export default async function NewsletterPage() {
  await connectDB();
  const emails = await Newsletter.find().sort({ createdAt: -1 }).lean();

  return <NewsletterClient emails={JSON.parse(JSON.stringify(emails))} />;
}
