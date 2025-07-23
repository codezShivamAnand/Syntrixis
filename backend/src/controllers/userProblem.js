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
        console.log("Error "+ err.message);
        res.status(400).send("Error22: "+err.message);
    }
};

module.exports = createProblem;