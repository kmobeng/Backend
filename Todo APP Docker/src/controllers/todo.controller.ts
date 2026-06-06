import Todo from "../model/todo.model";
import { Request, Response } from "express";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title,description } = req.body;
    const newTodo = await Todo.create({ title, description }); 
    res.status(201).json({status: "success", data: newTodo});
  } catch (error) {
    res.status(500).json({ message: "Error creating todo", error });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({status: "success", data: todos});
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo
        = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }   

    res.status(200).json({status: "success", data: todo});
  } catch (error) {
    res.status(500).json({ message: "Error fetching todo", error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({status: "success", data: updatedTodo});
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error });
    }
};


export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({status: "success", data: deletedTodo});
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error });
    }
};

