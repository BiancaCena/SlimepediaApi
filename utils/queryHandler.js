class QueryHandler {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
		this.isPaginated = false; // Flag to track if pagination was applied
	}

	filter() {
		// Create a copy of the query parameters from the request
		const queryObj = { ...this.queryString };

		// List fields to exclude from filtering (pagination, sorting, etc.)
		const excludedFields = ["page", "sort", "limit", "fields"];
		// Remove the excluded fields from the query object
		excludedFields.forEach((field) => delete queryObj[field]);

		// ---------------- FILTERING ---------------- //
		// Convert the query object to a JSON string for manipulation
		let queryStr = JSON.stringify(queryObj);

		// Replace comparison operators with MongoDB's query syntax (e.g., $gte, $gt, $lte, $lt)
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g,
			(match) => `$${match}`
		);

		// Parse the modified query string back to an object for MongoDB query
		// Create the query with the filtered conditions
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			// Separate the sort fields by space (ex. "type,name" becomes "type name")
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			// If no sort parameter is provided, use a default sorting
			this.query = this.query.sort("_id");
		}

		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			// Separate the limit fields by space (ex. "type,name" becomes "type name")
			const fields = this.queryString.fields.split(",").join(" ");
			// Select only the specified fields from the query results
			this.query = this.query.select(fields);
		} else {
			// If no specific fields are requested, exclude the version field from the results
			this.query = this.query.select("-__v");
		}

		return this;
	}

	paginate() {
		this.page = this.queryString.page * 1 || 1;
		this.limit = this.queryString.limit * 1 || 6;

		// Calculate the number of items to skip based on the current page and limit
		const skip = (this.page - 1) * this.limit;

		// Apply pagination to the query
		this.query = this.query.skip(skip).limit(this.limit);

		// Set isPaginated to true
		this.isPaginated = true;

		return this;
	}

	async getPaginationInfo(Model) {
		// Return null if pagination was not applied
		if (!this.isPaginated) return null;

		// Retrieve the filters used in the query
		const filters = this.query.getFilter();

		// Count the total number of documents that match the filters
		const totalCount = await Model.countDocuments(filters);

		// If no documents match the filters, return null
		if (totalCount === 0) return null;

		// Calculate the total number of pages based on the total count and the limit per page
		const totalPages = Math.ceil(totalCount / this.limit);

		// Return pagination information
		return {
			page: this.page, // Current page number
			limit: this.limit, // Number of documents per page
			totalPages, // Total number of pages
			totalCount, // Total number of documents
		};
	}
}

module.exports = QueryHandler;
