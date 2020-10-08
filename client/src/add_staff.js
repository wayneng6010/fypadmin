import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// link this page to another page
import { Link } from "react-router-dom";

class add_staff extends Component {
	constructor() {
		super();
		// this.startup();
		this.state = {
			sending_mail: false,
		};
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

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (confirmed_case_check_in_id) => {
		this.setState({ modal_show: true });
		this.view_casual_contacts(confirmed_case_check_in_id);
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		// get form input value
		const fname = this.refs.fname.value,
			email_address = this.refs.email_address.value,
			role = this.refs.role.value;

		if (
			fname == null ||
			fname == "" ||
			email_address == null ||
			email_address == "" ||
			role == null ||
			role == ""
		) {
			alert("Please fill in all the input");
			return;
		}

		this.setState({ sending_mail: true });

		var psw_length = 10,
			character =
				"!@#$^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			random_psw = "";
		for (var i = 0, x = character.length; i < psw_length; ++i) {
			random_psw += character.charAt(Math.floor(Math.random() * x));
		}

		await fetch("/add_new_staff", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fname: fname,
				email_address: email_address,
				role: role,
				random_psw: random_psw,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((response) => {
				if (response == "success") {
					alert("Email has been sent to the new staff");
					window.location.reload();
				} else if (response == "email_existed") {
					alert("This email is existed in staff list. Email was not sent.");
				} else if (response == "send_email_failed") {
					alert("Email failed to send");
				} else {
					alert(response);
				}
				this.setState({ sending_mail: false });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var { sending_mail } = this.state;

		return (
			<div class="">
				<NavBar />

				<div class="page_header">
					<div class="page_title">Add New Staff</div>
				</div>
				<div class="page_content">
					<h2>Add New Staff</h2>
					<br />
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
								<label for="fname">Full Name</label>
							</div>
							<input
								placeholder="Full Name"
								type="text"
								className="form-control"
								name="fname"
								id="fname"
								ref="fname"
								required
							/>
						</div>
						<br />

						<div class="input_outer">
							<div class="label_outer">
								<label for="email_address">Email Address</label>
							</div>
							<input
								placeholder="Email Address"
								type="email"
								className="form-control"
								name="email_address"
								id="email_address"
								ref="email_address"
								required
							/>
						</div>
						<br />

						<div class="input_outer">
							<div class="label_outer">
								<label for="role">Role</label>
							</div>
							<select className="form-control" name="role" id="role" ref="role">
								<option value={1}>Admin</option>
								<option value={0}>Staff</option>
							</select>
						</div>
						<br />
						<br />

						<input
							id="search_submit_btn"
							class="btn btn-success"
							type="submit"
							value="Add Staff"
						/>
					</form>
					<br />
					{sending_mail == true ? (
						<div class="alert alert-primary w-50" role="alert">
							Please wait while the mail is being sent.
						</div>
					) : (
						<p></p>
					)}
				</div>
			</div>
		);
	}
}

export default add_staff;
