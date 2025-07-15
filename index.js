// import http from 'http';
// import { Server } from 'socket.io';;


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Thư viện để kết nối và tương tác với MongoDB
const userRouter = require('./routers/user'); // Router để xử lý các yêu cầu liên quan đến người dùng
const workRouter = require('./routers/work'); // Router để xử lý các yêu cầu liên quan đến công việc
const leaveRouter = require('./routers/leave'); // Router để xử lý các yêu cầu liên quan đến nghỉ phép    
const PORT = 3000;
const app = express();

// Tạo một máy chủ HTTP và kết nối với Socket.IO
// const server = http.createServer(app);
// const io = new Server(server);
// const userSockets = new Map();


// Thiết lập Socket.IO để lắng nghe các kết nối từ phía client
// Khi có một kết nối mới, nó sẽ được xử lý trong hàm callback này
// `socket` là một đối tượng đại diện cho kết nối của client
// `io` là đối tượng Socket.IO toàn cục, cho phép gửi và nhận sự kiện từ tất cả các kết nối 
//---- Tức là khi có một client kết nối đến server, hàm này sẽ được gọi và chúng ta có thể xử lý các sự kiện liên quan đến client đó
// io.on('connection', (socket) => {
//     console.log(`Connected:${socket.id} `);

//     // Lắng nghe sự kiện 'user-join' từ client
//     // Khi client gửi sự kiện này, chúng ta sẽ lưu trữ socket ID của người dùng trong Map `userSockets` với key là tên người dùng
//     // Sau đó, gửi lại thông báo cho client rằng phiên làm việc đã được bắt đầu
//     socket.on('user-join', (data) => {
//         userSockets.set(data,socket.id);
//         io.to(socket.id).emit('session-join', 'Your session has been started');
//     });
//     socket.on('disconnect', () => {
//         for(let [user, socketId] of userSockets.entries()) {
//             if (socketId == socket.id) {
//                 userSockets.delete(user);
//                 console.log(`User ${user} disconnected`);
//                 break;
//             }
//         }
//     });
// });



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


