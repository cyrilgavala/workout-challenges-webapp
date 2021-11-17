import './App.css';
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./containers/Dashboard";
import Footer from "./components/Footer";
import {read_cookie} from "sfcookies";

export default function App() {

    const user = read_cookie("username")

    return (
        <div className={"App"}>
            {user.length === 0 && <h3>Welcome in workout challenges</h3>}
            {user.length === 0 && <LoginForm/>}
            {user.length === 0 && <RegistrationForm/>}
            {user.length > 0 && <Dashboard/>}
            {user.length === 0 && <Footer/>}
        </div>
    )
}