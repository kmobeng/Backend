import express from 'express';
import morgan from 'morgan';
import todoRoute from './routes/todo.route';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api',todoRoute);

export default app;