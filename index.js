require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Thư viện để kết nối và tương tác với MongoDB
const userRouter = require('./routers/user'); // Router để xử lý các yêu cầu liên quan đến người dùng
const workRouter = require('./routers/work'); // Router để xử lý các yêu cầu liên quan đến công việc
const leaveRouter = require('./routers/leave'); // Router để xử lý các yêu cầu liên quan đến nghỉ phép    
const PORT = 3000;
const app = express();


// Middleware để xử lý CORS (Cross-Origin Resource Sharing) cho phép các yêu cầu từ các nguồn khác nhau
// CORS là một cơ chế bảo mật trong trình duyệt web để ngăn chặn các yêu cầu từ các nguồn khác nhau (cross-origin requests) mà không được phép.
// Middleware này cho phép ứng dụng của bạn chấp nhận các yêu cầu từ các nguồn khác
const cors = require('cors');
app.use(cors());
//---------------------------------------------
app.use(express.json()); // Middleware để phân tích dữ liệu JSON trong yêu cầu HTTP 


app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});
app.use(userRouter); // Sử dụng router người dùng để xử lý các yêu cầu liên quan đến người dùng
app.use(workRouter); // Sử dụng router công việc để xử lý các yêu cầu liên quan đến công việc
app.use(leaveRouter); // Sử dụng router nghỉ phép để xử lý các yêu cầu liên quan đến nghỉ phép
// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


