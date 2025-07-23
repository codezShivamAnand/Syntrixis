const validator = require('validator');

async function validateUserData(data){

    const mandatoryField = ['firstName', 'emailId', 'password'];
    const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed)
        throw new Error("Field missing");
    // firstName validate karo
    if(!(data.firstName.length >= 3 && data.firstName.length <= 20))
        throw new Error("Enter valid FirstName");
    // email Validate
    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");
    // Strong Password,check  
    if(!validator.isStrongPassword(data.password))
        throw new Error("Weak Password");
}
module.exports = validateUserData;