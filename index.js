//import
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//variable
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

//MongoDb server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrqu461.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("actionZoneDB").collection("toys");

    app.get("/toys", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const skip = page * limit;
      let email = req.query.email;

      let query = {};
      if (email) {
        query = { seller_email: email };
      }
      const result = await toyCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send(result);
    });

    // Category
    app.get("/toys/:category", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 8;
      const skip = page * limit;
      const category = req.params.category;

      let query = {};
      if (category !== "All") {
        query = { sub_category: category };
      }

      const result = await toyCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send(result);
    });

    //total product
    app.get("/total-products", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { seller_email: email };
      }
      console.log(query);
      const result = await toyCollection.countDocuments(query);
      console.log(result);
      res.send({ totalProducts: result });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy store server is running");
});
app.listen(port, () => {
  console.log("Port: ", port);
});
