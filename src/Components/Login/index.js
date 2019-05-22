import React from "react";
import "./index.css";
import "./Mobile.css";
import { Auth } from "../../config";

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            open: false,
        }
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user", user.uid)
            }
        })
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    onLogin = () => {
        Auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((err) => { console.log("err", err) })
            .then((user) => {
                if (user) {
                    this.props.history.push("/home")
                }
            })
    }

    render() {
        return (
            <div className="loginMainDiv">
                <h1>Let's Login.</h1>
                <div className="inputs">
                    <input
                        id="email"
                        type="text"
                        required
                        onChange={this.onInputChange}
                        onKeyUp={this.enterKey}
                        placeholder="Email"
                    />
                    <input
                        id="password"
                        type="password"
                        required
                        onChange={this.onInputChange}
                        onKeyUp={this.enterKey}
                        placeholder="Password"
                    />
                </div>
                <button onClick={this.onLogin}>Login</button>
            </div>
        )
    }
}
