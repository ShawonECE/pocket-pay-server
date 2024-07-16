const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// middlewares
app.use(cors(
  {
    origin: ['http://localhost:5173'],
  }
));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("pocket-pay");
const allUserCollection = db.collection("all-users"); 

// const verifyToken = (req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }
//   const token = req.headers.authorization.split(' ')[1];
//   // console.log(token);
//   if (!token) {
//     // console.log('No token');
//     return res.status(401).send({message: 'unauthorized access'});
//   }
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       // console.log('Invalid token');
//       return res.status(401).send({message: 'unauthorized access'});
//     }
//     // console.log(decoded);
//     req.decoded = decoded;
//     next();
//   });
// };

// const verifyAdmin = async (req, res, next) => {
//   const email = req.decoded.data;
//   const query = { email: email };
//   // console.log(email);
//   const user = await userColl.findOne(query);
//   // console.log(user);
//   const isAdmin = user?.role === 'admin';
//   if (!isAdmin) {
//     // console.log('not admin');
//     return res.status(403).send({ message: 'forbidden access' });
//   }
//   next();
// }

// const verifyAgent = async (req, res, next) => {
//   const email = req.decoded.data;
//   const query = { email: email };
//   // console.log(email);
//   const user = await userColl.findOne(query);
//   // console.log(user);
//   const isAgent = user?.role === 'agent';
//   if (!isAgent) {
//     // console.log('not admin');
//     return res.status(403).send({ message: 'forbidden access' });
//   }
//   next();
// }


async function run() {
  try {
    await client.connect();

    app.get('/', async (req, res) => {
        res.send('Welcome to pocket pay');
    });

    app.post('/register', async (req, res) => {
        const user = req.body;
        const hash = bcrypt.hashSync(user.pin, saltRounds);
        user.pin = hash;
        const result = await allUserCollection.insertOne(user);
        res.send(result);
    });
  } 
  finally {
    
  }
}
run().catch(console.dir);

app.listen(port);