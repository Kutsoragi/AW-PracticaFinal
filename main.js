"use strict";

const path = require("path");
const mysql = require("mysql");
const config = require("./config")
const utils = require("./public/js/utils")
const express = require("express");
const { check, validationResult } = require("express-validator");

const DAOUsuarios = require("./public/js/DAOUsuarios")
const DAOAvisos = require("./public/js/DAOAvisos")
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = require("express-mysql-session");
const mysqlStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password:"",
    database: "ucm_cau"
})

const valorPerfil = (param) => {
    const perfiles = ["alumno", "pas", "pdi", "aa"];
    return perfiles.includes(param);

};

let camposVacios = {
    correo:'',
        nombre:'',
        password:'',
        password2:'',
        perfil: 'none',
        tecnico : '',
        foto : undefined,
        numEmpl : ''
}

const pool = mysql.createPool(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

const daoU = new DAOUsuarios(pool)
const daoA = new DAOAvisos(pool)

function middleLogueado(req, res, next){
	//if usuario loggueado, next
	if(req.session.user){
		next()
	}
	else res.redirect("/login")
}

function middleNoLogueado(req, res, next){
	//if usuario loggueado, next
	if(!req.session.user){
		next()
	}
	else res.redirect("/mis_avisos")
}

function middleTecnico(req,res,next){
    if (req.session.user.tecnico){
        next()
    }
    else{
        res.redirect("back");
    }
}



app.get("/mis_avisos", middleLogueado, function(request, response) {
    console.log(request.session.user);
    let listaAvisos = []
    if(request.session.user.tecnico){
        daoA.leerAvisosPorTecnico(request.session.user.idUsuario,function(err,res){
            if(err){
                console.log(err)
            }
            else{
                
                for(let aviso of res){
                    daoU.leerNombrePorId(aviso.idUsuario,function (err, res2){   
                        if(err){
                            console.log(err);
                        }
                        else {
                            aviso.nombreUsuario = res2.nombre;
                        }
                    });

                    if(aviso.idTecnico){
                        daoU.leerNombrePorId(aviso.idTecnico,function (err, res2){   
                            if(err){
                                console.log(err);
                            }
                            else {
                                aviso.ntecnico = res2.nombre;
                            }
                        });
                        
                    }
                    setTimeout(function(){
                        listaAvisos.push({idAviso:aviso.idAviso,texto:aviso.texto,fecha:aviso.fecha,nombreUsu:aviso.nombreUsuario, tecnico:aviso.ntecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria, subcategoria:aviso.subcategoria,comentario:aviso.comentario_tecnico})
                    }, 50);
                }
                setTimeout(function(){
                    listaAvisos = listaAvisos.sort(function(a,b){
                        return new Date(b.fecha) - new Date(a.fecha);
                    });
                    
                    response.status(200).render("mis_avisos", {sesion: request.session.user, myUtils: utils, msgPantalla: null, avisos:listaAvisos});
                }, 50);
            }
        })
    }
    else{
        daoA.leerAvisosPorUsuario(request.session.user.idUsuario, function(err,res){
            if(err){
                response.status(200).render("mis_avisos", {sesion: request.session.user, myUtils: utils, msgPantalla: null, avisos: listaAvisos});
            }
            else{
                let listaAvisos = []
                for(let aviso of res){
                    daoU.leerNombrePorId(aviso.idUsuario,function (err, res){   
                        if(err){
                            console.log(err);
                        }
                        else {
                            aviso.nombreUsuario = res.nombre;
                        }
                    });
                    
                    if(aviso.idTecnico){
                        daoU.leerNombrePorId(aviso.idTecnico,function (err, res){   
                            if(err){
                                console.log(err);
                            }
                            else {
                                aviso.ntecnico = res.nombre;
                            }
                        });
                        
                    }
                    setTimeout(function(){
                        listaAvisos.push({idAviso:aviso.idAviso,texto:aviso.texto,fecha:aviso.fecha,nombreUsu:aviso.nombreUsuario, tecnico:aviso.ntecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria, subcategoria:aviso.subcategoria,comentario:aviso.comentario_tecnico})
                    }, 50);  
                }
                setTimeout(function(){
                    listaAvisos = listaAvisos.sort(function(a,b){
                        return new Date(b.fecha) - new Date(a.fecha);
                    });
                    response.status(200).render("mis_avisos", {sesion: request.session.user, myUtils: utils, msgPantalla: null, avisos:listaAvisos});
                }, 50);
            }
        })
    }    
});

app.get("/historico_de_avisos", middleLogueado, function(request, response) {
    let listaAvisos = []
    if(request.session.user.tecnico){
        daoA.leerAvisosPorTecnicoCerrados(request.session.user.idUsuario,function(err,res){
            if(err){
                console.log(err)
            }
            else{
                
                for(let aviso of res){
                    daoU.leerNombrePorId(aviso.idUsuario,function (err, res2){   
                        if(err){
                            console.log(err);
                        }
                        else {
                            aviso.nombreUsuario = res2.nombre;
                        }
                    });

                    if(aviso.idTecnico){
                        daoU.leerNombrePorId(aviso.idTecnico,function (err, res2){   
                            if(err){
                                console.log(err);
                            }
                            else {
                                aviso.ntecnico = res2.nombre;
                            }
                        });
                        
                    }
                    setTimeout(function(){
                        listaAvisos.push({idAviso:aviso.idAviso,texto:aviso.texto,fecha:aviso.fecha,nombreUsu:aviso.nombreUsuario, tecnico:aviso.ntecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria, subcategoria:aviso.subcategoria,comentario:aviso.comentario_tecnico})
                    }, 50);
                }
                setTimeout(function(){
                    listaAvisos = listaAvisos.sort(function(a,b){
                        return new Date(b.fecha) - new Date(a.fecha);
                    });
                    response.status(200).render("historico_de_avisos", {sesion: request.session.user, myUtils: utils, msgPantalla: null, avisos:listaAvisos});
                }, 50);
            }
        })
    }
    else{
        daoA.leerAvisosPorUsuarioCerrados(request.session.user.idUsuario, function(err,res){
            if(err){
                console.log(err)
            }
            else{
                let listaAvisos = []
                for(let aviso of res){
                    daoU.leerNombrePorId(aviso.idUsuario,function (err, res){   
                        if(err){
                            console.log(err);
                        }
                        else {
                            aviso.nombreUsuario = res.nombre;
                        }
                    });
                    
                    if(aviso.idTecnico){
                        daoU.leerNombrePorId(aviso.idTecnico,function (err, res){   
                            if(err){
                                console.log(err);
                            }
                            else {
                                aviso.ntecnico = res.nombre;
                            }
                        });
                        
                    }
                    setTimeout(function(){
                        listaAvisos.push({idAviso:aviso.idAviso,texto:aviso.texto,fecha:aviso.fecha,nombreUsu:aviso.nombreUsuario, tecnico:aviso.ntecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria, subcategoria:aviso.subcategoria,comentario:aviso.comentario_tecnico})
                    }, 50);  
                }
                setTimeout(function(){
                    listaAvisos = listaAvisos.sort(function(a,b){
                        return new Date(b.fecha) - new Date(a.fecha);
                    });
                    response.status(200).render("historico_de_avisos", {sesion: request.session.user, myUtils: utils, msgPantalla: null, avisos:listaAvisos});
                }, 50);
            }
        })
    }
});

app.get("/avisos_entrantes", middleLogueado, middleTecnico, function(request, response) {
    daoA.leerAvisosActivos(function (err, res){
        let listaAvisos = [];
        
        if(err){
            console.log(err.message);
            response.render("avisos_entrantes", {sesion: request.session.user, msgPantalla: err.message, avisos: null, myUtils: utils, tecnicos: null});
            
        }
        else {
            for(let aviso of res){
                daoU.leerNombrePorId(aviso.idUsuario,function (err, res2){   
                    if(err){
                       console.log(err);
                    }
                    else {
                        aviso.nombreUsuario = res2.nombre;
                    }
                });
                setTimeout(function(){
                    listaAvisos.push({idAviso:aviso.idAviso,idUsuario:aviso.idUsuario,nombreUsu:aviso.nombreUsuario,texto:aviso.texto,fecha:aviso.fecha, idTecnico:aviso.idTecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria,subcategoria:aviso.subcategoria,comentario:aviso.comentario_tecnico,activo:aviso.activo})
                }, 50);
                
            }
            
           
            daoU.leerTecnicos(function (err, res){
                let listaTecnicos = [];
                if(err){
                    console.log(err.message);
                    response.render("avisos_entrantes", {sesion: request.session.user, msgPantalla: err.message, avisos: null, myUtils: utils, tecnicos: null});
                }
                else {
                    for(let tecnico of res){
                        listaTecnicos.push({idUsuario:tecnico.idUsuario, nombre: tecnico.nombre})
                    }
                    setTimeout(function(){
                    listaAvisos = listaAvisos.sort(function(a,b){
                        return new Date(b.fecha) - new Date(a.fecha);
                    });
                    response.render("avisos_entrantes", {sesion: request.session.user, msgPantalla: null, avisos: listaAvisos, myUtils: utils, tecnicos: listaTecnicos});
                    }, 50);
                }
            });
            
        }
    });
    
    
});

app.get("/gestion_de_usuarios", middleLogueado, middleTecnico, function(request, response) {
    response.render("gestion_de_usuarios",{sesion: request.session.user, myUtils: utils, avisos: null});
});

app.get("/login", middleNoLogueado,function(request, response) {
    response.render("login", {errMsg: null, errores : null, campoEmail : null});
});

app.post("/login", 
    // El campo correo ha de ser no vacío.
    check("correo", "Por favor, introduce un correo electrónico").notEmpty(),
    // El campo correo ha de ser una dirección de correo válida.
    check("correo","Por favor, introduce un correo electrónico").isEmail(),
    // El campo nombre ha de ser no vacío.
    check("password", "Por favor, introduce una contraseña").notEmpty(),

function(request, response){

    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        response.render("login", {errMsg : null, errores: errors.mapped(), campoEmail : request.body.correo });
    }
    else {
        daoU.leerUsuarioPorCorreo(request.body.correo, request.body.password,function(err,res){
            if (err){
                response.render("login", {errMsg : err.message, errores : null, campoEmail : request.body.correo })
            }
            else{
                request.session.user = res
                response.redirect("/mis_avisos")
            }
        })

    }

    
})

