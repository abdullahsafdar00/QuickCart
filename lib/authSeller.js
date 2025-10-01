import { clerkClient } from '@clerk/nextjs/server';

/**
 * Check whether given userId is a seller.
 * Returns true/false. Never returns a NextResponse so callers can use it in server components.
 */
const authSeller = async (userId) => {
    if (!userId) return false;
    try {
        const client = clerkClient;
        const user = await client.users.getUser(userId);
        return user?.publicMetadata?.role === 'seller';
    } catch (error) {
        // Log if you have a logger; for now just return false to deny access on error
        return false;
    }
}

export default authSeller;