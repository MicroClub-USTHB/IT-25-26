
function Card({salat,time,setCursorText}) {


 
  const HnadleMouseLeave=()=>setCursorText("MAWAKIT")
 

 
  return (
  <>
      <div onMouseEnter={()=>{setCursorText(time+" "+salat)}}  onMouseLeave={HnadleMouseLeave}  className=" card sticky top-[350px] bg-[url(/HR-18.jpg)]
        bg-cover bg-center bg-no-repeat w-[320px] h-[250px] object-cover flex justify-center
         items-end flex-col rounded-2xl shadow-2xl shadow-amber-50/[0.3]
         p-8 transition-all sm:w-[720px] z-40
          border-2 border-amber-50/[0.2]  duration-500 cursor-pointer
          ">
        <div className="salat font-extrabold text-4xl sm:text-5xl font-mono text-amber-100  ">صلاة:{salat} </div>
        <br />
        <div className="time w-full">
             <p className="font-bold text-3xl sm:text-3xl text-amber-100 font-mono text-end ">:الأذان</p>
           <h1 className="font-light text-4xl text-amber-100  font-normal text-center sm:text-7xl">{time}</h1>
          
        </div>
      </div>
  
  </>
  );
}

export default Card;
