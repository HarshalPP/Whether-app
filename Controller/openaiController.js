const OpenAI = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: 'sk-proj-gxlmkJeO87jyHvb88d21T3BlbkFJu9af95fdHihURL7BtE9Q', // Replace with your actual API key
});

exports.createCompletion = async (req, res) => {
  try {
    const { msg } = req.body;
   console.log(msg)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: msg }],
      max_tokens: 100 // Example token limit, adjust as needed

    });

    console.log("Response is that",response)

    const completionText = response.data.choices[0].message.content;
    res.status(200).json({ message: "msg is Received", completion: completionText });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server error',
      error: error.message,
    });
  }
};
