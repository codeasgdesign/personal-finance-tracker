// Import the category schema
import { FastifyRequest, FastifyReply } from 'fastify';
import { Category } from '../models/Category'; 

// Controller function to create a new category
export async function createCategory(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = (req.headers.user as unknown as {userId:string}).userId; 
    const { name } = req.body as { name: string }; 
    const categoryExists = await Category.findOne({ name, user: userId });
    if (categoryExists) {
      res.status(400).send({ error: 'Category already exists' });
    } 
    const category = new Category({ name, user: userId });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

export async function getCategories(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = (req.headers.user as unknown as {userId:string}).userId; 
    const categories = await Category.find({user:userId});
    
    res.send(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateCategory(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string }; 
     const userId = (req.headers.user as unknown as {userId:string}).userId; 
     const newName=(req.body as { name: string }).name; 
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, user: userId }, 
      { name:newName },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).send({ error: 'Category not found' });
    }

    res.send(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}


export async function deleteCategory(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const userId = (req.headers.user as unknown as {userId:string}).userId as string; 

    const deletedCategory = await Category.findOneAndDelete({ _id: id, user: userId });
    
    if (!deletedCategory) {
      return res.status(404).send({ error: 'Category not found' });
    }

    res.send({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
