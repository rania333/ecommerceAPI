const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { ErrorHandler } = require('../utils/Error')

//category
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/category')
    },
    filename: function (req, file, cb) {
        const id = uuidv4()
        const ext = file.mimetype.split('/')[1]
        cb(null, `category-${id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ErrorHandler('Only Images allowed', 400), false);
    }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadCategory = upload.single('image')