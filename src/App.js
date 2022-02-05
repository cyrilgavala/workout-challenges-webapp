import './App.css';
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./containers/Dashboard";
import Footer from "./components/Footer";
import {useState} from "react";
import axios from "axios";

export default function App() {

    const [user, setUser] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [loginActive, setActive] = useState(true)

    const login = async (data) => {
        setLoading(true)
        setError("")
        await axios.post(process.env.REACT_APP_API_URL + "user/login", {
            name: data.username,
            pass: btoa(data.password)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                setUser(res.data.name)
            }
        }).catch(err => {
            if (err.message.includes("409")) {
                setError("Wrong password")
            } else if (err.message.includes("404")) {
                setError("User not found. Please register.")
            } else {
                setError("Unknown error")
            }
        })
        setLoading(false)
    }

    const register = async (data) => {
        setLoading(true)
        setError("")
        await axios.put(process.env.REACT_APP_API_URL + "user/register", {
            name: data.username,
            pass: btoa(data.password)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                setUser(res.data.name)
            }
        }).catch(err => {
            if (err.message.includes("409")) {
                setError("Username already exists")
            } else {
                setError("Unknown error")
            }
        })
        setLoading(false)
    }

    const logout = () => {
        setUser("")
    }

    if (user.length === 0) {
        return <div className={"App"}>
            <h3>Welcome in workout challenges</h3>
            <div id={"signInUp-wrapper"}>
                <div id={"login-wrapper"} className={loginActive ? "active" : "inactive"}>
                    <p>Sign up</p>
                    <LoginForm login={login} loading={loading}/>
                    <p className={"switch"}>Not a member? <button disabled={loading}
                                                                  onClick={() => setActive(false)}>Sign in</button></p>
                </div>
                <div id={"registration-wrapper"} className={loginActive ? "inactive" : "active"}>
                    <p>Sign in</p>
                    <RegistrationForm register={register} loading={loading}/>
                    <p className={"switch"}>Already a member? <button disabled={loading}
                                                                      onClick={() => setActive(true)}>Sign up</button>
                    </p>
                </div>
                {error && <p onClick={() => setError("")}>Error: {error}</p>}
            </div>
            <Footer/>
        </div>
    } else {
        return <div className={"App"}>
            <Dashboard logout={logout} user={user}/>
        </div>
    }
}