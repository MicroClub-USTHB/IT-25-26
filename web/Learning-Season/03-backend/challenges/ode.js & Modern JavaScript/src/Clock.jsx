import { useState,useEffect } from "react";

export default function Clock({setCursorText}){
const [time,setTime]=useState(new Date());

useEffect(()=>{
  const interval =setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(interval);
},[])


const format = (n) => String(n).padStart(2, "0");
const Hour = format(time.getHours());
const Minute = format(time.getMinutes());
const Second = format(time.getSeconds());


return(





    <>
    <div onMouseEnter={()=>setCursorText(`${Hour}:${Minute}`)} onMouseLeave={()=>{setCursorText('MAWAKIT')}}
     className="Clock  bg-[url(/HR-26.jpg)]
        bg-cover bg-center bg-no-repeat w-4/5 h-[350px] object-cover flex justify-center
         items-center  rounded-2xl shadow-2xl shadow-amber-50/[0.3]
         p-8 transition-all z-40
          border-2 border-amber-50/[0.2]  duration-500 cursor-pointer
          hover:translate-y-[-10px] ">
 

          <h1 className=" font-light text-amber-100 text-4xl p-3 
          font-mono text-center  border-2 rounded-2xl border-amber-100
           bg-amber-50/[0.3] backdrop-blur-[2px] shadow-amber-50/[0.4] shadow-2xl
            sm:text-8xl" >{Hour}:{Minute}:{Second}</h1>

          </div>
    
    </>
)
}