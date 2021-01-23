import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {useHistory} from "react-router"
import image from "../images/login_image.png";
import axios from "axios";

function RegistrationForm() {
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
          history.push("/login")
        }
      }).catch(err => {
        form.reset()
        if (err.message.includes("409")) window.alert("Username already exists")
        else if (err.message.includes("500")) window.alert("Unknown error")
      })
    }
  }

  function switchToLogin() {
    history.push("/login");
  }

  return (
    <div className="App">
      <img id={"image"} src={image} alt={""}/>
      <div className={"formWrapper"}>
        <Form id={"registerForm"} noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="register">
            <Form.Control required type="text" placeholder="Enter username"/>
            <Form.Control required type="password" placeholder="Password"/>
            <Form.Text className="text-muted">
              We'll never share your personal information with anyone else.
            </Form.Text>
          </Form.Group>
          <Button id={"registerButton"} variant="outline-light" size={"lg"} type="submit">
            Register
          </Button>
        </Form>
      </div>
      <div>
        <p>Already a user?</p>
        <Button id={"switchToLogin"} variant="outline-light" size={"sm"} type="button" onClick={switchToLogin}>
          Log in
        </Button>
      </div>
    </div>
  )
}

export default RegistrationForm;