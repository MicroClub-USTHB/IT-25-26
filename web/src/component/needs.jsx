import React, {useState} from 'react'

export  function useNeeded()
{ 
  const [chart, setChart] = useState([])
  const [cart, setCart] = useState({});


  
  const addToChart = (product) => {
     
    setChart([...chart, product]);
  }

  // Retirer un produit du panier
  const removeFromChart = (product) => {

    setChart(chart.filter((item) => item.id !== product.id));
  }
 const add = (product) => {
  setCart(prev => {
    const currentQty = prev[product.id] || 1;

    if (currentQty >= product.Stock) {
      return prev; // on ne change rien
    }

    return {
      ...prev,
      [product.id]: currentQty + 1
    };
  });
};
const substract = (product) => {
  setCart(prev => {
    const currentQty = prev[product.id] || 1;

    if (currentQty <= 0) {
      return prev;
    }

    return {
      ...prev,
      [product.id]: currentQty - 1
    };
  });
};
    return { chart,cart, addToChart, removeFromChart,add,substract}
}

// des fonctions que j utilisait fplusieur component 7tithom hna bch ma n93dch n3wd nktbhom