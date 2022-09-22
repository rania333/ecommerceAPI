const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, "subCategory must be unique"],
            minlength: [2, "Too short subCategory name"],
            maxlength: [32, "Too long subCategory name"]
        },
        slug: {
            type: String,
            lowercase: true
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: "subCategory must be belong to mainCategory"
        }
    }, { timestamps: true })

module.exports = mongoose.model('subCategory', subCategorySchema)

