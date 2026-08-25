import { clerkClient, getAuth } from '@clerk/express';

const getAuthUserId = (req) => {
    try {
        const auth = getAuth(req);
        if (auth?.userId) return auth.userId;
    } catch {
        // Ignore and fallback
    }
    if (typeof req.auth === 'function') {
        try {
            return req.auth()?.userId;
        } catch {
            return null;
        }
    }
    return req.auth?.userId || null;
};

export const protectRoute = async (req, res, next) => {
    const userId = getAuthUserId(req);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized--you must be logged in" });
    }
    next();
};

export const requireAdmin = async (req, res, next) => {
    try {
        const userId = getAuthUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized--you must be logged in" });
        }

        const currentUser = await clerkClient.users.getUser(userId);
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

        const userEmail = (
            currentUser.primaryEmailAddress?.emailAddress ||
            currentUser.emailAddresses?.find(e => e.id === currentUser.primaryEmailAddressId)?.emailAddress ||
            currentUser.emailAddresses?.[0]?.emailAddress ||
            ""
        ).trim().toLowerCase();

        const adminEmails = (adminEmail || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
        const isAdmin = adminEmails.includes(userEmail);
        console.log(`[Admin Check] Configured Admin Email: '${adminEmail}', Logged-in User Email: '${userEmail}', Matches: ${isAdmin}`);

        if (!isAdmin) {
            return res.status(403).json({ message: "Unauthorised - you must be an admin" });
        }

        next();
    } catch (error) {
        next(error);
    }
};



