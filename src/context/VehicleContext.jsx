import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from 'sonner';
export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVehicles = async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(
                "http://localhost:3001/api/vehicles",
                filters
            );
            setVehicles(res.data);
            if (res.data.length === 0) {
                toast.info("Không tìm thấy xe nào khớp với bộ lọc", {
                    description: "Vui lòng thử thay đổi năm hoặc hãng xe khác."
                });
            } else {
                toast.success(`Đã tìm thấy ${res.data.length} kết quả`);
            }
        } catch (error) {
            setError("Không thể tải dữ liệu");
            console.error("Lỗi khi tải dữ liệu", error);
            toast.error("Lỗi kết nối máy chủ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VehicleContext.Provider value={{ vehicles, setVehicles, loading, error, fetchVehicles }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicles = () => useContext(VehicleContext);
