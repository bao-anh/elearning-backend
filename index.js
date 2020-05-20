const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Initial Middleware
app.use(express.json({ extended: false }));

// User Cors
app.use(cors());

app.get('/', (req, res) => res.json({ msg: 'hello world' }));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/documents', require('./routes/documents'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is start on port ${PORT}`));
