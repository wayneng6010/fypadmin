import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";

// link this page to another page
import { Link } from "react-router-dom";

class App extends Component {
	constructor() {
		super();
		// this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {};

	handleSubmit = async (e) => {
		e.preventDefault();

		// input value
		const email = this.refs.email.value,
			psw = this.refs.psw.value;

		// check login credentials
		await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					email: email,
					psw: psw,
				},
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// console.log(jsonData);
				if (jsonData == "success_first_login") {
					// alert("Login successful");
					window.location.href = "/change_password_first_login";
				} else if (jsonData == "success") {
					window.location.href = "/dashboard";
				} else if (jsonData == "failed") {
					alert("Email or password is incorrect");
				} else if (jsonData == "failed_expired") {
					alert(
						"This account is expired due to not activate within 3 days. Please contact the system administrator on this."
					);
				} else {
					alert("Error occured while login");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		return (
			<div class="login_outer">
				<div class="login_form_outer d-flex justify-content-center align-items-center">
					<div>
						<h3 class="login_title text-center">
							COVID-19 Contact Tracing System
						</h3>
						<div className="login_form_outer_inner">
							<h3 class="text-center">Staff Login</h3>
							<br />
							<div class="login_form_inner">
								<form
									name="login_form"
									method="post"
									id="login_form"
									onSubmit={this.handleSubmit}
								>
									{/* input group */}
									<input
										placeholder="Email"
										type="email"
										className="form-control"
										name="email"
										ref="email"
										required
									/>
									<br />
									<input
										placeholder="Password"
										type="password"
										className="form-control"
										name="psw"
										ref="psw"
										required
									/>
									<br />
									<input
										id="search_submit_btn"
										class="btn btn-success w-100"
										type="submit"
										value="Login"
									/>
								</form>
							</div>
							<br />
							{/* <p class="text-center">
								Forgot password? Please contact the system admin
							</p> */}
							<p class="px-5 text-center">
								This system is only accessible by medical teams of
								<br />
								<b>
									<i>Ministry of Health Malaysia</i>
								</b>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
