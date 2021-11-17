import axios from "axios";
import {useState} from "react";
import {bake_cookie} from "sfcookies";

export default function RegistrationForm() {
    const api_url = process.env.REACT_APP_API_URL
    const [registering, isRegistering] = useState(false)

    async function handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            isRegistering(true)
            await axios.put(api_url + "user/register", {
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
                if (err.message.includes("409")) window.alert("Username already exists")
                else window.alert("Unknown error")
            })
            form.reset()
            isRegistering(false)
        }
    }

    return (
        <div id={"registration-wrapper"}>
            <h4>Registration</h4>
            <form id={"registration-form"} noValidate onSubmit={handleSubmit}>
                <input className={"form-input"} required type="text" placeholder="Enter username"/>
                <input className={"form-input"} required type="password" placeholder="Password"/>
                <p className="input-description">
                    We'll never share your personal information with anyone else.
                </p>
                <button id={"registration-btn"} type="submit">{registering ? "Loading..." : "Register"}</button>
            </form>
        </div>
    )
}