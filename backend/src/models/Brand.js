import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Brand = sequelize.define('Brand', {
    name: { type: DataTypes.STRING, allowNull: false },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
    }
}, {
    timestamps: false,
    tableName: 'brands'
});

export default Brand;