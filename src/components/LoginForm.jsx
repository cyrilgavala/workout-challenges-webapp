import {useState} from "react";
import axios from "axios"
import {bake_cookie} from "sfcookies";

export default function LoginForm() {
    const api_url = process.env.REACT_APP_API_URL
    const [logging, isLogging] = useState(false)

    async function handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            isLogging(true)
            await axios.post(api_url + "user/login", {
                name: event.target[0].value,
                pass: Buffer.from(event.target[1].value).toString('base64')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then((res) => {
                if (res.status === 200) {
                    bake_cookie("username", res.data.name)
                    window.location.reload()
                }
            }).catch(err => {
                if (err.message.includes("409")) window.alert("Wrong password")
                else if (err.message.includes("500")) window.alert("Unknown error")
            })
            form.reset()
            isLogging(false)
        }
    }

    return (
        <div id="login-wrapper">
            <h4>Login</h4>
            <form id={"login-form"} noValidate onSubmit={handleSubmit}>
                <input className={"form-input"} required type="text" placeholder="Enter username"/>
                <input className={"form-input"} required type="password" placeholder="Password"/>
                <button id={"login-btn"} type="submit" disabled={logging}>
                    {logging ? "Logging in..." : "Log in"}
                </button>
            </form>
        </div>
    )
}