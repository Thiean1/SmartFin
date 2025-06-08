const express = require("express");
const router = express.Router();
const TuVanAIController = require("../controllers/TuVanAIController");

router.get("/", TuVanAIController.getAll);
router.post("/", TuVanAIController.create);
router.put("/:id", TuVanAIController.update);
router.delete("/:id", TuVanAIController.delete);

module.exports = router;
