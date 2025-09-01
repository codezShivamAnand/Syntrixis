const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const createProblem = require('../controllers/userProblem');
const userAuthMiddleware = require("../middleware/usermiddleware");
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem} = require("../controllers/userProblem");
//admin
problemRouter.post("/create",adminMiddleware, createProblem); // create new problem
problemRouter.patch("/update/:id",adminMiddleware, updateProblem); // update
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

// // admin or user 
problemRouter.get("/problemById/:id", userAuthMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userAuthMiddleware, getAllProblem);
// problemRouter.get("/problemSolvedByUser", userAuthMiddleware, AllsolvedProblem);


module.exports = problemRouter;