var User = require("../models/user.js");
var jwt = require("jsonwebtoken");

module.exports = {
    index: function( req, res ) {
        User
            .find({})
            .exec( function(err, users) {
                if (err) return console.log(err)
                res.json( { success: true, message: "users found.", users: users } );
            })
    },
    show: function( req, res ) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function( err, user ) {
                if (err) return console.log(err)
                res.json( { success: true, message: "user found.", user: user } );
            })
    },
    create: function( req, res ) {
        var user = new User( req.body );
        user.online_status = true;
        user.password = user.generateHash(req.body.password);
        user.save( function( err, user ) {
            if (err) return console.log(err)
            var token = jwt.sign( user.toObject(), process.env.secret, {
                expiresIn: 1500
            })
            res.json( { sucess: true, message: "user created.", token: token, user: user } );
        })
    },
    login: function( req, res ) {
        User
            .findOne( { email: req.body.email } )
            .exec( function( err, user ) {
                if (err) return console.log(err)
                if (!user) return res.json( { sucess: false, message: "email address not found in db."  } )
                if ( user && !user.validPassword( req.body.password )) return res.json( { sucess: false, message: "password invalid." } )
                var token = jwt.sign( user.toObject(), process.env.secret, {
                    expiresIn: 1500
                }) 
                res.json( { sucess: true, message: "login successful.", user: user, token: token } );
            })
    },
    verify_token: function( req, res, next ) {
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (token) {
            jwt.verify( token, process.env.secret, function(err, decoded) {
                if (err) return res.json( { sucess: false, message: "failed to validate token." } )
                req.decoded = decoded;
                next();
            })
        } else {
            return res.status(403)
                      .json( { success: false, message: "token not provided in request." } )
        }
    },
    delete_user: function( req, res ) {
        User
            .findOneAndRemove( { _id: req.params.id }, function(err) {
                if (err) return console.log(err)
                res.json( { sucess: true, message: "user deleted." } );
            })
    },
    change_online_status: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function( err, user ) {
                if (err) return console.log(err)
                console.log(user, "before change")
                user.online_status = !user.online_status;
                user.save( function( err, user ) {
                    if (err) return console.log(err)
                    res.json( { success: true, message: "online status changed.", user: user } );
                })
            })
    }
}