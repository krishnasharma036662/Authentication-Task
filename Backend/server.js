import app from './src/app.js';
import connectDB from './src/config/database.js';

// Connect to the database
connectDB();

// Start the server

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});