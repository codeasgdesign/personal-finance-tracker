import { FastifyReply, FastifyRequest } from "fastify";
import { ITransaction, Transaction } from "../models/Transaction";
import mongoose from 'mongoose';

export async function getSummary(req: FastifyRequest, res: FastifyReply) {
  try {
    const { startDate, endDate } = req.body as { startDate: string, endDate: string };
    const userId = (req.headers.user as unknown as { userId: string }).userId;

    const transactions: ITransaction[] = await Transaction.find({ user: userId, date: { $gte: startDate, $lte: endDate } });

    const totalIncome = await calculateTotalAmountByType(transactions, 'income');
    const totalExpenses = await calculateTotalAmountByType(transactions, 'expense');
    const balance = totalIncome - totalExpenses;
    const insightsByCategory = await calculateInsightsByCategory(transactions);

    res.send({ totalIncome, totalExpenses, balance, insightsByCategory });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

export async function getMonthlyExpenseTrends(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = (req.headers.user as unknown as { userId: string }).userId;
    const year = ((req.query) as unknown as {year:string}).year ||2024;
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' }},
          totalExpense: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          category: '$_id.category',
          totalExpense: 1
        }
      }
    ]);
    
    res.send(monthlyExpenses);
  } catch (error) {
    console.error('Error fetching monthly expense trends:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}


async function calculateTotalAmountByType(transactions: ITransaction[], type: string): Promise<number> {
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

async function calculateInsightsByCategory(transactions: ITransaction[]): Promise<{ [key: string]: { income: number, expenses: number } }> {
  return transactions.reduce((insights:any, transaction) => {
    const categoryName = transaction.category;
    if (!insights[categoryName]) {
      insights[categoryName] = { income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      insights[categoryName].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      insights[categoryName].expenses += transaction.amount;
    }
    return insights;
  }, {});
}
