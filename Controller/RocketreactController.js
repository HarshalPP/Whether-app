const {lookupPerson} =require("../Models/RocketReach")
const session = require('express-session');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


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
      // If session data is not ava ilable
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


exports.exportSessionData = (req, res) => {
  const sessionStore = req?.sessionStore; // Retrieve session store data
  if (!sessionStore || !sessionStore.sessions) {
    console.error('Session store or sessions data is missing.');
    res.status(400).send('Session data is missing');
    return;
  }

  // Extract session values as objects
  const sessions = Object.values(sessionStore.sessions).map((session) =>
    JSON.parse(session)
  );

  // Flatten and collect all profiles from each session, if available
  const profiles = sessions.reduce((acc, session) => {
    if (session.data?.profiles) {
      acc.push(...session.data.profiles);
    }
    return acc;
  }, []);



  // Set up CSV Writer with all the additional headers
  const csvWriter = createCsvWriter({
    path: 'exported_data.csv', // File path where the CSV will be saved
    header: [
      { id: 'Name', title: 'Name' },
      { id: 'CurrentEmployer', title: 'Current Employer' },
      { id: 'LinkedInURL', title: 'LinkedIn URL' },
      { id: 'Email', title: 'Email' },
      { id: 'Location', title: 'Location' },
      { id: 'CurrentTitle', title: 'Current Title' },
      { id: 'Skills', title: 'Skills' },
      { id: 'BirthYear', title: 'Birth Year' },
      { id: 'City', title: 'City' },
      { id: 'CompanyCity', title: 'Company City' },
      { id: 'CompanyCountryCode', title: 'Company Country Code' },
      { id: 'CompanyDomain', title: 'Company Domain' },
      { id: 'CompanyEmail', title: 'Company Email' },
      { id: 'CompanyFundingMax', title: 'Company Funding Max' },
      { id: 'CompanyFundingMin', title: 'Company Funding Min' },
      { id: 'CompanyID', title: 'Company ID' },
      { id: 'CompanyIndustry', title: 'Company Industry' },
      { id: 'CompanyIntent', title: 'Company Intent' },
      { id: 'CompanyList', title: 'Company List' },
      { id: 'CompanyNaicsCode', title: 'Company Naics Code' },
      { id: 'CompanyName', title: 'Company Name' },
      { id: 'CompanyPostalCode', title: 'Company Postal Code' },
      { id: 'CompanyPubliclyTraded', title: 'Company Publicly Traded' },
      { id: 'CompanyRegion', title: 'Company Region' },
      { id: 'CompanyRevenue', title: 'Company Revenue' },
      { id: 'CompanyRevenueMax', title: 'Company Revenue Max' },
      { id: 'CompanyRevenueMin', title: 'Company Revenue Min' },
      { id: 'CompanySicCode', title: 'Company Sic Code' },
      { id: 'CompanySize', title: 'Company Size' },
      { id: 'ExcludeCompanySize', title: 'Exclude Company Size' },
      { id: 'CompanySizeMax', title: 'Company Size Max' },
      { id: 'ExcludeCompanySizeMax', title: 'Exclude Company Size Max' },
      { id: 'CompanySizeMin', title: 'Company Size Min' },
      { id: 'ExcludeCompanySizeMin', title: 'Exclude Company Size Min' },
      { id: 'CountryCode', title: 'Country Code' },
      { id: 'EducationLevel', title: 'Education Level' },
      { id: 'EmailStatus', title: 'Email Status' },
      { id: 'ExcludeEmailStatus', title: 'Exclude Email Status' },
      { id: 'Gender', title: 'Gender' },
      { id: 'JobFunction', title: 'Job Function' },
      { id: 'ExcludeJobFunction', title: 'Exclude Job Function' },
      { id: 'JobTitle', title: 'Job Title' },
      { id: 'ExcludeJobTitle', title: 'Exclude Job Title' },
      { id: 'LocationType', title: 'Location Type' },
      { id: 'PhoneStatus', title: 'Phone Status' },
      { id: 'ProfileImage', title: 'Profile Image' },
      { id: 'School', title: 'School' },
      { id: 'ExcludeSkills', title: 'Exclude Skills' },
      { id: 'State', title: 'State' },
      { id: 'WorkEmail', title: 'Work Email' },
      { id: 'ExcludeWorkEmail', title: 'Exclude Work Email' },
      { id: 'YearsExperience', title: 'Years Experience' },
      { id: 'YearsExperienceMax', title: 'Years Experience Max' },
      { id: 'YearsExperienceMin', title: 'Years Experience Min' }
    ]
  });

  // Formatting the session data into the expected structure for CSV
  const formattedData = profiles.map(profile => ({
    Name: (profile.name || '').padEnd(20, ' '), // Padding example
    CurrentEmployer: (profile.current_employer || '').padEnd(20, ' '),
    LinkedInURL: profile.linkedin_url || '',
    Email: profile.teaser.emails || '',
    Location: profile.location || '',
    CurrentTitle: profile.current_title || '',
    Skills: profile.skills || '',
    BirthYear: profile.birth_year || '',
    City: profile.city || '',
    CompanyCity: profile.companyCity || '',
    CompanyCountryCode: profile.country_code || '',
    CompanyDomain: profile.current_employer_domain || '',
    CompanyEmail: profile.CompanyEmail || '',
    CompanyFundingMax: profile.CompanyFundingMax || '',
    CompanyFundingMin: profile.CompanyFundingMin || '',
    CompanyID: profile.CompanyID || '',
    CompanyIndustry: profile.CompanyIndustry || '',
    CompanyIntent: profile.CompanyIntent || '',
    CompanyList: profile.CompanyList || '',
    CompanyNaicsCode: profile.CompanyNaicsCode || '',
    CompanyName: profile.CompanyName || '',
    CompanyPostalCode: profile.CompanyPostalCode || '',
    CompanyPubliclyTraded: profile.CompanyPubliclyTraded || '',
    CompanyRegion: profile.CompanyRegion || '',
    CompanyRevenue: profile.CompanyRevenue || '',
    CompanyRevenueMax: profile.CompanyRevenueMax || '',
    CompanyRevenueMin: profile.CompanyRevenueMin || '',
    CompanySicCode: profile.CompanySicCode || '',
    CompanySize: profile.CompanySize || '',
    ExcludeCompanySize: profile.ExcludeCompanySize || '',
    CompanySizeMax: profile.CompanySizeMax || '',
    ExcludeCompanySizeMax: profile.ExcludeCompanySizeMax || '',
    CompanySizeMin: profile.CompanySizeMin || '',
    ExcludeCompanySizeMin: profile.ExcludeCompanySizeMin || '',
    CountryCode: profile.countryCode || '',
    EducationLevel: profile.EducationLevel || '',
    EmailStatus: profile.EmailStatus || '',
    ExcludeEmailStatus: profile.ExcludeEmailStatus || '',
    Gender: profile.Gender || '',
    JobFunction: profile.JobFunction || '',
    ExcludeJobFunction: profile.ExcludeJobFunction || '',
    JobTitle: profile.jobTitle || '',
    ExcludeJobTitle: profile.ExcludeJobTitle || '',
    LocationType: profile.LocationType || '',
    PhoneStatus: profile.PhoneStatus || '',
    ProfileImage: profile.profileImage || '',
    School: profile.school || '',
    ExcludeSkills: profile.ExcludeSkills || '',
    State: profile.state || '',
    WorkEmail: profile.WorkEmail || '',
    ExcludeWorkEmail: profile.ExcludeWorkEmail || '',
    YearsExperience: profile.years_experience || '',
    YearsExperienceMax: profile.YearsExperienceMax || '',
    YearsExperienceMin: profile.YearsExperienceMin || ''
  }));


  // Write data to CSV file
  csvWriter.writeRecords(formattedData)
    .then(() => {
      console.log('CSV file written successfully');
      // Send the CSV file to the client for download
      res.download('exported_data.csv');
    })
    .catch(error => {
      console.error('Error writing CSV file:', error);
      res.status(500).send('Error exporting data');
    });
};



