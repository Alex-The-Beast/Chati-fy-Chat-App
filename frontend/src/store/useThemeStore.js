import { create } from "zustand";

export const useThemeStore =create((set)=>({
    theme:localStorage.getItem("chat-theme" )|| "coffee",
    
    setTheme: (theme)=>{
        localStorage.setItem("Chat-theme",theme);
        set({theme})}
}))