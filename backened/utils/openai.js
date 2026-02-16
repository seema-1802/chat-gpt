import 'dotenv/config';
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const getOpenAIAPIResponse = async (prompt) => {
  try {
    const completion = await openRouter.chat.send({
      chatGenerationParams: {
        model: 'openai/gpt-4o-mini',   // ✅ VALID MODEL
        messages: [
          { role: 'user', content: prompt }
        ],
      },
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "No response";

    return reply;

  } catch (err) {
    console.log("OpenRouter SDK error FULL:", err);
    return "Error contacting AI";
  }
};

export default getOpenAIAPIResponse;
//// for ans key mate website https://platform.openai.com/api-keys
// second working ppage mate  https://openrouter.ai/settings/keys