import xlsx from "xlsx";
import mysql from "mysql2/promise";
import "dotenv/config";

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function main() {
    try {
        console.log(" Bắt đầu quá trình import...");

        // 1. Tạo sẵn Category (Loại xe) trước để lấy ID chuẩn
        await db.execute("INSERT IGNORE INTO categories (name) VALUES (?), (?)", ["Ô tô", "Xe máy"]);
        const [categories] = await db.execute("SELECT id, name FROM categories");
        const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

        // 2. Hàm xử lý logic cho từng file
        const processImport = async (filePath, typeName) => {
            const categoryId = catMap[typeName];
            console.log(`--- Đang xử lý: ${typeName} (ID: ${categoryId}) ---`);

            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            const rows = data.slice(2);

            // LẤY DANH SÁCH HÃNG XE DUY NHẤT CỦA FILE NÀY
            const uniqueBrands = [...new Set(rows.map(row => row[3]).filter(b => b))];

            // CHÈN VÀO BẢNG BRANDS KÈM THEO CATEGORY_ID
            // Sử dụng ON DUPLICATE KEY UPDATE để tránh lỗi nếu bảng brands đã có cột unique
            for (const brandName of uniqueBrands) {
                await db.execute(
                    "INSERT IGNORE INTO brands (name, category_id) VALUES (?, ?)",
                    [brandName.trim(), categoryId]
                );
            }

            // Lấy lại Map của Brands tương ứng với Category hiện tại để lấy ID chính xác
            const [brandList] = await db.execute(
                "SELECT id, name FROM brands WHERE category_id = ?",
                [categoryId]
            );
            const brandMap = Object.fromEntries(brandList.map(b => [b.name, b.id]));

            const formatPrice = (val) => {
                if (val === undefined || val === null || val === "") return null;
                let num = parseFloat(val);
                if (isNaN(num)) return null;

                // Làm tròn đến 1 chữ số thập phân trước khi nhân 1 triệu (Sửa lỗi 13.65 -> 13.7)
                let roundedNum = Math.round(num * 10) / 10;
                return roundedNum < 1000 ? roundedNum * 1000000 : roundedNum;
            };

            for (const row of rows) {
                const name = row[0]; // Cột A: Tên Xe
                const brandName = row[3]; // Cột D: Hãng Xe

                if (!name || !brandName) continue;

                await db.execute(
                    `INSERT INTO vehicles 
    (category_id, brand_id, name, capacity, transmission, year, reg_code, price_a_plus, price_a, price_b, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, // Thêm 2 cột và 2 hàm NOW()
                    [
                        categoryId,
                        brandMap[brandName.trim()],
                        name,
                        row[1] ?? null,
                        row[2] ?? null,
                        row[4] ?? null,
                        row[8] ?? null,
                        formatPrice(row[5]),
                        formatPrice(row[6]),
                        formatPrice(row[7])
                    ]
                );
            }
            console.log(` Đã import xong file: ${filePath}`);
        };

        // 3. Chạy import lần lượt 2 file
        await processImport("data/datamoto.xlsx", "Xe máy");
        await processImport("data/dataoto.xlsx", "Ô tô");

        console.log(" Tất cả dữ liệu đã được import hoàn tất!");
    } catch (error) {
        console.error(" Lỗi trong quá trình import:", error.message);
    } finally {
        await db.end();
        process.exit();
    }
}

main();