"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const router = (0, express_1.Router)();
router.post('/', job_controller_1.default.createJob);
router.get('/', job_controller_1.default.getJobs);
router.get('/:id', job_controller_1.default.getJobById);
router.put('/:id', job_controller_1.default.updateJob);
router.delete('/:id', job_controller_1.default.deleteJob);
exports.default = router;
//# sourceMappingURL=job.routes.js.map