app.get("/cerrarSesion", middleLogueado, function(req,res){
    req.session.user = null
    console.log("Has cerrado sesion")
    res.redirect("/login")
});


app.get("/crear_cuenta", middleNoLogueado, function(request, response) {
    response.render("crear_cuenta", {errMsg : null, errores : null, camposC : camposVacios});
});

app.get("/obtener_imagen", middleLogueado, function(request, response){
    daoU.obtenerImagen(request.session.user.idUsuario, function(err,res){
        if (res){
            response.end(new Buffer.from(res))
        }
        else{
            response.sendFile(__dirname + "/public/img/avatar.jpg")
        }
    })
})

app.get("/obtener_aviso/:idAviso", function(request, response){
    let id = request.params.idAviso;
    daoA.leerAvisoPorId(id, function(err,res){
        if (err){
            console.log(err.message);
        }
        else {
            daoU.leerNombrePorId(res.idUsuario,function (err, res2){
                if(err){
                    console.log(err.message)
                }
                else{
                    res.nombre = res2.nombre;
                    res.tipo = utils.parseTipo(res.tipo);
                    res.fecha = utils.parseFecha(res.fecha);
                    res.categoria = utils.parseCategorias(res.categoria);
                    res.subcategoria = utils.parseCategorias(res.subcategoria);
                    res.perfil = utils.parsePerfil(res.perfil);
                    res.sesionTecnico = request.session.user.tecnico;
                    setTimeout(function(){ response.send(res);}, 50);
                }
            })
                 
        }
    })
})

