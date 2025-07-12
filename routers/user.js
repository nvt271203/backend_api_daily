const express = require('express'); // Framework để tạo các API HTTP.
const User = require('../models/user');  //Đây là mô hình của một người dùng, bao gồm các thông tin như fullname, email, và password.
const bcrypt = require('bcryptjs'); // Chắc là Framework để băm chuỗi
const jwt = require('jsonwebtoken'); // Thư viện để tạo và xác thực JSON Web Tokens (JWT) cho việc xác thực người dùng.
const authRouter = express.Router();  //KHởi tọa 1 router.

authRouter.post('/api/register', async (req, res) => {
    try {
        const { fullName, birthDay, sex, email, password } = req.body;
        // Kiểm tra xem người dùng đã tồn tại chưa     
        const existingUser = await User.findOne({ email: email });  
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
         }else{
            
            // Chắc là tạo định dạng Băm chuỗi
            const salt = await bcrypt.genSalt(10);

            // Áp dụng băm chuỗi vào mật khẩu
            const hashedPassword = await bcrypt.hash(password, salt);
        
 
            var user = new User({fullName, birthDay, sex, email, password: hashedPassword}); //3Thso này lấy từ ID
            user = await user.save();
            res.json({user});   
        }

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


authRouter.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Tìm người dùng theo email
        const findUser = await User.findOne({email });
        if (!findUser) {
            return res.status(400).json({ message: 'User not found with this email' });
        }else{
            const isMatch = await bcrypt.compare(password, findUser.password); // so sánh mật khẩu chưa mã hoá với mật khẩu đã mã hóa trong cơ sở dữ liệu
            if (!isMatch) {
                return res.status(400).json({ message: 'Password is incorrect, please re-enter password' });
            }else{
                // Tạo token định danh người dùng đã đăng nhập thành công
                const token = jwt.sign({id: findUser._id}, "passwordKey");
                const { password, ...userWithoutPassword } = findUser._doc; // loại bỏ mật khẩu khỏi đối tượng người dùng
                     //Lưu 2 key là token và đối tượng User
                res.json({token, user: userWithoutPassword});
            }
        }
}
    catch (e) {
        res.status(500).json({error: e.message});
    }
});



module.exports = authRouter;