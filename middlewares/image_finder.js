var Imagen = require("./../models/imagen");

module.exports = function (req, res, next) {
    Imagen.finById(res.params.id, function (err, imagen) {
        if (imagen != null) {
            console.log("Se encontro la imagen ", imagen.title);
            res.locals.imagen = imagen;
            next();
        }
        else {
            res.redirect("/app");
        }
    });
};