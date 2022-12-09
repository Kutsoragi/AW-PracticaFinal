"use strict"

class DAOUsuarios {
	constructor(pool){
		this._pool = pool;
	}

    crearAviso(aviso, callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("INSERT INTO ucm_aw_cau_avi_avisos (idUsuario,texto,fecha,perfil,categoria,tipo) VALUES (?,?,?,?,?,?)" , [aviso.idUsuario,aviso.texto,new Date().toISOString().slice(0, 19).replace('T', ' '),aviso.perfil,aviso.categoria,aviso.tipo] ,
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null,rows.insertID)
                        }
                    }
                );
            }
        })
    }

    leerAvisosPorUsuario(idUsuario,callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ucm_aw_cau_avi_avisos where idUsuario = ? and activo = true;" , [idUsuario] ,
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if(rows.length == 0){
                                callback(new Error("No hay avisos asociados al usuario"))
                            }
                            else{
                                callback(null,rows)
                            }
                            
                        }
                    }
                );
            }
        })
    }

    leerAvisosPorUsuarioCerrados(idUsuario,callback){
        this._pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ucm_aw_cau_avi_avisos where idUsuario = ? and activo = false;" , [idUsuario] ,
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if(rows.length == 0){
                                callback(new Error("No hay avisos asociados al usuario"))
                            }
                            else{
                                callback(null,rows)
                            }
                            
                        }
                    }
                );
            }
        })
    }
    

}

module.exports = DAOAvisos;