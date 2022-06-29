const router = require('express').Router();
const {
  allUsers,
  oneUser,
  newUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(allUsers).post(newUser);
// /api/users/:userId
router.route('/:userId').get(oneUser).put(updateUser).delete(deleteUser);
// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;