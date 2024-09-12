import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_645VRPT6U0hXVIjIDabeiDOb',
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    let assistantResponse = '';

    if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
      assistantResponse = lastMessage.content[0].text.value;
    } else {
      throw new Error('Unexpected response format from OpenAI');
    }

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error('Error in OpenAI assistant API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}