app.get("/obtener_contador_avisos/:idUsuario&:tecnico", function(request, response){
    let id = request.params.idUsuario;
    let tecnico = request.params.tecnico;
    
    if(tecnico == '1'){
        daoU.obtenerEstadisticasTecnico(id, function(err,res){
            if (err){
                console.log(err.message);
            }
            else {                
                response.send(res);
            }
        })
    }
    else{
        daoU.obtenerEstadisticasUsuario(id, function(err,res){
            if (err){
                console.log(err.message);
            }
            else {                
                
                response.send(res);
            }
        })
    }
    
})

app.post("/crear_cuenta", multerFactory.single("foto"),
    // El campo correo ha de ser no vacío.
    check("correo", "Por favor, introduce un correo electrónico").notEmpty(),
    // El campo correo ha de ser una dirección de correo válida.
    check("correo","Por favor, introduce un correo electrónico").isEmail(),
    // El campo nombre ha de ser no vacío.
    check("nombre", "Por favor, introduce un nombre").notEmpty(),
    // El campo password ha de ser no vacío.
    check("password", "Por favor, introduce la contraseña").notEmpty(),
    // El campo pass ha de tener entre 6 y 10 caracteres.
    check("password","Contraseña no válida").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-¿=])[A-Za-z\d@$!%*?&.-¿=]{8,16}$/),
    // El campo password2 ha de ser no vacío.
    check("password2", "Por favor, confirma la contraseña").notEmpty(),
    // El campo password2  tiene que coincidir.
    check("password2", "Las contraseñas deben coincidir").custom((value, {req}) => (value === req.body.password)),
    // El campo perfil hay que seleccionarlo.
    check("perfil", "Por favor, selecciona un perfil universitario").custom(valorPerfil),
    // El campo foto tiene que ser una foto.
    check("foto", "Sólo se admiten archivos .jpeg o .png").custom((value, {req}) => {
        if(req.file === undefined) return true
        else {
            switch(req.file.mimetype){
                case "image/jpeg" : return ".jpeg"
                case "image/png" : return ".png"
                default : return false;
            }
        }
    }),
    check("foto", "La imagen debe ocupar menos de 10MB").custom((value, {req}) => {
        if(req.file === undefined) return true
        else {
            if(req.file.size < 10485760) return true;
            else return false;
        }
    }),
    // El campo empleado debe tener 4 dígitos y 3 letras
    //check("numEmpl", "El formato de nº de empleado no es válido").matches(/^[0-9]{4}-[a-z]{3}$/),
    

