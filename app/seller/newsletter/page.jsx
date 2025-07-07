'use client'
import React from "react";
import connectDB from "@/config/db";
import Newsletter from "@/models/newsletter";
import Footer from "@/components/seller/Footer";

const NewsLetterPage = async () => {
  await connectDB();
  const emails = await Newsletter.find().sort({ createdAt: -1 });

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-white">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">Newsletter Subscribers</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full text-sm">
            <thead className="text-white bg-orange-600">
              <tr>
                <th className="w-12 px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium max-sm:hidden">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                emails.map((entry, index) => (
                  <tr
                    key={entry._id}
                    className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 break-words">{entry.email}</td>
                    <td className="px-4 py-3 max-sm:hidden text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsLetterPage;
