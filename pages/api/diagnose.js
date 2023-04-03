import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const symptoms = req.body.symptoms || '';
  if (symptoms.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter valid symptoms",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(symptoms),
      temperature: 0.6,
      max_tokens: 2048, // <-- Set max_tokens to 2048
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(symptoms) {
  return `Think of yourself as a highly experienced doctor. Based on the symptoms provided, suggest the next steps that should be followed. Write your answer in first person
. I want your answer to be well formatted and it should always include,
1. The possible diagnosis
2. Additional questions to help to narrow down the diagnosis
3. Possible recommendations that a doctor might make.
4. Next steps that should be taken.
Format your response in a professional manner, with appropriate spacing, tabs and alignments.

Symptoms: ${symptoms}

Diagnosis:`;
}
