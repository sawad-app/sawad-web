import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production", override: true });

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Quan trọng để kết nối với Aiven/Render
            }
        }
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối MySQL thành công");
    } catch (error) {
        console.error("Không thể kết nối MySQL", error);
    }
}