import {Router } from 'express';
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../controllers/todo.controller';

const TodoRoute = Router();

TodoRoute.post('/todos', createTodo);
TodoRoute.get('/todos', getTodos);
TodoRoute.get('/todos/:id', getTodoById);
TodoRoute.patch('/todos/:id', updateTodo);
TodoRoute.delete('/todos/:id', deleteTodo);

export default TodoRoute;