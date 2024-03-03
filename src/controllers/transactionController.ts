import { FastifyRequest, FastifyReply } from "fastify";
import { ITransaction, Transaction } from "../models/Transaction";
import { Category } from "../models/Category";
import mongoose from "mongoose";

export async function createTransaction(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { amount, date, category, type, description } =
      req.body as ITransaction;
    const userId = (req.headers.user as unknown as { userId: string }).userId;

    let categoryId;
    const existingCategory = await Category.findOne({
      name: category,
      user: userId,
    });
    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      const newCategory = new Category({ name: category, user: userId });
      const savedCategory = await newCategory.save();
      categoryId = savedCategory._id;
    }

    // Create the transaction
    const newTransaction = new Transaction({
      amount,
      date,
      category: categoryId, // Use the category ID
      user: userId,
      type,
      description,
    });

    await newTransaction.save();

    res.status(201).send({
      id: newTransaction._id,
      amount: newTransaction.amount,
      date: newTransaction.date,
      category: category,
      type: newTransaction.type,
      description: newTransaction.description,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to fetch all transactions for the logged-in user
export async function getTransactions(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = (req.headers.user as unknown as { userId: string }).userId;

    const transactions: ITransaction[] = await Transaction.find({
      user: userId,
    })
      .populate("category", "name")
      .select("amount date category type description");
    res.send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateTransaction(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { id } = req.params as { id: string };
    const updates = req.body as Partial<ITransaction>;
    if (updates.category) {
      const name = updates.category;
      const userId = (req.headers.user as unknown as { userId: string }).userId;
      const existingCategory = await Category.findOne({
        name: Category,
        user: userId,
      });
      if (existingCategory) {
        updates.category = existingCategory._id;
      } else {
        const newCategory = new Category({ name, user: userId });
        const savedCategory = await newCategory.save();
        updates.category = savedCategory._id;
      }
    }

    const updatedTransaction: ITransaction | null =
      await Transaction.findByIdAndUpdate(id, updates, { new: true })
        .populate("category", "name")
        .select("amount date category type description") as unknown as ITransaction;

    if (!updatedTransaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    res.send(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to delete a specific transaction
export async function deleteTransaction(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { id } = req.params as { id: string };
    const deletedTransaction: ITransaction | null =
      await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    res.send({ message: "Transaction deleted successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    console.error("Error deleting transaction:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
