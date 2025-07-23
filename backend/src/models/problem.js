const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linkedList','graph','dp','string'],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ], 
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ], 
    
    startCode:[ // boilerplate code 
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ], 

    referenceSolution:[ // this will be used to check if the user gives its own test case, then that input can be run on this refernceSolution and check if the output is same as expected output    
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
}, {timestamps: true});
const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;