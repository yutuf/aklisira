const supabaseUrl = "https://elumzkgrgpldnuxpskgz.supabase.co";
const supabaseKey = "sb_publishable_-I_KscRjNOt_6yu3wWzD2g_Tt6S6IGt";

fetch(`${supabaseUrl}/rest/v1/waitlist`, {
  method: "POST",
  headers: {
    "apikey": supabaseKey,
    "Authorization": `Bearer ${supabaseKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email: "test2@aklisira.com", name: "Test" })
})
.then(async r => {
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
})
.catch(console.error);
