const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const uri = process.env.URL;

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function server() {
  try {
    await client.connect();
    console.log("Database Connected!!!");
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

// books: get all books
app.get("/books", async (req, res) => {
  const books = client.db("book").collection("books");

  const book = await books.find().toArray();

  res.send(book);
});

// books: add book
app.post("/book/add", async (req, res) => {
  const books = client.db("book").collection("books");
  const { name, author, publication, price } = req.body;

  const book = await books.insertOne({
    name,
    author,
    publication,
    price,
  });

  res.send({ message: "Book has been created!!!", book });
});

// books: get single book
app.get("/book/:id", async (req, res) => {
  const books = client.db("book").collection("books");
  const { id } = req.params;

  const book = await books.findOne({ _id: new ObjectId(id) });
  res.send(book);
});

// books: update book using id
app.put("/book/:id", async (req, res) => {
  const books = client.db("book").collection("books");
  const { id } = req.params;
  const updatebook = req.body;

  const book = await books.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatebook }
  );

  res.send({ message: "Book has been updated!!!", book });
});

// books: delete book using id
app.delete("/book/:id", async (req, res) => {
  const books = client.db("book").collection("books");
  const { id } = req.params;

  await books.deleteOne({ _id: new ObjectId(id) });
  res.send("Book has been deleted!!!");
});

// server run here
server()
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server running at http://localhost:5000/`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
