const express = require("express");
const thoughtController = require("../controllers/thoughtController");
const router = express.Router();

router.route("/").get(thoughtController.getAllThoughts);
router.route("/").post(thoughtController.createThought);

router.route("/:id").get(thoughtController.getThoughtById);
router.route("/:id").patch(thoughtController.updateThought);
router.route("/:id").delete(thoughtController.deleteThought);

router.route("/:id/reactions").post(thoughtController.addReaction);
router
  .route("/:id/reactions/:reactionId")
  .delete(thoughtController.removeReaction);

module.exports = router;
