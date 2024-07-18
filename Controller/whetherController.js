const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function run(ip) {
    console.log("Ip address in the run function:", ip);
    
    // Check for reserved IP addresses
    if (ip === '::1' || ip === '127.0.0.1') {
        return { message: 'Localhost IP address is not supported for geolocation.' };
    }

    // Load the profile
    const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');

    // Use the profile
    const result = await profile.getUseCase('IpGeolocation').perform(
        {
            ipAddress: ip,
        },
        {
            provider: 'ipdata',
            security: {
                apikey: {
                    apikey: process.env.IPDATA_API_KEY,
                },
            },
        }
    );

    // Handle the result
    try {
        const data = result.unwrap();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get IP geolocation data');
    }
}

exports.IpAddress = async (req, res) => {
    try {
        const ip = req.clientIp;
        const data = await run(ip);
        res.status(200).json({
            ipAddress: ip,
            geolocation: data
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}



async function findCity(ip) {
    // Load the profile
    const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');
  
    // Use the profile
    const result = await profile.getUseCase('IpGeolocation').perform(
      {
        ipAddress: ip,
      },
      {
        provider: 'ipdata',
        security: {
          apikey: {
            apikey: '9a511b6fc8334e1852cfbbd4ff3f1af3c42ed6abc75e96a1648b969a',
          },
        },
      }
    );
  
    // Handle the result
    try {
      const data = result.unwrap();
      return data;
    } catch (error) {
      console.error(error);
    }
  }



  exports.WhetherIp = async(req,res)=>{
    try{
        const city = await findCity(req.ip)
        res.send(await weather(city.addressLocality))

    }catch(error){
        res.status(500).json('Internal Server Error')
    }
  }

