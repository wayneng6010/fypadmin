import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";

// link this page to another page
import { Link } from "react-router-dom";

class change_password_first_login extends Component {
	constructor() {
		super();
		// this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {
		// await fetch("/testing", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		visitor_id: "991004-07-5721",
		// 		date_from: "2020-08-24T13:54:36.038+00:00",
		// 	}),
		// })
		// 	.then((res) => {
		// 		// console.log(JSON.stringify(res.headers));
		// 		return res.json();
		// 	})
		// 	.then((jsonData) => {
		// 		alert(JSON.stringify(jsonData));
		// 		// if (jsonData) {
		// 		// 	alert("Login successful");
		// 		// 	// this.props.navigation.navigate("visitor_home");
		// 		// } else {
		// 		// 	alert("Phone number or password is incorrect");
		// 		// }
		// 	})
		// 	.catch((error) => {
		// 		alert("Error: " + error);
		// 	});
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		// input value
		const old_psw = this.refs.old_psw.value,
			new_psw = this.refs.new_psw.value,
			con_new_psw = this.refs.con_new_psw.value;

		if (new_psw !== con_new_psw) {
			alert("New password does not match");
			return;
		}

		if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(new_psw)) {
			alert(
				"New password must contain at least 8 characters with combination of number, uppercase and lowercase character"
			);
			return;
		}

		// check login credentials
		await fetch("/change_psw_first_login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					old_psw: old_psw,
					new_psw: new_psw,
				},
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// console.log(jsonData);
				if (jsonData) {
					alert("Password changed successful");
					window.location.href = "/";
				} else {
					alert("Current password is incorrect or new password is same as current password");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		return (
			<div class="">
				<div class="page_header">
					<div class="page_title">First Login - Change Password</div>
				</div>
				<div class="page_content_first_login">
					<h2 class="text-center">First Login - Change Password</h2>
					<p class="text-center lead mt-3">
						You have to change password in order to activate your account
					</p>
				</div>

				<div class="mt-5 d-flex justify-content-center align-items-center change_psw_first_login">
					<form
						name="trace_casual_contacts_form"
						method="post"
						id="trace_casual_contacts_form"
						class="add_staff_form"
						onSubmit={this.handleSubmit}
					>
						{/* input group */}
						<div class="input_outer">
							<div class="label_outer">
								<label for="old_psw">Current Password</label>
							</div>
							<input
								placeholder="Current Password"
								type="password"
								className="form-control"
								name="old_psw"
								id="old_psw"
								ref="old_psw"
								required
							/>
						</div>
						<br />

						<div class="input_outer">
							<div class="label_outer">
								<label for="new_psw">New Password</label>
							</div>
							<input
								placeholder="New Password"
								type="password"
								className="form-control"
								name="new_psw"
								id="new_psw"
								ref="new_psw"
								required
							/>
						</div>
						<br />

						<div class="input_outer">
							<div class="label_outer">
								<label for="con_new_psw">Confirm New Password</label>
							</div>
							<input
								placeholder="Confirm New Password"
								type="password"
								className="form-control"
								name="con_new_psw"
								id="con_new_psw"
								ref="con_new_psw"
								required
							/>
						</div>
						<br />
						<br />

						<div class="d-flex justify-content-center align-items-center">
							<input
								id="search_submit_btn"
								class="btn btn-success col-sm-6"
								type="submit"
								value="Change Password"
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default change_password_first_login;
