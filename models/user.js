var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var posibles_valores = ["M", "F"];

var email_match = [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    , "Ingresa un email valido"]
//String Number Date Buffer Boolean Mixed Objectid Array
var user_schema = new Schema(
    {
        name: String,
        username: { type: String, required: true, maxlength: [50, "El username no puede tener mas de 50 caracteres."] },
        password: {
            type: String
            , minlength: [7, "El password es muy corto"]
            , validate: {
                validator: function (p) {
                    return this.password_confirmation == p;
                },
                message: "Las contraseñas no coinciden"
            }
        },
        age: {
            type: Number
            , min: [0, "La edad no puede ser menor a cero"]
            , max: [150, "La edad no puede ser mayor a 150"]
        },
        email: { type: String, required: "El correo es obligatorio.", match: email_match },
        date_of_birth: Date,
        sex: { type: String, enum: { values: posibles_valores, message: "Opcion no Valida" } }
    });

user_schema.virtual("password_confirmation").get(function () {
    return this.p_c;
}).set(function (value) {
    this.p_c = value;
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;