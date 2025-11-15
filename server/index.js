const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const app = express();
const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionSuccessStatus: 200,
};
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

// verify jwt meddleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: 'unauthorized access' });
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // console.log(err);
        return res.status(401).send({ message: 'unauthorized access' });
      }
      // console.log(decoded);
      req.user = decoded;
      next();
    });
  }
  // console.log(token);
};

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

    //jwt generate
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      // console.log('Dynamic token for this user =>', user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '7d',
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });
    //clear token on logout
    app.get('/logout', (req, res) => {
      res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 0,
        })
        .send({ success: true });
    });
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
      //check if its a duplicate request
      const query = {
        email: bidData.email,
        jobId: bidData.jobId,
      };
      const alreadyApplied = await bidCollection.findOne(query);
      // console.log(alreadyApplied);
      if (alreadyApplied) {
        return res
          .status(400)
          .send('You have alresdy placed a bid on this Job.');
      }
      // return console.log(alreadyApplied);
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
    app.get('/job/:email', verifyToken, async (req, res) => {
      const tokenEmail = req.user.email;
      const email = req.params.email;
      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' });
      }
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

    // get all bids for a user by email from db
    app.get('/mybid/:email', verifyToken, async (req, res) => {
      const tokenEmail = req.user.email;
      const email = req.params.email;
      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      // akai hoi tahola sodo emai lakala hiba
      // const query = { email: email };
      const query = { email };
      const result = await bidCollection.find(query).toArray();
      res.send(result);
    });

    //get all bid request from db for job owner
    app.get('/bid-requests/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'buyer.buyer_email': email };
      const result = await bidCollection.find(query).toArray();
      res.send(result);
    });
    //update bid status
    app.patch('/update-status/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: status,
      };
      const result = await bidCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    //pagenation
    //get all jobs data BD for pagenation
    app.get('/all-jobs', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page)-1;
      console.log(size, page);
      const result = await jobCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    //get all jobs data count
    app.get('/jobs-count', async (req, res) => {
      // const result = await jobCollection.estimatedDocumentCount()
      const count = await jobCollection.countDocuments();
      res.send({ count });
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
