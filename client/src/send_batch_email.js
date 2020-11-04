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

class send_batch_email extends Component {
	constructor() {
		super();
		this.startup();
		var newLine = "\r\n";
		this.state = {
			sending_mail: false,
			confirmed_case_name: null,
			confirmed_case_ic_num: null,
			group_id: null,
			group_id_verified: false,
			verify_token: false,
			send_to: "premise_owner",
			email_subject: "Inform about Casual Contact with COVID-19 patient",
			email_content:
				"Good day," +
				newLine +
				newLine +
				"Sorry to inform that one of the COVID-19 patient have checked in to your premise. " +
				"Please wait for further instructions. " +
				"The medical team of Ministry of Health (MOH) Malaysia will contact you soon." +
				newLine +
				newLine +
				"Regards," +
				newLine +
				"Medical Team from MOH" +
				newLine +
				"COVID-19 Contact Tracing System",
		};
	}

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

	// signals that the all components have rendered properly
	componentDidMount = async () => {
		// var email_content = document.getElementById("email_content");
		// var newLine = "\r\n";
		// var content =
		// 	"Good day," +
		// 	newLine +
		// 	newLine +
		// 	"Sorry to inform that you or/and your dependent have been in casual contact with one of the COVID-19 patient. " +
		// 	"Please avoid close contact with others if possible until you get further instructions. " +
		// 	"The medical team of Ministry of Health (MOH) Malaysia will contact you soon." +
		// 	newLine +
		// 	newLine +
		// 	"Regards," +
		// 	newLine +
		// 	"Medical Team from MOH" +
		// 	newLine +
		// 	"COVID-19 Contact Tracing System";
		// email_content.value = content;
	};

