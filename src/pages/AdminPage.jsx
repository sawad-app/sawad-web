import React, { useState } from 'react';
import PriceTable from '../components/PriceTable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import api from '../axios/axios';
import { Button, Modal, Space, Upload, Typography } from 'antd';
import { InboxOutlined, CarOutlined, RocketOutlined, LeftOutlined } from '@ant-design/icons';


const { Dragger } = Upload;
const { Text } = Typography;
const AdminPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState(null);

    const handleClose = () => {
        setIsModalOpen(false);
        setCategory(null);
    };

    // Hàm Import Excel
    const handleImportExcel = (file) => {
        const reader = new FileReader();

        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' }); // Đồng bộ với readAsBinaryString
                const sheetName = wb.SheetNames[0];
                const worksheet = wb.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

                const payload = data.map(item => {
                    const cleanItem = {};
                    // Làm sạch khoảng trắng tiêu đề
                    Object.keys(item).forEach(key => {
                        cleanItem[key.trim()] = item[key];
                    });

                    // Hàm xử lý giá tiền (nhân 1 triệu)
                    const formatPrice = (val) => val ? Math.round(parseFloat(val) * 1000000) : 0;

                    return {
                        name: cleanItem['Tên Xe'],
                        capacity: cleanItem['Dung Tích'],
                        transmission: cleanItem['AT/MT'],
                        year: cleanItem['Năm'],
                        reg_code: cleanItem['Mã Cà Vẹt'],
                        price_a_plus: formatPrice(cleanItem['A+']),
                        price_a: formatPrice(cleanItem['A']),
                        price_b: formatPrice(cleanItem['B']),
                        brand_name: cleanItem['Hãng Xe'],
                        category_id: category // Lấy từ state category bạn đã chọn ở Modal
                    };
                }).filter(v => v.name);

                await api.post('/vehicles/import', { vehicles: payload, category_id: category });
                toast.success(`Import thành công ${payload.length} dòng!`);
                handleClose();
            } catch (error) {
                console.error(error);
                toast.error("Lỗi khi xử lý dữ liệu!");
            }
        };

        reader.readAsArrayBuffer(file);
        return false;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Quản Trị Hệ Thống Định Giá</h1>

                {/* Thanh công cụ (Toolbar) */}
                <div className="flex flex-wrap gap-4 mb-6 justify-between">
                    <div className="flex gap-2">
                        {/* <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                        >
                            + Thêm dữ liệu
                        </button> */}

                        <Space>
                            <Button
                                type="primary"
                                icon={<InboxOutlined />}
                                onClick={() => setIsModalOpen(true)}
                                style={{ backgroundColor: '#28a745' }}
                            >
                                Import Excel
                            </Button>
                        </Space>

                    </div>

                    <div className="text-gray-500 italic text-sm self-center">
                        * Lưu ý: Mọi thay đổi sẽ được cập nhật trực tiếp vào Database
                    </div>
                </div>

            </div>

            {/* Bước 1: Modal chọn loại xe */}
            <Modal
                title={category ? `Import dữ liệu ${category === 1 ? 'Ô tô' : 'Mô tô'}` : "Chọn loại phương tiện"}
                open={isModalOpen}
                onCancel={handleClose}
                footer={null} // Ẩn footer mặc định của Modal
                centered
                width={600}
            >
                {!category ? (
                    /* BƯỚC 1: Chọn loại xe */
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
                            Vui lòng chọn loại xe bạn muốn nhập từ file Excel
                        </Text>
                        <Space size="large">
                            <Button
                                size="large"
                                icon={<CarOutlined />}
                                onClick={() => setCategory(1)}
                                style={{ width: 150, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                            >
                                Xe Ô tô
                            </Button>
                            <Button
                                size="large"
                                icon={<RocketOutlined />}
                                onClick={() => setCategory(2)}
                                style={{ width: 150, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                            >
                                Xe Mô tô
                            </Button>
                        </Space>
                    </div>
                ) : (
                    /* BƯỚC 2: Hiện Dragger ngay trong Modal */
                    <div style={{ padding: '10px 0' }}>
                        <Button
                            type="link"
                            icon={<LeftOutlined />}
                            onClick={() => setCategory(null)}
                            style={{ marginBottom: 10, padding: 0 }}
                        >
                            Quay lại chọn loại xe
                        </Button>

                        <Dragger
                            beforeUpload={handleImportExcel}
                            maxCount={1}
                            accept=".xlsx, .xls"
                            style={{ padding: '20px', background: '#fafafa' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: '#1890ff' }} />
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào đây để tải lên</p>
                            <p className="ant-upload-hint">
                                Hỗ trợ định dạng .xls, .xlsx. Dữ liệu sẽ được gán vào danh mục
                                <strong style={{ color: '#1890ff' }}> {category === 1 ? 'Ô tô' : 'Mô tô'}</strong>
                            </p>
                        </Dragger>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminPage;