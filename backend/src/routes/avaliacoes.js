const router = require("express").Router();
const ctrl = require("../controllers/avaliacaoController");
const { proteger } = require("../middleware/auth");

router.get("/servico/:servicoId", ctrl.porServico);
router.post("/", proteger, ctrl.criar);

module.exports = router;
