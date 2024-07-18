const Captcha = require('node-captcha-generator');
const client = require("../config/redis")

exports.getCaptcha = async (req, res) => {
    const captchaData = new Captcha({
        width: 150,
        height: 50,
        color: '#000', // text color
        background: '#fff', // background color
    });
    req.session.captcha = captchaData.value;
    console.log("Session after setting captcha:", req.session); // Log session
    res.status(200).json({
        data: captchaData
    });
};


exports.verifyCaptcha = async (req, res) => {
    const userCaptcha = req.body.captcha;
    console.log(req.session.captcha , "-------------->>>>>>>>>>>>>-------------<<<<<<<<<<<<<<<<<< ")
   
    if (userCaptcha === req.session.captcha) {
        res.status(200).json({
            message: 'CAPTCHA passed'
        });
    } else {
        res.status(500).json({
            message: 'CAPTCHA failed. Please try again.'
        });
    }
};



exports.getRendoomnumber = async (req, res) => {
    try {
      const redisKey = 'randomNumber';
  
      // Check Redis cache
      const cachedNumber = await client.get(redisKey);
      if (cachedNumber) {
        console.log('Received from Redis Server:', cachedNumber);
        return res.json({ number: parseInt(cachedNumber) });
      }
  
      // Calculate the number if not in cache
      let number = 0;
      for (let i = 0; i <= 233333456; i++) {
        number += i;
      }
      console.log('Calculated Number:', number);
  
      // Store in Redis cache
      await client.set(redisKey, number.toString());
  
      res.json({ number });
    } catch (error) {
      res.status(500).json(error.message);
    }
  };