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
        return res.send({
          success: false,
          error: "Please Provide a valid information",
        });
      }
      const result = await productCollections.insertOne(product);
      res.send({
        success: true,
        message: `Successfully inserted ${product.name}`,
      });
    });

    // get data to the /products api endpoint:
    app.get("/products", async (req, res) => {
      // frontend theke jei query ti asbe seti thakbe string e! tai eke number e convert korte hobe:
      const limit = parseInt(req.query.limit);
      const pageNumber = parseInt(req.query.pageNumber);

      const cursor = productCollections.find({});
      const product = await cursor
        .skip(limit * pageNumber)
        .limit(limit)
        .toArray();

      // backend e koyti data ase ta dekhar jonne:
      const count = await productCollections.estimatedDocumentCount();

      if (!product.length) {
        return res.send({
          success: false,
          error: "Products not get to the server!",
        });
      }
      res.send({ success: true, data: product, count: count });
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
