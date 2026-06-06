import mongoose, { InferSchemaType } from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    description: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

type ITodo = InferSchemaType<typeof todoSchema>;

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;