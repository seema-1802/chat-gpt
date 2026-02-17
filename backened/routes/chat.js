
import express from 'express';
import Thread from "../models/Thread.js"
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

router.post("/test", async (req, res) => {

    try {
        const thread = new Thread({
            threadId: "xyz",
             user: req.user._id,
            title: "testing new thread",
        });
        const response = await thread.save();
        res.send(response);
    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.get("/thread", async (req, res) => {

    try {
     const thread = await Thread.find({user: req.user._id }).sort({ updatedAt: -1 }); 
        //
        res.json(thread);

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


router.get("/thread/:threadId", async (req, res) => {
const{ threadId }= req.params;
    try {

          const thread = await Thread.findOne({ threadId }); 

        if (!thread) {
            res.status(404).send({ error: "thread is not found" });
        }
        res.json(thread.messages);

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {

    const { threadId } = req.params;
    try {

        const deletedthread = await Thread.findOneAndDelete({ threadId, user: req.user._id  });
        if (!deletedthread) {
            res.status(404).send({ error: "thread is not found" });
        }

        res.status(200).send({ success: "thread is deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});




router.post("/chat", async (req, res) => {
  const { threadId, messages } = req.body;

  if (!threadId || !messages) {
    return res.status(400).send({ error: "threadId and messages are required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    // If thread doesn't exist, create new
    if (!thread) {
      thread = new Thread({
        threadId,
        title: messages,
        messages: [{ role: "user", content: messages }],
      });
    } else {
      thread.messages.push({ role: "user", content: messages });
    }

    
    const assistantReply = await getOpenAIAPIResponse(messages);
    

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = Date.now();
    await thread.save();

    return res.status(200).json({ reply: assistantReply });

  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;

































































































// router.post("/chat", async (req, res) => {
//   const { threadId, message } = req.body;

//   if (!threadId || !message) {
//     return res.status(400).send({ error: "threadId and messages are required" });
//   }

//   try {
//     let thread = await Thread.findOne({ threadId });

//     if (!thread) {
//       thread = new Thread({
//         threadId,
//         title: message,
//         messages: [{ role: "user", content: message }],
//       });
//     } else {
//       thread.messages.push({ role: "user", content: messages });
//     }

//     const assistantReply = await getOpenAIAPIResponse(messages);

//     thread.messages.push({ role: "assistant", content: assistantReply });
//     thread.updatedAt=Date.now;
//     await thread.save();
//     res.json({reply:assistantReply});

//     res.status(200).json(thread);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// });

