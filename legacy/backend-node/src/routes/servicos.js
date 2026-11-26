const router = require("express").Router();
const ctrl = require("../controllers/servicoController");
const { proteger, restringir } = require("../middleware/auth");

router.get("/", ctrl.listar);
router.get("/meus", proteger, ctrl.meusServicos);
router.get("/:id", ctrl.buscarPorId);
router.post("/", proteger, restringir("freelancer", "admin"), ctrl.criar);
router.patch("/:id", proteger, restringir("freelancer", "admin"), ctrl.atualizar);
router.delete("/:id", proteger, restringir("freelancer", "admin"), ctrl.deletar);

module.exports = router;
