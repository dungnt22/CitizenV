var express = require('express');

var authenticate = require('../authenticate');
var account = require('../models/account');
var citizen = require('../models/citizen');
var analysisController = require('../analysisController');

var analysisRouter = express.Router();
var bodyParser = require('body-parser');

analysisRouter.use(bodyParser.json());

analysisRouter.get('/getRatioGender', analysisController.getRatioGender);
analysisRouter.get('/getRatioGenderPerProvince', analysisController.getRatioGenderPerProvince);
analysisRouter.get('/getRatioGenderPerProvinceGroup', analysisController.getRatioGenderPerProvinceGroup);
analysisRouter.get('/getRatioGenderPerProvinceDistrict', analysisController.getRatioGenderPerProvinceDistrict);
analysisRouter.get('/getRatioGenderPerProvinceDistrictGroup', analysisController.getRatioGenderPerProvinceDistrictGroup);
analysisRouter.get('/getRatioGenderPerProvinceDistrictCommune', analysisController.getRatioGenderPerProvinceDistrictCommune);
analysisRouter.get('/getRatioGenderPerProvinceDistrictCommuneGroup', analysisController.getRatioGenderPerProvinceDistrictCommuneGroup);
analysisRouter.get('/getAveAge', analysisController.getAveAge);
analysisRouter.get('/getAveAgePerProvince', analysisController.getAveAgePerProvince);
analysisRouter.get('/getAveAgePerProvinceDistrict', analysisController.getAveAgePerProvinceDistrict);
analysisRouter.get('/getAveAgePerProvinceDistrictCommune', analysisController.getAveAgePerProvinceDistrictCommune);
analysisRouter.get('/getEducationLevelRatio', analysisController.getEducationLevelRatio);
analysisRouter.get('/getEducationLevelRatioPerProvince', analysisController.getEducationLevelRatioPerProvince);
analysisRouter.get('/getEducationLevelRatioPerProvinceGroup', analysisController.getEducationLevelRatioPerProvinceGroup);
analysisRouter.get('/getEducationLevelRatioPerProvinceDistrict', analysisController.getEducationLevelRatioPerProvinceDistrict);
analysisRouter.get('/getEducationLevelRatioPerProvinceDistrictGroup', analysisController.getEducationLevelRatioPerProvinceDistrictGroup);
analysisRouter.get('/getEducationLevelRatioPerProvinceDistrictCommune', analysisController.getEducationLevelRatioPerProvinceDistrictCommune);
analysisRouter.get('/getEducationLevelRatioPerProvinceDistrictCommuneGroup', analysisController.getEducationLevelRatioPerProvinceDistrictCommuneGroup);
analysisRouter.get('/getJobRatio', analysisController.getJobRatio);
analysisRouter.get('/getJobRatioPerProvince', analysisController.getJobRatioPerProvince);
analysisRouter.get('/getJobRatioPerProvinceGroup', analysisController.getJobRatioPerProvinceGroup);
analysisRouter.get('/getJobRatioPerProvinceDistrict', analysisController.getJobRatioPerProvinceDistrict);
analysisRouter.get('/getJobRatioPerProvinceDistrictGroup', analysisController.getJobRatioPerProvinceDistrictGroup);
analysisRouter.get('/getJobRatioPerProvinceDistrictCommune', analysisController.getJobRatioPerProvinceDistrictCommune);
analysisRouter.get('/getJobRatioPerProvinceDistrictCommuneGroup', analysisController.getJobRatioPerProvinceDistrictCommuneGroup);
analysisRouter.get('/getReligionRatio', analysisController.getReligionRatio);
analysisRouter.get('/getReligionRatioPerProvince', analysisController.getRatioGenderPerProvince);
analysisRouter.get('/getReligionRatioPerProvinceGroup', analysisController.getRatioGenderPerProvinceGroup);
analysisRouter.get('/getReligionRatioPerProvinceDistrict', analysisController.getRatioGenderPerProvinceDistrict);
analysisRouter.get('/getReligionRatioPerProvinceDistrictGroup', analysisController.getRatioGenderPerProvinceDistrictGroup);
analysisRouter.get('/getReligionRatioPerProvinceDistrictCommune', analysisController.getRatioGenderPerProvinceDistrictCommune);
analysisRouter.get('/getReligionRatioPerProvinceDistrictCommuneGroup', analysisController.getRatioGenderPerProvinceDistrictCommuneGroup);

module.exports = analysisRouter;