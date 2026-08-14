const express = require("express");
const router = express.Router();
const adminProtect = require("../middlewares/adminProtect");

const {
    createTest,
    getTests,
    getTestById,
    deleteTest,
    updateTest,
    toggleTestStatus
} = require("../controllers/mockTestController");

// Protect all admin routes
router.use(adminProtect);


router.post('/',createTest)
router.get('/',getTests)
router.get('/:id',getTestById)
router.put('/:id',updateTest)
router.patch('/:id/status',toggleTestStatus)
router.delete('/:id',deleteTest)

module.exports=router