const OpenAI = require('openai');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const session = require("express-session")
const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMNI);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const BASE_URL = 'https://api.rocketreach.co/api/v2/person/search'

const openai = new OpenAI({
  apiKey: 'sk-fC4YTC2B80_bygFX6AzCGJc1znHRuiUfKCVcTdp9z9T3BlbkFJl-OfeSAq6vyuL7Npghy_njkyG1EKqvad7BMKKAPFQA',
});


exports.createCompletion = async (req, res) => {
  try {
    const { msg } = req.body;
    console.log(msg);

    const result = await model.generateContent([{ role: "user", content: msg }]);


    const completionText = result.response.text(); 
    res.status(200).json({ message: "Message is received", completion: completionText });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};


const getGeminiQuery = async (userQuery) => {
  console.log("User query:", userQuery);

  try {
    // Generate content from the model
    const result = await model.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          parts: [
            {
              text: `Please generate a JSON object based on the following fields and values from this user query: "${userQuery}". For fields where data is not provided, include them with empty strings. The JSON object should have the following structure:

{
  "name": "",
  "query": "",
  "all_skills": [""],
  "birth_year": [""],
  "city": [""],
  "company_city": [""],
  "company_country_code": [""],
  "company_domain": [""],
  "company_email": [""],
  "company_funding_max": "",
  "company_funding_min": "",
  "company_id": [""],
  "company_industry": "",
  "company_intent": "",
  "company_list": [""],
  "company_naics_code": "",
  "company_name": "",
  "company_postal_code": "",
  "company_publicly_traded": "",
  "company_region": "",
  "company_revenue": "",
  "company_revenue_max": "",
  "company_revenue_min": "",
  "company_sic_code": "",
  "company_size": "",
  "exclude_company_size": "",
  "company_size_max": "",
  "exclude_company_size_max": "",
  "company_size_min": "",
  "exclude_company_size_min": "",
  "education_level": "",
  "email_status": "",
  "exclude_email_status": "",
  "gender": "",
  "job_function": "",
  "exclude_job_function": "",
  "job_title": "",
  "exclude_job_title": "",
  "linkedin_url": "",
  "location_type": "",
  "phone_status": "",
  "profile_image": "",
  "school": "",
  "skills": [""],
  "exclude_skills": [""],
  "state": "",
  "work_email": "",
  "exclude_work_email": "",
  "years_experience": "",
  "years_experience_max": "",
  "years_experience_min": ""
  
}

Ensure that all fields are included, and fill in any missing data with empty strings or empty arrays as appropriate. The JSON object should be correctly formatted and use proper grammar. 

Return the response in JSON format as shown above.`,
            },
          ],
        },
      ],
    });



    // Adjust based on actual response structure
    const completionText = result?.response?.candidates || [];
    return completionText;

  } catch (error) {
    console.error(`Gemini Error: ${error.message}`);
    throw new Error(`Gemini Error: ${error.message}`);
  }
};



