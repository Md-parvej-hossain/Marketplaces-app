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
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    //post job data 
    
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
