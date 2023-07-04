const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUserById);

router.route("/").post(userController.createUser);
router.route("/:id").patch(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

router.route("/:id/friends/:friendId").patch(userController.addFriend);
router.route("/:id/friends/:friendId").delete(userController.removeFriend);

module.exports = router;
