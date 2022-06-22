const app = require('express')(); 
const express = require('express');
const PORT = 5000;
const { MongoClient } = require("mongodb");
require('dotenv').config();

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

app.use(express.json());

app.post('/data', (req, res)=>{ //POST REQUEST
   async function run_p() {
     try {
      await client.connect();
        const database = client.db('monitoring');
        const bierz = await database.collection("info").updateOne({"Hostname" : req.body.Hostname},{$set : req.body}, {upsert : true});
      }
      finally {
        await client.close();
        res.status(200).send({message: `OK, hostname: ${req.body.Hostname}`});
        console.log(`Updated: ${req.body.Hostname}`)
      }
    }
    run_p().catch(console.dir);
});

app.get('/data/:hostname', (req,res)=>{ //GET REQUEST
    const { hostname } = req.params;
    var data;
    async function run_g() {
      try {
       await client.connect();
          const database = client.db('monitoring');
          data = await database.collection("info").findOne({"Hostname" : hostname});
          console.log(data);
       }
       finally {
         await client.close();
         res.status(200).send(data);
       }
     }
     run_g().catch(console.dir);
});

app.listen(PORT,'192.168.0.104', err => {
  if (err){
    console.log("Something is no yes ", err)
    return;
  }
  console.log(`Działa, port: ${PORT}`)
});