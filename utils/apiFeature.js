class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
        this.page = this.queryString.page
    }

    filtering() {
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'search', 'fields', 'keyword']
        excludedFields.forEach(field => delete queryObj[field])

        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
        return this
    }

    sorting() {
        if (this.queryString.sort) {
            this.mongooseQuery = this.mongooseQuery.sort(this.queryString.sort.replace(',', ' '))
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
        }
        return this

    }

    limitFields() {
        if (this.queryString.fields) {
            this.mongooseQuery = this.mongooseQuery.select(this.queryString.fields.replace(',', ' '))
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v -_id")
        }
        return this
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {}
            if (modelName == 'Product') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ]
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
            }

            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }

    pagination(countDocuments) {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        const endIndex = page * limit
        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.paginationResult = pagination
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)

        return this
    }
}

exports.ApiFeature = ApiFeature