const express = require('express')
const router = express.Router()

router.put('/pokemon/:id', (req, res) => {
    res.json({ version: 'v2' })
})

module.exports = router