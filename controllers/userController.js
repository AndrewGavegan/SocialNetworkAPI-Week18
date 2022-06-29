// const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models')

module.exports = {
  // getting al the users//
  allUsers(req, res) {
    // finding all users and also getting the thoughts of each user //
    User.find().select('-__v').populate('thoughts')
      // responding in json format //
      .then((users) => res.json(users))
      // giving the error a status of 500 and responding in json //
      .catch((err) => res.status(500).json(err));
  },
  // getting one user //
  oneUser(req, res) {
    // finding one user with their specific id, populating their thoughts //
    User.findOne({ _id: req.params.userId }).select('-__v').populate('thoughts')
      // if the id doesnt match any user, responds with no user before responding with a proper result //
      .then((user) => (!user ? res.status(404).json({ message: "User doesn't exist" }) : res.json(user)))
      // giving the error a status of 500 and responding in json //
      .catch((err) => res.status(500).json(err));
  },
  // creating a new user //
  newUser(req, res) {
    // creating a user from the body of the req, then responding with that user in json format//
    User.create(req.body).then((user) => res.json(user))
      // giving the error a status of 500 and responding in json //
      .catch((err) => { return res.status(500).json(err) });
  },
  //deleting an existing user //
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      // finding one user with a specific id, if that id doesnt exist then respond with message, if user does exist, findoneandDelete will be ran, aswell as the associated thoughts of that user being deleted seen below with deleteMany thoughts. //
      // this is done using the  $in operator which will return data with certain criteria, in this case user.thoughts relating to the user we just found and deleted//
      .then((user) => (!user ? res.status(404).json({ message: "User doesn't exist" }) : Thought.deleteMany({ _id: { $in: user.thoughts } })))
      // a basic confirmation message in json //
      .then(() => res.json({ message: "User and their thoughts are now deleted" }))
      // giving the error a status of 500 and responding in json //
      .catch((err) => res.status(500).json(err));
  },
  // updating an existing user //
  updateUser(req, res) {
    // finding user with specific id, setting the users info as the body, making sure to pass the new data back into json not the old data with new: true //
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
      // sending a json response with the new data and checking if the user exists //
      .then((user) => (!user ? res.status(404).json({ message: "User doesn't exist" }) : res.json(user)))
      // giving the error a status of 500 and responding in json //
      .catch((err) => res.status(500).json(err));
  },
  // adding a friend //
  addFriend(req, res) {
    //finding user with specific id, adding that user to the set of friends, passing new: true so the new data gets passed to json not the old data//
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      // sending the response and updating the selected users friends list, then we have to send another findOneandUpdate on behalf of the friend thata got added, same format //
      .then((user) => !user ? res.status(404).json({ message: "User doesn't exist" }) : User.findOneAndUpdate({ _id: req.params.friendId },
        { $addToSet: { friends: req.params.userId } }, { new: true }))
      // checking it all again with a if user doesn't exist, otherwise responding succesfull//
      .then((user) => (!user ? res.status(404).json({ message: "Friend doesn't exist" }) : res.json(user)))
      .catch((err) => res.status(500).json(err));
  },
  // deleting a friend from friends list, same as above but we are pulling from the set not adding to it with the $pull operator //
  deleteFriend(req, res) {
    //finding user with specific id, adding that user to the set of friends, passing new: true so the new data gets passed to json not the old data//
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
      // sending the response and updating the selected users friends list, then we have to send another findOneandUpdate on behalf of the friend thata got added, same format //
      .then((user) => !user ? res.status(404).json({ message: "User doesn't exist" }) : User.findOneAndUpdate({ _id: req.params.friendId },
        { $pull: { friends: req.params.userId } }, { new: true }))
      // checking it all again with a if user doesn't exist, otherwise responding succesfull//
      .then((user) => (!user ? res.status(404).json({ message: "Friend doesn't exist" }) : res.json(user)))
      .catch((err) => res.status(500).json(err));
  }

};