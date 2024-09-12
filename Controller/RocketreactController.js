const {lookupPerson} =require("../Models/RocketReach")
const session = require('express-session');



exports.getPerson = async (req, res) => {
  const { ...restQueryParams } = req.body;

  try {
    const data = await lookupPerson({
      ...restQueryParams,
    });
 

    // Store data in session
    req.session.data = data;



    // Send successful response
    return res.status(200).json(data);
      // Store data in session
  } catch (error) {
    console.error('Error in getPerson:', error.message);

    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      errorMessage = `Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`;
    } else {
      errorMessage = error.message || 'An error occurred';
    }

    // Send the error response
    return res.status(500).json({ error: errorMessage });
  }
};

exports.indexejs = (req, res) => {
  try {
    const sessionStore = req?.sessionStore; // Retrieve session store data
    if (!sessionStore || !sessionStore.sessions) {
      // If session data is not available
      console.error("Session store or sessions data is missing.");
      return res.render('user', { data: [] }); // Render with empty data
    }

    // Extract session values as objects
    const sessions = Object.values(sessionStore.sessions).map((session) =>
      JSON.parse(session)
    );

    // Flatten and collect all profiles from each session, if available
    const formattedData = sessions.reduce((acc, session) => {
      if (session.data?.profiles) {
        acc.push(...session.data.profiles);
      }
      return acc;
    }, []);

    console.log("Formatted Data:", formattedData);

    // Render the EJS template with the formatted data
    res.render('user', { data: formattedData });
  } catch (error) {
    console.error("Error rendering EJS:", error);

    // Handle the error for rendering
    return res.status(500).json({ error: 'Internal server error' });
  }
};



