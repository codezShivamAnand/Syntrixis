const {getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");

const createProblem = async (req,res)=>{
    // take all the fields from problem  schema 
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try{

        // judge0 format 
        // const submission = [
        //     {
        //         "language_id": 
        //         "source_code": 
        //         "stdin" : 
        //         "expected_output":
        //     }
        // ]
            //  { python , code in Python } <-- referenceSolution
            //  { java , code in Java } <-- referenceSolution
        for(const {language, completeCode} of referenceSolution){
            //  get language_id from Judge0, corresponding to the language of referenceDolution Code(source code) 
            const languageId=getLanguageById(language);
            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            // Batch Submission 
            const submissions = visibleTestCases.map((testcase)=>({
                "language_id": languageId,
                "source_code": completeCode,
                "stdin":testcase.input,
                "expected_output":testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            console.log("submitResult: ",submitResult);
            /* submitResult: [
              {
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
              },
              {
                "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
              },
              {
                "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
              }
          ] */

            const resultToken = submitResult.map((tkn)=> tkn.token);
            // resultToken: ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
            console.log("resultToken: ",resultToken);

            const testResult = await submitToken(resultToken);
            console.log("testResult: ",testResult);

            for(const test of testResult){
                    // console.log("status_idx: ", test.status_id );

                if(test.status_id != 3){
                    return res.status(400).send("error Occured");
                }
            }
        }

        // we can now store the prob created by ADMIN in our db

        const userProblem = await Problem.create({ ...req.body, problemCreator: req.userProfile._id}); // problemCreator is added explicitely while adding the problem to the db, 
        // who will be the problemCreater ? adminMiddleware se we can get, req.userProfile._id  
        res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        console.log("Error in createProblem controller "+ err.message);
        res.status(400).send("Error "+err.message);
    }
};

const updateProblem = async(req,res)=>{
    const {id} = req.params; // get id of the problem 
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

  try{

    if(!id){
    return res.status(400).send("Missing ID Field");
    }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language, completeCode} of referenceSolution){
            //  get language_id from Judge0, corresponding to the language of referenceDolution Code(source code) 
            const languageId=getLanguageById(language);
            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            // Batch Submission 
            const submissions = visibleTestCases.map((testcase)=>({
                "language_id": languageId,
                "source_code": completeCode,
                "stdin":testcase.input,
                "expected_output":testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            console.log("submitResult: ",submitResult);
            /* submitResult: [
              {
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
              },
              {
                "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
              },
              {
                "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
              }
          ] */

            const resultToken = submitResult.map((tkn)=> tkn.token);
            // resultToken: ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
            console.log("resultToken: ",resultToken);

            const testResult = await submitToken(resultToken);
            console.log("testResult: ",testResult);

            for(const test of testResult){
                    // console.log("status_idx: ", test.status_id );

                if(test.status_id != 3){
                    return res.status(400).send("error Occured");
                }
            }
        }


    const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
            // runValidators -check for validators at db levek even during uodate , cz by default its not checked during update 
            // new: true, returns a new document after updation 
    res.status(200).send(newProblem);
  }
  catch(err){
        console.log("Error in updation probelm :", err.message);
        res.status(500).send("Error: "+err.message);
  }
}

const deleteProblem = async(req,res)=>{
    // find prob by id 
    const {id} = req.params;
    try{
        if(!id)
          return res.send(400).json({message:"Invalid Id"});
        // problem ->findByIdAndDelete
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if(!deletedProblem)
          return res.status(404).json({message:"Problem is Missing"});

          res.status(200).send("Successfully Deleted");
    }
    catch(err){
        console.log("Error in probelm deletion :", err.message);
        res.status(500).send("Error: "+err.message);  
    }
}

const getProblemById = async(req,res)=>{
    const {id} = req.params;
    try{
      
      if(!id)
        return res.status(400).send("ID is Missing");

      const getProblem = await Problem.findById(id).select('-hiddenTestCases -problemCreator');
      if(!getProblem)
        return res.status(404).send("Problem is Missing");

      res.status(200).send(getProblem);
    }
    catch(err){
      res.status(500).send("Error: "+err);
    }
}
const getAllProblem = async(req,res)=>{
    try{
      
      const getProblem = await Problem.find({});

      if(getProblem.length==0)
        return res.status(404).send("Problem is Missing");

      // try to achieve pagination here, cz we dont want to load all 100 or 300 problems at once  
      res.status(200).send(getProblem);
    }
    catch(err){
      res.status(500).send("Error: "+err);
    }
}

module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem};