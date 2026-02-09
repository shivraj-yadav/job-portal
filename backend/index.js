import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:5173', // Update this to your frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));


app.get('/home', (req, res) => {
  return res.status(200).json({ message: 'Welcome to the Job Portal API!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});