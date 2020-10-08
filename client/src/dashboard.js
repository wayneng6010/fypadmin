import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";

// link this page to another page
import { Link } from "react-router-dom";

class dashboard extends Component {
	constructor() {
		super();
		this.state = {
			verify_token: false,
			login_name: null,
			last_login: null,
		};
		this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount = async () => {
		await fetch("/getLoginDetails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData[0].last_login == "undefined") {
					jsonData[0].last_login = "None";
				}

				jsonData[0].last_login = jsonData[0].last_login
					.replace("T", " ")
					.substring(0, jsonData[0].last_login.indexOf(".") - 3);

				this.setState({
					login_name: jsonData[0].fname,
					last_login: jsonData[0].last_login,
				});
			})
			.catch((error) => {
				// alert("Error: " + error);
			});
	};

	startup = async () => {
		await fetch("/verifyToken", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData === "failed") {
					this.setState({ verify_token: false });
					window.location.href = "/";
				} else if (jsonData === "success") {
					this.setState({ verify_token: true });
				} else if (jsonData === "failed_first_login") {
					this.setState({ verify_token: false });
					window.location.href = "/change_password_first_login";
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var { verify_token, login_name, last_login } = this.state;
		return (
			<div>
				{verify_token == true ? (
					<div>
						<NavBar />
						<div class="page_header">
							<div class="row">
								<div class="col-sm-2"></div>
								<div class="col-sm-5 text-right page_title">Dashboard</div>
								{login_name == null || last_login == null ? (
									<p></p>
								) : (
									<div class="col-sm-5 text-right page_subtitle">
										{"Logged in as " + login_name}
										<span class="ml-5 mr-5">
											{"Last login - " + last_login}
										</span>
									</div>
								)}
							</div>
						</div>
						<div class="page_content">
							<h1>Dashboard</h1>
						</div>
					</div>
				) : (
					<div></div>
				)}
			</div>
		);
	}
}

export default dashboard;
