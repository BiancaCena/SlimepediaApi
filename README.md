# **API Documentation**

## **SlimepediaApi**

### **Overview**

Slimepedia API provides access to detailed information about slimes from the game _Slime Rancher_. Built using Node.js, Express, MongoDB, and Mongoose.

### **Endpoints**

| Name               | Method | Endpoint                                                                                                              | Description                                                                       |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Slimes             | GET    | [/slimes](https://slimepedia-api.vercel.app/slimes)                                                                   | Returns a paginated list of slimes.                                               |
| Slimes by Location | GET    | [/slimes/by-location](https://slimepedia-api.vercel.app/slimes/by-location)                                           | Returns a list of locations with the names of slimes that spawn at each location. |
| Slimes by Type     | GET    | [/slimes/by-type](https://slimepedia-api.vercel.app/slimes/by-type)                                                   | Returns a list of slime types and the names of slimes that belong to each type.   |
| Slime by Object ID | GET    | [/slimes/{slime_id}](https://slimepedia-api.vercel.app/slimes/{slime_id})                                             | Returns information about a specific slime based on its ID.                       |
| Slimes by Property | GET    | [/slimes/{property_name}/{property_value}](https://slimepedia-api.vercel.app/slimes/{property_name}/{property_value}) | Returns a paginated list of slimes based on a specified property and value.       |

### **Rate Limiting**

To prevent abuse and ensure fair use, this API implements rate limiting. The default rate limit is set to 100 requests per hour per IP address.

### **Usage**

#### **A. Resource Operations**

1. **List Resources**

   Retrieve a paginated list of all slimes.

   Example Request:

   ```sh
   GET /slimes
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
   		/* ... */
   	]
   }
   ```

2. **Get Resource**

   Retrieve information about a specific slime by its Object ID.

   Example Request:

   ```sh
   GET /slimes/{slime_id}
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

#### **B. Pagination**

The API defaults to showing 6 resources per page. You can adjust this number by including `limit` and `page` parameters in your GET request.

Example:

```sh
GET /slimes?limit=10&page=2
```

This request retrieves the second page of results, with a maximum of 10 resources per page.

#### **C. Sorting**

By default, the results are ordered by the \_id field. To sort the results by another field, use the `sort` query parameter.

Examples:

- To sort by name:

  ```sh
  GET /slimes?sort=name
  ```

- To sort by several properties and their respective orders, list them separated by commas and use a minus sign (`-`) to indicate descending order:

  ```sh
  GET /slimes?sort=type,-name
  ```

  This sorts the list first by type, then by name in descending order.

#### **D. Filtering**

You can filter results by specifying query parameters that match the properties and their values.

1. **Basic Filtering**

   Examples:

   - To find a slime based on name:

     ```sh
     GET /slimes?name=Tabby Slime
     ```

   - To find slimes with fruit or veggie as their diet:

     ```sh
     GET /slimes?diet[]=fruit&diet[]=veggie
     ```

   - To get slimes based on property

     ```sh
     GET /slimes/diet/other
     ```

2. **Advanced Filtering with Mongoose Queries**

   For more complex queries, you can use Mongoose query operators. Here’s how to format your query parameters:

   Examples:

   - To find a slime based on name using **Equality (`$eq`)** operator:

     ```sh
     GET /slimes?name[eq]=Tabby Slime
     ```

   - To find slimes with fruit or veggie as their diet using **In (`$in`)** operator:

     ```sh
     GET /slimes?diet[in]=fruit&diet[in]=veggie
     ```

   - To exclude a slime based on id using **Not Equal (`$ne`)** operator:

     ```sh
     GET /slimes?id[ne]=tarr
     ```

   - To get slimes that do not belong to the types "docile" and "hostile" using the **Not In (`$nin`)** operator:

     ```sh
     GET /slimes?type[nin]=docile&type[nin]=hostile
     ```

   - To get slimes that exists on both games 1 and 2 using **All (`$all`)** operator:

     ```sh
     GET /slimes?games[all]=1&games[all]=2
     ```

   - To get slimes that spawns in one location only using **Size (`$size`)** operator:

     ```sh
     GET /slimes?locations[size]=1
     ```

#### **E. Limiting Fields**

You can specify which fields to include in the response by using the fields query parameter.

Example:

- To display the name, diet, favourite food, and favourite toy of each slime:

  ```sh
  GET /slimes?fields=name,diet,favouriteFood,favouriteToy
  ```

### **Credits and Acknowledgements**

This API utilizes data sourced from the [Slime Rancher Wiki](https://slimerancher.fandom.com/wiki/Slime_Rancher_Wiki) by [apriltaoyvr](https://github.com/apriltaoyvr/slime-rancher-api). All images and information are the property of **Monomi Park**, the developers of Slime Rancher.
