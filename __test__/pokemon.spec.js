const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('GET /pokemons',() => {
    it('should return list of pokemons' ,(done) => {
        
        request(app).get('/pokemons')
        .end((err,res) => {
            expect(res.statusCode).to.equals(200)

            let result = res.body
            expect(result).to.be.an('array')

            let p = result[0]
            expect(p).to.have.property('_id')
            expect(p).to.have.property('name')
            done()
        })

    })


})

describe('POST /pokemons',() => {
    it('should return http 201 created with id' ,(done) => {
        
        request(app).get('/pokemons')
        .end((err,res) => {
            request(app).post('/pokemons')
            .send({name:'Picka'})
            .end((err,res) => {
                expect(res.statusCode).to.equals(201)
                let p = res.body
                expect(p).to.be.an('object')
                expect(p).to.have.property('id')
                done()
            })
        })

    })


})

describe('GET /me',() => {
    it('should return http 401 Unauthorized when token is unvailable' ,(done) => {
        
        request(app).get('/me')
        .end((err,res) => {
            expect(res.statusCode).to.equals(401)
            done()    
        })

    })

    it('should return http 401 Unauthorized when provides invalid token' ,(done) => {
    
        request(app).get('/me')
        .set('Authorization','123456789')
        .end((err,res) => {
            expect(res.statusCode).to.equals(401)
            done()    
        })

    })


})