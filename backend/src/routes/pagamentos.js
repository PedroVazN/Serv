const router = require("express").Router();
const ctrl = require("../controllers/pagamentoController");
const { proteger, restringir } = require("../middleware/auth");

router.use(proteger);

router.post("/", ctrl.criar);
router.get("/pedido/:pedidoId", ctrl.porPedido);
router.patch("/:id/status", restringir("admin"), ctrl.atualizarStatus);

module.exports = router;
