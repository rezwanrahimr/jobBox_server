const express = require('express')
const app = express()
var cors = require('cors')
const port = 5000


app.use(cors())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bdcpj22.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        client.connect();
        const userCollection = client
            .db("jobBox")
            .collection("userCollection");

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            if (result) {
                res.status(2001).send(true)
            }
        })

        app.get('/user', async (req, res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result)

        })

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})