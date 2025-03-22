const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
let numbers = [];
const windowSize = 10;

app.get("/numbers",(req,res)=>{
  const newNumber = Math.floor(Math.random() * 15) * 2 + 2;
  numbers.push(newNumber);
  if (numbers.length > windowSize) {
    numbers.shift();
  }
  const midIndex = Math.floor(numbers.length / 2);
  const windowPrevState = numbers.slice(0, midIndex);
  const windowCurrState = numbers.slice(midIndex);
  const avg = (numbers.reduce((sum, num) => sum + num, 0) / numbers.length).toFixed(2);
  res.json({
    windowPrevState,
    windowCurrState,
    numbers,
    avg: parseFloat(avg),
  });
});

const PORT = 4000;
app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});

