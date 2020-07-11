const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Initial Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
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
app.use('/api/questions', require('./routes/questions'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/progresses', require('./routes/progresses'));
app.use('/api/scales', require('./routes/scales'));
app.use('/api/toeic', require('./routes/toeic'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/sets', require('./routes/sets'));
app.use('/api/terms', require('./routes/terms'));
app.use('/api/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is start on port ${PORT}`));
