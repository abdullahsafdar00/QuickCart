import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "HMElectronics-next" });

// Ingest Function to save user data to database
export const syncUserCreation = inngest.createFunction({
    id: "sync-user-from-clerk",
},
{event: 'clerk/user.created'},
async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
        _id: id, 
        email: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        imageUrl: image_url
    }
    await connectDB();
    await User.create(userData)
}
)

// inngest function to update user data in database

export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
         const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
        _id: id, 
        email: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        imageUrl: image_url
    }
    await connectDB();
    await User.findByIdAndUpdate(id, userData)
    }

)

// inngest function to delete user from database

export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk"
    },
    { event: 'clerk/user.deleted' },
    async ({event}) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id)
    }
) 

// inngest function to create user's order in database

export const createUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        batchEvents: {
            maxSize: 5,
            timeout: '3s'
        }
    },

    { event: 'order/created'},
    async ({ events})=>{
        const orders = events.map((event)=>{
            return { 
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })
        await connectDB();
        await Order.insertMany(orders)

        return {success: true, processed: orders.length};
    }

)

// Background job: send order notification emails and perform courier booking if needed
export const notifyOnOrder = inngest.createFunction(
    {
        id: 'notify-on-order'
    },
    { event: 'order/created' },
    async ({ event }) => {
        try {
            const data = event.data;
            await connectDB();

            // Reload user to get email (in case it changed)
            const user = await User.findById(data.userId);

            // Send emails (best-effort)
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });

            const itemsHtml = (data.itemDetails || []).map(
                (item) => `<li>${item.name} - ${item.quantity} × ${item.price}</li>`
            ).join('');

            const orderDetailsHtml = `
              <h2> Order Summary</h2>
              <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
              <p><strong>Total:</strong> PKR ${data.amount}</p>
              <p><strong>Shipping:</strong> ${data.address}</p>
              <ul>${itemsHtml}</ul>
            `;

            // Admin email (non-blocking)
            transporter.sendMail({
                from: `"HM Electronics Order" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO,
                subject: `📦 New Order Received - ${data.userId}`,
                html: orderDetailsHtml,
            }).catch(err => console.error('Admin email failed', err));

            // Customer email
            if (user?.email) {
                transporter.sendMail({
                    from: `"HM Electronics" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: '✅ Your Order Confirmation',
                    html: `
                      <h2>Thank you for your order!</h2>
                      <p>Your order has been placed successfully.</p>
                      ${orderDetailsHtml}
                      <p>Well ship your items soon!</p>
                    `,
                }).catch(err => console.error('Customer email failed', err));
            }

            // Optionally, perform courier API call here (left as TODO)
            return { success: true };
        } catch (error) {
            console.error('notifyOnOrder failed', error);
            return { success: false, error: String(error) };
        }
    }
)