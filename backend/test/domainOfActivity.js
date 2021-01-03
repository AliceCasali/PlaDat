const chai = require('chai');
const server = require('../index');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-json-schema');
const router = require('../routes/studentRoute');
const { response } = require('express');
const { request } = require('chai');
const { post } = require('../index');

//Assertion style
chai.should();

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

describe('domainOfActivity API', () => {

    describe('GET /domainOfActivity', () => {

        it('should get an array of domain of activity with id and name', (done) => {

            chai.request(server)
                .get('/domainOfActivity')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    let doms = response.body;
                    for(let i = 0; i < doms.lenght; i++){
                        doms[i].should.be.a('object');
                        doms[i].should.have.property('id');
                        doms[i].should.have.property('name');
                    }
                    done();
                })

        })

    })

})