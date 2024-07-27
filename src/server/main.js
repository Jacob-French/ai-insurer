import express from "express";
import ViteExpress from "vite-express";
import axios from "axios";

const app = express();
app.use(express.json());

const apiEndpoint = "https://api.openai.com/v1/chat/completions"
const apiKey = "sk-proj-dwW5d5Kwas258fWzwyFHT3BlbkFJA5eZzX0rkygVBf2vmHOq"

const headers = {
  headers: {
    "Content-Type" : "application/json",
    "Authorization" : `Bearer ${apiKey}`
  }
}

const systemMessage = `
  The user has a bank account where they put money aside to cover unexpected expenses. Your role is to help the user be disciplined about \
  when they take money out of this account. You will act a bit like an insurance company. If the user wants to take money out of their \
  insurance account for an unexpected expense, they will make a claim to you. The claim will specify the amount of money they wish to take \
  out and the reason for taking it out. You will then decide if this is an acceptable reason or not and if the amount is acceptable for the \
  reason. 

  The claim will have the following format:

  CLAIM AMOUNT: 
  $300
  REASON:
  example reason here.

  When making your decision, a good rule of thumb is that the claim should be to cover an unexpected expense. This could be a possession that \
  is broken and the user wants to repair or replace, a fine such as a parking fine or a speeding ticket, an unexpected bill, an unexpected \
  medical expense, and other things. Please keep in mind that the purpose of this insurance account is to take some stress away when the user \
  encounters expenses they did not plan for. The priority is the user's wellbeing so you should be sympathetic to their circumstances and \
  lenient when necessary. Keep an open mind and think about what is best for the user. don't be rigid.

  you will respond with some json data in the following format: 
  {
    "explanation" : "your explanation as to why you made your decision goes here",
    "decision" : "accept / deny"
  }

  below is an example of a response for the example claim I provided above:
  {
    "explanation" : "Your insurance account is intended to cover the cost of damaged items as this is an unexpected expense for you.",
    "decision" : "accept"
  }

  your response will not contain anything other than this json data. The data must be parsable by JSON.parse() with no errors.
`

const systemAppeal = `The user has made an appeal onYou chose to deny this claim and the user has made an appeal. The user will provide \
  additional information, context or arguments as to why they disagree with your decision.  You will now reconsider based on the same \
  criteria but taking this additional information into account. Your decision on this appeal will be final. The appeal will be formatted as \
  follows: 

  CLAIM AMOUNT: 
  $(amount goes here)
  REASON: 
  example reason
  RESPONSE: 
  this is how you responded when the user first made the claim
  APPEAL: 
  the user appeal providing additional information, context and arguments goes here
  
  you will respond with some json data in the following format:
  {
    "explanation" : "your explanation as to why you made your decision goes here",
    "decision" : "accept / deny"
  }

  below is an example of a response to an appeal:
  {
    "explanation" : "Given that your laptop was stolen, as you have now specified, you may cover the costs from your insurance account.",
    "decision" : "accept"
  }
  `

async function openAI(headers, body){
  try{
    const response = await axios.post(apiEndpoint, body, headers);
    return response.data.choices;
  }
  catch(error){
    error.log("there was an error connecting to open AI: ", error);
    return null;
  }
}

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});



app.post("/openAi/claim", async (req, res) => {
  const claim = req.body;
  
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {"role" : "system", "content" : systemMessage},
      {"role" : "user", "content" : "CLAIM AMOUNT:/n" + claim.amount + "/nCLAIM REASON:/n" + claim.reason}
    ],
    temperature: 0.9,
    max_tokens: 150
  }

  let responseData = null;

  try{
    const choices = await openAI(headers, body);
    responseData = JSON.parse(choices[0].message.content);
  }
  catch(error){
    console.error("error communicating with open ai: ", error)
    responseData = null;
  }

  res.send(JSON.stringify(responseData));
})



app.post("/openAi/appeal", async (req, res) => {
  const appeal=req.body;
  
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {"role" : "system", "content" : systemMessage},
      {"role" : "user", "content" : "CLAIM AMOUNT:/n" + appeal.amount + "/nCLAIM REASON:/n" + appeal.reason},
      {"role" : "system", "content" : systemAppeal},
      {"role" : "user", 
        "content" : "CLAIM AMOUNT:/n" 
        + appeal.amount 
        + "/nCLAIM REASON:/n" 
        + appeal.reason
        + "/nRESPONSE:/n"
        + appeal.assistantResponse
        + "/nAPPEAL:/n"
        + appeal.appeal
      }
    ],
    temperature: 0.9,
    max_tokens: 150
  }

  let responseData = null;

  try{
    const choices = await openAI(headers, body);
    responseData = JSON.parse(choices[0].message.content);
  }
  catch(error){
    console.error("error communicating with open ai: ", error)
    responseData = null;
  }

  res.send(JSON.stringify(responseData));
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
