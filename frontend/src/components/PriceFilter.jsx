import { useEffect, useState } from "react"
import { useVehicles } from "../context/VehicleContext";
import api from "../axios/axios";

export default function PriceFilter() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        category_id: "",
        year: "",
        brand_id: "",
        name: "",
    });

    const { fetchVehicles, setVehicles } = useVehicles();

    // 1. Lấy danh sách loại xe khi khởi tạo
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) { console.error("Lỗi lấy categories", err); }
        };
        fetchCats();
    }, []);

    // 2. Lấy danh sách hãng xe dựa trên category_id đã chọn
    useEffect(() => {
        const fetchBrands = async () => {
            // Chỉ gọi API nếu đã chọn category_id
            if (filters.category_id) {
                try {
                    const res = await api.get(`/brands?category_id=${filters.category_id}`);
                    setBrands(res.data);
                } catch (err) { console.error("Lỗi lấy brands", err); }
            } else {
                setBrands([]);
            }
        };
        fetchBrands();
    }, [filters.category_id]); // Chạy lại mỗi khi category_id thay đổi

    // 3. Hàm xử lý thay đổi cho tất cả input/select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            // Reset brand_id nếu category_id thay đổi để tránh lệch dữ liệu
            ...(name === "category_id" ? { brand_id: "" } : {})
        }));
    }

    // 4. Hàm Reset (Làm mới)
    const handleReset = () => {
        const defaultFilters = { category_id: "", year: "", brand_id: "", name: "" };
        setFilters(defaultFilters);
        setVehicles([]);
    }

    return (
        <div className='rounded-lg'>
            <h2 className="text-center text-4xl font-semibold mb-2 text-blue-600">
                🔍 BẢNG ĐỊNH GIÁ XE
            </h2>
            <p className="flex items-center justify-center gap-2 text-md mb-6">
                <span>📅</span> Cập nhật: Ngày 14/01/2026

            </p>

            <div className='grid grid-cols-1 md:grid-cols-6 gap-3'>
                {/* Loại xe */}
                <select
                    name="category_id"
                    value={filters.category_id}
                    onChange={handleChange}
                    className='border rounded px-2 py-1'
                >
                    <option value="">Chọn loại xe</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Năm */}
                {/* Năm */}
                <select
                    name="year"
                    value={filters.year}
                    onChange={handleChange}
                    className='border rounded px-2 py-1'
                >
                    <option value="">Chọn năm</option>
                    {Array.from({ length: 2026 - 2010 + 1 }, (_, i) => 2026 - i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Hãng xe */}
                <select
                    name="brand_id"
                    value={filters.brand_id}
                    onChange={handleChange}
                    className='border rounded px-2 py-1'
                    disabled={!filters.category_id} // Khóa nếu chưa chọn loại xe
                >
                    <option value="">Chọn hãng xe</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>

                <input
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    type='text'
                    placeholder='Nhập tên xe'
                    className='border rounded px-2 py-1'
                />

                <button
                    onClick={() => fetchVehicles(filters)}
                    className='bg-blue-500 text-white rounded px-3 py-1 cursor-pointer hover:bg-blue-600 transition duration-200'
                >
                    Tìm
                </button>

                <button
                    onClick={handleReset}
                    className='bg-red-500 text-white rounded px-3 py-1 cursor-pointer hover:bg-red-600 transition duration-200'
                >
                    Làm mới
                </button>
            </div>
        </div>
    )
}