"use strict";

const path = require("path");
const mysql = require("mysql");
const config = require("./config")
const express = require("express");
const DAOUsuarios = require("./public/js/DAOUsuarios")
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

const pool = mysql.createPool(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

const daoU = new DAOUsuarios(pool)

function middleLogueado(req, res, next){
	//if usuario loggueado, next
     console.log("ENTRO LOGGEADO")
	if(req.session.user){
		next()
	}
	else res.redirect("/login")
}

function middleNoLogueado(req, res, next){
	//if usuario loggueado, next
    console.log("ENTRO NO LOGGEADO")
	if(!req.session.user){
		next()
	}
	else res.redirect("/mis_avisos")
}


app.get("/", middleNoLogueado, (request, response) => {
    response.redirect("/login");
});
    
app.get("/mis_avisos", middleLogueado, function(request, response) {
    response.render("mis_avisos", {});
    console.log("EAVISO")
});

app.get("/historico_de_avisos", middleLogueado, function(request, response) {
    response.render("historico_de_avisos", {});
});

app.get("/login", middleNoLogueado,function(request, response) {
    response.render("login", {errMsg: null});
});

app.post("/login", function(request, response){
    daoU.leerUsuarioPorCorreo(request.body.correo, request.body.password,function(err,res){
        if (err){
            response.render("login", {errMsg : err.message})
        }
        else{
            request.session.user = res
            response.redirect("/mis_avisos")
        }
    })
})

app.get("/cerrarSesion", middleLogueado, function(req,res){
    req.session.user = null
    console.log("Has cerrado sesion")
    res.redirect("/login")
});


app.get("/crear_cuenta", middleNoLogueado, function(request, response) {
    response.render("crear_cuenta", {errMsg:null});
});

app.get("/obtener_imagen", middleLogueado, function(request, response){
    daoU.obtenerImagen(request.session.user.ID, function(err,res){
        if (res){
            response.end(new Buffer.from(res))
        }
        else{
            response.sendFile(__dirname + "/public/img/avatar.jpg")
        }
    })
})

app.post("/crear_cuenta", multerFactory.single("foto"),function(request, response){
    //VALIDACION
    
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
        console.log(request.file)
        usuario.foto = request.file.buffer
    }
    if (usuario.tecnico){
        usuario.numEmpleado = request.body.numEmpl
    }
    daoU.agregarUsuario(usuario, function(err,res){
        if (err){
            console.log(err)
            response.render("crear_cuenta",{errMsg:err.message})
        }
        else{
            response.redirect("/login")
        }
    })
})

function cb_leerAvisos(err, res){
    listaAvisos = []
    if(err){
        console.log(err.message);
    }
    else {
        for(let aviso of res){
            listaAvisos.push({idAviso:aviso.idAviso,texto:aviso.texto,fecha:aviso.fecha, tecnico:aviso.tecnico, perfil:aviso.perfil,tipo:aviso.tipo,categoria:aviso.categoria,comentario:aviso.comentario_tecnico})
        }
    }
}

app.listen(3000, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log("Servidor arrancado en el puerto 3000");        
    }
});