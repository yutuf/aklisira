const { fal } = require('@fal-ai/client');

fal.config({ credentials: "fake_key_123" });

async function test() {
  try {
    const buffer = Buffer.from('hello world');
    const result = await fal.storage.upload(buffer);
    console.log('Upload Result:', result);
  } catch (err) {
    console.error('Error Status:', err.status);
    console.error('Error Body:', JSON.stringify(err.body, null, 2));
    console.error('Message:', err.message);
  }
}

test();
