import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });

      //currently  i am in 2:45 tomorrow my goal is to complete this project i had created socket server in backend also so take a look ont that then proceed further by good night.
      
    }
  },

  getMessages:async (userId)=>{
    set({isMessagesLoading:true})
    try{
      const res=await axiosInstance.get(`/messages/${userId}`)
      set({messages:res.data})
      

    }catch(error){
      toast.error(error.response.data.message)

    }
    finally{
      set({isMessagesLoading:false})
    }
  },

  sendMessage:async (messageData)=>{
    const {selectedUser,messages}=get()
    try{
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
      set({messages:[...messages,res.data]})

    }catch(error){
      toast.error(error.response.data.message)
      


    }
    // finally{

    // }

  },

  subscribeToMessages:()=>{
    const {selectedUser}=get()
    if(!selectedUser) return 

    const socket=useAuthStore.getState().socket
    socket.on("newMessage",(newMessage)=>{

      const isMessageSentFromSelectedUser=newMessage.senderId === selectedUser._id
      if(!isMessageSentFromSelectedUser) return 
      set({messages:[...get().messages,newMessage],})
    })
  },

  unSubscribeFromMessages:()=>{
    const socket=useAuthStore.getState().socket
    socket.off("newMessage")
  },

 
  setSelectedUser:(selectedUser)=>set({selectedUser

  })
}));