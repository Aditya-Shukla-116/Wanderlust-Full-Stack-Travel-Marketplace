const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required().label("title"),
        description: joi.string().required().label("description"),
        location: joi.string().required().label("location"),
        country: joi.string().required().label("country"),
        price: joi.number().required().min(0).label("price"),
        image: joi.string().allow("", null).label("image"),
        category: joi.string().allow("none", "omg", "lakefront", "tinyhomes", "trending", "treehouses", "countryside", "historical", "beachfront", "tropical").default("none")
    }).required()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required().messages({
            "number.base": "Rating must be a number",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating cannot be greater than 5",
            "any.required": "Rating is required"
        }),

        comment: joi.string().required().messages({
            "string.empty": "Comment is required",
            "any.required": "Comment is required"
        })
    }).required()
});