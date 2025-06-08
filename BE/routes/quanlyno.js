const express = require("express");
const router = express.Router();
const QuanLyNoVaDauTuController = require("../controllers/QuanLyNoVaDauTuController");

router.get("/", QuanLyNoVaDauTuController.getAll);
router.post("/", QuanLyNoVaDauTuController.create);
router.put("/:id", QuanLyNoVaDauTuController.update);
router.delete("/:id", QuanLyNoVaDauTuController.delete);

module.exports = router;
