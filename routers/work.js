const express = require('express'); // Framework để tạo các API HTTP.
const Work = require('../models/work'); // Đây là mô hình của một công việc, bao gồm các thông tin như thời gian check-in, check-out, thời gian làm việc, báo cáo, kế hoạch và ID người dùng.
const workRouter = express.Router(); // Khởi tạo một router cho các API liên quan đến công việc.

workRouter.post('/api/work', async (req, res) => {
    try {
        const { checkInTime, checkOutTime, workTime, report, plan, note, userId } = req.body;
        // Tạo một công việc mới vớ i các thông tin từ yêu cầu
        const work = new Work({ checkInTime, checkOutTime, workTime, report, plan, note, userId });
        // Lưu công việc vào cơ sở dữ liệu
        await work.save();
        res.status(201).json(work); // Trả về công việc đã tạo với mã trạng thái 201 (Created)
    } catch (e) {
        res.status(500).json({ error: e.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
});

workRouter.get('/api/work/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const works = await Work.find({userId}); // Tìm công việc theo userId từ tham số URL
        if (!works || works.length == 0) {
            return res.status(404).json({ message: 'Work of user not found' }); // Trả về lỗi nếu không tìm thấy công việc
        }
        res.json(works); // Trả về công việc tìm thấy
    } catch (e) {
        res.status(500).json({ error: e.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
});



workRouter.get('/api/work', async (req, res) => {
    try {
        const works = await Work.find(); // Lấy tất cả công việc từ cơ sở dữ liệu
        res.json(works); // Trả về danh sách công việc
    } catch (e) {
        res.status(500).json({ error: e.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
});




workRouter.get('/api/work_checkin/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Lấy ID công việc từ tham số URL

        // Lấy bản ghi mới nhất của user chưa check-out
        const latestWork = await Work.findOne({
        userId,
        workTime: null, // hoặc checkInTime == checkOutTime nếu bạn muốn thay đổi
        })
        .sort({ checkInTime: -1 })
        .exec();
        
        if (!latestWork) {
            return res.status(404).json({ message: 'Work_checkin not found' }); // Trả về lỗi nếu không tìm thấy công việc
        }
        return res.status(200).json(latestWork); // Trả về mã trạng thái // Trả về công việc đã cập nhật
    } catch (e) {
        res.status(500).json({ error: e.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
});

workRouter.put('/api/work/:id', async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID công việc từ tham số URL
        const {checkOutTime, workTime, report, plan, note} = req.body; // Lấy các thông tin cập nhật từ yêu cầu
        const updateWork = await Work.findByIdAndUpdate(
            id, 
            { checkOutTime, workTime, report, plan, note }, // Cập nhật các trường cần thiết
            { new: true } // Trả về tài liệu đã cập nhật
        );

        
        if (!updateWork) {
            return res.status(404).json({ message: 'Work not found' }); // Trả về lỗi nếu không tìm thấy công việc
        }
        return res.status(200).json(updateWork); // Trả về mã trạng thái // Trả về công việc đã cập nhật
    } catch (e) {
        res.status(500).json({ error: e.message }); // Trả về lỗi nếu có vấn đề xảy ra
    }
});
    
module.exports = workRouter; // Xuất router để sử dụng trong các tệp khác
// Đây là các API liên quan đến công việc, bao gồm tạo công việc mới và lấy