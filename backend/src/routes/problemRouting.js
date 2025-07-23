const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const createProblem = require('../controllers/userProblem');

//admin
problemRouter.post("/create",adminMiddleware, createProblem); // create new problem
// problemRouter.patch("/:id",adminMiddleware, problemUpdate); // update
// problemRouter.delete("/:id",adminMiddleware,problemDelete);

// // admin or user 
// problemRouter.get("/:id",problemFetch);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedProblem);


module.exports = problemRouter;