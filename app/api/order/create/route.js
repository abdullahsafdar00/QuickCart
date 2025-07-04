import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({success: false, message: "No items in the order"})
        }

        // calculate amount using items

        let amount = 0;

for (const item of items) {
  const product = await Product.findById(item.product);
  if (!product) continue;
  amount += product.offerPrice * item.quantity;
}

const totalAmount = amount + Math.floor(amount * 0.02); // adding 2% fee

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: totalAmount,
                date: Date.now(),
            }
        })
        // clear user cart

        const user = await User.findById(userId);
        user.cartItems = {}
        await user.save();

        return NextResponse.json({success: true, message: "Order Placed"})


    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false, message: error.message})
    }
}