import prisma from "../../config/db";

export const createAccessRequest = async (userId: string, requestedRole: string) => {
    // Check if one already exists and is pending
    const existing = await (prisma as any).accessRequest.findFirst({
        where: { userId, status: "PENDING" }
    });
    if (existing) {
        throw new Error("You already have a pending request.");
    }

    return (prisma as any).accessRequest.create({
        data: {
            userId,
            requestedRole,
            status: "PENDING"
        }
    });
};

export const getAccessRequests = async () => {
    return (prisma as any).accessRequest.findMany({
        include: { user: { select: { email: true, name: true, role: true } } },
        orderBy: { createdAt: "desc" }
    });
};

export const updateAccessRequestStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    const request = await (prisma as any).accessRequest.update({
        where: { id },
        data: { status }
    });

    if (status === "APPROVED") {
        await prisma.user.update({
            where: { id: request.userId },
            data: { role: request.requestedRole as any }
        });
    }

    return request;
};
