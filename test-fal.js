const { fal } = require('@fal-ai/client');

fal.config({ credentials: "fake_key_123" });

async function test() {
  try {
    const result = await fal.subscribe('fal-ai/whisper', {
      input: {
        audio_url: "https://storage.googleapis.com/falserverless/model_tests/whisper/dinner_conversation.mp3",
        task: 'transcribe',
        language: 'tr',
        chunk_level: 'none'
      }
    });
    console.log(result.data);
  } catch (err) {
    console.error('Error Status:', err.status);
    console.error('Error Body:', JSON.stringify(err.body, null, 2));
    console.error('Message:', err.message);
  }
}

test();
