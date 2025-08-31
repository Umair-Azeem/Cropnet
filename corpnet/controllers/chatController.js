// // controllers/chatController.js
// const { HfInference } = require('@huggingface/inference');
// const hf = new HfInference(process.env.HF_API_KEY);

// exports.chat = async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message || !message.trim()) {
//       return res.status(400).json({
//         success: false,
//         reply: 'Please send a message to chat.'
//       });
//     }

//     // Call Hugging Face API
//     const result = await hf.chatCompletion({
//       model: "mistralai/Mistral-7B-Instruct-v0.2",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: message }
//       ],
//       max_tokens: 256
//     });

//     const reply = result.choices?.[0]?.message?.content || "No reply generated.";
//     res.json({ success: true, reply });
//   } catch (err) {
//     console.error("Hugging Face chat error:", err);
//     res.status(500).json({
//       success: false,
//       reply: 'Something went wrong with Hugging Face API.'
//     });
//   }
// };
