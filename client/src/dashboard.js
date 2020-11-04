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
			dashboard_data: null,
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

		await fetch("/getDashboardData", {
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
				this.setState({ dashboard_data: jsonData });
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
		var { verify_token, login_name, last_login, dashboard_data } = this.state;
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
							{dashboard_data == null ? (
								<p>Loading...</p>
							) : (
								<div class="row my-4 dash_outer">
									<div class="col-sm-2 dash_box dash_0">
										<p class="left_top">Confirmed Case</p>
										<span class="right_bottom">{dashboard_data[4]}</span>
									</div>
									<div class="col-sm-2 dash_box dash_1">
										<p class="left_top">Casual Contact</p>
										<span class="right_bottom">{dashboard_data[0]}</span>
									</div>
									<div class="col-sm-2 dash_box dash_2">
										<p class="left_top">Hotspot</p>
										<span class="right_bottom">{dashboard_data[1]}</span>
									</div>
									<div class="col-sm-2 dash_box dash_3">
										<p class="left_top">Health Risk Assessment Respondent</p>
										<span class="right_bottom">{dashboard_data[2]}</span>
									</div>
									<div class="col-sm-2 dash_box dash_4">
										<p class="left_top">Staff</p>
										<span class="right_bottom">{dashboard_data[3]}</span>
									</div>
								</div>
							)}
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
