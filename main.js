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
    daoU.obtenerImagen(request.session.user.ID, function(err,res){
        if (res){
            response.end(new Buffer.from(res))
        }
        else{
            response.sendFile(__dirname + "/public/img/avatar.jpg")
        }
    })
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
    check("password","Contraseña no válida").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/),
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
            console.log(request.file)
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
                response.redirect("/login")
            }
        })
    }
        
})

app.post("/mis_avisos", 
    // El campo correo ha de ser no vacío.
    

function(request, response){

    
        console.log(request.body)
   // const errors = validationResult(request);
    //console.log(errors);
 //   if(!errors.isEmpty()) {          
 //       response.render("crear_cuenta", {errMsg : "Por favor, completa todos los campos correctamente" , errores: errors.mapped(), camposC : campos});
 //   }
 //   else {
        let aviso = {
            idUsuario: request.session.user,
            texto: request.body.obs,
            perfil : 'pdi',
            tipo: request.body.tipo,
            categoria: request.body.categoria,
            subcategoria : request.body.subcategoria
        }
        daoA.crearAviso(aviso, function(err,res){
            if (err){
                console.log(err)
                response.render("mis_avisos",{})
            }
            else{
                response.render("mis_avisos",{})
            }
        })
//    }
        
})

function cb_leerAvisos(err, res){
    listaAvisos = []
    if(err){
        console.log(err.message);
    }
    else {
        for(let aviso of res){
            if(aviso.tecnico){
                aviso.tecnico = daoU.leerNombrePorId(aviso.tecnico)
            }
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