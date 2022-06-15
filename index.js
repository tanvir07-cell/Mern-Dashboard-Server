const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware:
app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k3h41.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollections = client.db("dashboard").collection("products");

    // post data to the /products api endpoint:
    app.post("/products", async (req, res) => {
      const product = req.body;
      // validation if user post data with name and product price in client side:
      if (!product.name || !product.price) {
        return;
      }
      const result = await productCollections.insertOne(product);
    });
  } finally {
  }
}

run().catch(console.dir);
// server:
app.get("/", (req, res) => {
  res.send({ message: "Server Side" });
});

app.listen(port, () => {
  console.log(`Listening to the server ${port}`);
});
