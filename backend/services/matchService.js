const matchDAO = require('../DAO/matchDAO');
const { checkIfOtherSkillExists } = require('../DAO/skillsDAO');
const { SuperError, ERR_FORBIDDEN, ERR_NOT_FOUND } = require('../errors');
const employerService = require('./employerService');
const placementService = require('./placementService');
const studentService = require('./studentService');

module.exports = {
    saveChoice: async (choice, auth) => { 
        let employer = await employerService.getEmployerByPlacementId(choice.placementID);
        if (auth.studentId !== choice.studentID && auth.employerId !== employer.id) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not authorized to save this interaction');
            return;
        }
        if(auth.studentId && choice.placementAccept !== null) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not allowed to save this interaction'); return;
        }
        if(auth.employerId && choice.studentAccept !== null) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not allowed to save this interaction'); return;
        }

        let previousInteraction = await matchDAO.getPreviousInteraction(choice.studentID, choice.placementID);
        let result = {};
        if(!previousInteraction) {
            result = await matchDAO.createInteraction(choice)
        } else {
            result = await matchDAO.saveInteraction(previousInteraction, choice);
        }
        return result;
    },

    getMatchesByStudentId: (studentId, auth) => {
        if(parseInt(studentId) !== auth.studentId) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not authorized to retrieve this information');
            return;
        }
        return matchDAO.getMatchesByStudentId(studentId);
    },
    
    deleteMatch: async (studentId, placementId, auth) => {
        // let student = await studentService.getStudent(studentId);
        let employer = await employerService.getEmployerByPlacementId(placementId);
        if (auth.studentId !== studentId && auth.employerId !== employer.id) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not authorized to delete this match');
            return;
        }
        return await matchDAO.deleteMatch(studentId, placementId);  
    },

    getMatchesByPlacementId: async (placementId, auth) => {        
        let employer = await employerService.getEmployerByPlacementId(placementId);
        if(employer === null) {
            throw new  SuperError(ERR_NOT_FOUND, 'The placement or the employer were not found');
            return;
        }
        if (auth.id !== employer.userId && auth.employerId !== employer.id) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not authorized to get this information');
            return;
        }

        let matches = await matchDAO.getMatchesByPlacementId(placementId);
        
        let niceMatches = [];
        matches.forEach((match) => {
            let matchIndex = niceMatches.findIndex((niceMatch) => match.studentId === niceMatch.id);
            let newSkill = {id: match.id, name: match.skillName, type: match.type};

            if (matchIndex === -1) { 
                // Not an entry here
                niceMatches.push({
                    id: match.studentId,
                    name: match.studentName,
                    surname: match.surname,
                    description: match.description,
                    skills: [newSkill],
                });
            } else if(matchIndex >= 0 && matchIndex < niceMatches.length){
                // just add skills
                let matchType = match.type === "TECH" ? "technicalSkills" : "softSkills";
                niceMatches[matchIndex].skills =
                    [...niceMatches[matchIndex].skills, newSkill];
            }
        });
        return niceMatches;
    },
    checkMatch: async function(studentId, employerId) {
        let interaction = await matchDAO.getStudentMatchesWithEmployer(employerId,studentId);
        return (interaction.length > 0);
    } 
};
