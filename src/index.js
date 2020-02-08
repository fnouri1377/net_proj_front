import React from "react";
import ReactDOM from "react-dom";
import DisplayForms from "./displayForms";
import FormPage from "./formPage";
import LoginPage from "./loginPage";
import SignupPage from './signupPage';
import { BrowserRouter as Router, Route } from "react-router-dom";
import FormsListReport from './formsListReport';
import FormInfo from './formInfo';
import FormInfoDetails from './formInfoDetails';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFormId: null,
      currentForm: null,
      fieldAgent: true,
      username: '',
      currentFormInfo: [],
      formDetailsId: null,
    };
  }

  setUsername = (username) => {
    console.log('setUsername was called => ', username)
    this.setState({
      username: username,
    })
  }

  setForm = (id, form) => {
    console.log('SET FORM : id :', id, ', form :', form)
    this.setState({
      currentFormId: id,
      currentForm: form
    });
    console.log('@@@@SET FORM : id :', this.state.currentFormId, ', form :', this.state.currentForm)
  };

  setFormDetailsId = (id) => {
    this.setState({
      formDetailsId: id,
    })
  }

  setFormInfo = (resolve) => {
    console.log("setFormInfo => ", resolve)
    this.setState({
      currentFormInfo: resolve,
    });
  }

  chooseRole = isFieldAgent => {
    console.log("ENTER chooseRole isFieldAgent is : " + isFieldAgent)
    this.setState({
      fieldAgent: isFieldAgent
    });
    console.log("chooseRole => ", this.state.fieldAgent)
  };

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/api/login">
            <LoginPage chooseRole={this.chooseRole} setUsername={this.setUsername} />
          </Route>

          <Route exact path="/api/signup">
            <SignupPage chooseRole={this.chooseRole} setUsername={this.setUsername} />
          </Route>

          <Route exact path="/api/fieldAgent/forms">
            <DisplayForms username={this.state.username} setForm={this.setForm} />
          </Route>

          <Route exact path="/api/controlCenterAgent/forms">
            <FormsListReport username={this.state.username} setForm={this.setForm} setFormInfo={this.setFormInfo} />
          </Route>
          
          <Route exact path={`/api/fieldAgent/forms/${this.state.currentFormId}`}>
            <FormPage
              id={this.state.currentFormId}
              form={this.state.currentForm}
              username={this.state.username}
            />
          </Route>
          
          <Route exact path={`/api/controlCenterAgent/forms/${this.state.currentFormId}`}>
            <FormInfo
              id={this.state.currentFormId}
              form={this.state.currentForm}
              username={this.state.username}
              info={this.state.currentFormInfo}
              setFormDetailsId={this.setFormDetailsId}
            />
          </Route>

          <Route exact path={`/api/controlCenterAgent/forms/${this.state.currentFormId}/details`}>
            <FormInfoDetails
              id={this.state.currentFormId}
              form={this.state.currentForm}
              username={this.state.username}
              info={this.state.currentFormInfo}
              formDetailsId={this.state.formDetailsId}
            />
          </Route>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
