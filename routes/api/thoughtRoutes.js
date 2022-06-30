const router = require('express').Router();

const {
  allThoughts,
  oneThought,
  newThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// /api/Thoughts
router.route("/").get(allThoughts).post(newThought);

// /api/Thoughts/:ThoughtId
router.route("/:thoughtId").get(oneThought).put(updateThought).delete(deleteThought);

// /api/Thoughts/:ThoughtId/reactions
router.route("/:thoughtId/reactions/").post(addReaction);

// /api/Thoughts/:ThoughtId/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;