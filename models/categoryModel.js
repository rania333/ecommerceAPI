const mongoose = require('mongoose')

//create schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name is required'],
        unique: [true, 'category must be unique'],
        minlength: [2, 'too short category name'],
        maxlength: [32, 'too long category name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true })

const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
        doc.image = imageUrl;
    }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
    setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
    setImageURL(doc);
});

//create model
const categoryModel = mongoose.model('Category', categorySchema)


module.exports = categoryModel