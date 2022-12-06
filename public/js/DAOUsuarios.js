"use strict"

class DAOUsuarios {
	constructor(pool){
		this._pool = pool;
	}

    agregarUsuario(usuario, callback){//El usuario es: username, password, email
        this._pool.getConnection(function(err, connection) {
			if (err) {
				callback("Error de conexión a la base de datos");
			}
			else {
                connection.query("SELECT * FROM ucm_aw_cau_usu_usuarios WHERE correo = ?;", [usuario.correo],
                function(err, rows) {
                    if(err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if (rows.length > 0) {
                            callback(new Error("Ya existe el usuario")); //no está el usuario en la base de datos
                        }
                        else{
                            if (usuario.tecnico){
                                connection.query("SELECT * FROM ucm_aw_cau_tec_tecnico WHERE num_empleado = ?;", [usuario.numEmpleado],
                                function(err, rows) {
                                    if(err) {
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else{
                                        if (rows.length > 0) {
                                            callback(new Error("Ya existe el numero de empleado")); //no está el usuario en la base de datos
                                        }
                                        else{
                                            connection.query("INSERT INTO ucm_aw_cau_usu_usuarios (correo, nombre, contraseña, fecha, perfil, tecnico, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",  [ usuario.correo, usuario.nombre, usuario.contraseña, new Date().toISOString().slice(0, 19).replace('T', ' '), usuario.perfil, usuario.tecnico, usuario.foto], 
                                            function(err, result) {
                                                if (err) {
                                                    callback("Ha ocurrido un error en la base de datos, por favor intentelo de nuevo más tarde");
                                                }
                                                else {
                                                    usuario.ID = result.insertId
                                                    connection.query("INSERT INTO ucm_aw_cau_tec_tecnico (idUsuario, num_empleado) VALUES (?,?);", [usuario.ID, usuario.numEmpleado],
                                                    function(err, rows) {
                                                        if(err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        }
                                                        else{
                                                            callback(null, usuario);
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                            else{
                                connection.query("INSERT INTO usuario (correo, nombre, contraseña, fecha, perfil, tecnico, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",  [ usuario.correo, usuario.nombre, usuario.contraseña, new Date().toISOString().slice(0, 19).replace('T', ' '), usuario.perfil, usuario.tecnico, usuario.foto], 
                                function(err, result) {
                                    if (err) {
                                        callback("Ha ocurrido un error en la base de datos, por favor intentelo de nuevo más tarde");
                                    }
                                    else {
                                        usuario.ID = result.insertId
                                        callback(null, usuario);
                                    }
                                });
                            }
                        }
                    }
                })
			}
            connection.release();
		});
    }

    leerUsuarioPorCorreo(correo, callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ucm_aw_cau_usu_usuarios WHERE correo = ?" , [correo] ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            let usuario;
                            if(rows.length > 0){
                                usuario = {
                                    ID: rows[0].idUsuario, 
                                    Correo: rows[0].correo,
                                    Nombre: rows[0].nombre,
                                    Contraseña: rows[0].contraseña,
                                    Fecha: rows[0].fecha,
                                    Perfil: rows[0].perfil,
                                    Tecnico: rows[0].tecnico,
                                    Foto: rows[0].foto
                                };
                            }
                            callback(null,usuario);
                        }
                    }
                );
            }
        });
    }
}
module.exports = DAOUsuarios;