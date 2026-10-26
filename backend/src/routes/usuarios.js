const router = require("express").Router();
const ctrl = require("../controllers/usuarioController");
const { proteger, restringir } = require("../middleware/auth");

router.get("/freelancers", ctrl.listarFreelancers);
router.get("/", proteger, restringir("admin"), ctrl.listar);
router.get("/:id", proteger, ctrl.buscarPorId);
router.patch("/:id", proteger, ctrl.atualizar);
router.delete("/:id", proteger, restringir("admin"), ctrl.deletar);

module.exports = router;
