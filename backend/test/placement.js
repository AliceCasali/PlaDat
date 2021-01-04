const chai = require('chai');
const server = require('../index');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-json-schema');
const router = require('../routes/studentRoute');
const { response } = require('express');
const { request } = require('chai');

//Assertion style
chai.should();

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

describe('placement API', () => {

    describe('POST /placement/new-placement', () => {
        let placementId;
        let locationId;
        let employerId;

        beforeEach(async () => {
            employerId = (await chai.request(server)
                .get('/employers/last')).body.id;
        })

        it('should add a new placement to the db and return the details with the id', (done) => {
            chai.request(server)
                .post('/placement/new-placement')
                .set('content-type', 'application/json')
                .send({
                        position: "test position",
                        startDate: "2020-12-14",
                        employmentType: "PART_TIME",
                        endDate: "2020-12-14",
                        salary: 0,
                        descriptionRole: "test description role", 
                        employerId: employerId,
                        location: {
                            country: "test placement country",
                            city: "test placement city"
                        },
                        institutions: [],
                        majors: [],
                        skills: []})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    placementId = response.body.id;
                    response.body.should.have.property('position');
                    response.body.should.have.property('employment_type');
                    response.body.should.have.property('start_period');
                    response.body.should.have.property('end_period');
                    response.body.should.have.property('salary');
                    response.body.should.have.property('description_role');
                    response.body.should.have.property('institutions');
                    response.body.should.have.property('employment_type');
                    response.body.should.have.property('location');
                    response.body.should.have.property('status');
                    response.body.status.should.equal('OPEN');
                    response.body.location.should.have.property('id');
                    locationId = response.body.location.id;
                    response.body.location.should.have.property('country');
                    response.body.location.should.have.property('city');
                    let institutions = response.body.institutions;
                    institutions.should.be.a('array');
                    for(let i=0; i<institutions.length; i++){
                        institutions[i].should.be.a('object');
                        institutions[i].should.have.property('id');
                        institutions[i].should.have.property('name');
                    }
                    response.body.should.have.property('majors');
                    let majors = response.body.majors;
                    majors.should.be.a('array')
                    for(let i=0; i<majors.length; i++){
                        majors[i].should.be.a('object');
                        majors[i].should.have.property('id');
                        majors[i].should.have.property('name');
                    }
                    response.body.should.have.property('skills');
                    let skills = response.body.skills;
                    skills.should.be.a('array');
                    for(let i=0; i<skills.length; i++){
                        skills[i].should.be.a('object');
                        skills[i].should.have.property('id');
                        skills[i].should.have.property('name');
                        skills[i].should.have.property('type');
                    }
                    //response.body.should.have.property('employer_id');
                    done();
                })
        })

        afterEach(async () =>{
            await chai.request(server)
                .delete('/placement/' + placementId);

            await chai.request(server)
                .delete('/location/' + locationId)
        })
    })

    describe('GET /placement/:id', () => {
        

        it('should return the placement with all its details', (done) => {
            chai.request(server)
            .get('/placement')
            .end((err, response) => {
                let placementId = response.body[0].id
                chai.request(server)
                .get('/placement/' + placementId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.id.should.equal(placementId);
                    response.body.should.have.property('position');
                    response.body.should.have.property('employment_type');
                    response.body.should.have.property('start_period');
                    response.body.should.have.property('end_period');
                    response.body.should.have.property('salary');
                    response.body.should.have.property('description_role');
                    response.body.should.have.property('employer');
                    response.body.should.have.property('status');
                    response.body.should.have.property('location');
                    response.body.location.should.be.a('object');
                    response.body.location.should.have.property('id');
                    response.body.location.should.have.property('country');
                    response.body.location.should.have.property('city');
                    let employer = response.body.employer;
                    if(employer != null){
                        employer.should.be.a('object');
                        employer.should.have.property('id');
                        employer.should.have.property('name');
                        employer.should.have.property('description');
                    }
                    response.body.should.have.property('institutions');
                    let institutions = response.body.institutions;
                    institutions.should.be.a('array');
                    for(let i=0; i<institutions.length; i++){
                        institutions[i].should.be.a('object');
                        institutions[i].should.have.property('id');
                        institutions[i].should.have.property('name');
                    }
                    response.body.should.have.property('majors');
                    let majors = response.body.majors;
                    majors.should.be.a('array')
                    for(let i=0; i<majors.length; i++){
                        majors[i].should.be.a('object');
                        majors[i].should.have.property('id');
                        majors[i].should.have.property('name');
                    }
                    response.body.should.have.property('skills');
                    let skills = response.body.skills;
                    skills.should.be.a('array');
                    for(let i=0; i<skills.length; i++){
                        skills[i].should.be.a('object');
                        skills[i].should.have.property('id');
                        skills[i].should.have.property('name');
                        skills[i].should.have.property('type');
                    }

                    done();
                })
            })
            
        }).timeout(10000)
    })

    describe('GET /placement', () => {
        it('should return an array with all the ids of all the placements', (done) => {
            chai.request(server)
                .get('/placement')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    let ids = response.body;
                    for(let i=0; i<ids.length; i++){
                        ids[i].should.be.a('object');
                        ids[i].should.have.property('id')
                    }
                    done();
                })
        })
    })

    describe('GET /employer/:employerId/placements', () => {
        it('should get an array of placements details belonging to a specific employer', (done) => {
            chai.request(server)
                .get('/employers/last')
                .end((err, response) => {
                    chai.request(server)
                        .get('/employer/' + response.body.id + '/placements')
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            let placements = response.body;
                            for(let i=0; i<placements.length; i++){
                                placements[i].should.be.a('object');
                                placements[i].should.have.property('id');
                                placements[i].should.have.property('position');
                                placements[i].should.have.property('employment_type');
                                placements[i].should.have.property('start_period');
                                placements[i].should.have.property('end_period');
                                placements[i].should.have.property('salary');
                                placements[i].should.have.property('description_role');
                                placements[i].should.have.property('employer_id');
                                placements[i].should.have.property('status');
                                placements[i].should.have.property('count_matches');
                            }
                            done();
                        })
                })
            
        })
    })

    describe('PUT /placement/:id/close', () => {

        let placementId;

        beforeEach(async () => {

            let employerId = (await chai.request(server)
                .get('/employers/last')).body.id;

            let testPlacement = await chai.request(server)
                .post('/placement/new-placement')
                .set('content-type', 'application/json')
                .send({
                    position: "test position",
                    startDate: "2020-12-14",
                    employmentType: "PART_TIME",
                    endDate: "2020-12-14",
                    salary: 0,
                    descriptionRole: "test description role", 
                    employerId: employerId
                })
            
            placementId = testPlacement.body.id;
            
        })

        it('should correctly close the placement given a correct id', (done) => {

            chai.request(server)
                .put('/placement/' + placementId + '/close')
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                })

        })

        afterEach(async () =>{
            await chai.request(server)
                .delete('/placement/' + placementId);
        })

        it('should get a 400 Bad Request error when the request is not valid', (done) => {

            chai.request(server)
                .put('/placement/jkdfk/close')
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                })

        })

    })

})