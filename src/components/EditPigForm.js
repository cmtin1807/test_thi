import React, { useState, useEffect } from 'react';

const EditPigForm = ({ pig, onEdit, onClose }) => {
    const [exitDate, setExitDate] = useState('');
    const [exitWeight, setExitWeight] = useState('');
    const [errors, setErrors] = useState({}); // State để lưu lỗi

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0]; // Định dạng ngày YYYY-MM-DD
        setExitDate(currentDate);
    }, []);

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra xem khối lượng xuất chuồng có được nhập hay không
        if (!exitWeight|| exitWeight <= 10) {
            newErrors.exitWeight = 'Khối lượng xuất chuồng phải lớn hơn 10kg';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const updatedPig = {
                ...pig,
                exitDate,
                exitWeight: parseFloat(exitWeight),
            };

            onEdit(updatedPig); // Gọi hàm onedit để cập nhật heo
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={"mb-3"}>
                <label>Ngày xuất chuồng</label>
                <input
                    className={"form-control"}
                    type="date"
                    value={exitDate}
                    onChange={(e) => setExitDate(e.target.value)}
                />
            </div>

            <div className={"mb-3"}>
                <label>Trọng lượng xuất chuồng (kg)</label>
                <input
                    className={"form-control"}

                    type="number"
                    value={exitWeight}
                    onChange={(e) => setExitWeight(e.target.value)}
                />
                {errors.exitWeight && <p style={{ color: 'red' }}>{errors.exitWeight}</p>} {/* Hiển thị thông báo lỗi */}
            </div>

            <button className={"btn btn-success mx-2"}  type="submit">Xuất chuồng</button>
            <button className={"btn btn-secondary bi bi-x"} type="button" onClick={onClose}>Đóng</button>
        </form>
    );
};

export default EditPigForm;
