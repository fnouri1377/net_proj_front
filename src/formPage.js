import React from 'react'
import './index.css'
import DisplayMap from './displayMap'

export default class FormPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: {},
            form: this.props.form,
            errorMessage: '',
            successfulMessgage: '',
        }
    }

    handleChange = (key, e) => {
        const { values } = this.state;
        this.setState({
            values: { ...values, [key]: e.target.value },
            errorMessage: '',
            successfulMessgage: ''
        })
        console.log("value changed. values : ", values, " and e is :", e)
    }

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

    getAreas = async () => {
        let { values, form } = this.state;
        form.fields.map(async (item, i) => {
            console.log("dnljdbvgljgbnaekng;k", item)
            if (item.fieldType === 'Location') {
                console.log(' lat o longi ke mire be server => ', values[item.name].lat, ' , ', values[item.name].long)
                fetch(`https://shrouded-shore-40312.herokuapp.com/api/testpoint/${values[item.name].lat}/${values[item.name].long}`, {
                    // mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            response.json().then(async (json) => {
                                let loc = values[item.name]
                                this.setState({
                                    values: { ...values, [item.name]: { ...loc, areas: json.foundAreas } }
                                })
                                values = { ...values, [item.name]: { ...loc, areas: json.foundAreas } }
                                console.log("Fatemehhhhhh : ", values)
                                
                                if (i === form.fields.length - 1) {
                                    try {
                                        console.log("2222Fatemehhhhhh : ", values)
                                        const data = await this.putData(`https://shrouded-shore-40312.herokuapp.com/api/forms/send`, values);
                                        console.log("send to server => ", JSON.stringify(data));
                                        this.setState({
                                            errorMessage: '',
                                            successfulMessgage: 'Your data was sent successfully.',
                                        })
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }

                            });
                        }
                    })

            } else if (i === form.fields.length - 1) {
                try {
                    console.log("2222Fatemehhhhhh : ", values)
                    const data = await this.putData(`https://shrouded-shore-40312.herokuapp.com/api/forms/send`, values);
                    console.log("send to server => ", JSON.stringify(data));
                    this.setState({
                        errorMessage: '',
                        successfulMessgage: 'Your data was sent successfully.',
                    })

                } catch (error) {
                    console.error(error);
                }
            }
        })

        return new Promise(function (resolve, reject) {
            return resolve(values);
        });
    }

    submit = async () => {
        let { values, form } = this.state;
        let err = false;
        form.fields.map((item, i) => {
            if (item.required && !values[item.name] && !err) {
                console.log('what is required and not filled => ', item.title)
                this.setState({
                    errorMessage: `Please Fill the ${item.title} Field.`
                })
                err = true;
                return;
            }
        })

        if (!err) {
            await this.getAreas();
        }
        err = false
    }

    onChangeMarker = (lat, long, name) => {
        const { values } = this.state;
        console.log("=> onChangeMarker , lat : ", lat, " lng : ", long)
        this.setState({
            values: { ...values, [name]: { lat: lat, long: long } }
        })
    }

    componentDidMount() {
        let values = this.state.values;
        console.log("Component did mount => form is :", this.state.form)
        this.setState({
            values: { ...values, 'username': this.props.username, 'formName': this.state.form.title }
        })
        values = { ...values, 'username': this.props.username, 'formName': this.state.form.title };
        console.log("###Component did mount values => ", values)
        !!this.state.form && this.state.form.fields.map((item, i) => {
            if (item.options.length > 0 && item.options != undefined && !!item.options) {
                console.log("##### item.options[0].label :", item.options[0].label)
                this.setState({
                    values: { ...values, [item.name]: item.options[0].label }
                })
                values = { ...values, [item.name]: item.options[0].label };
            }

            if (item.fieldType === 'Location' && !item.required) {
                this.setState({
                    values: { ...values, [item.name]: { lat: 18.5204, long: 73.8567 } }
                })
                values = { ...values, [item.name]: { lat: 18.5204, long: 73.8567 } };
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.form !== this.state.form) {
            //Perform some operation
            this.setState({ form: nextProps.form });
        }
    }

    render() {
        return (
            !!this.state.form ? (<div>
                <h4 className={"usernameBox"}>User: {this.props.username}</h4>
                <form className="formContainer">
                    <p className="formTitle">{this.state.form.title}</p>
                    <br />
                    {!!this.state.form && this.state.form.fields.map((item, i) => {
                        return (<div>
                            <p>{item.title}</p>
                            {(item.fieldType === 'Text' && item.options.length <= 0) ? (<input type='text' required={item.required} value={this.state.values[item.name]} onChange={(e) => this.handleChange(item.name, e)}></input>) : null}
                            {(item.fieldType === 'Date' && item.options.length <= 0) ? (<input type='date' required={item.required} value={this.state.values[item.name]} onChange={(e) => this.handleChange(item.name, e)}></input>) : null}
                            {(item.fieldType === 'Number' && item.options.length <= 0) ? (<input type='number' required={item.required} value={this.state.values[item.name]} onChange={(e) => this.handleChange(item.name, e)}></input>) : null}
                            {(item.fieldType === 'Location' && item.options.length <= 0) ? (<DisplayMap name={item.name} onChange={this.onChangeMarker} />) : null}
                            {(item.options.length > 0 && item.options != undefined && !!item.options) ? (<select className={"selectOption"} name={item.name} onChange={(e) => this.handleChange(item.name, e)}>
                                {item.options.map((option) => {
                                    return (<option value={option.value}>{option.label}</option>)
                                })}
                            </select>) : null}
                        </div>
                        )
                    })}
                    <br /><br />
                    <div className="submitButton marginTop" onClick={this.submit}>Submit</div>
                    <br />
                </form>
                <p className="errorMessage">{this.state.errorMessage}</p>
                <p className="successfulMessgage">{this.state.successfulMessgage}</p>
            </div>) : <div>Form Not Found :(</div>
        )
    }
}