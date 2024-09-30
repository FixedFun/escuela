"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const router = (0, express_1.Router)();
router.route("/")
    .get(post_controller_1.obtenerMuchos)
    .post(post_controller_1.crearUno);
router.route("/:pruebaId")
    .get(post_controller_1.obtenerUno)
    .delete(post_controller_1.borrarUno)
    .put(post_controller_1.actualizarUno);
exports.default = router;
