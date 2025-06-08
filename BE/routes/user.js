const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.put("/:id", UserController.update);
// Có thể thêm các route khác nếu cần

module.exports = router;
