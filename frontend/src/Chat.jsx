

import './Chat.css';
import React, { useEffect, useState, useContext, useRef } from 'react';
import MyContext from './MyContext';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

const Chat = () => {
  const { newChat, prevChats } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState("");
const chatEndRef = useRef(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [prevChats, latestReply]);

useEffect(() => {
  if (!prevChats?.length) return;

  const lastMessage = prevChats[prevChats.length - 1];

  // Animate only assistant message
  if (!lastMessage || lastMessage.role !== "assistant") return;

  if (!lastMessage.content) return;

  setLatestReply(""); // reset animation

  const content = lastMessage.content.split(" ");
  let idx = 0;

  const interval = setInterval(() => {
    setLatestReply(content.slice(0, idx + 1).join(" "));
    idx++;
    if (idx >= content.length) clearInterval(interval);
  }, 40);

  return () => clearInterval(interval);
}, [prevChats]);

  return (
    <>
      {newChat && <h1 className='hi'>Start a New Chat</h1>}

      <div className='chats'>
        {prevChats?.map((chat, idx) => (
          <div key={idx} className={chat.role === "user" ? "userDiv" : "gptDiv"}>
            {chat.role === "user" ? (
              <p className='userMessage'>{chat.content}</p>
            ) : (
              <div className="markdown-body">
              <ReactMarkdown   rehypePlugins={[rehypeHighlight]}>
                {/* If it's the last assistant message, animate it */}
                {idx === prevChats.length - 1 ? latestReply : chat.content}
              </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
