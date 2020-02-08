import React from 'react';
import ReactList from 'react-list';
import './index.css';
import LinkButton from './linkButton'

export default class FormsListReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            forms: [],
        }
    }

    getForms = () => {
        fetch(`http://localhost:4000/api/forms`, {
            // mode: "no-cors",
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.setState({ forms: json })
                });
            }
        })
    }

    getForm = (i) => {
        this.state.forms.map((item) => {
            if (i === item._id) {
                console.log("Iteeeeeeeem : ", item)
                fetch(`http://localhost:4000/api/forms/info/${item.title}`, {
                    // mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            response.json().then(json => {
                                console.log('OKAY json in getForm : ', json)
                                this.props.setForm(i, item)
                                this.props.setFormInfo(json.resolve)
                            });
                        }
                    })
            }
        })
    }

    renderItem = (index, key) => {
        return (
            <LinkButton className={"link"}
                form={this.state.forms[index]}
                getForm={this.getForm}
                to={'/api/controlCenterAgent/forms/'}
            />
        );
    }

    componentDidMount() {
        this.getForms();
    }

    render() {
        return (
            <div>
                <h4 className={"usernameBox"}>User: {this.props.username}</h4>
                <h1 style={{ textAlign: "center" }}>Choose the Form You Want!</h1>
                <div>
                    <ReactList itemRenderer={this.renderItem} length={this.state.forms.length} type='uniform' />
                </div>
            </div>
        )
    }
}