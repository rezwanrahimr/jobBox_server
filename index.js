const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const port = 5000
require('dotenv').config();


app.use(cors())
app.use(bodyParser.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        await client.connect();
        const userCollection = client
            .db("jobBox")
            .collection("userCollection");
        const jobCollection = client.db("jobBox").collection("jobCollection");

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.post('/user', async (req, res) => {
            const data = req.body;
            try {
                const result = await userCollection.insertOne(data);
                res.send(result);
            } catch (error) {
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/user', async (req, res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result)
        })


        app.post('/job', async (req, res) => {
            const data = req.body;
            console.log('check data', data);

            try {
                const result = await jobCollection.insertOne(data);
                res.send(result);
            } catch (error) {
                
                res.status(500).send('Internal Server Error: ' + error.toString());
            }
        });
        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const result = await jobCollection.findOne({ _id: new ObjectId(id) });
                res.send(result);

            } catch (error) {
                
                res.status(500).send('Internal Server Error: ' + error.toString());
            }
        })
        app.get('/job', async (req, res) => {
            const result = await jobCollection.find({}).toArray();
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})