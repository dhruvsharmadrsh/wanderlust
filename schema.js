const Joi = require('joi');
const Review = require('./models/review');


const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow('',null),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    })
})




const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})


// ✅ Export both
module.exports = {
    listingSchema,
    reviewSchema
};