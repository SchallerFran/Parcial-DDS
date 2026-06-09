import { sequelize } from "../models/index.js";

try {
    await sequelize.sync({ force: true });
    console.log("✓ Tablas creadas correctamente");
    process.exit(0);
} catch (err) {
    console.error("✗ Error al crear tablas:", err);
    process.exit(1);
}