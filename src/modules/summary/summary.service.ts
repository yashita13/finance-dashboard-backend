import prisma from "../../config/db";

export const getSummary = async (userId: string, query: any) => {
    const { startDate, endDate } = query;

    const dateFilter =
        startDate && endDate
            ? {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            }
            : {};

    const records = await prisma.record.findMany({
        where: {
            userId,
            isDeleted: false,
            ...dateFilter,
        },
        select: {
            amount: true,
            type: true,
            category: true,
            date: true,
        },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryBreakdown: Record<string, { income: number; expense: number }> =
        {};

    const monthlyTrends: Record<
        string,
        { income: number; expense: number }
    > = {};
    const weeklyTrends:Record<
        string,
        { income:number,expense:number}
    >={};

    records.forEach((r) => {
        // totals
        if (r.type === "INCOME") {
            totalIncome += r.amount;
        } else {
            totalExpense += r.amount;
        }

        // category breakdown (separate income & expense)
        if (!categoryBreakdown[r.category]) {
            categoryBreakdown[r.category] = { income: 0, expense: 0 };
        }

        if (r.type === "INCOME") {
            categoryBreakdown[r.category].income += r.amount;
        } else {
            categoryBreakdown[r.category].expense += r.amount;
        }

        // monthly trends (separate income & expense)
        const month = new Date(r.date).toISOString().slice(0, 7); // YYYY-MM

        if (!monthlyTrends[month]) {
            monthlyTrends[month] = { income: 0, expense: 0 };
        }

        if (r.type === "INCOME") {
            monthlyTrends[month].income += r.amount;
        } else {
            monthlyTrends[month].expense += r.amount;
        }

        //weekly trends
        const week=new Date(r.date).toISOString().slice(0,10)
        if(!weeklyTrends[week]){
            weeklyTrends[week]={income:0,expense:0}
        }

        if(r.type==="INCOME"){
            weeklyTrends[week].income+=r.amount
        }else{
            weeklyTrends[week].expense+=r.amount
        }
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown,
        monthlyTrends,
        weeklyTrends,
    };
};