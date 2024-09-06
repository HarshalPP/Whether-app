const OpenAI = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

exports.createCompletion = async (req, res) => {
  try {
    const { msg } = req.body;
   console.log(msg)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
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
