const multer = require('multer')
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid')
const { ErrorHandler } = require('../utils/Error')
const asyncHandler = require('express-async-handler');

//category
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/category')
//     },
//     filename: function (req, file, cb) {
//         const id = uuidv4()
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `category-${id}-${Date.now()}.${ext}`)
//     }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ErrorHandler('Only Images allowed', 400), false);
    }
}

// Image processing for category
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/category/${filename}`);
    // Save image into our db
    req.body.image = filename;
    next();
});

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadCategory = upload.single('image')

//brand
// Image processing for brand
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/brand/${filename}`);
    // Save image into our db
    req.body.image = filename;
    next();
});
exports.uploadBrand = upload.single('image')