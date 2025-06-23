const express = require("express");
const router = express.Router();
const { register, login, getUserDetails } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth(["user", "admin"]), getUserDetails);


module.exports = router;
