import Sauce from "../models/sauces.js";
import fs from "fs";

// Create a sauce
export const createSauce = (req, res) => {
     const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        userId: sauceObject.userId
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Sauce added." }))
        .catch(error => res.status(400).json({message: error.message }));
};

// Find a sauce
export const getOneSauce = (req, res) => {
   Sauce.findOne({
     _id: req.params.id
   })
   .then(
     (sauce) => {
       res.status(200).json(sauce);
     }
   ).catch(
     (error) => {
       res.status(404).json({
         error: error
       });
     }
   );
};

// Edit a sauce
export const modifySauce = (req, res) => {
  const sauceObject = req.file? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : { ...req. body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "You are not authorized to edit this sauce." });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce changed!" }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Delete a sauce
export const deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
      if (!sauce) {
          res.status(404).json({message: "Sauce not found."});
      }
      else {
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
          const userId = decodedToken.userId;

          if (sauce.userId !== userId) {
              res.status(401).json({message: "You're not authorized to delete this sauce."});
          }
          else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({ _id: req.params.id })
                      .then(() => res.status(200).json({ message: "Sauce deleted." }))
                      .catch(error => res.status(400).json({ message: error.message }));
              });
          }
      }

  })
  .catch(error => res.status(500).json({ message: error.message }));
};

// Retrieve all sauces
export const getAllSauce = (req, res) => {
   Sauce.find().then(
     (sauces) => {
       res.status(200).json(sauces);
     }
   ).catch(
     (error) => {
       res.status(404).json({
        error: {
          message: "Sauces not found.",
          ...error
        }
       });
     }
   );
};

//like and dislike
export const likeSauce = (req, res) => {
   const like = req. body. like;
   if(like === 1) { // like button
       Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
       .then( () => res.status(200).json({message: "You like this sauce." }))
       .catch( error => res.status(500).json({ error}))

   } else if(like === -1) { // don"t like button
       Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
       .then( () => res.status(200).json({message: "You don't like this sauce." }))
       .catch( error => res.status(500).json({ error}))

   } else { // cancel the like or dislike button
       Sauce.findOne( {_id: req.params.id})
       .then( sauce => {
           if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
               .then( () => res.status(200).json({message: "You don't like this sauce anymore." }))
               .catch( error => res.status(500).json({ error}))
               }
              
           else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
               Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
               .then( () => res.status(200).json({message: "Maybe try this sauce again?" }))
               .catch( error => res.status(500).json({ error}))
               }
       })
       .catch( error => res.status(404).json({ error}))
   }
};

