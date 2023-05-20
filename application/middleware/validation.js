var validator = require('validator');
var db = require("../conf/database");
module.exports = {
    usernameCheck: function (req, res, next) {
        var { username } = req.body;
        username = username.trim();
        if (!validator.isLength(username, { min: 3, max: 20 })) {
            req.flash("error", "username must be 3 or more character");
        }
        if (!/[a-zA-Z]/.test(username.charAt(0))) {
            req.flash("error", "username must begin with a character");
        }
        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }
    },

    passwordCheck: function (req, res, next) {
        var { password } = req.body;
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            returnScore: true,
        })) {
            req.flash("error", "password must include at least 1 uppercase, 1 number, at least 8 characters");
        };
        if (!validator.matches(password, /[\/*\-+!@#$^&~\[\]]/)) {
            req.flash("error", "password must include a special character in [\/*\-+!@#$^&~\[\]]");
        };
        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }
    },
    emailCheck: function (req, res, next) {
        var { email } = req.body;
        if (!validator.isEmail(email)) {
            req.flash("error", "email is not valid");
        }
        if (req.session.flash.error) {
            res.redirect('/register');
        } else {
            next();
        }
    },
    // tosCheck: function (req, res, next) { },
    // ageCheck: function (req, res, next) { },
    isUsernameUnique: async function (req, res, next) {
        var { username } = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users 
        where username = ?;`, [username]);
            if (rows && rows.length > 0) {
                req.flash("error", `username ${username} is already taken`);
                return req.session.save(function (err) {
                    return res.redirect('/register');
                });
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    },
    isEmailUnique: async function (req, res, next) {
        var { email } = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users 
        where email = ?;`, [email]);
            if (rows && rows.length > 0) {
                req.flash("error", `email ${email} is already taken`);
                return req.session.save(function (err) {
                    return res.redirect('/register');
                });
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    },
};