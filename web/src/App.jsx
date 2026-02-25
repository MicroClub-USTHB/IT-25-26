import React from "react";
import "./App.css";
import { useNeeded } from './component/needs';
import { Mychart } from './component/chart';
import { Routes, Route } from 'react-router-dom';
import { Magasin } from './component/magasin';
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'



export default function App() {
  const location = useLocation();
  const { chart,cart, addToChart, removeFromChart,add,substract } = useNeeded();

 
  return (
//pour switch bin chart ou products

    <> { location.pathname=="/" &&  
      <div className="link"> 
      <Link  to="/chart">my chart</Link></div>}
      { location.pathname=="/chart" &&  
      <div className="link">  
      <Link  to="/">see more products</Link></div>} 
      <Routes>
        <Route
          path='/'
          element={
            <Magasin
              chart={chart}
              addToChart={addToChart}
              removeFromChart={removeFromChart}
            /> //hna  on display les produit en passant chart et les fonction pour une utilisation nchofoha fle fichier
          }
        />
        <Route
          path='/chart'
          element={
            <Mychart chart={chart}  cart={cart} removeFromChart={removeFromChart} add={add} substract={substract}/> //same on passe la date b "chart" et la fct removefromchart 
          }
        />
      </Routes>
    </> //on utilise Routes bch n9dr n9ol quel fonction appliquer (quel componenent afficher ) 3la 7sab lroute li jbto localisation.pathname
  );
}