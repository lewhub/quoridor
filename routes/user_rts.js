var express = require("express");
var user_router = express.Router();
var user_ctrl = require("../controllers/user_ctrl.js");



user_router.route("/")
    .get( user_ctrl.index )
    .post( user_ctrl.create )
user_router.get("/hosting", user_ctrl.host_index);
user_router.get("/:id", user_ctrl.show);
user_router.post("/login", user_ctrl.login);
user_router.post("/fb-call", user_ctrl.show_with_email);

user_router.use( "/:id", user_ctrl.verify_token );
user_router.patch( "/:id", user_ctrl.change_online_status );
user_router.post("/:id", user_ctrl.update_host);
user_router.delete("/:id", user_ctrl.delete_user);

module.exports = user_router;
