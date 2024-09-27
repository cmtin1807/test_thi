import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PigForm = ({ onSave, onClose, pigs }) => {
    const [code, setCode] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [entryWeight, setEntryWeight] = useState('');
    const [origin, setOrigin] = useState('');
    const [origins, setOrigins] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/origins')
            .then(response => setOrigins(response.data))
            .catch(error => console.error(error));
    }, []);

    const validateForm = () => {
        const newErrors = {};

        // Validate Mã số heo
        if (!/^MH-\d{3}$/.test(code)) {
            newErrors.code = 'Mã số heo phải theo định dạng MH-XXX (XXX là các số)';
        }

        // Validate ngày nhập chuồng
        const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại
        if (!entryDate || entryDate > currentDate) {
            newErrors.entryDate = 'Ngày nhập chuồng phải nhỏ hơn hoặc bằng ngày hiện tại';
        }

        // Validate trọng lượng khi nhập
        if (!entryWeight || entryWeight <= 5) {
            newErrors.entryWeight = 'Trọng lượng khi nhập phải lớn hơn 5kg';
        }

        // Validate xuất xứ
        if (!origin) {
            newErrors.origin = 'Xuất xứ là bắt buộc';
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };
    let lastId = 0;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const maxId = pigs.length > 0 ? Math.max(...pigs.map(pig => pig.id)) : 0;

            const newPig = {
                id: maxId + 1,
                code,
                entryDate,
                entryWeight: parseFloat(entryWeight),
                exitDate: '',
                exitWeight: parseFloat(entryWeight),
                origin
            };

            axios.post('http://localhost:5000/pigs', newPig)
                .then(() => {
                    onSave(); // Gọi lại hàm fetchPigs để cập nhật danh sách
                    onClose(); // Đóng modal sau khi lưu thành công
                })
                .catch(error => console.error(error));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
            <div className="mb-3">
                <label className="form-label">Mã số heo</label>
                <input
                    type="text"
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`} // Thêm lớp 'is-invalid' nếu có lỗi
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Ngày nhập chuồng</label>
                <input
                    type="date"
                    className={`form-control ${errors.entryDate ? 'is-invalid' : ''}`}
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                />
                {errors.entryDate && <div className="invalid-feedback">{errors.entryDate}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Trọng lượng nhập chuồng (kg)</label>
                <input
                    type="number"
                    className={`form-control ${errors.entryWeight ? 'is-invalid' : ''}`}
                    value={entryWeight}
                    onChange={(e) => setEntryWeight(e.target.value)}
                />
                {errors.entryWeight && <div className="invalid-feedback">{errors.entryWeight}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Xuất xứ</label>
                <select
                    className={`form-select ${errors.origin ? 'is-invalid' : ''}`}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                >
                    <option value="">Chọn xuất xứ</option>
                    {origins.map(o => (
                        <option key={o.id} value={o.name}>{o.name}</option>
                    ))}
                </select>
                {errors.origin && <div className="invalid-feedback">{errors.origin}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Lưu</button>
        </form>
    );
};

export default PigForm;
