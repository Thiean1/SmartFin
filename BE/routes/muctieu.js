const express = require("express");
const router = express.Router();
const MucTieuController = require("../controllers/MucTieuController");

router.get("/", MucTieuController.getAll);
router.post("/", MucTieuController.create);
router.put("/:id", MucTieuController.update);
router.delete("/:id", MucTieuController.delete);

module.exports = router;
