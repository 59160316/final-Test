const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const mongoUrl = 'mongodb+srv://superadmin:pwdsecure123@pokemon-cluster-zp5v5.gcp.mongodb.net/test?retryWrites=true&w=majority'
const jwtKey = 'supersecure'

router.post('/register', async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let encryptedPwd = await bcrypt.hash(password, 8).catch((err) => {
        console.error(err)
        res.status(500).json({error: err})
        return
    })

    let client = await MongoClient.connect(
        mongoUrl,
        { useUnifiedTopology: true, useNewUrlParser: true}
    ).catch((err) => {
        console.error(err)
        res.status(500).json({error: err})
        return
    })

    try {
        let db = client.db('buu')
        let result = await db.collection('users').insertOne(
            { email: email, password: encryptedPwd }
        )
        res.status(201).json({id: result.insertedId})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: err})
        return
    } finally {
        client.close()
    }
})

router.post('/sign-in', async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let client = await MongoClient.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).catch((err) => {
        console.error(err)
        res.status(500).json({error: err})
        return
    })

    try {
        let db = client.db('buu')
        let user = await db.collection('users').findOne({email: email})

        if (!user) {
            res.status(401).json({error: `Email: ${email} is not existed`})
            return
        }

        let valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            res.status(401).json({error: `Your email or password is incorrect`})
            return
        }

        let token = await jwt.sign(
            { email: user.email, id: user._id}, // payload
            jwtKey,
            { expiresIn: 120 }
        )
        res.json({token: token})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: err})
        return
    } finally {
        client.close()
    }
})

const auth = async (req, res, next) => {
    let token = req.header('Authorization')
    let decoded
    
    try {
        decoded = await jwt.verify(token, jwtKey)
        req.decoded = decoded
        next()
    } catch(err) {
        console.error(`Invalid token: ${err}`)
        res.status(401).json({error: err})
        return
    }
}

router.get('/me', auth, async (req, res) => {
    let email = req.decoded.email
    let client = await MongoClient.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).catch((err) => {
        console.error(err)
        res.status(500).json({error: err})
        return
    })

    try {
        let db = client.db('buu')
        let user = await db.collection('users').findOne({email: email})
        delete user.password
        res.json({data: user})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: err})
        return
    } finally {
        client.close()
    }
})

module.exports = router