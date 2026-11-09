const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // For reviews we need listing

module.exports.createReview = async (req,res)=>{
   let {id} = req.params;
   const list = await Listing.findById(id);
  //  console.log(req.body.review);
   let newReview = new Review(req.body.review);
  //  assign the author before saving!
   newReview.author = req.user._id; 
//    console.log(newReview);

   list.reviews.push(newReview);
   
   await newReview.save();
   await list.save();
   console.log("new review saved");
   req.flash("success", "New Review Saved");
   res.redirect(`/listings/${id}`);

}



module.exports.destroyReview = async (req,res)=>{
     let {id ,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(id);
     req.flash("success", "Review Deleted");
     res.redirect(`/listings/${id}`);
}