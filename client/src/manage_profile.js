import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class manage_profile extends Component {
	constructor() {
		super();
		this.verifyToken();
		this.state = {
			profile_details: null,
			updated_phone_no: null,
			current_psw: null,
			new_psw: null,
			con_new_psw: null,
			verify_token: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.startup();
	}

	verifyToken = async () => {
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

	startup = async () => {
		// alert(this.state.group_record_id);
		await fetch("/get_own_profile_details", {
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
				if (!jsonData.hasOwnProperty("phone_no")) {
					jsonData.phone_no = "-";
				}
				if (jsonData.role == 1) {
					jsonData.role = "Admin";
				} else if (jsonData.role == 0) {
					jsonData.role = "Staff";
				}
				if (jsonData.first_login == true) {
					jsonData.first_login = "No";
				} else if (jsonData.first_login == false) {
					jsonData.first_login = "Yes";
				}
				jsonData.date_created = jsonData.date_created
					.replace("T", " ")
					.substring(0, jsonData.date_created.indexOf(".") - 3);
				this.setState({ profile_details: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	handleCopyID = (sid) => {
		navigator.clipboard.writeText(sid);
		alert("ID copied: " + sid);
	};

	updatePhoneNo = async () => {
		var { updated_phone_no } = this.state;

		if (updated_phone_no == null) {
			alert("There is no update on the phone number");
			return;
		}

		updated_phone_no = updated_phone_no.trim().replace(/\s/g, "");

		if (updated_phone_no == "") {
			alert("Please enter your phone number");
			return;
		} else if (/\D/.test(updated_phone_no)) {
			// if contains non-digit character
			alert("Please enter number only");
			return;
		} else if (updated_phone_no.substring(0, 1) !== "0") {
			alert("Invalid phone number");
			return;
		} else if (
			updated_phone_no.substring(0, 2) == "04" &&
			(updated_phone_no.length < 9 || updated_phone_no.length > 10)
		) {
			alert("Invalid phone number");
			return;
		} else if (
			updated_phone_no.substring(0, 2) == "01" &&
			(updated_phone_no.length < 10 || updated_phone_no.length > 11)
		) {
			alert("Invalid phone number");
			return;
		} else if (
			updated_phone_no.substring(0, 2) !== "01" &&
			updated_phone_no.substring(0, 2) !== "04"
		) {
			alert("Invalid phone number");
			return;
		}

		await fetch("/update_own_phone_number", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ updated_phone_no: updated_phone_no }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((jsonData) => {
				if (jsonData == "success") {
					alert("Phone number updated successfully");
				} else if (jsonData == "failed") {
					alert("Phone number existed in the other staff's record");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	changePassword = async () => {
		// input value
		var { current_psw, new_psw, con_new_psw } = this.state;

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
		await fetch("/change_psw", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					current_psw: current_psw,
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
					alert(
						"Current password is incorrect or new password is same as current password"
					);
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var {
			profile_details,
			updated_phone_no,
			current_psw,
			new_psw,
			con_new_psw,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">Manage Profile</div>
				</div>
				<div class="page_content">
					<h2>Manage Profile</h2>

					<br />
					{profile_details == null ? (
						<p>Loading...</p>
					) : (
						<div>
							<div class="row mb-1">
								<h5 class="col-sm-2">ID</h5>
								<p class="lead col-sm-2 mt-n1">{profile_details._id}</p>
							</div>
							<div class="row mb-1">
								<h5 class="col-sm-2">Full Name</h5>
								<p class="lead col-sm-2 mt-n1">{profile_details.fname}</p>
							</div>
							<div class="row mb-1">
								<h5 class="col-sm-2">Email</h5>
								<p class="lead col-sm-2 mt-n1">{profile_details.email}</p>
							</div>
							<div class="row mb-3">
								<h5 class="col-sm-2">Phone No.</h5>
								<input
									placeholder="Phone No."
									type="text"
									className="form-control col-sm-2 mt-n2 ml-2"
									name="phone_no"
									id="phone_no"
									ref="phone_no"
									maxLength={11}
									value={
										updated_phone_no == null
											? profile_details.phone_no
											: updated_phone_no
									}
									onChange={(e) => {
										this.setState({ updated_phone_no: e.target.value });
									}}
									required
								/>
								<button
									class="btn btn-secondary col-sm-1 ml-2 mt-n2"
									onClick={() => {
										this.updatePhoneNo();
									}}
									type="submit"
								>
									Update
								</button>
							</div>
							<div class="row mb-1">
								<h5 class="col-sm-2">Role</h5>
								<p class="lead col-sm-2 mt-n1">{profile_details.role}</p>
							</div>
							<div class="row mb-1">
								<h5 class="col-sm-2">Date Created</h5>
								<p class="lead col-sm-2 mt-n1">
									{profile_details.date_created}
								</p>
							</div>
							<br />
							<hr />
							<br />
							<h3>Change Password</h3>
							<br />
							<br />
							<div class="row mb-4">
								<h5 class="col-sm-2">Current Password</h5>
								<input
									placeholder="Current Password"
									type="password"
									className="form-control col-sm-2 mt-n2 ml-2"
									name="current_psw"
									id="current_psw"
									ref="current_psw"
									value={current_psw}
									onChange={(e) => {
										this.setState({ current_psw: e.target.value });
									}}
									required
								/>
							</div>
							<div class="row mb-4">
								<h5 class="col-sm-2">New Password</h5>
								<input
									placeholder="New Password"
									type="password"
									className="form-control col-sm-2 mt-n2 ml-2"
									name="new_psw"
									id="new_psw"
									ref="new_psw"
									value={new_psw}
									onChange={(e) => {
										this.setState({ new_psw: e.target.value });
									}}
									required
								/>
							</div>
							<div class="row mb-4">
								<h5 class="col-sm-2">Confirm New Password</h5>
								<input
									placeholder="Confirm New Password"
									type="password"
									className="form-control col-sm-2 mt-n2 ml-2"
									name="con_new_psw"
									id="con_new_psw"
									ref="con_new_psw"
									value={con_new_psw}
									onChange={(e) => {
										this.setState({ con_new_psw: e.target.value });
									}}
									required
								/>
							</div>
							<br />
							<button
								class="btn btn-success col-sm-2"
								onClick={() => {
									this.changePassword();
								}}
								type="submit"
							>
								Change Password
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default manage_profile;
