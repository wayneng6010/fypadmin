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
		var newLine = "\r\n";
		this.state = {
			sending_mail: false,
			confirmed_case_name: null,
			confirmed_case_ic_num: null,
			group_id: null,
			group_id_verified: false,
			email_subject: "Inform about Casual Contact with COVID-19 patient",
			email_content:
				"Good day," +
				newLine +
				newLine +
				"Sorry to inform that you or/and your have been in casual contact with one of the COVID-19 patient. " +
				"Please avoid close contact with others if possible until you get further instructions. " +
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

		await fetch("/send_batch_email", {
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
		} = this.state;

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

					{confirmed_case_ic_num == null || confirmed_case_name == null ? (
						<br />
					) : (
						<div class="row mb-3">
							<div class="col-sm-2"></div>
							<div>
								{/* <h5>Confirmed Case Record Info</h5> */}
								<p>{confirmed_case_name}</p>
								<p>{confirmed_case_ic_num}</p>
								<p>{confirmed_case_date_created}</p>
							</div>
						</div>
					)}

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
