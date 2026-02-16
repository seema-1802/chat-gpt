
import './ChatWindow.css';
import Chat from "./Chat.jsx"
import React, { useContext,useState } from 'react';
import MyContext from './MyContext'
import {ScaleLoader} from "react-spinners"
import { useEffect } from 'react';

import { BACKEND_URL } from "./MyContext";


function ChatWindow (){

  

  const {prompt,setPrompt,reply,setReply,currThreadId ,prevChats, setPrevChats,setNewChat ,  user, sidebarOpen, setSidebarOpen,}=useContext(MyContext);
  const [loading,setLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false);
const [showProfile, setShowProfile] = useState(false);

  const getReply=async()=>{
     if (!prompt.trim()) return; 
     if (!currThreadId) return;
     const userMessage = prompt;
    setLoading(true);
    setNewChat(false);  

    



    const options={
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
           messages:prompt,
           threadId:currThreadId,
      })

    };
    try{
      const response = await fetch(`${BACKEND_URL}/api/chat`, options);
      
      const res=await response.json();
       setPrevChats(prev => ([
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: res.reply }
    ]));

    setPrompt("");
      
      setReply(res.reply);

      //console.log(response);
    }catch(err){
      console.log(err);
      alert("Something went wrong. Try again.");
    }finally {
    setLoading(false);
    }
  }

//   //append new chat to prevChats
//   useEffect(() => {
//   if (reply !== null) {
    
//     setPrevChats(prev => ([
//       ...prev,
//       { role: "user", content: prompt },
//       { role: "assistant", content: reply }
//     ]));
//     setPrompt("");
//   }
// }, [reply]);


  const handleOnClick=()=>{
    setIsOpen(!isOpen);
  }

  const handleLogout = async () => {
     const confirmDelete = window.confirm("Do you really want to log out?");
  if (!confirmDelete) return;
  try {
    await fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
     
  } catch (err) {
    console.log("Logout error:", err);
   
  }

  // local storage clear
  localStorage.removeItem("user");

  // page reload (signup screen dikhane ke liye)
  window.location.href = "/";
};


  return (
     
     <div className='chatWindow'>
      <div className='navbar'>
        <span onClick={() => setSidebarOpen(true)} className="menuBtn">
    <i className="fa-solid fa-bars"></i>
  </span>

          <span>ALL know<i className='fa-solid fa-chevron-down' ></i></span>
         <div className='userIconDiv' onClick={handleOnClick}> 
  <span className='userIcon' ><i className="fa-solid fa-user"></i></span>
</div>
      </div>
      {
        isOpen&&
        <div className='dropDown'>
         <div
  className="dropDownItem"
  onClick={() => (window.location.href = "/")}
>
  <i className="fa-solid fa-circle-up"></i> signup
</div>

<div
  className="dropDownItem"
   onClick={() => setShowProfile(!showProfile)}
>
  <i className="fa-solid fa-gear"></i> userprofile
</div>

          <div className="dropDownItem"  onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>logout</div>
          </div>
      }
      <div className="chatBody">
        {showProfile ? (
    <div className="profileBox">
      <img
        src={user?.ProfileImage || "https://i.pravatar.cc/100"}
        alt="user"
        className="user-img"
      />
      <h3>{user?.Name}</h3>
      <p>{user?.Email}</p>
    </div>
  ) : (
    <Chat />
  )}
  
</div>

      {/* <ScaleLoader color='#fff' loading={loading}></ScaleLoader> */}
      {loading && (
  <div className="loaderWrapper">
    <ScaleLoader color="#49964c" />
     <p className="loadingText">Analyzing...</p>
  </div>
)}

      <div className='chatInput'>
        <div className='inputBox'>
        <input className="input"placeholder='Ask anything'
         value={prompt}
          disabled={loading} 
         onChange={(e)=> setPrompt(e.target.value)}
         onKeyDown={(e) => {
  if (e.key === "Enter" && !loading) {
    e.preventDefault();
    getReply();
  }
}}

        >

        </input>
         <div id='submit'  onClick={!loading ? getReply : null}> <i className="fa-solid fa-paper-plane se"></i></div>
        
       </div>
        <p className='info'>
          All Known can make mistakes.Check important info.See Cookie Preferences.
        </p>
      </div>
    </div>
     
  )
}

export default ChatWindow