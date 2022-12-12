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
                                connection.query("SELECT * FROM ucm_aw_cau_tec_tecnico WHERE num_empleado = ? and correo = ?;", [usuario.numEmpleado, usuario.correo],
                                function(err, rows) {
                                    if(err) {
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else{
                                        if (rows.length === 0) {
                                            callback(new Error("El numero de empleado y/o correo no coinciden con los del registro.")); //no está el usuario en la base de datos
                                        }
                                        else{
                                            connection.query("INSERT INTO ucm_aw_cau_usu_usuarios (correo, nombre, contraseña, fecha, perfil, tecnico, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",  [ usuario.correo, usuario.nombre, usuario.contraseña, new Date().toISOString().slice(0, 19).replace('T', ' '), usuario.perfil, usuario.tecnico, usuario.foto], 
                                            function(err, result) {
                                                if (err) {
                                                    console.log(err)
                                                    callback("Ha ocurrido un error en la base de datos, por favor intentelo de nuevo más tarde");
                                                }
                                                else {
                                                    callback(null, usuario);
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                            else{
                                connection.query("INSERT INTO ucm_aw_cau_usu_usuarios (correo, nombre, contraseña, fecha, perfil, tecnico, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",  [ usuario.correo, usuario.nombre, usuario.contraseña, new Date().toISOString().slice(0, 19).replace('T', ' '), usuario.perfil, usuario.tecnico, usuario.foto], 
                                function(err, result) {
                                    if (err) {
                                        console.log(err)
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

    leerNombrePorId(idUsuario,callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT nombre FROM ucm_aw_cau_usu_usuarios WHERE idUsuario = ? and activo = true" , [idUsuario] ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            if(rows.length > 0){
                                callback(null,rows[0]);
                            }
                            else{
                                callback(new Error("No existe el usuario"))
                            }
                        }
                    }
                );
            }
        });
    }

    leerUsuarioPorCorreo(correo, password,callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ucm_aw_cau_usu_usuarios WHERE correo = ? and contraseña = ? and activo = true" , [correo,password] ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            if(rows.length > 0){
                                let usuario = {
                                    idUsuario: rows[0].idUsuario, 
                                    correo: rows[0].correo,
                                    nombre: rows[0].nombre,
                                    contraseña: rows[0].contraseña,
                                    fecha: rows[0].fecha,
                                    perfil: rows[0].perfil,
                                    tecnico: rows[0].tecnico,
                                };
                                callback(null,usuario);
                            }
                            else{
                                callback(new Error("Email y/o contraseña incorrectos"))
                            }
                        }
                    }
                );
            }
        });
    }

    obtenerImagen(idUsuario, callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT foto FROM ucm_aw_cau_usu_usuarios WHERE idUsuario = ?" , [idUsuario] ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            if(rows.length > 0){
                                callback(null,rows[0].foto);
                            }
                            else{
                                callback(new Error("No existe el usuario"))
                            }
                        }
                    }
                );
            }
        });
    }

    leerTecnicos(callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT idUsuario, nombre FROM ucm_aw_cau_usu_usuarios WHERE tecnico = true and activo = true" ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            if(rows.length > 0){
                               
                                callback(null,rows);
                            }
                            else{
                                callback(new Error("No existe ningún técnico"))
                            }
                        }
                    }
                );
            }
        });
    }

    leerUsuarios(callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ucm_aw_cau_usu_usuarios WHERE activo = true" ,//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            if(rows.length > 0){
                               
                                callback(null,rows);
                            }
                            else{
                                callback(new Error("No existe ningún usuario"))
                            }
                        }
                    }
                );
            }
        });
    }
    obtenerEstadisticasUsuario(idUsuario, callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT tipo, count(*) as cifra FROM ucm_cau.ucm_aw_cau_avi_avisos WHERE idUsuario = ? GROUP BY tipo;" , [idUsuario],//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            callback(null,rows);
                        }
                    }
                );
            }
        });
    }

    obtenerEstadisticasTecnico(idUsuario, callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT tipo, count(*) as cifra FROM ucm_cau.ucm_aw_cau_avi_avisos WHERE idTecnico = ? GROUP BY tipo;" , [idUsuario],//Aquí va la query a la BD
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            //Aquí se tratan los datos y llama al callback (Habría que devolver el ID generado por el insert)
                            callback(null,rows);
                        }
                    }
                );
            }
        });
    }
}

module.exports = DAOUsuarios;