import prisma from "../../config/db";

export const createRecord = async (data: any, userId: string) => {
    return prisma.record.create({
        data: {
            ...data,
            date:new Date(data.date),
            userId,
        },
    });
};

export const getRecords = async (filters: any, userId: string) => {
    //adding pagination too
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 5;
    const where = {
        userId,
        isDeleted: false,
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category }),
        ...(filters.search && {
            category: {
                contains: filters.search,
                mode: "insensitive",
            },
        }),
        ...(filters.startDate&&filters.endDate&&{
            date:{
                gte:new Date(filters.startDate),
                lte:new Date(filters.endDate)
            }
        }),
    };
    const total = await prisma.record.count({ where });
    const records = await prisma.record.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
    });

    return {
        records,
        total,
        page,
        limit,
    };
};

export const updateRecord = async (id: string, data: any, userId: string) => {
    return prisma.record.update({
        where: {
            id,
            userId,
        },
        data,
    });
};

export const deleteRecord = async (id: string, userId: string) => {
    return prisma.record.update({
        where: {
            id,
            userId,
        },
        data: {
            isDeleted: true,
        },
    });
};

export const getRecentRecords=async(userId:string,limit:number=5)=>{
    return prisma.record.findMany({
        where:{
            userId,
            isDeleted:false
        },
        orderBy:{
            createdAt:"desc"
        },
        take:limit
    })
}