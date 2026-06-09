import {sequelize} from "./db/db.js";
import { Usuario } from "./model/usuario.model.js";
import { Postulante } from "./model/postulante.model.js";
import { HistorialEntrevista } from "./model/historialEntrevista.model.js";
import { Entrevista } from "./model/entrevista.model.js";

const main = async () => {
    await sequelize.sync();
    console.log('Conexion establecida');

    // Consulta todos los usuarios de la db (Select * from Usuario)
    const usuarios = await Usuario.findAll();

    // Busca un usuario por su id (Select * from Usuario where id = 2) y lo modifica y lo guarda (Update Usuario set apellido = 'Gomez' where id = 2)
    const usuarioAModificar = await Usuario.findByPk(2);
    if (usuarioAModificar) {
        usuarioAModificar.apellido = 'Gomez';
        await usuarioAModificar.save();
    }
    
    // Elimina un usuario por su id (Delete from Usuario where id = 1)
    const usuarioAEliminar = await Usuario.findByPk(1);
    if (usuarioAEliminar) {
        await usuarioAEliminar.destroy();
    }
} 

main();