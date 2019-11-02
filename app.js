const express = require('express')
const pokemonRouter = require('./pokemons/router')
const userRouter = require('./users/router')

const app = express()

// Register middleware
app.use(express.json())
app.use(pokemonRouter)
app.use(userRouter)

module.exports = app