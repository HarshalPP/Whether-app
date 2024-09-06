const {lookupPerson} =require("../Models/RocketReach")


exports.getPerson = async (req, res) => {
    const queryParams = req.query;
  
    try {
      const data = await lookupPerson(queryParams);
      res.status(200).json(data); 
    } catch (error) {
      console.error('Error in getPerson:', error.message);
  
      let errorMessage = 'An unexpected error occurred';
      if (error.response) {
        // Axios error response
        errorMessage = `Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`;
      } else {
        // Other types of errors
        errorMessage = error.message || 'An error occurred';
      }
  
      // Send the error response
      res.status(500).json({ error: errorMessage });
    }
  };