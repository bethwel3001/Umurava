"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicant_controller_1 = __importDefault(require("../controllers/applicant.controller"));
const router = (0, express_1.Router)();
router.post('/', applicant_controller_1.default.createApplicant);
router.get('/', applicant_controller_1.default.getApplicants);
router.post('/screen', applicant_controller_1.default.screenApplicants);
router.post('/parse', applicant_controller_1.default.parseResume);
router.get('/results/:jobId', applicant_controller_1.default.getScreeningResults);
exports.default = router;
//# sourceMappingURL=applicant.routes.js.map