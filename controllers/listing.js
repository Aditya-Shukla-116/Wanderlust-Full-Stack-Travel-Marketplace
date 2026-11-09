const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    // 1. Capture what the user typed in the search bar OR clicked on the category icons
    const searchQuery = req.query.search;
    const categoryQuery = req.query.category;
    
    let filter = {}; // By default, an empty filter {} fetches absolutely everything

    // 2. SCENARIO A: A user clicked a shortcut category icon shortcut
    if (categoryQuery && categoryQuery !== "none") {
        filter = { category: categoryQuery };
    } 
    // 3. SCENARIO B: A user typed terms into the text search bar
    else if (searchQuery) {
        // Clean up the text input and split words into a flexible matcher to handle partial words and spaces
        const cleanInput = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flexibleQuery = cleanInput.split('').join('.*?');
        
        // This rule searches for text matching location, country, OR title case-insensitively
        filter = {
            $or: [
                { location: { $regex: flexibleQuery, $options: "i" } },
                { country: { $regex: flexibleQuery, $options: "i" } },
                { title: { $regex: flexibleQuery, $options: "i" } }
            ]
        };
    }

    // 4. Find listings from the MongoDB collection using the active query filter
    let allLists = await Listing.find(filter);
    
    // 5. Send the filtered listings and tracking variables down to your index view template
    res.render("listings/index.ejs", { 
        allLists, 
        searchQuery: searchQuery || '',
        activeCategory: categoryQuery || 'all' // Matches your template to keep the correct icon highlighted!
    });
};



  module.exports.renderNewForm = (req, res) => {
    // If the session identifies an authenticated user,
    // allow access to the listing creation page.
    res.render("listings/new.ejs");
}



module.exports.createListing = async (req, res, next) => {
    // 1. Take the text location entered in the form and ask Mapbox for coordinates
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    // 2. Initialize the instance using the new keyword so we can manipulate it cleanly
    const neWListing = new Listing(req.body.listing);
    
    neWListing.image = { url, filename };
    neWListing.owner = req.user._id;

    // 3. Extract the GeoJSON coordinate structure from Mapbox and assign it!
    neWListing.geometry = response.body.features[0].geometry;
    
    // 4. Save the finalized object natively to MongoDB
    await neWListing.save(); 
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};




  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      let list = await Listing.findById(id);
      // Check whether the requested listing exists in the database.
      // If it doesn't exist, store an error message using flash
      // and redirect the user to the All Listings page.
      if (!list) {
        req.flash("error", "The listing you are searching for does not exist!");
        return res.redirect("/listings");
      }
      let originalImageUrl = list.image.url;

      if (originalImageUrl.includes("cloudinary.com")) {
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_300,c_fill");
      } 
     else if (originalImageUrl.includes("unsplash.com")) {
     // .split("?")[0] extracts ONLY the base URL path, discarding old parameters safely
     let baseUrl = originalImageUrl.split("?")[0]; 
       originalImageUrl = `${baseUrl}?auto=format&fit=crop&w=250&h=300&q=80`;
   } 
    res.render("listings/edit.ejs", { list ,  originalImageUrl});
    }



    module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
    .populate({
     path: "reviews",
     populate: {path: "author" }
   })
   .populate("owner");
 // here populate is used to show reviews
    // Change console.log(list); to:

    // Check whether the requested listing exists in the database.
    // If it doesn't exist, store an error message using flash
    // and redirect the user to the All Listings page.
    if (!list) {
      req.flash("error", "The listing you are searching for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
  }


  module.exports.updateListing = async (req, res) => {
      let { id } = req.params;
     // console.log(req.body);
      let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
      if(typeof req.file!== "undefined"){
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = {url, filename};
          await listing.save();
      }

      req.flash("success", "Listing Updated!");
      res.redirect("/listings");
    }



    module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    // Delete all reviews connected to this listing
    // await Review.deleteMany({
    //     _id: { $in: (await Listing.findById(id)).reviews }
    // });

    const Deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(Deletedlisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }