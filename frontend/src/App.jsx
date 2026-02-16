import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './Sidebar'
import Chat from './Chat'
import ChatWindow from './ChatWindow'
import MyContext from './MyContext'
import { v4 as uuidv4 } from 'uuid';
import Signup from './Signup';



function App() {

  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState(null);
  const [currThreadId,setCurrThreadId]=useState(uuidv4());
  const [prevChats,setPrevChats]=useState([]);
  const [newChat, setNewChat] = useState(true);  // instead of []
  const [allThreads,setAllThreads]=useState([]);
const [user, setUser] = useState(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);


useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId, setCurrThreadId,   
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
      user, setUser, 
      sidebarOpen, setSidebarOpen,
  }; // passing values

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
       {!user ? (
   <Signup setUser={setUser} />
) : (
  <>
  <div className="appLayout">
   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <ChatWindow setSidebarOpen={setSidebarOpen} />
    </div>
  </>
)}

      </MyContext.Provider>
    </div>
  );
}

export default App
