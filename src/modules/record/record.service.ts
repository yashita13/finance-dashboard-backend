import prisma from "../../config/db";

export const createRecord = async (data: any, userId: string) => {
    return prisma.record.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const getRecords = async (filters: any, userId: string) => {
    //adding pagination too
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 5;

    return prisma.record.findMany({
        where: {
            userId,
            isDeleted: false,
            ...(filters.type && { type: filters.type }),
            ...(filters.category && { category: filters.category }),
            //adding insensitive search too
            ...(filters.search && {
                category: {
                    contains: filters.search,
                    mode: "insensitive",
                },
            }),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            date: "desc",
        },
    });
};

export const updateRecord = async (id: string, data: any, userId: string) => {
    return prisma.record.updateMany({
        where: {
            id,
            userId,
        },
        data,
    });
};

export const deleteRecord = async (id: string, userId: string) => {
    return prisma.record.updateMany({
        where: {
            id,
            userId,
        },
        data: {
            isDeleted: true,
        },
    });
};