const fetchRocketReachData = async (queryParams ,req ) => {


  let cleanedParams = queryParams;
  if (typeof queryParams === 'string') {
    cleanedParams = queryParams.replace(/^```json\s*|\s*```$/g, '').trim();
    
    try {
      queryParams = JSON.parse(cleanedParams);
    } catch (error) {
      console.error("Failed to parse queryParams:", error);
      throw new Error("Invalid queryParams format");
    }
  }

 

  // Format the `query` field correctly
  const formattedQuery = typeof queryParams.query === 'object' ? queryParams.query : {};

  


  const formatField = (value, isArray = false, forceArray = false) => {
    if (isArray || forceArray) {
      if (Array.isArray(value)) {
        return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(item => item !== '');
      }
      return value ? [typeof value === 'string' ? value.trim() : ''] : [];
    } else {
      return typeof value === 'string' ? value.trim() : '';
    }
  };

  // Format the parameters for the API request
  const formattedParams = {
    start: parseInt(queryParams.start, 10) || 1,
    page_size: parseInt(queryParams.page_size, 10) || 10,
    query: {
      all_skills: formatField(queryParams.all_skills, true),
      city: formatField(queryParams.city, true),
      company_city: formatField(queryParams.company_city, true),
      company_country_code: formatField(queryParams.company_country_code, true),
      company_domain: formatField(queryParams.company_domain, false, true),
      company_email: formatField(queryParams.company_email, true),
      company_funding_max: formatField(queryParams.company_funding_max, false, true),
      company_funding_min: formatField(queryParams.company_funding_min, false, true),
      company_id: formatField(queryParams.company_id, true),
      company_intent: formatField(queryParams.company_intent, false, true),
      company_naics_code: formatField(queryParams.company_naics_code, false, true),
      company_name: formatField(queryParams.company_name, true),
      company_postal_code: formatField(queryParams.company_postal_code, false, true),
      company_publicly_traded: formatField(queryParams.company_publicly_traded, false, true),
      company_region: formatField(queryParams.company_region, false, true),
      company_revenue: formatField(queryParams.company_revenue, false, true),
      company_revenue_max: formatField(queryParams.company_revenue_max, false, true),
      company_revenue_min: formatField(queryParams.company_revenue_min, false, true),
      company_sic_code: formatField(queryParams.company_sic_code, false, true),
      exclude_company_size: formatField(queryParams.exclude_company_size, false, true),
      company_size_max: formatField(queryParams.company_size_max, false, true),
      exclude_company_size_max: formatField(queryParams.exclude_company_size_max, false, true),
      company_size_min: formatField(queryParams.company_size_min, false, true),
      exclude_company_size_min: formatField(queryParams.exclude_company_size_min, false, true),
      skills: formatField(queryParams.skills, true),
      exclude_skills: formatField(queryParams.exclude_skills, true),
      // Remove or comment out invalid fields
      // education_level: formatField(queryParams.education_level, false, true),
      // email_status: formatField(queryParams.email_status, false, true),
      // exclude_email_status: formatField(queryParams.exclude_email_status, false, true),
      // gender: formatField(queryParams.gender, false, true),
      // job_function: formatField(queryParams.job_function, false, true),
      // exclude_job_function: formatField(queryParams.exclude_job_function, false, true),
      // job_title: formatField(queryParams.job_title, false, true),
      // exclude_job_title: formatField(queryParams.exclude_job_title, false, true),
      // linkedin_url: formatField(queryParams.linkedin_url, false, true),
      // location_type: formatField(queryParams.location_type, false, true),
      // phone_status: formatField(queryParams.phone_status, false, true),
      // profile_image: formatField(queryParams.profile_image, false, true),
      // school: formatField(queryParams.school, false, true),
      // work_email: formatField(queryParams.work_email, false, true),
      // exclude_work_email: formatField(queryParams.exclude_work_email, false, true),
      // years_experience: formatField(queryParams.years_experience, false, true),
      // years_experience_max: formatField(queryParams.years_experience_max, false, true),
      // years_experience_min: formatField(queryParams.years_experience_min, false, true),
    },
  };
  



   

  try {
    const response = await axios.post(
      BASE_URL,
      formattedParams,

      {
        headers: {
          Authorization: '1597c9ck32ec2870ee39f66029dde40e9905a867', 
          'Content-Type': 'application/json'
        }
      }
    );


      // Check if req.session is available before accessing it
      if (req && req.session) {
        req.session.data = response.data;
      } else {
        console.warn('Session is not available.');
      }

   // Ensure the `req` object has a session
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      const errorMessage = error.response.data.message || 'Unknown error occurred';
      const status = error.response.status || 500;
      throw new Error(`Error ${status}: ${errorMessage}`);
    } else {
      console.error("Network Error:", error.message || 'Network error occurred');
      throw new Error(error.message || 'Network error occurred');
    }
  }
};














exports.searchWithOpenAI = async (req, res) => {
  try {
    const userQuery = req.body.query;
    const geminiQuery = await getGeminiQuery(userQuery);

    console.log("chatGPTQuery:", geminiQuery);

    if (!geminiQuery || geminiQuery.length === 0) {
      throw new Error("No candidates found in Gemini response.");
    }


    const firstPart = geminiQuery[0]?.content?.parts?.[0]?.text || '';

    const data = await fetchRocketReachData(firstPart , req);

    return res.status(200).json({ data: data });
    return res.render('user', {formdata:data})
  } catch (error) {
    console.error("Error in searchWithOpenAI:", error);
    return res.status(500).send(error.message);
  }
};

