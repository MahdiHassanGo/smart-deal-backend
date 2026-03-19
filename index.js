const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://Smart-Deals:jIxWOMQBoLoHW2RX@cluster0.ygrer.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productsCollection = db.collection("products");

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;

      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await productsCollection.updateOne(query,update);
      res.send(result);
    });

//query listing 

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });


    app.get('/products',async(req,res)=>{
        const cursor = productsCollection.find().sort({price_min:1});
        const result= await cursor.toArray();
        res.send(result)
       

    })

    app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        // const cursor = productsCollection.find();

        
        const result= await productsCollection.findOne(query);
        res.send(result)
       

    })

    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

run();

app.listen(port, () => {
  console.log(`server app listening on port ${port}`);
});
