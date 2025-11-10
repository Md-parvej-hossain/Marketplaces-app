const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.VITE_USER}:${process.env.VITE_PASS}@cluster0.mcpcj.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const jobCollection = client.db('jobsDB').collection('jobs');
    const bidCollection = client.db('jobsDB').collection('bids');

    //get all jobs data BD
    app.get('/jobs', async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    //get a singale job data bd
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    //seb a bid data in db
    app.post('/bid', async (req, res) => {
      const bidData = req.body;
      const result = await bidCollection.insertOne(bidData);
      res.send(result);
    });
    //save a job in db
    app.post('/job', async (req, res) => {
      const jobData = req.body;
      const result = await jobCollection.insertOne(jobData);
      res.send(result);
    });
    //get all job posted by a specific user
    app.get('/job/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'buyer.buyer_email': email };
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    });
    //deleate a job data
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(quary);
      res.send(result);
    });

    //update a job data in db
    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const quary = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          ...jobData,
        },
      };
      const result = await jobCollection.updateOne(quary, updateDoc, option);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
