import React, { useState } from 'react'
import './Vitrine.css'
 export default function Vitrine ({ product, chart, addToChart, removeFromChart}){
    const [stock, setStock] = useState(product.Stock);//je set ma data m products en utilisant un useState pour activer un render a chaque changement
    const dispo = product.Stock > 0;
    const check = chart.includes(product);//mdyorine pour des controle l omb3d

    const del = () => setStock(stock - 1);
    const add = () => setStock(stock + 1);//same juste de simple fonction pour gere le stock mm si en tant reel ajt l chart la yna9ass ma yzid stock

    return(
        <>{!check &&//hna g3 j utilise produit comme un objet defini f "data.js" pour passer les infos du produit actuel
            <div className="product"> 
                <h2>{product.name}</h2>
                <div className="container_product">
                    <img src={product.photo} alt={product.description} />
                    
                        <div className="container-infos">
                            <h3>{product.description}</h3>
                            <h3>{product.prix}€</h3>
                            <div className="bouton"> 
                            {dispo && !check && (
                              <button onClick={() => { del(); addToChart(product); }}>
                                🛒Add to chart
                              </button>
                            )}
                            
                            {!dispo && <h2>Sold Out</h2>}
                            
                            {check && (
                              <button onClick={() => { add(); removeFromChart(product); }}>
                                 🛒Remove from chart
                              </button>//qst de logique brk ki tkone nn dispo tetkteb non dispo sinon d apres tkone fel chart wla lala ama button ibane ou kol button wsh idir
                            )}</div>
                        </div>
                    
                </div>
            </div> }
        </> 
)}
