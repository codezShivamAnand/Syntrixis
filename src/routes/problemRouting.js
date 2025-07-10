const express = require('express');
const problemRouter = express.Router();

//admin
problemRouter.post("/create",problemCreate); // create new problem
problemRouter.patch("/:id", problemUpdate); // update
problemRouter.delete("/:id",problemDelete);

// admin or user 
problemRouter.get("/:id",problemFetch);
problemRouter.get("/", getAllProblem);
problemRouter.get("/user", solvedProblem);


module.exports = problemRouter;