const axios = require('axios');

// Constants for the RocketReach API
const BASE_URL = 'https://api.rocketreach.co/api/v2/person/search';
const API_KEY = 'YOUR_ROCKETREACH_API_KEY'; // Replace with your actual RocketReach API Key

// Function to make the API request
exports.lookupPerson = async (queryParams) => {

  console.log(queryParams , "qqqqqqqqqqqqqqqqqqqqqqerrrrrrrrrrrrrrrrrr")
  try {
    const response = await axios.post(
      BASE_URL,
      {
        // Payload directly includes the query at the top level
        start: queryParams.start || 1,
        page_size: queryParams.page_size || 10,
        query: queryParams.query || {}, // Ensure the query parameter is properly passed
        all_skills: queryParams.all_skills || [],
        birth_year: queryParams.birth_year || [],
        city: queryParams.city || [],
        company_city: queryParams.company_city || [],
        company_country_code: queryParams.company_country_code || [],
        company_domain: queryParams.company_domain || [],
        company_email: queryParams.company_email || [],
        company_funding_max: queryParams.company_funding_max || [],
        company_funding_min: queryParams.company_funding_min || [],
        company_id: queryParams.company_id || [],
        company_industry: queryParams.company_industry || [],
        company_intent: queryParams.company_intent || [],
        company_list: queryParams.company_list || [],
        company_naics_code: queryParams.company_naics_code || [],
        company_name: queryParams.company_name || [],
        company_postal_code: queryParams.company_postal_code || [],
        company_publicly_traded: queryParams.company_publicly_traded || [],
        company_region: queryParams.company_region || [],
        company_revenue: queryParams.company_revenue || [],
        company_revenue_max: queryParams.company_revenue_max || [],
        company_revenue_min: queryParams.company_revenue_min || [],
        company_sic_code: queryParams.company_sic_code || [],
        company_size: queryParams.company_size || [],
        exclude_company_size: queryParams.exclude_company_size || [],
        company_size_max: queryParams.company_size_max || [],
        exclude_company_size_max: queryParams.exclude_company_size_max || [],
        company_size_min: queryParams.company_size_min || [],
        exclude_company_size_min: queryParams.exclude_company_size_min || [],
        country_code: queryParams.country_code || [],
        education_level: queryParams.education_level || [],
        email_status: queryParams.email_status || [],
        exclude_email_status: queryParams.exclude_email_status || [],
        gender: queryParams.gender || [],
        job_function: queryParams.job_function || [],
        exclude_job_function: queryParams.exclude_job_function || [],
        job_title: queryParams.job_title || [],
        exclude_job_title: queryParams.exclude_job_title || [],
        linkedin_url: queryParams.linkedin_url || [],
        location_type: queryParams.location_type || [],
        phone_status: queryParams.phone_status || [],
        profile_image: queryParams.profile_image || [],
        school: queryParams.school || [],
        skills: queryParams.skills || [],
        exclude_skills: queryParams.exclude_skills || [],
        state: queryParams.state || [],
        work_email: queryParams.work_email || [],
        exclude_work_email: queryParams.exclude_work_email || [],
        years_experience: queryParams.years_experience || [],
        years_experience_max: queryParams.years_experience_max || [],
        years_experience_min: queryParams.years_experience_min || []

      },
      {
        headers: {
          Authorization: '1597434k5731585966a9ff8692a5009a9624defa', // Correct format with the API key
          'Content-Type': 'application/json',
        },
      }
    );


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












