import './App.css';
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./containers/Dashboard";
import Footer from "./components/Footer";
import Modal from '@mui/material/Modal';
import {useEffect, useState} from "react";
import userService from "./service/userService";
import {bake_cookie, delete_cookie, read_cookie} from "sfcookies";
import jwt_decode from "jwt-decode";

export default function App() {

    const [accessToken, setAccessToken] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [loginActive, setActive] = useState(true)
    const [consent, setConsent] = useState(false)
    const [modalVisible, setModalVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const consentGranted = read_cookie("consent_granted")
        setModalVisible(consentGranted.length === 0)
        if (consentGranted === "true") {
            setConsent(true)
            const token = read_cookie("access_token")
            console.log(token)
            if (token.length > 0) {
                setAccessToken(token)
                setUsername(jwt_decode(token).username)
            }
        }
    }, [])

    const handleSuccessfulResponse = res => {
        if (consent) {
            bake_cookie("access_token", res.data.accessToken)
        }
        setAccessToken(res.data.accessToken)
        setUsername(res.data.name)
    }

    const login = data => {
        setError("")
        setLoading(true)
        userService.loginUser(data)
            .then((res) => handleSuccessfulResponse(res))
            .catch(err => {
                if (err.message.includes("409")) {
                    setError("Wrong password")
                } else if (err.message.includes("404")) {
                    setError("User not found. Please register.")
                } else {
                    setError("Unknown error")
                }
            })
            .finally(() => setLoading(false))
    }

    const register = data => {
        setError("")
        setLoading(true)
        userService.registerUser(data)
            .then((res) => handleSuccessfulResponse(res))
            .catch(err => {
                if (err.message.includes("409")) {
                    setError("Username already exists")
                } else {
                    setError("Unknown error")
                }
            })
            .finally(() => setLoading(false))
    }

    const logout = () => {
        setUsername("")
        setAccessToken("")
        delete_cookie("access_token")
    }

    const onModalClose = () => {
        setModalVisible(false)
    }

    const acceptCookies = () => {
        setConsent(true)
        setModalVisible(false)
        bake_cookie("consent_granted", "true")
    }

    const rejectCookies = () => {
        bake_cookie("consent_granted", "false")
        delete_cookie("access_token")
        setConsent(false)
        setModalVisible(false)
    }

    if (accessToken.length === 0) {
        return <div className={"App"}>
            <Modal open={!consent && modalVisible} onClose={() => onModalClose()}>
                <div className={"modal-content"}>
                    <p>We use Cookies on this site to enhance your experience. Click on “Accept Cookies” to allow this
                        functionality and agree to the storing of Cookies and related technologies on your device.
                        Otherwise you click "Reject Cookies". In case you want to change your decision, you need to
                        delete Cookies on this page a reload it.</p>
                    <button id={"accept"} className={"modal-btn"} onClick={acceptCookies}>Accept Cookies</button>
                    <button id={"reject"} className={"modal-btn"} onClick={rejectCookies}>Reject Cookies</button>
                </div>
            </Modal>
            <h3>Welcome in workout challenges</h3>
            <div id={"signInUp-wrapper"}>
                <div id={"login-wrapper"} className={loginActive ? "active" : "inactive"}>
                    <p>Sign up</p>
                    <LoginForm login={login} loading={loading}/>
                    <p className={"switch"}>Not a member? <button onClick={() => setActive(false)}>Sign in</button></p>
                </div>
                <div id={"registration-wrapper"} className={loginActive ? "inactive" : "active"}>
                    <p>Sign in</p>
                    <RegistrationForm register={register} loading={loading}/>
                    <p className={"switch"}>Already a member? <button onClick={() => setActive(true)}>Sign up</button>
                    </p>
                </div>
                {error && <p onClick={() => setError("")}>Error: {error}</p>}
            </div>
            <Footer/>
        </div>
    } else {
        return <div className={"App"}>
            <Dashboard logout={logout} accessToken={accessToken} username={username}/>
        </div>
    }
}