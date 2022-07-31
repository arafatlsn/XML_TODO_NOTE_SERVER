const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.moy4n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notes = client.db('XML_TODO_NOTES').collection('notes');

    // load all notes 
    app.get('/loadNotes', async(req, res) => {
      const result = await notes.find({}).toArray()
      res.send(result)
    })

    // add new note 
    app.post('/addNote', async(req, res) => {
      const addNote = req.body;
      const result = await notes.insertOne(addNote);
      res.send(result)
    })

    // added or update new note 
    app.put('/updateNote', async(req, res) => {
      const noteDoc = req.body;
      const id = req.query.id;
      const findNote = await notes.findOne({_id: ObjectId(id)});
      const updateDoc = {
        $set: noteDoc
      }
      const result = await notes.updateOne(findNote, updateDoc);
      console.log(result)
      res.send(result)
    })
    
  } finally {
  }
}

run();

app.get("/", async (req, res) => {
  res.send("h3llo world");
});

app.listen(port, () => {
  console.log("server is running");
});
