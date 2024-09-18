const axios = require('axios');

// Function to get access token from Lilly Translate API
async function getAccessToken() {
  const tokenUrl = 'https://login.microsoftonline.com/18a59a81-eea8-4c30-948a-d8824cdc2580/oauth2/v2.0/token';
  
  const body = new URLSearchParams({
    'grant_type': 'client_credentials',
    'client_id': '0b3epair_8c6f59b48b614e6abfa58c885e5b485b8c70-10ff-4f1f-9e0d-b5bcbd03d117',  // Replace with your actual client_id
    'client_secret': '5Xg8Q~q_u~yw0QqTilHLDQqq7G7toymlbrR3EdcV',  // Replace with your actual client_secret
    'scope': 'api://translate.lilly.com/.default'
  });

  try {
    const response = await axios.post(tokenUrl, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Unable to get access token');
  }
}

// Function to call Lilly Translate API for text translation
async function translateText(srcText, sourceLang, targetLang, accessToken) {
  const translateUrl = 'https://gateway.apim.lilly.com/translate/api/textingest-01-prod';
  
  const body = {
    "userId": "your_user_id",  // Set your userId
    "userCountry": "United States",
    "sourceLang": sourceLang,
    "targetLang": targetLang,
    "cci": "green",
    "srcText": srcText
  };

  try {
    const response = await axios.post(translateUrl, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Error during translation:', error);
    throw new Error('Translation failed');
  }
}

// Define the bot logic and event handling
module.exports = {
  botId: "translate-bot-id",  // Replace with the bot ID you registered in Kore.ai
  botName: "TranslateBot",

  on_message: async function (message, context) {
    try {
      // Fetch user language from the bot context
      const userLang = context.getBotVariable('userLanguage');  // Assuming userLanguage is stored here
      const accessToken = await getAccessToken();  // Fetch access token from Lilly Translate API

      // Translate the user message to English
      const translatedQuery = await translateText(message.messagePayload.content.text, userLang, 'en', accessToken);

      // TODO: Process the translated query in English and get the bot's response
      const botResponseInEnglish = await processBotQuery(translatedQuery);  // Simulated bot logic in English

      // Translate the bot's response from English back to the user's language
      const finalResponse = await translateText(botResponseInEnglish, 'en', userLang, accessToken);

      // Send the translated response back to the user
      context.sendMessage(finalResponse);

    } catch (error) {
      console.error('Error handling message:', error);
      context.sendMessage("Sorry, there was an issue processing your request.");
    }
  }
};

// Simulated bot logic function for processing translated queries
async function processBotQuery(query) {
  // Simulate the processing of a query (this is where the bot's actual response logic would go)
  return `This is the bot's response to: "${query}"`;  // Placeholder response
}
