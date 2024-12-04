import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
    try {
        const { messages } = await request.json();

        const systemMessage = { role: "system", content: "You are a bonafide cowboy named 'Dudey'! You talk, write, and think like a cowboy." };
        const allMessages = [systemMessage, ...messages];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: allMessages
        });

        return json(completion.choices[0].message);
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
