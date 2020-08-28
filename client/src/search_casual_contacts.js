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

class search_casual_contacts extends Component {
	constructor() {
		super();
		// this.startup();
		this.state = {
			confirmed_case_info: null,
			confirmed_case_user_type: null,
			checked_in_premise: null,
			casual_contacts_visitors: null,
			casual_contacts_this_premise: null,
			modal_show: false,
			check_in_day_range: null,
			check_in_time_range_before_hr: null,
			check_in_time_range_before_min: null,
			check_in_time_range_after_hr: null,
			check_in_time_range_after_min: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {
		await fetch("/testing", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				visitor_id: "991004-07-5721",
				date_from: "2020-08-24T13:54:36.038+00:00",
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				alert(JSON.stringify(jsonData));
				// if (jsonData) {
				// 	alert("Login successful");
				// 	// this.props.navigation.navigate("visitor_home");
				// } else {
				// 	alert("Phone number or password is incorrect");
				// }
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	saveCasualContacts = async () => {
		var check_in_time_range_before =
			this.state.check_in_time_range_before_hr +
			" hr " +
			this.state.check_in_time_range_before_min +
			" min";
		var check_in_time_range_after =
			this.state.check_in_time_range_after_hr +
			" hr " +
			this.state.check_in_time_range_after_min +
			" min";
		await fetch("/savedCasualContactsGroup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				confirmed_case_id: this.state.confirmed_case_info._id,
				confirmed_case_user_type: this.state.confirmed_case_user_type,
				check_in_day_range: this.state.check_in_day_range,
				check_in_time_range_before: check_in_time_range_before,
				check_in_time_range_after: check_in_time_range_after,
				checked_in_premise: this.state.checked_in_premise,
				casual_contacts_visitors: this.state.casual_contacts_visitors,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				alert(JSON.stringify(jsonData));
				// if (jsonData) {
				// 	alert("Login successful");
				// 	// this.props.navigation.navigate("visitor_home");
				// } else {
				// 	alert("Phone number or password is incorrect");
				// }
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_casual_contacts_visitor = async (ic_number, check_in_timerange) => {
		await fetch("/search_casual_contacts_visitor", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
				check_in_timerange: check_in_timerange,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				jsonData.forEach(function (item) {
					if (!item.hasOwnProperty("visitor_dependent")) {
						item["visitor_dependent"] = { ic_num: "-" };
					}
				});
				this.setState({ casual_contacts_visitors: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_casual_contacts_dependent = async (ic_number, check_in_timerange) => {
		await fetch("/search_casual_contacts_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
				check_in_timerange: check_in_timerange,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				jsonData.forEach(function (item) {
					if (!item.hasOwnProperty("visitor_dependent")) {
						item["visitor_dependent"] = { ic_num: "-" };
					}
				});
				this.setState({ casual_contacts_visitors: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_check_in_records_dependent = async (
		ic_number,
		currentTime,
		check_in_time_range_before_hr,
		check_in_time_range_before_min,
		check_in_time_range_after_hr,
		check_in_time_range_after_min
	) => {
		await fetch("/search_check_in_records_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
				date_from: currentTime.toISOString(),
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// var checked_in_premise = jsonData;
				// checked_in_premise.forEach(function (item) {
				// 	item.date_created = new Date(item.date_created);
				// });
				var checked_in_premise = jsonData;
				var counter = 0;
				var check_in_timerange = new Array();
				jsonData.forEach(function (item) {
					var time_check_in = new Date(item.date_created);
					// alert(time_check_in.toISOString());

					// calculate time range from
					var time_check_in_before = time_check_in;
					time_check_in_before.setHours(
						time_check_in_before.getHours() -
							parseInt(check_in_time_range_before_hr)
					);
					time_check_in_before.setMinutes(
						time_check_in_before.getMinutes() -
							parseInt(check_in_time_range_before_min)
					);

					var time_check_in_before_iso = time_check_in_before.toISOString();

					var time_check_in = new Date(item.date_created);
					// calculate time range to
					var time_check_in_after = time_check_in;
					time_check_in_after.setHours(
						time_check_in_after.getHours() +
							parseInt(check_in_time_range_after_hr)
					);
					time_check_in_after.setMinutes(
						time_check_in_after.getMinutes() +
							parseInt(check_in_time_range_after_min)
					);
					var time_check_in_after_iso = time_check_in_after.toISOString();
					// push to array
					check_in_timerange.push({
						check_in_record_id: item._id,
						user_premiseowner: item.user_premiseowner,
						time_from: time_check_in_before_iso,
						time_to: time_check_in_after_iso,
					});

					checked_in_premise[counter]["time_check_in"] = new Date(
						item.date_created
					)
						.toISOString()
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
					checked_in_premise[counter][
						"time_from"
					] = time_check_in_before_iso
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
					checked_in_premise[counter][
						"time_to"
					] = time_check_in_after_iso
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);

					counter += 1;
					// var x = item.date_created;
				});
				alert(JSON.stringify(check_in_timerange));
				this.setState({ checked_in_premise: jsonData });
				this.search_casual_contacts_dependent(ic_number, check_in_timerange);
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_confirmed_case_info_dependent = async (
		ic_number,
		currentTime,
		check_in_time_range_before_hr,
		check_in_time_range_before_min,
		check_in_time_range_after_hr,
		check_in_time_range_after_min
	) => {
		await fetch("/search_confirmed_case_info_dependent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == false) {
					alert("not found dependent");
				} else {
					this.setState({
						confirmed_case_info: jsonData,
						confirmed_case_user_type: "Dependent",
					});
					this.search_check_in_records_dependent(
						ic_number,
						currentTime,
						check_in_time_range_before_hr,
						check_in_time_range_before_min,
						check_in_time_range_after_hr,
						check_in_time_range_after_min
					);
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_check_in_records_visitor = async (
		ic_number,
		currentTime,
		check_in_time_range_before_hr,
		check_in_time_range_before_min,
		check_in_time_range_after_hr,
		check_in_time_range_after_min
	) => {
		await fetch("/search_check_in_records_visitor", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
				date_from: currentTime.toISOString(),
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// var checked_in_premise = jsonData;
				// checked_in_premise.forEach(function (item) {
				// 	item.date_created = new Date(item.date_created);
				// });
				var checked_in_premise = jsonData;
				alert(JSON.stringify(jsonData));

				var check_in_timerange = new Array();
				var counter = 0;
				jsonData.forEach(function (item) {
					var time_check_in = new Date(item.date_created);

					// calculate time range from
					var time_check_in_before = time_check_in;
					time_check_in_before.setHours(
						time_check_in_before.getHours() -
							parseInt(check_in_time_range_before_hr)
					);
					time_check_in_before.setMinutes(
						time_check_in_before.getMinutes() -
							parseInt(check_in_time_range_before_min)
					);

					var time_check_in_before_iso = time_check_in_before.toISOString();

					var time_check_in = new Date(item.date_created);
					// calculate time range to
					var time_check_in_after = time_check_in;
					time_check_in_after.setHours(
						time_check_in_after.getHours() +
							parseInt(check_in_time_range_after_hr)
					);
					time_check_in_after.setMinutes(
						time_check_in_after.getMinutes() +
							parseInt(check_in_time_range_after_min)
					);
					var time_check_in_after_iso = time_check_in_after.toISOString();
					// push to array
					check_in_timerange.push({
						check_in_record_id: item._id,
						user_premiseowner: item.user_premiseowner,
						time_from: time_check_in_before_iso,
						time_to: time_check_in_after_iso,
					});

					checked_in_premise[counter]["time_check_in"] = new Date(
						item.date_created
					)
						.toISOString()
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
					checked_in_premise[counter][
						"time_from"
					] = time_check_in_before_iso
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
					checked_in_premise[counter][
						"time_to"
					] = time_check_in_after_iso
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);

					counter += 1;
				});
				// alert(JSON.stringify(checked_in_premise));
				this.setState({ checked_in_premise: jsonData });
				this.search_casual_contacts_visitor(ic_number, check_in_timerange);
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		// get form input value
		const ic_number = this.refs.ic_number.value,
			check_in_day_range = this.refs.check_in_day_range.value,
			check_in_time_range_before_hr = this.refs.check_in_time_range_before_hr
				.value,
			check_in_time_range_before_min = this.refs.check_in_time_range_before_min
				.value,
			check_in_time_range_after_hr = this.refs.check_in_time_range_after_hr
				.value,
			check_in_time_range_after_min = this.refs.check_in_time_range_after_min
				.value;

		var currentTime = new Date();
		currentTime.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
		currentTime.setDate(currentTime.getDate() - check_in_day_range);

		this.setState({
			check_in_day_range: check_in_day_range,
			check_in_time_range_before_hr: check_in_time_range_before_hr,
			check_in_time_range_before_min: check_in_time_range_before_min,
			check_in_time_range_after_hr: check_in_time_range_after_hr,
			check_in_time_range_after_min: check_in_time_range_after_min,
		});

		await fetch("/search_confirmed_case_info_visitor", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ic_number: ic_number,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == false) {
					// alert("not found");
					this.search_confirmed_case_info_dependent(
						ic_number,
						currentTime,
						check_in_time_range_before_hr,
						check_in_time_range_before_min,
						check_in_time_range_after_hr,
						check_in_time_range_after_min
					);
				} else {
					this.setState({
						confirmed_case_info: jsonData,
						confirmed_case_user_type: "Visitor",
					});
					this.search_check_in_records_visitor(
						ic_number,
						currentTime,
						check_in_time_range_before_hr,
						check_in_time_range_before_min,
						check_in_time_range_after_hr,
						check_in_time_range_after_min
					);
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	view_casual_contacts = async (confirmed_case_check_in_id) => {
		// e.preventDefault();
		// alert(premise_id);
		var casual_contacts_this_premise = new Array();
		this.state.casual_contacts_visitors.forEach(function (item) {
			if (item.check_in_record_id === confirmed_case_check_in_id) {
				casual_contacts_this_premise.push(item);
			}
			// alert(JSON.stringify(casual_contacts_this_premise));
		});
		this.setState({
			casual_contacts_this_premise: casual_contacts_this_premise,
		});
	};

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (confirmed_case_check_in_id) => {
		this.setState({ modal_show: true });
		this.view_casual_contacts(confirmed_case_check_in_id);
	};

	render() {
		var {
			checked_in_premise,
			casual_contacts_visitors,
			casual_contacts_this_premise,
			confirmed_case_info,
		} = this.state;
		return (
			<div class="">
				<NavBar />
				<Modal size="lg" show={this.state.modal_show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{casual_contacts_this_premise === null ? (
							<p></p>
						) : (
							<ReactTable
								data={casual_contacts_this_premise}
								columns={[
									// {
									// 	Header: "Visitor Name",
									// 	accessor: "user_visitor.ic_fname",
									// },
									{
										Header: "Visitor IC No.",
										accessor: "user_visitor.ic_num",
									},
									{
										Header: "Dependent IC No.",
										accessor: "visitor_dependent.ic_num",
									},
									// {
									// 	Header: "Phone Number",
									// 	accessor: "user_visitor.phone_no",
									// },
									// {
									// 	Header: "Email",
									// 	accessor: "user_visitor.email",
									// },
									{
										Header: "Date",
										accessor: "date_created",
									},
									// {
									// 	Header: "View Casual Contacts",
									// 	accessor: "user_premiseowner._id",
									// 	Cell: ({ value }) => (
									// 		<button
									// 			onClick={() => {
									// 				this.handleShow(value);
									// 			}}
									// 		>
									// 			View
									// 		</button>
									// 	),
									// },
								]}
								defaultPageSize={5}
								className="-striped -highlight"
							/>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.handleClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
				<div class="page_header">
					<div class="page_title">Trace Casual Contacts</div>
				</div>
				<div class="page_content">
					<h2>Search for casual contacts</h2>
					<br />
					<form
						name="trace_casual_contacts_form"
						method="post"
						id="trace_casual_contacts_form"
						onSubmit={this.handleSubmit}
					>
						{/* input group */}
						<div class="input_outer">
							<div class="label_outer">
								<label for="ic_number">Confirmed case IC number</label>
							</div>
							<input
								placeholder="e.g. 123456-05-1234"
								type="text"
								className="form-control"
								name="ic_number"
								id="ic_number"
								ref="ic_number"
								required
							/>
						</div>
						<br />
						<div class="input_outer">
							<div class="label_outer">
								<label for="check_in_day_range">Day range of check in</label>
							</div>
							<select
								className="form-control"
								name="check_in_day_range"
								id="check_in_day_range"
								ref="check_in_day_range"
							>
								<option value="1">1 day before</option>
								<option value="2">2 day before</option>
								<option value="3">3 day before</option>
								<option value="4">4 day before</option>
								<option value="5">5 day before</option>
								<option value="6">6 day before</option>
								<option value="7">7 day before</option>
								<option value="8">8 day before</option>
								<option value="9">9 day before</option>
								<option value="10">10 day before</option>
								<option value="11">11 day before</option>
								<option value="12">12 day before</option>
								<option value="13">13 day before</option>
								<option value="14" selected>
									14 day before
								</option>
							</select>
						</div>
						{/* <br />
						<div class="input_outer">
							<div class="label_outer">
								<label for="check_in_time_range">Time range of check in</label>
							</div>
							<select
								className="form-control"
								name="check_in_time_range"
								id="check_in_time_range"
							>
								<option value="whole_day">Whole day</option>
								<option value="specific">Specific time range</option>
							</select>
						</div> */}
						<br />
						<div class="input_outer">
							<div class="label_outer">
								<label for="check_in_time_range_before">
									Time range of check in (before)
								</label>
							</div>
							<input
								placeholder="1"
								type="number"
								min="0"
								max="24"
								className="form-control"
								name="check_in_time_range_before_hr"
								id="check_in_time_range_before_hr"
								ref="check_in_time_range_before_hr"
								required
							/>
							<span>Hour</span>
							<input
								placeholder="0"
								type="number"
								min="0"
								max="59"
								className="form-control"
								name="check_in_time_range_before_min"
								id="check_in_time_range_before_min"
								ref="check_in_time_range_before_min"
								required
							/>
							<span>Minute</span>
						</div>
						<br />
						<div class="input_outer">
							<div class="label_outer">
								<label for="check_in_time_range_after">
									Time range of check in (after)
								</label>
							</div>
							<input
								placeholder="1"
								type="number"
								min="0"
								max="24"
								className="form-control"
								name="check_in_time_range_after_hr"
								id="check_in_time_range_after_hr"
								ref="check_in_time_range_after_hr"
								required
							/>
							<span>Hour</span>
							<input
								placeholder="0"
								type="number"
								min="0"
								max="59"
								className="form-control"
								name="check_in_time_range_after_min"
								id="check_in_time_range_after_min"
								ref="check_in_time_range_after_min"
								required
							/>
							<span>Minute</span>
						</div>
						<br />
						<br />
						<input
							id="search_submit_btn"
							class="btn btn-success"
							type="submit"
							value="Search"
						/>
					</form>
					{confirmed_case_info === null ||
					this.state.confirmed_case_user_type === null ? (
						<p></p>
					) : (
						<div>
							<p>{this.state.confirmed_case_user_type}</p>
							<p>{confirmed_case_info.ic_num}</p>
							<p>{confirmed_case_info.ic_fname}</p>
						</div>
					)}
					{checked_in_premise === null || casual_contacts_visitors === null ? (
						<p></p>
					) : (
						// checked_in_premise.map((item) => (
						// 	<div class="each_premise">
						// 		<p class="premise_name">
						// 			{item.user_premiseowner.premise_name}
						// 		</p>
						// 		<p class="premise_name">
						// 			{item.date_created
						// 				.replace("T", "")
						// 				.substring(0, item.date_created.indexOf(".") - 1)}
						// 		</p>
						// 		<button
						// 			onClick={(e) =>
						// 				this.view_casual_contacts(item.user_premiseowner._id)
						// 			}
						// 		>
						// 			View Casual Contact Visitors
						// 		</button>
						// 	</div>
						// ))
						<ReactTable
							data={checked_in_premise}
							columns={[
								{
									Header: "Premise Name",
									accessor: "user_premiseowner.premise_name",
								},
								{
									Header: "Check In Time",
									accessor: "time_check_in",
								},
								{
									Header: "Time Range (From)",
									accessor: "time_from",
								},
								{
									Header: "Time Range (To)",
									accessor: "time_to",
								},
								{
									Header: "View Casual Contacts",
									accessor: "_id",
									Cell: ({ value }) => (
										<div>
											<span>4 person </span>
											<button
												onClick={() => {
													this.handleShow(value);
												}}
											>
												View
											</button>
										</div>
									),
								},
							]}
							defaultPageSize={5}
							className="-striped -highlight"
						/>
					)}
					<Button
						onClick={() => {
							this.saveCasualContacts();
						}}
					>
						Save
					</Button>
				</div>
			</div>
		);
	}
}

export default search_casual_contacts;
