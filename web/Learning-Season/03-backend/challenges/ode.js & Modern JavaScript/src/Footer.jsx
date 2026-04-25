 export default function Footer({setCursorText}){
return(

    <>
     <footer onMouseEnter={()=>{setCursorText('Powered by ayoub')}} onMouseLeave={()=>setCursorText('MAWAKIT')}
      className="w-full relative bottom-0 text-center py-4  text-sm text-amber-100 ">
      Powered by <span className="font-semibold text-amber- text-md">Ayoub</span>
    </footer>
    </>
)
}
