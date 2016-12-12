var User = require("./../models/user").User;

module.exports = function (req, res, next) {
    if (!req.session.user_id) {
        console.log("redirect");
        res.redirect("/login");
    }
    else {
        User.findById(req.session.user_id, function (err, user) {
            if (err) {
                res.redirect("/login");
            }
            else {
                console.log("NO redirect");
                res.locals = { user: user };
                next();
            }

        });


    }
};