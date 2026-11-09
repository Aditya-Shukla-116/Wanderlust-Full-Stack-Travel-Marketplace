const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
   description: String,

   image: {
    url:String,
    filename: String
  }, 

  price: {
    type: Number,
    required: true,
    min: 0
 },

  location: String,
  country: String,

  category: {
    type: String,
    enum: ["none", "omg", "lakefront", "tinyhomes", "trending", "treehouses", "countryside", "historical", "beachfront", "tropical"],
    default: "none"
},

  reviews: [{
     type:Schema.Types.ObjectId,
     ref:"Review",
  }],

  owner:{
     type:Schema.Types.ObjectId,
     ref:"User",
  },

   // GEOMETRY OBJECT FOR MAPBOX
  geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});


// Mongoose Middleware: PRE vs POST
//
// PRE middleware runs BEFORE the specified database operation.
// POST middleware runs AFTER the specified database operation.
//
// Flow when deleting a listing:
//
// 1. Listing.findByIdAndDelete(id) is called.
// 2. PRE middleware runs before the listing is deleted.
// 3. The listing is deleted from MongoDB.
// 4. POST middleware runs and receives the deleted listing document.
// 5. Review.deleteMany() deletes all reviews associated with that listing.
//
// findByIdAndDelete() triggers the findOneAndDelete middleware.
// PRE is useful for tasks before deletion.
// POST is useful for cleanup tasks after deletion.

listingSchema.post("findOneAndDelete", async (list) => {
    if (list) {
        await Review.deleteMany({
            _id: { $in: list.reviews }
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


