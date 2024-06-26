export const createData = function (req, res) {
    console.log("createData");
}

import axios from 'axios';

const apiKey = 'ba3d893b16314ec1ac85abaea9ea9df0'; // Replace with your OpenAI API key
const apiUrl = 'https://a208321-datavizaipocbfv5-zyzj.openai.azure.com/openai/deployments/DatavizAIPOCbFV5-gpt-35-turbo/chat/completions?api-version=2023-07-01-preview'

// Load data from CSV file  
const data = [];
const output = [];

export const getMostSuccessFulVideo = async (data) => {
    const jsonData = data;
    const promises = [getReponseFromOpenAI(jsonData, inputForMostSuccessFulVideo)];
    return promiseExecution(promises);
}

export const getStatsForAllVideos = async (data) => {
    const jsonData = data;

    const promises = jsonData.map((row) => {
        return getReponseFromOpenAI(row, inputForAllStats);
    })
    return promiseExecution(promises);
}

const promiseExecution = async (promises) => {
    return await Promise.all(promises);
}

const getReponseFromOpenAI = (inputJsonArray, inputType) => {
    const headers = {
        'Content-Type': 'application/json',
        'api-key': `${apiKey}`,
    };

    const finalJSON = JSON.stringify(inputJsonArray);

    const finalInput = [
        inputType[0],
        {
            "role": "user",
            "content": finalJSON
        }
    ]

    const requestBody = {
        "temperature": 0.3,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 350,
        "stop": null,
        "messages": finalInput
    };

    return callOpenAiApi(apiUrl, requestBody, headers).then((response) => {
        return response.data.choices[0].message.content;
    }).catch((error) => {
        console.log(error.request.data);
    })
};

const determineMostSuccessfulVideoFromMultipleVideos = (inputJsonArray) => {
    const headers = {
        'Content-Type': 'application/json',
        'api-key': `${apiKey}`,
    };

    const finalInput2 = [
        input2[0],
        {
            "role": "user",
            "content": inputJsonArray
        }
    ]

    const requestBody2 = {
        "temperature": 0.3,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 350,
        "stop": null,
        "messages": finalInput2
    };

    callOpenAiApi(apiUrl, requestBody2, headers).then((response) => {
        return response.data.choices[0].message.content;
    }).catch((error) => {
        console.log(error);
    });
}

const callOpenAiApi = (apiUrl, requestBody, headers) => {
    return axios.post(apiUrl, requestBody, { headers: headers });
}

const inputForMostSuccessFulVideo = [
    {
        "role": "system",
        "content": `You are an agent which takes some input parameters, for a video and determine whether that video will be successful or not. I have these parameters :   
                    sum_time_viewed - Total time video viewed.  
                    count_plays - Number of times video played.
                    avg_view_drop_off - Number of times the video was dropped off in between.
                    author_name - Name of the author.
                    engagement_ranking - The ranking of engagement of the video.
                    avg_completion_rate - The rate at which a video is seen completely by any user.
                    
                    
                    title - Title of the video.
                    category - Category of the video.
                    
                    More the sum_time_viewed, more the video is successful
                    More the count_plays, more the video is successful
                    More the avg_view_drop_odd, less the video will be successful.
                    The title should be relevant to the category of the video.
                    More the engagement_ranking, more chances of video being successful.
                    The higher the avg_completion_rate, higher the chances of video being successful.
                    I will provide input in the form of JSON.
                    Use this info to determine the success rate of the video.
                    Determine if the video is successful or not. Dont give me details, just tell me if the video is successful or not.
                    Return me the video which has the highest chances of being successful.
                    Also specify the reason for the same.
                    Do not add any instructions in the json or message.`
    }
]

const inputForAllStats = [
    {
        "role": "system",
        "content": `You are an agent which takes some input parameters, for a video and determine whether that video will be successful or not. I have these parameters :   
                    sum_time_viewed - Total time video viewed.  
                    count_plays - Number of times video played.
                    avg_view_drop_off - Number of times the video was dropped off in between.
                    author_name - Name of the author.
                    engagement_ranking - The ranking of engagement of the video.
                    avg_completion_rate - The rate at which a video is seen completely by any user.
                    
                    
                    title - Title of the video.
                    category - Category of the video.
                    
                    More the sum_time_viewed, more the video is successful
                    More the count_plays, more the video is successful
                    More the avg_view_drop_odd, less the video will be successful.
                    The title should be relevant to the category of the video.
                    More the engagement_ranking, more chances of video being successful.
                    The higher the avg_completion_rate, higher the chances of video being successful.
                    I will provide input in the form of JSON.
                    Use this info to determine the success rate of the video.
                    Determine if the video is successful or not. Dont give me details, just tell me if the video is successful or not.
                    Also specify the reason for the same.
                    Do not add any instructions in the json or message.`
    }
]

const input2 = [
    {
        "role": "system",
        "content": `You are an agent which takes some input parameters, for a video and determine whether that video will be successful or not. 
                    I have the description of the video, why it can be successful or why it can't be successful.
                    I will give you input for multiple videos, and you need to identify which video is most likely to be successful.`
    }
]