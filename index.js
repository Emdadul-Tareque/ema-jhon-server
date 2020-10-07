const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 4000;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuz7l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
  console.log("DataBase Connected");

  app.post('/addProducts', (req, res) => {
      const products = req.body;
      productCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
           res.send(result.insertedCount);
      })
  })

  app.get('/products', (req, res) => {
      productCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.get("/product/:key", (req, res) => {
    productCollection.find({key: req.params.key}).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/productsByKeys", (req, res) => {
      const productsKeys = req.body;
      productCollection.find({ key: { $in: productsKeys }})
      .toArray((err, documents) => {
      res.send(documents);
  })
  })

   app.post("/addOrder", (req, res) => {
     const order = req.body;
     ordersCollection.insertOne(order).then((result) => {
       console.log(result.insertedCount);
       res.send(result.insertedCount > 0)
     });
   });
  

});


app.get("/", (req, res) => {
  res.send("Hello World!");
});
 
app.listen(process.env.PORT || port);
