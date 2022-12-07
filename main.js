"use strict";

const path = require("path");
const mysql = require("mysql");
const config = require("./config")
const express = require("express");
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });
const bodyParser = require("body-parser");

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
    response.render("login", {});
});

app.post("/login", function(request, response){
    request.session.user = {
        nombre: request.body.nombre,
        correo: request.body.correo,
        perfil: request.body.perfil,
        tecnico: request.body.tecnico
    };
    response.redirect("/mis_avisos")
})

app.get("/cerrarSesion", function(req,res){
    req.session.user = null
    console.log("Has cerrado sesion")
    res.redirect("/login")
});


app.get("/crear_cuenta", middleNoLogueado, function(request, response) {
    response.render("crear_cuenta", {});
});

app.post("crearCuenta", multerFactory.none(),function(request, response){
    
})

app.listen(3000, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log("Servidor arrancado en el puerto 3000");        
    }
});