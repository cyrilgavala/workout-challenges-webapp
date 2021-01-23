import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {useHistory} from "react-router";
import image from "../images/login_image.png";
import axios from "axios"
import { bake_cookie } from 'sfcookies';

function LoginForm() {
  const api_url = "https://workout-challenges-api.herokuapp.com/"
  let history = useHistory();
  const [validated, setValidated] = useState(false);

  async function handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
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
          bake_cookie("username", res.data.name);
          history.push("/dashboard")
        }
      }).catch(err => {
        form.reset()
        if (err.message.includes("409")) window.alert("Wrong password")
        else if (err.message.includes("500")) window.alert("Unknown error")
      })
    }
  }

  function switchToRegister() {
    history.push("/register");
  }

  return (
    <div className="App">
      <h4>Welcome in workout challenges</h4>
      <img id={"image"} src={image} alt={""}/>
      <div className={"formWrapper"}>
        <Form id={"loginForm"} noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="loginName">
            <Form.Control required type="text" placeholder="Enter username"/>
          </Form.Group>
          <Form.Group controlId="loginPass">
            <Form.Control required type="password" placeholder="Password"/>
          </Form.Group>
          <Button id={"loginButton"} variant="outline-light" size={"lg"} type="submit">
            Log in
          </Button>
        </Form>
      </div>
      <div>
        <p>Not a user?</p>
        <Button id={"switchToRegister"} variant="outline-light" size={"sm"} type="button"
                onClick={e => switchToRegister(e)}>
          Register
        </Button>
      </div>
    </div>
  )
}

export default LoginForm;