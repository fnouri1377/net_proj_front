import React from "react";
import "./index.css";
import { withRouter } from "react-router-dom";

class FormInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedInfo: this.props.info,
      originalInfo: this.props.info,
      predifinedAreasName: [],
      selectedGeolocationField: "",
      selectedPredefinedArea: "",
      errorMessage: "",
      go: false
    };
  }

  showDetails = id => {
    this.props.setFormDetailsId(id);
    console.log("ididididi ", id);
    this.props.history.push(
      `/api/controlCenterAgent/forms/${this.props.id}/details`
    );
  };

  createTable = () => {
    let table = [];
    let row = [];

    row.push(<th> username</th>);
    for (let key in this.state.displayedInfo[0].fields) {
      console.log("mememem", typeof this.state.displayedInfo[0].fields[key]);
      if (
        typeof this.state.displayedInfo[0].fields[key] === "object" &&
        !!this.state.displayedInfo[0].fields[key].lat
      ) // so its location
      {
        row.push(<th>Areas For Field {key}</th>);
      }
    }
    table.push(<tr className='headerTr'>{row}</tr>);

    for (let i = 0; i < this.state.displayedInfo.length; i++) {
      row = [];
      row.push(<td>{this.state.displayedInfo[i].username}</td>);
      for (let key in this.state.displayedInfo[i].fields) {
        console.log(
          "mememem222",
          typeof this.state.displayedInfo[i].fields[key]
        );
        if (
          typeof this.state.displayedInfo[i].fields[key] === "object" &&
          !!this.state.displayedInfo[i].fields[key].lat
        ) // so its location
        {
          let foundAreas = this.state.displayedInfo[i].fields[key].areas;
          let areasStr = "";
          for (let j = 0; j < foundAreas.length; j++) {
            areasStr += foundAreas[j];
            if (j !== foundAreas.length - 1) {
              areasStr += ", ";
            }
          }
          row.push(<td>{areasStr}</td>);
        }
      }
      table.push(
        <tr className='clickableTr rowsTr' onClick={() => this.showDetails(this.state.displayedInfo[i]._id)}>
          {row}
        </tr>
      );
    }
    return table;
  };

  getLocationfieldNames = () => {
    let names = [];
    for (let key in this.state.originalInfo[0].fields) {
      if (
        typeof this.state.originalInfo[0].fields[key] === "object" &&
        !!this.state.originalInfo[0].fields[key].lat
      ) // so its location
      {
        names.push(key);
      }
    }
    return names;
  };

  getPredefinedAreas = () => {
    let names = [];
    fetch(`https://shrouded-shore-40312.herokuapp.com/api/areas`, {
      // mode: "no-cors",
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          json.resolve.map((item, i) => {
            console.log("jsoooon => ", item.properties.name);
            names.push(item.properties.name);
            if (i === json.resolve.length - 1) {
              this.setState({
                predifinedAreasName: names,
              });
            }
          });
        });
      }
    });
  };

  selectGeolocationField = name => {
    this.setState({
      selectedGeolocationField: name
    });
  };

  selectPredefinedArea = name => {
    this.setState({
      selectedPredefinedArea: name
    });
  };

  filterTable = () => {
    if (this.state.selectedGeolocationField === "") {
      this.setState({
        errorMessage: "Please Choose a Location Field."
      });
    } else if (this.state.selectedPredefinedArea === "") {
      this.setState({
        errorMessage: "Please Choose an Area."
      });
    } else {
      let info = this.state.originalInfo.filter(item => {
        let areas = item.fields[this.state.selectedGeolocationField].areas;
        let exist = false;
        areas.map((area, i) => {
          if (area === this.state.selectedPredefinedArea) {
            exist = true;
          }
        });
        return exist;
      });
      console.log("FILTERED INFO :", info);
      this.setState({
        displayedInfo: info,
        errorMessage: "",
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.info !== this.state.originalInfo) {
      //Perform some operation
      this.setState({
        originalInfo: nextProps.info,
        displayedInfo: nextProps.info
      });
    }
  }

  componentDidMount() {
    this.getPredefinedAreas();
  }

  render() {
    return (
      <div>
        <h4 className={"usernameBox"}>User: {this.props.username}</h4>

        {this.state.displayedInfo.length <= 0 ? (
          <p>No Data to Show!</p>
        ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>{this.props.info[0].formName}</h1>
              <table>{this.createTable()}</table>
            </div>
          )}

        {this.state.originalInfo.length > 0 ? (
          <div className={"centerDiv"}>
            <select
              className={"marginTop selectOption"}
              onChange={e => this.selectGeolocationField(e.target.value)}
            >
              <option disabled selected value>
                {" "}
                -- Select a Location Field --{" "}
              </option>
              {this.getLocationfieldNames().map(name => {
                return <option value={name}>{name}</option>;
              })}
            </select>
          </div>
        ) : null}

        <div className={"centerDiv"}>
          <select
            className={"marginTop selectOption"}
            onChange={e => this.selectPredefinedArea(e.target.value)}
          >
            <option disabled selected value>
              {" "}
              -- Select an Area --{" "}
            </option>
            {this.state.predifinedAreasName.map(name => {
              console.log("MYMYMYMY ", name);
              return <option value={name}>{name}</option>;
            })}
          </select>
        </div>
        <div className="submitButton marginTop" onClick={this.filterTable}>
          Filter
        </div>
        <p className="errorMessage">{this.state.errorMessage}</p>
      </div>
    );
  }
}

export default withRouter(FormInfo);