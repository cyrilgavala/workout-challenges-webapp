import axios from "axios";

const api_url = process.env.REACT_APP_API_URL + "record"

const header = accessToken => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
    }
}

const getRecordsByChallengeKey = (challengeKey, accessToken) => {
    return axios.get(api_url, {
        params: {
            challengeKey: challengeKey,
        }, headers: header(accessToken)
    })
}

const addRecord = (data, challengeKey, accessToken) => {
    const date = new Date(Date.UTC(data.date.getFullYear(), data.date.getMonth(), data.date.getDate()))
    return axios.put(api_url, {
        reps: data.reps,
        date: date.toISOString(),
        challengeKey: challengeKey,
    }, {
        headers: header(accessToken)
    })
}

const deleteRecord = (id, accessToken) => {
    return axios.delete(api_url, {
        headers: header(accessToken),
        params: {
            id: id,
        }
    })
}

const recordService = {getRecordsByChallengeKey, addRecord, deleteRecord}

export default recordService