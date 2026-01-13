import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./Category.js";
import Brand from "./Brand.js";

const Vehicle = sequelize.define('Vehicle', {
    name: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.STRING },
    transmission: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    reg_code: { type: DataTypes.STRING },
    price_a_plus: { type: DataTypes.DECIMAL(15, 2) },
    price_a: { type: DataTypes.DECIMAL(15, 2) },
    price_b: { type: DataTypes.DECIMAL(15, 2) },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'vehicles'
});

// Thiết lập mối quan hệ với cấu hình onDelete để tránh lỗi Errno 150
Category.hasMany(Vehicle, { foreignKey: 'category_id' });
Vehicle.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });

Brand.hasMany(Vehicle, { foreignKey: 'brand_id' });
Vehicle.belongsTo(Brand, { foreignKey: 'brand_id', onDelete: 'CASCADE' });

// Thêm quan hệ giữa Brand và Category (để lọc Hãng theo Loại xe)
Category.hasMany(Brand, { foreignKey: 'category_id' });
Brand.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });

export default Vehicle;