const { User, Thought } = require('../models');

module.exports = {
  // getting all thoughta //
  allThoughts(req, res) {
    // same as finding all users //
    Thought.find().select('-__v').then((thoughts) => { res.json(thoughts) })
      // catching error and sending a response with the status //
      .catch((err) => { return res.status(500).json(err) });
  },
  // getting one thought //
  oneThought(req, res) {
    // same as finding one user just using thought id iunstead //
    Thought.findOne({ _id: req.params.thoughtId }).select('-__v')
      .then(async (thought) => (!thought ? res.status(404).json({ message: "Thought doesn't exist" }) : res.json(thought)))
      .catch((err) => { return res.status(500).json(err) });
  },
  // making a new thogut //
  newThought(req, res) {
    // same as creating a user except after we create the thought we find the users username and add the thought to that users "thought" set //
    Thought.create(req.body).then((thought) => {
      // populating the thoughts of the user //
      return User.findOneAndUpdate({ username: req.body.username }, { $addToSet: { thoughts: thought._id } }, { new: true })
        .select('-__v').populate('thoughts')
    })
      // if no user with that username respond with a message else send a confirmation message //
      .then((user) => !user ? res.status(400).json({ message: "No user with that username" }) : res.json({ message: "Thought added by the user" }))
      .catch((err) => res.status(500).json(err));
  },
  // updating a thought //
  async updateThought(req, res) {
    // field in the body of username will make sure it only looks to update thoughts from that particular user as well as the thought ID
    const user = await User.findOne({ _id: req.params.thoughtId });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    // finding the thought of the specifc user based on its id then updating, setting to the new body //
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then((thought) => (!thought ? res.status(404).json({ message: "Thought doesn't exist" }) : res.json(thought)))
      .catch((err) => res.status(500).json(err));
  },
  // deleting a thhought //
  async deleteThought(req, res) {
    // finding a thought and deleting it //
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      // sending message if thought doesn't exist, otherwise searching for a user and updating their individual thoughts set //
      .then((thought) => !thought ? res.status(404).json({ message: "Thought doesn't exist" }) : User.findOneAndUpdate(
        { username: thought.username }, { $pull: { thoughts: req.params.thoughtId } },
        { new: true }))
      .then((user) => (!user ? res.status(404).json({ message: "User doesn't exist" }) : res.json({ message: "Thought Deleted" })))
      .catch((err) => res.status(500).json(err));
  },
  // new reaction //
  addReaction(req, res) {
    // finding the thought from it's id, then updating it by adding to its "reaction" set, adding the req.body aka whatever we react //
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { new: true })
      // populating the reactions set with the successful result //
      .select('-__v').populate('reactions').then((thought) => !thought ? res.status(404).json({ message: "Thought doesn't exist" }) : res.json({ message: "Reaction Added" }))
      .catch((err) => res.status(500).json(err));
  },
  removeReaction(req, res) {
    // same as above but using the $pull operator to remove the reaction from the set //
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: req.body } }, { new: true })
      // removing from the reactions set with the successful result //
      .select('-__v').populate('reactions').then((thought) => !thought ? res.status(404).json({ message: "Thought doesn't exist" }) : res.json({ message: "Reaction removed" }))
      .catch((err) => res.status(500).json(err));
  }

};