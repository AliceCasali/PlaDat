const studentDAO = require('../DAO/studentDAO');
const skillService = require('../services/skillsService')
const locationService = require('../services/locationService');
const SuperError = require('../errors').SuperError;
const ERR_INTERNAL_SERVER_ERROR = require('../errors').ERR_INTERNAL_SERVER_ERROR;
const ERR_FORBIDDEN = require('../errors').ERR_FORBIDDEN;
const educationService = require('../services/educationService')
const workService = require('../services/workService')
const jwt = require('jsonwebtoken');

module.exports = studServ = {
    // Here you can add all kinds of methods that manage or handle data, or do specific tasks. 
    // This is the place where the business logic is.
    getStudent: (id) => {
        // Sometimes you need data from the DB. The Services are not allowed to directly access data, 
        // but they can request it from the specific DAO (Data Access Object) component.
        return studentDAO.getStudentById(id);
    },

    createStudentAccount: async (studentInfo, auth) => {
        
        if(auth.userType !== 'STUDENT') {
            throw new SuperError(ERR_FORBIDDEN, 'You cannot create a student profile from a non-student account.');
        }

        let studentProfile = {};
        try {
            studentProfile = await studentDAO.createStudentAccount(studentInfo);

            if(studentProfile.id) {
                studentProfile.token = jwt.sign({ id: auth.id, studentId: studentProfile.id, userType: 'STUDENT'}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_LIFE // 30 DAYS
                });
            }
            if(studentInfo.location){
                studentProfile.location = await studServ.saveStudentLocation(studentProfile.id, studentInfo.location);
            }

            if(studentInfo.skills) {
                studentProfile.skills = await studServ.saveStudentSkills(studentProfile.id, studentInfo.skills);
            }
            if(studentInfo.work && studentInfo.work.length > 0) {
                studentProfile.work = await workService.saveStudentWork(studentProfile.id, studentInfo.work);
            }
            if(studentInfo.education && studentInfo.education.length > 0){
                studentProfile.education = await educationService.saveStudentEducations(studentProfile.id, studentInfo.education);
            }
    
        } catch(error) {
            throw error;
        }
       
        return studentProfile;
    },

    saveStudentSkills: async (studentId, studentInfo) => {
        let skills = [];
        if(studentInfo.technicalSkills && studentInfo.technicalSkills.length > 0) {
            skills = [...skills, ...studentInfo.technicalSkills];
        } 
        if(studentInfo.softSkills && studentInfo.softSkills.length > 0) {
            skills = [...skills, ...studentInfo.softSkills];
        }
        if(studentInfo.otherSkills && studentInfo.otherSkills.length > 0) {
            const otherSkills = await skillService.saveOtherSkills(studentInfo.otherSkills);
            skills = [...skills, ...otherSkills];  
        }
        return studentDAO.setStudentSkills(studentId, skills);  
    },

    getStudentsBySkills: async (skills) => {
        let skillIds = skills.map(skill => skill.id);
        return await studentDAO.getStudentsBySkills(skillIds);
    },

    getStudentProfile: async (id) => {
        let profile = await studentDAO.getStudentById(id);
        profile.skills = await skillService.getStudentSkills(profile.id);
        profile.location = await studentDAO.getStudentLocationById(profile.id);
        profile.education = await studentDAO.getStudentEducationById(profile.id);
        profile.work = await studentDAO.getStudentWorkById(profile.id);
        return profile;
    },

    getLastStudent: async () => {
        return await studentDAO.getLastStudent();
    },

    deleteStudentById: async (id, auth) => {
        if(auth.studentId !== id) {
            throw new SuperError(ERR_FORBIDDEN, 'You cannot delete this student profile');
        }
        return await studentDAO.deleteStudentById(id);
    },

    saveStudentLocation: async (id, details) => {
        let location = await locationService.addNewLocationIfNeeded(details);
        let result = await studentDAO.setStudentLocation(id, location.id)
        if (result != 1){
            locationService.deleteLocationById(location.id);
            throw new SuperError(ERR_INTERNAL_SERVER_ERROR, 'There has been a problem setting your student profile location. Please try again')
        }
        return location;
    },
    getStudentByUserId: async (userId, auth) => {
        if(auth.id !== userId) {
            throw new SuperError(ERR_FORBIDDEN, 'You cannot see this profile');
        }
        return await studentDAO.getStudentByUserId(userId);
    },
    getStudentsForRecommendation: (placementId) => {
        return studentDAO.getStudentsForRecommendation(placementId);
    }
};