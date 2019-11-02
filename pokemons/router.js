const express = require('express')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const mongoUrl = 'mongodb+srv://59160316:a0147258369@pokemon-cluster-lypzl.gcp.mongodb.net/test?retryWrites=true&w=majority'

router.get('/pokemons', async (req, res) => {
    let client = await MongoClient.connect(
        mongoUrl, 
        { useNewUrlParser: true, useUnifiedTopology: true}
    ).catch((err) => {
        console.error(err)
        res.status(500).json({ error: err })
        return
    })

    try {
        let db = client.db('pokemondb')
        let docs = await db.collection('pokemons').find({}).toArray()
        res.json(docs)
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: err })
    } finally {
        client.close()
    }
})

// GET http://localhost:3000/pokemon/999
// Request Parameters
router.get('/pokemon/:id', (req, res) => {
    let id = req.params.id
    console.log(id)
    res.json({ pokemon_id: id })
})

// Request Body
router.post('/pokemons', async (req, res) => {
    let p = req.body
    let client = await MongoClient.connect(
        mongoUrl, 
        { useNewUrlParser: true, useUnifiedTopology: true}
    ).catch((err) => {
        console.error(err)
        res.status(500).json({error: err})
        return
    })

    try {
        let db = client.db('pokemondb')
        let result = await db.collection('pokemons').insertOne(p)
        res.status(201).json({id: result.insertedId})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: err})
    } finally {
        client.close()
    }
    
})

module.exports = router