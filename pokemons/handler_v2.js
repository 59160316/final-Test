let handler = {}

handler.getPokemon = (req, res) => {
    let id = req.params.id
    console.log(id)
    res.json({ pokemon_id: id, nickname: 'xxxxxx' })
}

module.exports = handler