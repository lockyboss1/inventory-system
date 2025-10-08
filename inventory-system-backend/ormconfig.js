"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("./src/entities/supplier.entity");
const warehouse_entity_1 = require("./src/entities/warehouse.entity");
const product_entity_1 = require("./src/entities/product.entity");
const purchase_order_entity_1 = require("./src/entities/purchase-order.entity");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_DB || 'inventory_db',
    synchronize: true,
    logging: false,
    entities: [supplier_entity_1.Supplier, warehouse_entity_1.Warehouse, product_entity_1.Product, purchase_order_entity_1.PurchaseOrder],
});
//# sourceMappingURL=ormconfig.js.map