const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apc6x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("sunRiseMart").collection("products");
  
    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, items)=> {
            res.send(items)
            console.log('from database', items);
        })
    })

  app.post('/admin', (req, res) => {
      const newProduct = req.body;
      console.log("add new product", newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted', result.insertedCount);
          res.send(result.insertedCount > 0);
      })
  })
  app.get(`/checkout/:id`, (req, res) => {
    productCollection.find({
      _id: ObjectId(req.params.id)
    })
    .toArray((err, items)=> {
        res.send(items)
        console.log('from database', items);
    })
})

  
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})