function(request, response){

    

    let campos = {
    
        correo:request.body.correo,
        nombre:request.body.nombre,
        password: request.body.password,
        password2: request.body.password2,
        perfil: request.body.perfil,
        tecnico : request.body.tecnico,
        foto : request.body.file,
        numEmpl : request.body.numEmpl

    }
        
    const errors = validationResult(request);
    //console.log(errors);
    if(!errors.isEmpty()) {          
        response.render("crear_cuenta", {errMsg : "Por favor, completa todos los campos correctamente" , errores: errors.mapped(), camposC : campos});
    }
    else {
        let usuario = {
            correo:request.body.correo,
            nombre:request.body.nombre,
            contraseña: request.body.password,
            perfil: request.body.perfil,
            tecnico: request.body.tecnico === "si" ? true : false,
            foto: null,
            numEmpleado: null
        }
        if (request.file){
            usuario.foto = request.file.buffer
        }
        if (usuario.tecnico){
            usuario.numEmpleado = request.body.numEmpl
        }
        daoU.agregarUsuario(usuario, function(err,res){
            if (err){
                console.log(err)
                response.render("crear_cuenta",{errMsg : err.message, errores : null, camposC : campos})
            }
            else{
                daoU.leerUsuarioPorCorreo(usuario.correo, usuario.contraseña,function(err,res){
                    if (err){
                        response.render("login", {errMsg : err.message, errores : null, campoEmail : request.body.correo })
                    }
                    else{
                        request.session.user = res
                        response.redirect("/mis_avisos")
                    }
                })
            }
        })
    }
        
})

app.post("/mis_avisos", function(request, response){
    
   // const errors = validationResult(request);
    //console.log(errors);
 //   if(!errors.isEmpty()) {          
 //       response.render("crear_cuenta", {errMsg : "Por favor, completa todos los campos correctamente" , errores: errors.mapped(), camposC : campos});
 //   }
 //   else {
        let aviso = {
            idUsuario: request.session.user.idUsuario,
            texto: request.body.observacion,
            perfil : request.session.user.perfil,
            tipo: request.body.tipo,
            categoria: request.body.categoria,
            subcategoria : request.body.subcategoria
        }
        if(aviso.tipo == "felicitacion"){
            aviso.subcategoria = '';
        }

       
        daoA.crearAviso(aviso, function(err,res){
            if (err){
                
                console.log(request.session.user);
                response.redirect("/mis_avisos")
            }
            else{
                response.redirect("/mis_avisos")
            }
        })
//    }
        
})

app.post("/asignarTecnico", function(request, response){
    daoA.asignarTecnico(request.body.asigTec,request.body.idAviso, function(err,res){
        if (err){
            console.log(err.message);
            response.redirect("/avisos_entrantes")
        }
        else{
            response.redirect("/avisos_entrantes")
        }
    })

})

app.post("/terminarAviso", function(request, response){
    daoA.terminarAviso(request.body.idAviso,request.body.comentario, function(err,res){
        if (err){
            console.log(err.message);
            response.redirect("/mis_avisos")
        }
        else{
            response.redirect("/mis_avisos")
        }
    })

})
app.post("/eliminarAviso", function(request, response){
    let comentario = "Este aviso ha sido eliminado por el técnico " + request.session.user.nombre + " debido a:\n\n" + '"' + request.body.comentario + '"';
    daoA.eliminarAviso(request.body.idAviso,comentario, function(err,res){
        if (err){
            console.log(err.message);
            response.redirect("back")
        }
        else{
            response.redirect("back")
        }
    })
})

app.get("/", middleNoLogueado, (request, response) => {
    response.redirect("/login");
});

app.get("*", function(request,response){
    response.status(404).send("Error 404 - Not found")
})

app.listen(3000, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log("Servidor arrancado en el puerto 3000");        
    }
});