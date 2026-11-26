const router = require("express").Router();
const ctrl = require("../controllers/pedidoController");
const { proteger, restringir } = require("../middleware/auth");

router.use(proteger);

router.get("/todos", restringir("admin"), ctrl.listarTodos);
router.get('/recebidos', restringir('freelancer'), ctrl.recebidos);
router.get("/", ctrl.meusPedidos);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);
router.patch("/:id/status", restringir("admin"), ctrl.atualizarStatus);
router.patch('/:id/concluir', restringir('cliente'), ctrl.concluir);

module.exports = router;
