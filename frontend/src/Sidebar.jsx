import './Sidebar.css';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { BACKEND_URL } from "./MyContext";

import MyContext from './MyContext';
import { useContext, useEffect } from 'react';

const Sidebar = () => {
  const { allThreads, setAllThreads, prevChats, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats , user ,sidebarOpen, setSidebarOpen,} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");


  useEffect(() => {
    getAllThreads();
  }, []);

   const getAllThreads = async () => {
     setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/thread`);
;
      const res = await response.json();
      const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      
      setAllThreads(filterData);

    }
    catch (err) {
      console.log(err);
    }finally {
    setLoading(false);
  }
  }


  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
   setCurrThreadId(uuidv4());
    getAllThreads();
setSidebarOpen(false);

    setPrevChats([]);
  }


  const changeThread = (async (newThreadId) => {
    setSidebarOpen(false);

    setCurrThreadId(newThreadId);
 setReply(null); 
    try {
      const response = await fetch(`${BACKEND_URL}/api/thread/${newThreadId}`);
;
      const res = await response.json();
      
      setPrevChats(res);
      setNewChat(false);
    }
    catch (err) {
      console.log(err);
    }

  });

const deleteThread = async (threadId) => {
   const confirmDelete = window.confirm("Delete this chat?");
  if (!confirmDelete) return;
  try {
    const response = await fetch(`${BACKEND_URL}/api/thread/${threadId}`, {
      method: 'DELETE'
    });

    const res = await response.json();
    
    setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));

    if(threadId===currThreadId){
      createNewChat();
    }
  } catch (err) {
    console.error('Error deleting thread:', err);
  }
};


  return (
    <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>

{loading && <p>Loading chats...</p>}

      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src='src/assets/chat_gpt_logo.png.jpg' alt='chat logo' className='logo'></img>
      
 <input
  type="text"
  placeholder="Search chat..."
    value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>
 

 {loading ? (
    <p>Loading chats...</p>
  ) : (
      <ul className='history'>
        {allThreads?.filter(thread =>
    thread.title?.toLowerCase().includes(search.toLowerCase())
  )
  .map((thread, idx) => (
        <li
  key={thread.threadId}
  onClick={() => changeThread(thread.threadId)}

  
  className={thread.threadId === currThreadId ? "highlighted" : ""}
>

            {thread.title.slice(0, 20)}

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); 
                deleteThread(thread.threadId); 
              }}
            ></i>
          </li>

        ))}
      </ul>
  )}

      <div className='sign'>
       <p>
  {user ? `By ${user.Name} ❤️` : "Welcome ❤️"}
</p>

       </div>



      

    </section>
  )
}

export default Sidebar