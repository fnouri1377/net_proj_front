import React from "react";
import "./index.css";
import { Link, withRouter } from 'react-router-dom';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      errorMessage: "",
    };
  }

  handleChange = (key, e) => {
    const { values } = this.state;
    this.setState({
      values: { ...values, [key]: e.target.value },
      errorMessage: "",
    });
    console.log("value chanded . values : ", values, " and e is :", e);
  };

  loginAction = async () => {
    const { values } = this.state;
    if (!values['username'] || !values['password']) {
      this.setState({
        errorMessage: 'Please Fill the Fields First!'
      })
    }
    else {
      fetch(`http://localhost:4000/api/users/${values["username"]}`, {
        // mode: "no-cors",
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json && values['password'] === json.password) {
              let isFieldAgent = json.type === 'Field Agent' ? true : false;
              this.props.chooseRole(isFieldAgent)
              console.log('%%%%% isfieldAgent => ', isFieldAgent)
              this.props.setUsername(values['username'])
              if (isFieldAgent) {
                console.log("truuuuuuu")
                this.props.history.push("/api/fieldAgent/forms");
              } else {
                console.log("false")
                this.props.history.push('/api/controlCenterAgent/forms');
              }

            } else {
              this.setState({
                errorMessage: 'Wrong username or password.'
              });
            }
          });
        }
      });
    }
  }

  submitForm = e => {
    e.preventDefault();
  };

  componentDidMount() {
    this.setState({
      values: {}
    });
  }

  render() {
    return (
      <div className="centerDiv">
        <h1>Log In To Your Account</h1>
        <form className="centerDiv formContainer" onSubmit={() => this.submitForm()}>
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

          <div className="submitButton marginTop" onClick={this.loginAction}>Log In</div>
        </form>
        <Link to={`/api/signup`} >Do not have an account? Sign Up!</Link>
        <p className="errorMessage">{this.state.errorMessage}</p>
      </div>
    );
  }
}

export default withRouter(LoginPage);