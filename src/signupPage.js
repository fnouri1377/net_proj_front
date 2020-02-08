import React from "react";
import "./index.css";
import { Link, withRouter } from "react-router-dom";

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      errorMessage: ""
    };
  }

  handleChange = (key, e) => {
    const { values } = this.state;
    this.setState({
      values: { ...values, [key]: e.target.value },
      errorMessage: ""
    });
    console.log("value chanded . values : ", values, " and e is :", e);
  };

  putData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  signupAction = async () => {
    const { values } = this.state;
    if (!values['username'] || !values['password']) {
      this.setState({
        errorMessage: 'Please Fill the Fields First!'
      })
    }
    else {
      fetch(`https://shrouded-shore-40312.herokuapp.com/api/users/${values['username']}`, {
        // mode: "no-cors",
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              console.log("77777", json)
              if (json) {
                this.setState({
                  errorMessage: 'This Username Has Already Taken.'
                });
              }
              else {
                try {
                  const data = this.putData(`https://shrouded-shore-40312.herokuapp.com/api/adduser`, values);
                  console.log("send to server => ", JSON.stringify(data));
                  let isFieldAgent = values['type'] === 'Field Agent' ? true : false;
                  this.props.chooseRole(isFieldAgent)
                  this.props.setUsername(values['username'])
                  if (isFieldAgent) {
                    this.props.history.push("/api/fieldAgent/forms");
                  } else {
                    this.props.history.push('/api/controlCenterAgent/forms');
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            });
          }
        })
    }
  };

  submitForm = e => {
    e.preventDefault();
    // this.props.history.push("/api/forms");
  };

  componentDidMount() {
    this.setState({
      values: { ['type']: 'Field Agent' }
    });
  }

  render() {
    return (
      <div className="centerDiv">
        <h1>Create An Account</h1>
        <form
          className="centerDiv formContainer"
          onSubmit={() => this.submitForm()}
        >
          <input
            type="text"
            required={true}
            placeholder="username"
            className="marginTop"
            value={this.state.values["username"]}
            onChange={e => this.handleChange("username", e)}
          ></input>
          <input
            type="password"
            required={true}
            placeholder="password"
            className="marginTop"
            value={this.state.values["password"]}
            onChange={e => this.handleChange("password", e)}
          ></input>

          <select
            className="marginTop selectOption"
            onChange={e => this.handleChange("type", e)}
          >
            <option value={"Field Agent"}>Field Agent</option>
            <option value={"Control Centre Agent"}>Control Centre Agent</option>
          </select>
          <div className="submitButton marginTop" onClick={this.signupAction}>Sign Up</div>
        </form>
        <Link to={`/api/login`}>Already have an account? Log In!</Link>
        <p className="errorMessage">{this.state.errorMessage}</p>
      </div>
    );
  }
}

export default withRouter(SignupPage);