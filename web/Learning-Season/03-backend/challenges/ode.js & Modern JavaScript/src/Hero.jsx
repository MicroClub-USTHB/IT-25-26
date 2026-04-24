import Card from './Card'
import Clock from './Clock'
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useContext } from 'react';
import { timeContext } from './timeContext';



gsap.registerPlugin(ScrollTrigger);


export default function Hero({setCursorText}){

const {timeList,setTime}=useContext(timeContext);

    const containerRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".card");
  let index=200;
    cards.forEach((card) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 50%",
          end: "bottom top",
          scrub: true,
        },
        y: -index-50, // يطلع لفوق
        scale: 0.90,
      });
     index-=70;} 
);
  }, []);








    return(

        <> 
        <div  ref={containerRef}  className="hero mt-30 flex justify-center items-center flex-col 
        gap-5 w-full pb-60 z-0" >

        <Clock setCursorText={setCursorText}/>
      
        <Card  salat="الفجر" time={timeList.Fajr} setCursorText={setCursorText}   />

         <Card salat="الظهر" time={timeList.Dhuhr} setCursorText={setCursorText}  />

          <Card salat="العصر" time={timeList.Asr} setCursorText={setCursorText}  />

           <Card salat="المغرب" time={timeList.Maghrib} setCursorText={setCursorText} />

            <Card salat="العشاء"time={timeList.Isha} setCursorText={setCursorText} />
        
        </div>
       
        </>
    )
}