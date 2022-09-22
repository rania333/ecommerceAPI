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

    search() {
        if (this.queryString.keyword) {
            const query = {}
            query.$or = [
                { title: { $regex: this.queryString.keyword, $options: 'i' } },
                { description: { $regex: this.queryString.keyword, $options: 'i' } }
            ]
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }

    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        return this
    }
}

exports.ApiFeature = ApiFeature