	search_confirmed_case_id = async () => {
		var { group_id } = this.state;

		if (group_id == null || group_id == "") {
			alert("Please fill in the confirmed case record ID");
			return;
		}

		await fetch("/search_confirmed_case_by_id", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				group_id: group_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (!jsonData) {
					alert("Confirmed case record not found.");
					this.setState({
						group_id_verified: false,
					});
				} else {
					if (jsonData.hasOwnProperty("confirmed_case_visitor")) {
						// alert(JSON.stringify(item.confirmed_case_visitor));
						jsonData.visitor_and_dependent_fname =
							jsonData.confirmed_case_visitor.ic_fname;
						jsonData.visitor_and_dependent_ic_num =
							jsonData.confirmed_case_visitor.ic_num;
					} else if (jsonData.hasOwnProperty("confirmed_case_dependent")) {
						// alert(JSON.stringify(item.confirmed_case_dependent));
						jsonData.visitor_and_dependent_fname =
							jsonData.confirmed_case_dependent.ic_fname;
						jsonData.visitor_and_dependent_ic_num =
							jsonData.confirmed_case_dependent.ic_num;
					}
					jsonData.date_created = jsonData.date_created
						.replace("T", " ")
						.substring(0, jsonData.date_created.indexOf(".") - 3);
					// alert(jsonData.visitor_and_dependent_ic_num);
					this.setState({
						confirmed_case_ic_num: jsonData.visitor_and_dependent_ic_num,
						confirmed_case_name: jsonData.visitor_and_dependent_fname,
						confirmed_case_date_created: jsonData.date_created,
						group_id_verified: true,
					});
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	handleSubmit = async () => {
		var {
			group_id_verified,
			group_id,
			email_subject,
			email_content,
			send_to,
		} = this.state;

		if (!group_id_verified) {
			alert("Please confirm the confirmed case record first");
			return;
		}

		if (
			group_id == null ||
			group_id == "" ||
			email_subject == null ||
			email_subject == "" ||
			email_content == null ||
			email_content == ""
		) {
			alert("Please fill in all the input");
			return;
		}

		this.setState({ sending_mail: true });
		// alert(send_to);
		if (send_to == "casual_contact") {
			await fetch("/send_batch_email_casual_contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					group_id: group_id,
					email_subject: email_subject,
					email_content: email_content,
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((response) => {
					if (response == "success") {
						alert("Email has been sent to all the casual contacts");
						window.location.reload();
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
		} else if (send_to == "premise_owner") {
			await fetch("/send_batch_email_premise_owner", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					group_id: group_id,
					email_subject: email_subject,
					email_content: email_content,
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((response) => {
					if (response == "success") {
						alert("Email has been sent to all the affected premise owner");
						window.location.reload();
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
		}
	};

	send_to_onChange = () => {
		var newLine = "\r\n";
		if (this.state.send_to == "premise_owner") {
			this.setState({
				email_content:
					"Good day," +
					newLine +
					newLine +
					"Sorry to inform that one of the COVID-19 patient have checked in to your premise. " +
					"Please wait for further instructions. " +
					"The medical team of Ministry of Health (MOH) Malaysia will contact you soon." +
					newLine +
					newLine +
					"Regards," +
					newLine +
					"Medical Team from MOH" +
					newLine +
					"COVID-19 Contact Tracing System",
			});
		} else if (this.state.send_to == "casual_contact") {
			this.setState({
				email_content:
					"Good day," +
					newLine +
					newLine +
					"Sorry to inform that you or/and your dependent have been in casual contact with one of the COVID-19 patient. " +
					"Please avoid close contact with others if possible until you get further instructions. " +
					"The medical team of Ministry of Health (MOH) Malaysia will contact you soon." +
					newLine +
					newLine +
					"Regards," +
					newLine +
					"Medical Team from MOH" +
					newLine +
					"COVID-19 Contact Tracing System",
			});
		}
	};

	render() {
		var {
			confirmed_case_ic_num,
			confirmed_case_name,
			confirmed_case_date_created,
			sending_mail,
			group_id,
			email_subject,
			email_content,
			send_to,
			group_id_verified,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		return (
			<div class="">
				<NavBar />

				<div class="page_header">
					<div class="page_title">Send Batch Email</div>
				</div>
				<div class="page_content">
					<h2>Send Batch Email</h2>
					<br />

					<div class="row mb-3">
						<h5 class="col-sm-2">Confirmed Case Record ID</h5>
						<input
							placeholder="e.g. 5f4781ee048dc43e5867d748"
							type="text"
							className="form-control col-sm-3"
							name="group_id"
							id="group_id"
							ref="group_id"
							value={group_id}
							onChange={(e) => {
								this.setState({ group_id: e.target.value });
							}}
							required
						/>
						<button
							class="btn btn-secondary col-sm-1 ml-3"
							onClick={() => {
								this.search_confirmed_case_id();
							}}
							// type="submit"
						>
							Confirm
						</button>
					</div>

					{confirmed_case_ic_num == null ||
					confirmed_case_name == null ||
					confirmed_case_date_created == null ||
					group_id_verified == false ? (
						<div class="row mb-3">
							<div class="col-sm-2"></div>
							<div class="record_no_confirm_batch_mail">
								<h5>Please confirm the Confirmed Case Record</h5>
							</div>
						</div>
					) : (
						<div class="row mb-3">
							<div class="col-sm-2"></div>
							<div class="record_confirmed_batch_mail">
								<h5>Confirmed Case Record has been confirmed</h5>
								<p>{"Confirmed Case Name: " + confirmed_case_name}</p>
								<p>{"Confirmed Case IC No.: " + confirmed_case_ic_num}</p>
								<p>{"Date created: " + confirmed_case_date_created}</p>
							</div>
						</div>
					)}

					<div class="row mb-3">
						<h5 class="col-sm-2">Send To</h5>
						<select
							class="form-control col-sm-5"
							name="place_state"
							id="place_state"
							ref="place_state"
							value={this.state.send_to}
							onChange={(e) => {
								this.state.send_to = e.target.value;
								this.send_to_onChange();
							}}
						>
							<option
								selected={send_to == "premise_owner"}
								value="premise_owner"
							>
								Premise Owner
							</option>
							<option
								selected={send_to == "premise_owner"}
								value="casual_contact"
							>
								Casual Contact
							</option>
						</select>
					</div>
					<br />

					<div class="row mb-3">
						<h5 class="col-sm-2">Email Subject</h5>
						<input
							placeholder="Email Subject"
							type="text"
							className="form-control col-sm-5 email_subject"
							name="email_subject"
							id="email_subject"
							ref="email_subject"
							value={email_subject}
							onChange={(e) => {
								this.setState({ email_subject: e.target.value });
							}}
							required
						/>
					</div>
					<br />

					<div class="row mb-3">
						<h5 class="col-sm-2">Email Content</h5>

						<textarea
							rows={11}
							placeholder="Email Content"
							type="text"
							className="form-control col-sm-5"
							name="email_content"
							id="email_content"
							ref="email_content"
							value={email_content}
							onChange={(e) => {
								this.setState({ email_content: e.target.value });
							}}
							required
						/>
					</div>
					<br />
					<br />

					<input
						id="search_submit_btn"
						class="btn btn-success px-5"
						type="submit"
						value="Send Email"
						onClick={() => {
							this.handleSubmit();
						}}
					/>
					<br />
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

export default send_batch_email;
