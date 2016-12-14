/////////////////////////CONFIGS DE FRAMEWORK////////////////////////////////////
/////////////////////////CONFIGS DE FRAMEWORK////////////////////////////////////
/////////////////////////CONFIGS DE FRAMEWORK////////////////////////////////////
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var User = require("./models/user").User;
//var session = require("express-session");
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/sessions");

var methodOverride = require("method-override");

//Estavlesco la conexion a la base de datos
mongoose.connect("mongodb://localhost/fotos");
//Middle que me permite servir archivos estaticos (ej: css, js)
app.use("/public", express.static("public"));
//Middle que me permite parsear application/json  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Middleware que nos permite manejar verbos REST que no implementa el navegador
app.use(methodOverride("_method"));
//Middle que me permite manejar sesiones
app.use(cookieSession({
    name: "session",
    keys: ["llave-1", "llave-2"]
}));

//Motor de Vistas
app.set("view engine", "jade");

//Montamos el router de nuestra aplicacion
app.use("/app", session_middleware);
app.use("/app", router_app);
/////////////////////END CONFIGS DE FRAMEWORK////////////////////////////////////

/////////////////////////////RUTEO///////////////////////////////////////////////
app.get("/", function (req, res) {
    if (req.session) {
        console.log(req.session.user_id);
    }
    res.render("index");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/users", function (req, res) {
    console.log(req.body.email);
    console.log(req.body.password);
    //LA INTERACCION CON LA BASE DE DATOS LO HACEMOS DE FORMA ASINCRONICA!!!!!!!!!!
    var user = new User({
        email: req.body.email
        , password: req.body.password
        , username: req.body.username
        , password_confirmation: req.body.password_confirmation
        , age: req.body.age
        , sex: req.body.sex
    });
    console.log(req.body.password_confirmation);
    //SINTAXIS USANDO CALLBACKS
    //user.save(function (err, created_user, cant_filas_afectadas) {
    //    if (err) {
    //        console.log(String(err));
    //    }                                 
    //    res.send("Guardamos tus datos satisfactoriamente");
    //});

    //SINTAXIS USANDO PROMISES
    user.save().then(function (param1, param2) {
        res.send("Guardamos tus datos satisfactoriamente");
    }, function (err) {
        if (err) {
            console.log(String(err));
        }
    });

});


app.get("/signup", function (req, res) {
    res.render("signup");
    //User.find(function (err, doc) {
    //    res.render("signup");
    //    console.log(doc);
    //});
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/sessions", function (req, res) {
    //QUERY, FIELDS TO RETURN (separados por espacios)= all, CALLBACK
    //User.find(
    //User.findById(
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        console.log(user);
        if (user) {
            req.session.user_id = user._id;
            res.redirect("/app");
            //res.send("Se ha encontrado un usuario (Info logueada en consola)");
        }
        else {
            res.send("NO se ha encontrado un usuario");
        }
    });
});
///////////////////////////END RUTEO//////////////////////////////////

/////////////////////////SETEO DE PUERTO//////////////////////////////
app.listen(8080);
/////////////////////END SETEO DE PUERTO//////////////////////////////