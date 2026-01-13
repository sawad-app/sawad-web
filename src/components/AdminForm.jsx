import React, { useState } from 'react';
import api from '../axios/axios.js'; // Hoặc import từ folder axios của bạn

const AdminForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '', capacity: '', transmission: 'Auto',
        year: '2024', reg_code: '', price_a_plus: '',
        price_a: '', price_b: '', category_id: '', brand_id: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Thay URL bằng API backend của bạn
            await api.post('/vehicles', formData);
            alert('Thêm dữ liệu thành công!');
            onSuccess(); // Refresh lại cái bảng
        } catch (error) {
            console.error("Lỗi khi thêm xe:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Thêm xe mới</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên xe</label>
                    <input name="name" onChange={handleChange} required className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Airblade FI" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium">Dung tích</label>
                        <input name="capacity" onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="125" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Truyền động</label>
                        <select name="transmission" onChange={handleChange} className="w-full border p-2 rounded-md">
                            <option value="Auto">Auto</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium">Năm</label>
                        <input name="year" type="number" onChange={handleChange} className="w-full border p-2 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mã cà vẹt</label>
                        <input name="reg_code" onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="R, P, N..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 font-bold">Định giá (VNĐ)</label>
                    <input name="price_a_plus" type="number" onChange={handleChange} placeholder="Giá loại A+" className="w-full border p-2 rounded-md bg-green-50" />
                    <input name="price_a" type="number" onChange={handleChange} placeholder="Giá loại A" className="w-full border p-2 rounded-md bg-blue-50" />
                    <input name="price_b" type="number" onChange={handleChange} placeholder="Giá loại B" className="w-full border p-2 rounded-md bg-orange-50" />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-200 shadow-md">
                    LƯU DỮ LIỆU
                </button>
            </div>
        </form>
    );
};

export default AdminForm;