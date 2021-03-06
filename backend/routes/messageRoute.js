const router = require('express').Router();

const messageService = require('../services/messageService');

const SuperError = require('../errors').SuperError;
const ERR_BAD_REQUEST = require('../errors').ERR_BAD_REQUEST;


router.post('/message', async (req, res, next) => {
    
    let message = await messageService.saveNewMessage(req.body, req.user)
    .catch(error => {
        res.status(error.code).send(error.message);
    });
    res.json(message);
    
    
});

router.get('/message/:studentId/:employerId', async (req, res, next) => {
    if( !isNaN(req.params.studentId) && !isNaN(req.params.employerId)){
        let conversation = await messageService.getConversation(
            parseInt(req.params.studentId), 
            parseInt(req.params.employerId),
            req.user
        ).catch(error => {
            res.status(error.code).send(error.message);
        });
        res.json(conversation);
    } else {
        res.status(ERR_BAD_REQUEST).send('Your request did not provided valid values for ids. Please try again.');
    }
     
});

router.delete('/message', async (req, res, next) => {
    let result = await messageService.deleteMessage(req.body, req.user)
        .catch(error => {
            res.status(error.code).send(error.message);
        });
    res.json(result);
});

module.exports = router;