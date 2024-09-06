const axios = require("axios")

const API_KEY = '1584a87k3a131f98e67afdbac652b3fc9c7d4fb5'
const BASE_URL = 'https://api.rocketreach.co/api/v2/person/lookup';

// Function to make the API request
exports.lookupPerson = async (queryParams) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: queryParams,
        headers: {
          'Authorization': `${API_KEY}`,
        },
      });
      return response.data; 
    } catch (error) {
   
      if (error.response) {
        const errorMessage = error.response.data || 'Unknown error occurred'; 
        const status = error.response.status || 500; 
        throw new Error(`Error ${status}: ${JSON.stringify(errorMessage)}`); 
      } else {
        throw new Error(error.message || 'Network error occurred'); 
      }
    }
  };

