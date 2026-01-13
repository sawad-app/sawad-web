import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB, sequelize } from "./config/db.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: [
        "http://localhost:5173",                 // Cho phép bạn test ở máy cá nhân
        "https://sawad-fe.vercel.app" // Link Frontend thật trên Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());

// Kết nối DB và đồng bộ model
connectDB();
sequelize.sync({ alter: true }).then(() => {
    console.log("Database và table đã sẵn sàng");
})

app.use("/api", vehicleRoutes)

app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});
