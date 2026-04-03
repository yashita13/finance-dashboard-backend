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
    return prisma.record.findMany({
        where: {
            userId,
            isDeleted: false,
            ...(filters.type && { type: filters.type }),
            ...(filters.category && { category: filters.category }),
        },
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