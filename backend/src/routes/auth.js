const router = require("express").Router();

const {
  registro,
  login,
  verificarMFA,
  me,
} = require("../controllers/authController");

const { proteger } = require("../middleware/auth");

router.post("/registro", registro);

router.post("/login", login);

router.post("/verificar-mfa", verificarMFA);

router.get("/me", proteger, me);

module.exports = router;