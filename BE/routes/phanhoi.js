const express = require("express");
const router = express.Router();
const PhanHoiController = require("../controllers/PhanHoiController");

router.get("/", PhanHoiController.getAll);
router.post("/", PhanHoiController.create);
router.put("/:id", PhanHoiController.update);
router.delete("/:id", PhanHoiController.delete);

module.exports = router;
