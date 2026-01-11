import { useVehicles } from "../context/VehicleContext";

export default function PriceTable() {
    const { vehicles, loading, error } = useVehicles();
    const formatVND = (val) => val ? new Intl.NumberFormat('vi-VN').format(val) + " VND" : "---";
    if (loading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    return (
        <div className="mt-6 overflow-x-auto">
            <div className="rounded border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead >
                        <tr className="bg-blue-600 text-white ">
                            <th className="px-4 py-3 text-left font-semibold border-r border-blue-500">
                                Tên xe
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Dung tích
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                AT/MT
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Hãng xe
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Năm
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Mã cà vẹt
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Định giá loại A+
                            </th>
                            <th className="px-4 py-3 font-semibold border-r border-blue-500">
                                Định giá loại A
                            </th>
                            <th className="px-4 py-3 font-semibold">
                                Định giá loại B
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {vehicles.length > 0 && vehicles.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">
                                    {item.name}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-gray-200">
                                    {item.capacity}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-gray-200">
                                    {item.transmission}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-gray-200">
                                    {item.Brand?.name}
                                </td>
                                <td className="px-4 py-3 text-center border-r border-gray-200">
                                    {item.year}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold border-r border-gray-200">
                                    {item.reg_code}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold  border-r border-gray-200">
                                    {formatVND(item.price_a_plus)}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold border-r border-gray-200">
                                    {formatVND(item.price_a)}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold border-r border-gray-200">
                                    {formatVND(item.price_b)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


