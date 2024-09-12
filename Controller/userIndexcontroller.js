// const axios = require('axios');

// // Controller function to handle rendering the user page with data from an API
// exports.indexejs = async (req, res) => {
//   try {
//     // Fetch data from the external API using axios
//     let response = await axios.get("https://www.authentichef.com/api/menu/menuItems");
    
//     // Assuming the API response contains data in a specific field (e.g., response.data.items)
//     let data = response.data.menuItems; // Adjust this line based on the actual response structure


//     // Check if the data is an array; if not, handle accordingly
//     if (!Array.isArray(data)) {
//       data = []; // Set to an empty array or handle the situation appropriately
//     }

//     // Render the 'user' EJS view, passing the fetched data
//     res.render('user', { data });
//   } catch (error) {
//     // Log the error for debugging
//     console.error("Error fetching data:", error);

//     // Send a 500 status with a JSON error message
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
