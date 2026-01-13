import Vehicle from "../models/Vehicle.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";

export const getVehicels = async (req, res) => {
    try {
        const { category_id, brand_id, year, name } = req.body;
        let whereClause = {};
        if (category_id) whereClause.category_id = Number(category_id);
        if (brand_id) whereClause.brand_id = Number(brand_id);
        if (year) whereClause.year = Number(year);
        if (name) whereClause.name = { [Op.like]: `%${name}%` };

        const vehicles = await Vehicle.findAll({
            where: whereClause,
            include: [
                { model: Brand, attributes: ['name'] },
                { model: Category, attributes: ['name'] }
            ]
        });
        res.status(200).json(vehicles);
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Lỗi khi lấy dữ liệu Vehicels" })
    }
};

export const getBrands = async (req, res) => {
    try {
        const { category_id } = req.query;
        let whereClause = {};

        if (category_id) {
            whereClause.category_id = category_id;
        }

        const brands = await Brand.findAll({
            where: whereClause,
            order: [['name', 'ASC']]
        });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const brands = await Category.findAll({ order: [['name', 'ASC']] });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};