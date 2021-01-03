
const placementDAO = require('../DAO/placementDAO');
const skillService = require('./skillsService');
const skillsService = require('./skillsService');
const employerService = require('./employerService');
const locationService = require('./locationService');
const matchService = require('./matchService');
const SuperError = require('../errors').SuperError;
const ERR_INTERNAL_SERVER_ERROR = require('../errors').ERR_INTERNAL_SERVER_ERROR;
const ERR_FORBIDDEN = require('../errors').ERR_FORBIDDEN;
const ERR_NOT_FOUND = require('../errors').ERR_NOT_FOUND;


module.exports = {
    getAllPlacementsIds: async () => {
        return await placementDAO.getAllPlacementsIds();
    },

    savePlacement: async (placementDetails, auth) => {

        if(auth.employerId !== placementDetails.employerId) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not allowed to save a placement of a different employer')
        }

        let newPlacement = {};
        try {

            newPlacement = await placementDAO.createNewPlacement(placementDetails);

            if(placementDetails.institutions) {
                newPlacement.institutions = await placementDAO.setPlacementInstitutions(newPlacement.id, placementDetails.institutions);
            }
            if(placementDetails.majors) {
                newPlacement.majors = await placementDAO.setPlacementMajors(newPlacement.id, placementDetails.majors);
            }

            if(placementDetails.location){
                let location = await locationService.addNewLocationIfNeeded(placementDetails.location);
                let addedLocation = await placementDAO.setPlacementLocation(newPlacement.id, location.id);
                if (addedLocation != 1){
                    await locationService.deleteLocationById(location.id);
                    throw new SuperError(ERR_INTERNAL_SERVER_ERROR, 'There has been a problem setting your placement location. Please try again')
                }
                newPlacement.location = location;
            }

            if(placementDetails.skills) {
                let placementInfos = placementDetails.skills;

                let newSkills = [];
                if(placementInfos.technicalSkills && placementInfos.technicalSkills.length > 0) {
                    newSkills = [...newSkills, ...placementInfos.technicalSkills];
                } 
                if(placementInfos.softSkills && placementInfos.softSkills.length > 0) {
                    newSkills = [...newSkills, ...placementInfos.softSkills];
                }
                if(placementInfos.otherSkills && placementInfos.otherSkills.length > 0) {
                    const otherSkills = await skillService.saveOtherSkills(placementInfos.otherSkills);
                    newSkills = [...newSkills, ...otherSkills];  
                }
                newPlacement.skills = await placementDAO.setPlacementSkills(newPlacement.id, newSkills);
            }
        } catch(error) {
            if(!error.code) {
                throw new SuperError(ERR_INTERNAL_SERVER_ERROR, error.message || "Server Error");
            }
            throw error; 
        }
        
        return newPlacement;
    },
    getPlacementsForSkills: async (skills) => {
        let skillIDs = skills.map(skill => skill.id);
        return await placementDAO.getPlacementsForSkills(skillIDs);
    },

    getPlacementById: async (placementId) => {

        let placement = await placementDAO.getPlacementById(placementId);
        placement.institutions = await placementDAO.getPlacementInstitutions(placementId);
        placement.majors = await placementDAO.getPlacementMajors(placementId);
        placement.skills = await skillsService.getPlacementSkills(placementId);
        placement.employer = await employerService.getEmployer(placement.employer_id);
        return placement;
    },

    getEmployerByPlacementId: (placementId) => {
        return placementDAO.getEmployerByPlacementId(placementId);
    },

    getPlacementsByEmployerId: async (employerId, auth) => {
        if(auth.employerId !== employerId) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not allowed to view the list of placements from another employer.')
        }
        return await placementDAO.getPlacementsByEmployerId(employerId);
    },

    deletePlacementById: async (id, auth) => {
        let placement = await placementDAO.getPlacementById(id);
        if(auth.employerId !== placement.employer_id) {
            throw new SuperError(ERR_FORBIDDEN, 'You are not allowed to delete this placement')
        }
        return placementDAO.deletePlacementById(id);
    },

    getLastPlacement: (auth) => {
        return placementDAO.getLastPlacement(auth.employerId);
    },

    closePlacementById: async (id) => {
        let result = await placementDAO.closePlacementById(id);
        if(result == 1){
            return "Your placement has been closed correctly."
        } else {
            throw new SuperError(ERR_NOT_FOUND,'The placement does not exists. Please try again'); 
        }
    }
};