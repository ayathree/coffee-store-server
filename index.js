const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycbv1lf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)


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

    
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const coffeeUserCollection = client.db('coffeeDB').collection('coffeeUser');
    // read
    app.get('/coffee', async(req,res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    // update
    app.get('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result)
    })
    // create

    app.post('/coffee',async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
    })

    // update
    app.put('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedCoffee= req.body;
        const coffee ={
            $set:{
                name:updatedCoffee.name,
                quantity : updatedCoffee.quantity,
                supplier:updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo
            }
            
        }
        const result = await coffeeCollection.updateOne(filter, coffee, options);
        
        res.send(result)
        
    })

    // delete
    app.delete('/coffee/:id', async(req,res)=>{

        const id =req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result)
    })

    // create for user
    app.post('/userCoffee',async(req,res)=>{
      const userCoffee = req.body;
      console.log(userCoffee)
      const result = await coffeeUserCollection.insertOne(userCoffee);
      res.send(result)
  })

  // read for user
  app.get('/userCoffee', async(req,res)=>{
    const cursor = coffeeUserCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})

// delete for user
app.delete('/userCoffee/:id', async(req,res)=>{

  const id =req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await coffeeUserCollection.deleteOne(query);
  res.send(result)
})
// update for user
app.patch('/userCoffee', async(req,res)=>{
  const user = req.body;
  const filter = {email: user.email}
  const updateDoc = {
    $set:{
      lastLoggedAt: user.lastLoggedAt
    }
  }
  const result = await coffeeUserCollection.updateOne(filter, updateDoc)
  res.send(result)

})
  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('coffee making server is running')
});

app.listen(port, ()=>{
    console.log(`coffee server is running on port: ${port}`)
})