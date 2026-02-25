import React from 'react';

export function Mychart({ chart,cart, removeFromChart,add,substract }) {
  const total = chart.reduce((acc, product) => {
  const quantity = cart[product.id] || 0;
  return acc + product.prix * quantity;
}, 0);
  return (
    <div className="chart">
      <h1>My chart</h1>
      <p>{chart.length} products</p>
      {chart.map((val) => (
        
        <div className="product" key={val.id}>
          <h2>{val.name}</h2>
          <div className="container-product">
            <img src={val.photo} alt={val.description} />
            <div className="container-infos">
              <h3>{val.description}</h3>
              <h3>{val.prix}€</h3>
              <button onClick={() => removeFromChart(val)}>
                Remove from chart
              </button>
              <div className='adder'> 
              
              <button onClick={() =>  substract(val) }>
                _
              </button>
              <p className='number'> {cart[val.id] || 1} </p>
              
               <button onClick={() => add(val)}>
                +
              </button> 
              
              </div>
            </div>
          </div>
        </div>
      ))}
      { chart.length>0 && 
      <div>
        <h1 >
          Total
        </h1>
        <p className='number'> {total}€</p>
      </div>}
    </div>
  );
}