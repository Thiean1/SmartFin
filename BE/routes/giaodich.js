const express = require("express");
const router = express.Router();
const GiaoDichController = require("../controllers/GiaoDichController");

router.get("/", GiaoDichController.getAll);
router.post("/", GiaoDichController.create);
router.put("/:id", GiaoDichController.update);
router.delete("/:id", GiaoDichController.delete);

module.exports = router;
