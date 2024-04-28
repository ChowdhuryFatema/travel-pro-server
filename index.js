const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zxai2xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    
    const tourSpotsCollection = client.db("touristsSpotsDB").collection("touristsSpots");
    const countriesCollection = client.db("touristsSpotsDB").collection("countries");

    app.get('/touristsSpots', async(req, res) => {
        const result = await tourSpotsCollection.find().toArray();
        res.send(result) 
    })


    app.get('/touristsSpots/:email', async(req, res) => {
      const email = req.params.email;
      const query = {user_email: email}
      const result = await tourSpotsCollection.find(query).toArray();
      res.send(result);
  })

    app.get('/touristsSpot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourSpotsCollection.findOne(query);
      res.send(result)
    })



    app.post('/touristsSpots', async(req, res) => {
      const result = await tourSpotsCollection.insertOne(req.body);
      res.send(result);
  })


    app.put('/touristsSpot/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedDetails = req.body;

      
      const tourSpots = {
        $set: {
          country_Name: updatedDetails.country_Name,
          tourists_spot_name: updatedDetails.tourists_spot_name, 
          location: updatedDetails.location, 
          description: updatedDetails.description, 
          average_cost: updatedDetails.average_cost, 
          seasonality: updatedDetails.seasonality, 
          travel_time: updatedDetails.travel_time,
          totalVisitorsPerYea: updatedDetails.totalVisitorsPerYea,
          image: updatedDetails.image
        },
      };

      const result = await tourSpotsCollection.updateOne(filter, tourSpots, options);
      res.send(result);

    })


    app.delete('/touristsSpots/:id', async(req, res) => {
      const result = await tourSpotsCollection.deleteOne({_id: new ObjectId(req.params.id)})
      res.send(result);
    })


    app.get('/countries', async(req, res) => {
      const result = await countriesCollection.find().toArray();
      res.send(result) 
  })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("The server is running")
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
})