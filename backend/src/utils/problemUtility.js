const axios = require('axios');

const getLanguageById = (lang)=>{
    const language = {
         "c++":54,
        "java":62,
        "javascript":63
    }
    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {
    
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error.message);
            throw new Error("Judge0 batch submission failed");
        }
    }
    return await fetchData();

}

const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		// console.error(error);
        console.error("Judge0 fetchToken error:", error?.response?.data || error.message);
	}
}


while(true){

    const result =  await fetchData();
    if (!result || !result.submissions) {
        console.log("Judge0 returned an invalid response.");
        continue;
    }
    const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

    if(IsResultObtained)
        return result.submissions;

  // else -> the loop runs aagain 

    await waiting(1000); // 1 sec wait before checking with JUDGE0 again 
}

}

module.exports = {getLanguageById, submitBatch, submitToken};