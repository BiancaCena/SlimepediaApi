# **Slimepedia API**

## Overview

The Slimepedia API provides access to detailed information about slimes from the game _Slime Rancher_. Built using Node.js, Express, MongoDB, and Mongoose.

## Table of Contents

- [Installation](#installation)
- [Endpoints](#endpoints)
- [Rate Limiting](#rate-limiting)
- [Usage](#usage)
  - [Resource Operations](#resource-operations)
  - [Pagination](#pagination)
  - [Sorting](#sorting)
  - [Filtering](#filtering)
  - [Limiting Fields](#limiting-fields)
- [Credits and Acknowledgements](#credits-and-acknowledgements)

## Installation

To install and run the Slimepedia API locally, follow these steps:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Ensure you have MongoDB installed and running. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

### Steps

1. **Clone the Repository**

   First, clone the repository to your local machine:

   ```sh
   git clone https://github.com/BiancaCena/SlimepediaApi.git
   ```

   Navigate into the project directory:

   ```sh
   cd SlimepediaApi
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `src/config` directory of the project to store your environment variables. Use the following template and replace the placeholder values with your actual configuration:

   - `NODE_ENV` - Set environment (development or production).
   - `PORT` - Set port for the project.
   - `DATABASE` - Set the MongoDB URL.
   - `DATABASE_PASSWORD` - Set the password for the MongoDB database.

4. **Prepare Data**
   If you want to populate your database with sample data, use the `importData.js` script located in `src/data`.

   - **Import Data**: To import sample data from `slimes.json` into your MongoDB database, use the following command:

     ```sh
     node src/data/importData.js --import
     ```

     Ensure that the `slimes.json` file is placed in the `src/data` directory and contains the data to be imported.

   - **Delete Data**: To delete all data from the slimes collection, use the following command:

     ```sh
     node src/data/importData.js --delete
     ```

5. **Run the API**

   Start the API server:

   ```sh
   npm start
   ```

   The API will start running on http://localhost:3000.

6. **Test the API**

   You can test the API endpoints using tools like Postman or curl. Refer to the Endpoints section for available routes.

## **Endpoints**

| Name               | Method | Endpoint                                                                                                                    | Description                                                                       | Status                      |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------- |
| Slimes             | GET    | [/api/slimes](https://slimepedia.onrender.com/api/slimes)                                                                   | Returns a paginated list of slimes.                                               | Available                   |
| Slimes by Location | GET    | [/api/slimes/by-location](https://slimepedia.onrender.com/api/slimes/by-location)                                           | Returns a list of locations with the names of slimes that spawn at each location. | Available                   |
| Slimes by Type     | GET    | [/api/slimes/by-type](https://slimepedia.onrender.com/api/slimes/by-type)                                                   | Returns a list of slime types and the names of slimes that belong to each type.   | Available                   |
| Slime by Object ID | GET    | [/api/slimes/{slime_id}](https://slimepedia.onrender.com/api/slimes/{slime_id})                                             | Returns information about a specific slime based on its ID.                       | Available                   |
| Slimes by Property | GET    | [/api/slimes/{property_name}/{property_value}](https://slimepedia.onrender.com/api/slimes/{property_name}/{property_value}) | Returns a paginated list of slimes based on a specified property and value.       | Available                   |
| Create Slime       | POST   | `/api/slimes`                                                                                                               | Creates a new slime entry.                                                        | Not Available in Production |
| Update Slime       | PUT    | `/api/slimes/{slime_id}`                                                                                                    | Updates an existing slime entry based on its ID.                                  | Not Available in Production |
| Delete Slime       | DELETE | `/api/slimes/{slime_id}`                                                                                                    | Deletes a slime entry based on its ID.                                            | Not Available in Production |

**Note**: The API supports only GET requests for read-only data retrieval. Create, Update, and Delete operations are commented out and not available in production. To use these operations locally, clone the project and uncomment the relevant code in the controllers and routes files.

## Rate Limiting

To prevent abuse and ensure fair use, this API implements rate limiting. The default rate limit is set to 100 requests per hour per IP address.

## Usage

### Resource Operations

1. **List Resources**

   Retrieve a paginated list of all slimes.

   Example Request:

   ```sh
   GET /api/slimes
   ```

   Sample Output:

   ```json
   {
   	"status": "success",
   	"requestedAt": "...",
   	"results": 6,
   	"pagination": {
   		"page": 1,
   		"limit": 6,
   		"totalPages": 5,
   		"totalCount": 28
   	},
   	"data": [
   		{
   			"slimepedia": {
   				"slimeology": "...",
   				"risks": "...",
   				"plortonomics": "..."
   			},
   			"_id": "...",
   			"id": "...",
   			"name": "...",
   			"image": "...",
   			"diet": "...",
   			"favouriteToy": "...",
   			"favouriteFood": "...",
   			"type": "...",
   			"locations": ["...", "...", "..."],
   			"properties": ["...", "..."],
   			"games": [1, 2]
   		}
   		...
   	]
   }
   ```

2. **Get Resource**

   Retrieve information about a specific slime by its Object ID.

   Example Request:

   ```sh
   GET /api/slimes/66dece79e3b9a78cca8878e0
   ```

   Sample Output:

   ```json
   {
   	"status": "success",
   	"requestedAt": "...",
   	"data": {
   		"slimepedia": {
   			"slimeology": "...",
   			"risks": "...",
   			"plortonomics": "..."
   		},
   		"_id": "...",
   		"id": "...",
   		"name": "...",
   		"image": "...",
   		"diet": "...",
   		"favouriteToy": "...",
   		"favouriteFood": "...",
   		"type": "...",
   		"locations": ["...", "...", "..."],
   		"properties": ["...", "..."],
   		"games": [1, 2],
   		"__v": 0
   	}
   }
   ```

### Pagination

The API defaults to showing 6 resources per page. You can adjust this number by including `limit` and `page` parameters in your GET request.

Example:

```sh
GET /api/slimes?limit=10&page=2
```

This request retrieves the second page of results, with a maximum of 10 resources per page.

### Sorting

By default, the results are ordered by the \_id field. To sort the results by another field, use the `sort` query parameter.

Examples:

- To sort by name:

  ```sh
  GET /api/slimes?sort=name
  ```

- To sort by several properties and their respective orders, list them separated by commas and use a minus sign (`-`) to indicate descending order:

  ```sh
  GET /api/slimes?sort=type,-name
  ```

  This sorts the list first by type, then by name in descending order.

### Filtering

You can filter results by specifying query parameters that match the properties and their values.

1. **Basic Filtering**

   Examples:

   - To find a slime based on name:

     ```sh
     GET /api/slimes?name=Tabby Slime
     ```

   - To find slimes with fruit or veggie as their diet:

     ```sh
     GET /api/slimes?diet[]=fruit&diet[]=veggie
     ```

   - To get slimes based on property

     ```sh
     GET /api/slimes/diet/other
     ```

2. **Advanced Filtering with Mongoose Queries**

   For more complex queries, you can use Mongoose query operators. Here’s how to format your query parameters:

   Examples:

   - To find a slime based on name using **Equality (`$eq`)** operator:

     ```sh
     GET /api/slimes?name[eq]=Tabby Slime
     ```

   - To find slimes with fruit or veggie as their diet using **In (`$in`)** operator:

     ```sh
     GET /api/slimes?diet[in]=fruit&diet[in]=veggie
     ```

   - To exclude a slime based on id using **Not Equal (`$ne`)** operator:

     ```sh
     GET /api/slimes?id[ne]=tarr
     ```

   - To find slimes that do not belong to the types "docile" and "hostile" using the **Not In (`$nin`)** operator:

     ```sh
     GET /api/slimes?type[nin]=docile&type[nin]=hostile
     ```

   - To find slimes that exists on both games 1 and 2 using **All (`$all`)** operator:

     ```sh
     GET /api/slimes?games[all]=1&games[all]=2
     ```

   - To find slimes that spawns in one location only using **Size (`$size`)** operator:

     ```sh
     GET /api/slimes?locations[size]=1
     ```

### Limiting Fields

You can specify which fields to include in the response by using the fields query parameter.

Example:

- To display the name, diet, favourite food, and favourite toy of each slime:

  ```sh
  GET /api/slimes?fields=name,diet,favouriteFood,favouriteToy
  ```

## Credits and Acknowledgements

- **Slime Rancher Wiki**: Data used in this API is sourced from the [Slime Rancher Wiki](https://slimerancher.fandom.com/wiki/Slime_Rancher_Wiki).
- **apriltaoyvr**: The JSON data file used in this project is based on work by [apriltaoyvr](https://github.com/apriltaoyvr/slime-rancher-api), who collected and structured the data.
- **Monomi Park**: All images and information are the property of **Monomi Park**, the developers of Slime Rancher.
