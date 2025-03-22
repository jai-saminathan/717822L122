import express from "express";
import cors from "cors";
import axios from "axios";

const app=express();
const PORT=4000;
const WINDOW_SIZE=10;
const numberStore=[];

const API_URLS = {
  p: "http://20.244.56.144/numbers/primes",
  f: "http://20.244.56.144/numbers/fibonacci",
  e: "http://20.244.56.144/numbers/even",
  r: "http://20.244.56.144/numbers/random"
};
app.use(cors()); 
const fetchNumbers = async (numberid)=>{
  if (!API_URLS[numberid]) return [];
  try {
    const controller = new AbortController();
    const timeout=setTimeout(()=>controller.abort(), 500); 
    const response=await axios.get(API_URLS[numberid],{signal:controller.signal });
    clearTimeout(timeout);
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:");
    return [];
  }
};
const updateNumbers=(newNumbers) => {
  newNumbers.forEach(num=>{
    if (!numberStore.includes(num)) {
      numberStore.push(num);
      if (numberStore.length>WINDOW_SIZE)numberStore.shift();
    }
  });
};
app.get("/numbers/:numberid", async(req,res)=>{
  const{numberid}=req.params;
  if (!["p","f","e","r"].includes(numberid)) {
    return res.status(400).json({error: "Invalid number ID"});
  }
  const newNumbers=await fetchNumbers(numberid);
  updateNumbers(newNumbers);
  const average=numberStore.length
    ? (numberStore.reduce((sum, num) => sum + num, 0) / numberStore.length).toFixed(2)
    : 0;
  res.json({
    numbers: numberStore,
    average: parseFloat(average)
  });
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
