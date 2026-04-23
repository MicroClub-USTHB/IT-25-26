const express = require('express'); 
const weatherRoutes = require('./routes/routes');
const app = express();              
const PORT = 3000;   
app.use(express.json());
app.use('/task',weatherRoutes);               
app.get('/', (req, res) => {
  res.send('lol');
});


app.listen(PORT, () => {
  console.log(`app rahi tsm3  http://localhost:${PORT}`);
});