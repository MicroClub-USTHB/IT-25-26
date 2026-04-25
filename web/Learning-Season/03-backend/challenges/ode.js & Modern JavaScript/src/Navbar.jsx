
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import Button from '@mui/material/Button';
import axios from 'axios'
import { useContext,useEffect } from 'react';
import { timeContext } from './timeContext';



export default function Navbar({open,setOpen,setCursorText}) {


const {timeList,setTime}=useContext(timeContext);

  async function  getLocalisation  () {
   navigator.geolocation.getCurrentPosition(
    (position) => {
       getTime(position.coords.latitude,position.coords.longitude)
    },
    (error) => {
      console.log("Error:", error);
    }
  );

}

async function getTime(latitude,longitude){
const date=new Date();
const day =date.getDate()
const month =date.getMonth()+1
const year =date.getFullYear()
console.log(day ,month, year)

   const response=await axios.get(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}`,{
    params:{
    latitude: latitude,
    longitude: longitude,
    method: '19',
    shafaq: 'general',
    tune: '5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6',
    school: '0',
    midnightMode: '0',
    timezonestring: 'Africa/Algiers',
    latitudeAdjustmentMethod: '1',
    calendarMethod: 'UAQ',
    iso8601: 'false'
    }
 })

setOpen(true)
  const timings=response.data.data.timings;
  setTime(timings)
}

 const HnadleMouseEnter={
  enter:()=>{setCursorText("تحديد تلقائي")},
  leave:()=>{setCursorText("MAWAKIT")}
 }






  return (
    <>
      <div className="navbar fixed top-3 left-1/2 -translate-x-1/2    z-50  p-6 border-amber-100 border-2 bg-amber-50/[0.3] backdrop-blur-md shadow-amber-50/[0.2] shadow-xl w-11/12
        rounded-2xl flex justify-between items-center">

        <div className="logo flex justify-start items-center gap-4 ">
          
            <h2 className="text-4xl text-amber-100 font-medium font-mono " >MAWAKIT</h2>
        </div>
        <div className="country flex justify-start items-center gap-4">
      <Button onClick={getLocalisation} variant="outlined" endIcon={ <GpsNotFixedIcon/>} size='large' sx={{color:'#fef3c7',borderColor:'#fef3c7'}}
        onMouseEnter={HnadleMouseEnter.enter} onMouseLeave={HnadleMouseEnter.leave} >auto</Button>
         
        </div>




      </div>
    </>
  )
}