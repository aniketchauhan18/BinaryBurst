import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import { io } from "socket.io-client"
import { 
  Input
 } from '@chakra-ui/react'

function Chats() {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomUsers, setRoomUsers] = useState([]);
  const messagesRef = useRef();

  const socketRef = useRef(); //By using useRef, you're telling React to keep the socket connection in memory across re-renders

  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');
  const room = params.get('room');


  // message from server
  useEffect(() => {
    const messageHandler = (message) => {
      setSentMessages(prevSentMessages => [...prevSentMessages, message]);
    }
    socketRef.current = io("http://localhost:3000");
    socketRef.current.on('message', messageHandler)
    socketRef.current.emit('joinRoom', {username, room})

    // get room and users
    socketRef.current.on(('roomUsers'), ({room, users}) => {
      setRoomName(room);
      setRoomUsers(users);
    })
    console.log(username, room)

    return () => {
      socketRef.current.off('message', messageHandler)
    }
  }, [])

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  
  })


  console.log(sentMessages)
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "") return;
    // emitting a message to the server
    socketRef.current.emit('chatMessage', message);
    // console.log(sentMessages)
    setMessage("");
  }
  
  return (
    <div className='bg-zinc-900 h-full flex justify-center items-center text-black chats'>
      <div className='flex flex-col border m-3 h-screen w-full m-3 rounded mb-20'>
        <div className='flex p-3 justify-between items-center'>
          <div className='text-4xl text-white chat-room-title'>
            CHAT ROOMS
          </div>
          <Link 
            to={'/groups'}
            className='bg-zinc-300 p-3 rounded hover:bg-zinc-700 hover:text-white transition duration-300 ease-in-out leave-btn'
          >
            Leave Room
          </Link>
        </div>
        <div className='h-full p-3 flex gap-3'>
          <div className='w-1/5 bg-zinc-300 h-full p-1 rounded'>
            <div className='flex justify-start bg-zinc-900 text-white p-2 rounded mb-10'>
              {roomName}
            </div>
            <div className='flex flex-col justify-start text-black p-2 rounded bg-zinc-200'>
              <div className='bg-zinc-900 text-white p-2 rounded text-xl '>
                Users
              </div>
              <div className='mt-2'>
                {roomUsers.map((user, index) => {
                  return (
                    <div key={index} className='bg-zinc-500 text-white  p-2 rounded mt-2'>
                      {user.username}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div 
            className='w-4/5 h-full p-2 flex flex-col justify-end rounded-md'
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1494768788897-7fdaa00de2a1?q=80&w=1638&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
              backgroundSize: 'cover'
            }}
          >
            <div
              style={{
                backdropFilter: 'blur(100px)'
              }}
            >
              <div 
                className='overflow-y-auto max-h-96 'ref={messagesRef}
              >
                {sentMessages.map((message, index) => {
                  return (
                    <div key={index} className='bg-gray-50 bg-opacity-30 text-white p-2 rounded-md m-2 flex flex-col justify-between'>
                      <div 
                        className='flex gap-1'
                        
                      >
                        <span className='text-zinc-300'>
                          {message.username}:
                        </span>
                        <div>
                          {message.text}
                        </div>
                      </div>
                      <div className='h-1/5  inline-block py-0.5 px-1 rounded text-sm self-end'>
                        {message.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <form 
              className='items-center w-full justify-end flex'
              onSubmit={handleSubmit}
            >
              <Input 
                className='border-2 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-transparent justify-end w-full text-black'
                placeholder='Enter message...'
                value={message}
                onChange={handleMessageChange}
                variant='flush'
              />
              <button 
                className='w-1/6 bg-zinc-500 m-2 px-2 rounded-md py-2 hover:text-black hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition duration-300 ease-in-out flex justify-center items-center text-white text-md rounded-md '
                type='submit'
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats