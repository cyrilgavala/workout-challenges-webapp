import axios from "axios";

const api_url = process.env.REACT_APP_API_URL + "user"

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

const loginUser = data => {
    return axios.post(process.env.REACT_APP_API_URL + "user/login", {
        name: data.username,
        pass: btoa(data.password)
    }, {
        headers: headers
    })
}

const registerUser = data => {
    return axios.put(api_url + "/register", {
        name: data.username,
        pass: btoa(data.password)
    }, {
        headers: headers
    })
}

const userService = {loginUser, registerUser}

export default userService