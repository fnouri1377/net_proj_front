import React from "react";
import "./index.css";
import DisplayMap from "./displayMap";
import { withRouter } from "react-router-dom";
import { CSVLink } from "react-csv";

class FormInfoDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      ready: false,
      formFormat: true,
    };
  }

  setValues = () => {
    this.props.info.map((item, i) => {
      if (item._id === this.props.formDetailsId) {
        console.log("######### this.props.id =>", this.props.formDetailsId);
        this.setState({
          values: item.fields,
        });
      }
    });
  };

  createTable = () => {
    console.log('CREATE TABLE : values : ', this.state.values, " this.props.form.fields :", this.props.form.fields)
    let table = [];
    let headers = [];
    let row = [];

    this.props.form.fields.map((item, i) => {
      headers.push(<th>{item.title}</th>);
    });

    table.push(<tr className='headerTr'>{headers}</tr>);

    this.props.form.fields.map((item, i) => {
      if (
        typeof this.state.values[item.name] === "object" &&
        !!this.state.values[item.name].lat
      ) // so its location
      {
        let str = "";
        let index = 0;
        for (let key in this.state.values[item.name]) {
          str += key + " : " + this.state.values[item.name][key];
          if (index !== this.state.values[item.name].areas.length + 1)
            str += "  -  ";
          index++;
        }
        row.push(<td>{str}</td>);
      } else {
        row.push(<td>{this.state.values[item.name]}</td>);
      }
    });

    table.push(<tr>{row}</tr>);
    return table;
  };

  getCsvData = () => {
    let csvData = [];
    let csvRow = [];

    this.props.form.fields.map((item, i) => {
      csvRow.push(item.title);
    });

    csvData.push(csvRow);

    csvRow = [];
    this.props.form.fields.map((item, i) => {
      if (
        typeof this.state.values[item.name] === "object" &&
        !!this.state.values[item.name].lat
      ) // so its location
      {
        let str = "";
        let index = 0;
        for (let key in this.state.values[item.name]) {
          str += key + " : " + this.state.values[item.name][key];
          if (index !== this.state.values[item.name].areas.length + 1)
            str += "  -  ";
          index++;
        }
        csvRow.push(str);

      } else {
        csvRow.push(this.state.values[item.name]);
      }
    });

    csvData.push(csvRow);
    return csvData;
  };

  toggleFormat = () => {
    let { formFormat } = this.state;
    this.setState({
      formFormat: !formFormat
    });
  };

  componentDidMount() {
    this.setValues();
    this.setState({
      ready: true,
    });
  }

  render() {
    console.log("this.props.info =>>>", this.props.info);
    return !!this.props.form || this.state.ready ? (
      this.state.formFormat ? (
        <div>
          <h4 className={"usernameBox"}>User: {this.props.username}</h4>
          <form className="formContainer">
            <p className="formTitle">{this.props.form.title}</p>
            <br />
            {!!this.props.form &&
              this.props.form.fields.map((item, i) => {
                console.log(
                  "***this.state.values[item.name] : values :",
                  this.state.values,
                  " feilds : ",
                  this.props.form.fields
                );
                return (
                  <div>
                    <p>{item.title}</p>
                    {item.fieldType === "Text" && item.options.length <= 0 ? (
                      <input
                        type="text"
                        value={this.state.values[item.name]}
                        disabled
                      ></input>
                    ) : null}
                    {item.fieldType === "Date" && item.options.length <= 0 ? (
                      <input
                        type="date"
                        value={this.state.values[item.name]}
                        disabled
                      ></input>
                    ) : null}
                    {item.fieldType === "Number" && item.options.length <= 0 ? (
                      <input
                        type="number"
                        value={this.state.values[item.name]}
                        disabled
                      ></input>
                    ) : null}
                    {item.fieldType === "Location" &&
                      item.options.length <= 0 ? (
                        <DisplayMap
                          name={item.name}
                          onChange={() => { }}
                          draggable={false}
                          lat={
                            !!this.state.values[item.name]
                              ? this.state.values[item.name].lat
                              : undefined
                          }
                          lng={
                            !!this.state.values[item.name]
                              ? this.state.values[item.name].long
                              : undefined
                          }
                        />
                      ) : null}
                    {item.options.length > 0 &&
                      item.options != undefined &&
                      !!item.options ? (
                        <select name={item.name} className={"selectOption"} disabled>
                          {item.options.map(option => {
                            console.log(
                              "this.state.values[item.name] : ",
                              this.state.values[item.name],
                              " option.label: ",
                              option.label
                            );
                            return (
                              <option
                                value={option.value}
                                selected={
                                  this.state.values[item.name] === option.label
                                    ? true
                                    : false
                                }
                              >
                                {option.label}
                              </option>
                            );
                          })}
                        </select>
                      ) : null}
                  </div>
                );
              })}
            <br />
            <br />
            <br />
          </form>
          <div className="submitButton marginTop" onClick={this.toggleFormat}>
            See Table Format
          </div>
        </div>
      ) : (
          <div>
            <h4 className={"usernameBox"}>User: {this.props.username}</h4>
            <h4>Table Format</h4>
            <table>{this.createTable()}</table>
            <div className="submitButton marginTop" onClick={this.toggleFormat}>
              See Form Format
            </div>
            <div className="submitButton marginTop">
              {/* onClick={this.toggleFormat}> */}
              <CSVLink className='csvLink' data={this.getCsvData()} >Download csv File</CSVLink>
            </div>
          </div>
        )
    ) : (
        <div>Please Wait ...</div>
      );
  }
}

export default withRouter(FormInfoDetails);