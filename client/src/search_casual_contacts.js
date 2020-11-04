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
		this.startup();
		this.state = {
			confirmed_case_ic_num: null,
			confirmed_case_info: null,
			confirmed_case_user_type: null,
			checked_in_premise: null,
			casual_contacts_visitors: null,
			casual_contacts_this_premise: null,
			modal_show: false,
			check_in_day_range: null,
			check_in_time_range_before_hr: 0,
			check_in_time_range_before_min: 30,
			check_in_time_range_after_hr: 24,
			check_in_time_range_after_min: 0,
			ttl_contact_counts: null,
			traceUntilDate: null,
			traceFromDate: null,
			casual_contact_counter: null,
			ttl_check_ins: null,
			loading_confirmed_case_info: false,
			loading_confirmed_case_check_in: false,
			verify_token: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

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

	saveCasualContacts = async () => {
		// const check_in_premise = this.state.checked_in_premise;
		// var check_in_premise_arr = new Array();

		// check_in_premise.forEach(function (item) {
		// 	alert(item.user_premiseowner.premise_name);
		// 	check_in_premise_arr.push(item.user_premiseowner.premise_name);
		// });
		// alert(JSON.stringify(check_in_premise));
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
				confirmed_case_ic_num: this.state.confirmed_case_ic_num,
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
				// alert(JSON.stringify(jsonData));
				if (jsonData) {
					alert("Saved successful");
					// this.props.navigation.navigate("visitor_home");
				} else {
					alert("Error occured while saving the record");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_casual_contacts_visitor = async (ic_number, check_in_timerange) => {
		// alert(JSON.stringify(this.state.checked_in_premise));
		var checked_in_premise = this.state.checked_in_premise;

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
				// jsonData.forEach(function (item) {
				// 	if (!item.hasOwnProperty("visitor_dependent")) {
				// 		item["visitor_dependent"] = { ic_num: "-" };
				// 	}
				// });
				this.setState({ casual_contacts_visitors: jsonData });
				var contact_counter = 0,
					ttl_contact_counter = 0;
				checked_in_premise.forEach(function (checkin_item) {
					contact_counter = 0;
					jsonData.forEach(function (contact_item) {
						if (contact_item.check_in_record_id == checkin_item._id) {
							// alert(contact_item._id);
							contact_counter += 1;
							ttl_contact_counter += 1;
						}
					});
					checkin_item.casual_contact_counts = contact_counter;
					// alert(contact_counter);
				});
				this.setState({
					checked_in_premise: checked_in_premise,
					ttl_contact_counts: ttl_contact_counter,
					loading_confirmed_case_check_in: false,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	search_casual_contacts_dependent = async (ic_number, check_in_timerange) => {
		var checked_in_premise = this.state.checked_in_premise;
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
				this.setState({ casual_contacts_visitors: jsonData });
				var contact_counter = 0,
					ttl_contact_counter = 0;
				checked_in_premise.forEach(function (checkin_item) {
					contact_counter = 0;
					jsonData.forEach(function (contact_item) {
						if (contact_item.check_in_record_id == checkin_item._id) {
							// alert(contact_item._id);
							contact_counter += 1;
							ttl_contact_counter += 1;
						}
					});
					checkin_item.casual_contact_counts = contact_counter;
					// alert(contact_counter);
				});
				this.setState({
					checked_in_premise: checked_in_premise,
					ttl_contact_counts: ttl_contact_counter,
					loading_confirmed_case_check_in: false,
				});
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
				if (jsonData == false) {
					this.setState({ checked_in_premise: "none" });
					return;
				}

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
				// alert(JSON.stringify(check_in_timerange));
				this.setState({ checked_in_premise: jsonData, ttl_check_ins: counter });
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
					this.setState({
						confirmed_case_info: null,
						confirmed_case_user_type: null,
						checked_in_premise: null,
						casual_contacts_visitors: null,
						ttl_contact_counts: null,
					});
					alert("User not found in the database");
					this.setState({
						loading_confirmed_case_info: false,
						loading_confirmed_case_check_in: false,
					});
					return;
				} else {
					this.setState({
						confirmed_case_info: jsonData,
						confirmed_case_user_type: "Dependent",
						loading_confirmed_case_info: false,
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
		// alert(currentTime.toISOString());
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
				if (jsonData == false) {
					this.setState({ checked_in_premise: "none" });
					return;
				}
				var checked_in_premise = jsonData;
				// alert(JSON.stringify(jsonData));

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
					// alert(time_check_in.toISOString());

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
				this.setState({ checked_in_premise: jsonData, ttl_check_ins: counter });
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

		// data validation
		var regex_ic_number = /^[0-9]{6}[-]{1}[0-9]{2}[-]{1}[0-9]{4}$/;
		if (!regex_ic_number.test(ic_number)) {
			alert("Invalid IC format. Correct format should be xxxxxx-xx-xxxx");
			return;
		}
		if (check_in_day_range > 20) {
			alert("Check in day range should be more than 20 days");
			return;
		}
		if (
			check_in_time_range_before_hr > 48 ||
			check_in_time_range_after_hr > 48
		) {
			alert("Time range hour should be more than 48 hours");
			return;
		}
		if (
			check_in_time_range_before_min > 59 ||
			check_in_time_range_after_min > 59
		) {
			alert("Time range minute should be more than 48 hours");
			return;
		}

		this.setState({
			loading_confirmed_case_info: true,
			loading_confirmed_case_check_in: true,
		});

		var currentTime = new Date();
		currentTime = new Date(
			currentTime.getTime() - currentTime.getTimezoneOffset() * 60000
		); // utc +8
		currentTime.setUTCHours(0, 0, 0, 0); // change time to midnight 00:00 of that day
		currentTime.setDate(currentTime.getDate() - check_in_day_range);

		// get today's date
		var utc_tdy = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
		// get trace from date
		var utc_trace_from_date = new Date();
		utc_trace_from_date.setDate(
			utc_trace_from_date.getDate() - check_in_day_range
		);
		var utc_from = utc_trace_from_date.toJSON().slice(0, 10).replace(/-/g, "/");
		this.setState({ traceUntilDate: utc_tdy, traceFromDate: utc_from });
		// alert(utc_tdy + utc_from);
		// alert(this.state.traceFromDate + " " + this.state.traceUntilDate);

		this.setState({
			confirmed_case_ic_num: ic_number,
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
						loading_confirmed_case_info: false,
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
		var casual_contact_counter = 0;
		this.state.casual_contacts_visitors.forEach(function (item) {
			if (item.check_in_record_id === confirmed_case_check_in_id) {
				casual_contacts_this_premise.push(item);
				casual_contact_counter += 1;
			}
			// alert(JSON.stringify(casual_contacts_this_premise));
		});

		casual_contacts_this_premise.forEach(function (item) {
			if (item.hasOwnProperty("visitor_dependent")) {
				item["ic_num_merged"] = item.visitor_dependent.ic_num;
				item["ic_fname_merged"] =
					item.visitor_dependent.ic_fname + " (Dependent)";
			} else {
				item["ic_num_merged"] = item.user_visitor.ic_num;
				item["ic_fname_merged"] = item.user_visitor.ic_fname;
			}
			item["date_created_simplified"] = item.date_created
				.replace("T", " ")
				.substring(0, item.date_created.indexOf(".") - 3);
			// alert(JSON.stringify(casual_contacts_this_premise));
		});

		this.setState({
			casual_contacts_this_premise: casual_contacts_this_premise,
			casual_contact_counter: casual_contact_counter,
		});
	};

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (confirmed_case_check_in_id) => {
		this.setState({ modal_show: true });
		this.view_casual_contacts(confirmed_case_check_in_id);
	};

	handleChange_before_hr = (e) => {
		var value = e.target.value;
		if (value > 48) {
			value = 48;
		}
		value = value.toString().replace(/\D/g, "");
		this.setState({ check_in_time_range_before_hr: value });
	};

	handleChange_before_min = (e) => {
		var value = e.target.value;
		if (value > 59) {
			value = 59;
		}
		value = value.toString().replace(/\D/g, "");
		this.setState({ check_in_time_range_before_min: value });
	};

	handleChange_after_hr = (e) => {
		var value = e.target.value;
		if (value > 48) {
			value = 48;
		}
		value = value.toString().replace(/\D/g, "");
		this.setState({ check_in_time_range_after_hr: value });
	};

	handleChange_after_min = (e) => {
		var value = e.target.value;
		if (value > 59) {
			value = 59;
		}
		value = value.toString().replace(/\D/g, "");
		this.setState({ check_in_time_range_after_min: value });
	};

	isDisabled = (value) => {
		var { casual_contacts_visitors } = this.state;
		var disabled = true;
		casual_contacts_visitors.forEach(function (item) {
			// alert(value);
			if (item.check_in_record_id == value) {
				// alert("as");
				disabled = false;
			}
		});
		// alert(disabled);
		return disabled;
	};

	render() {
		var {
			checked_in_premise,
			casual_contacts_visitors,
			casual_contacts_this_premise,
			confirmed_case_info,
			ttl_contact_counts,
			traceUntilDate,
			traceFromDate,
			casual_contact_counter,
			ttl_check_ins,
			loading_confirmed_case_check_in,
			loading_confirmed_case_info,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		return (
			<div class="">
				<NavBar />
				<Modal size="lg" show={this.state.modal_show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Casual Contacts</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{casual_contacts_this_premise === null ? (
							<p></p>
						) : (
							<div>
								<h5 class="mb-3">
									{"Number of casual contacts: " +
										casual_contact_counter +
										" contact(s)"}
								</h5>
								<ReactTable
									data={casual_contacts_this_premise}
									columns={[
										// {
										// 	Header: "Visitor Name",
										// 	accessor: "user_visitor.ic_fname",
										// },
										{
											Header: "Name",
											accessor: "ic_fname_merged",
											Cell: (row) => (
												<div class="table_column">{row.value}</div>
											),
										},
										{
											Header: "IC No.",
											accessor: "ic_num_merged",
											Cell: (row) => (
												<div class="table_column">{row.value}</div>
											),
										},
										// {
										// 	Header: "Visitor IC No.",
										// 	accessor: "user_visitor.ic_num",
										// },
										// {
										// 	Header: "Dependent IC No.",
										// 	accessor: "visitor_dependent.ic_num",
										// },
										// {
										// 	Header: "Phone Number",
										// 	accessor: "user_visitor.phone_no",
										// },
										// {
										// 	Header: "Email",
										// 	accessor: "user_visitor.email",
										// },
										{
											Header: "Check In Date Time",
											accessor: "date_created_simplified",
											Cell: (row) => (
												<div class="table_column">{row.value}</div>
											),
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
							</div>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						{/* <Button variant="primary" onClick={this.handleClose}>
							Save Changes
						</Button> */}
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
								<label for="check_in_day_range">
									Day range of confirmed case check in
								</label>
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
								<option value="15">15 day before</option>
								<option value="16">16 day before</option>
								<option value="17">17 day before</option>
								<option value="18">18 day before</option>
								<option value="19">19 day before</option>
								<option value="20">20 day before</option>
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
									Time range of casual contacts check in (before)
								</label>
							</div>
							<input
								placeholder="0"
								type="number"
								min="0"
								max="48"
								className="form-control"
								name="check_in_time_range_before_hr"
								id="check_in_time_range_before_hr"
								ref="check_in_time_range_before_hr"
								value={this.state.check_in_time_range_before_hr}
								onInput={this.handleChange_before_hr.bind(this)}
								required
							/>
							<span>Hour</span>
							<input
								placeholder="30"
								type="number"
								min="0"
								max="59"
								className="form-control"
								name="check_in_time_range_before_min"
								id="check_in_time_range_before_min"
								ref="check_in_time_range_before_min"
								value={this.state.check_in_time_range_before_min}
								onInput={this.handleChange_before_min.bind(this)}
								required
							/>
							<span>Minute</span>
						</div>
						<br />
						<div class="input_outer">
							<div class="label_outer">
								<label for="check_in_time_range_after">
									Time range of casual contacts check in (after)
								</label>
							</div>
							<input
								placeholder="24"
								type="number"
								min="0"
								max="48"
								className="form-control"
								name="check_in_time_range_after_hr"
								id="check_in_time_range_after_hr"
								ref="check_in_time_range_after_hr"
								value={this.state.check_in_time_range_after_hr}
								onInput={this.handleChange_after_hr.bind(this)}
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
								value={this.state.check_in_time_range_after_min}
								onInput={this.handleChange_after_min.bind(this)}
								required
							/>
							<span>Minute</span>
						</div>
						<br />
						<input
							id="search_submit_btn"
							class="btn btn-success"
							type="submit"
							value="Search"
						/>
					</form>
					{loading_confirmed_case_info === true ? (
						<p>Loading...</p>
					) : confirmed_case_info === null ||
					  this.state.confirmed_case_user_type === null ? (
						<p></p>
					) : (
						<div id="confirmed_case_info_outer">
							<h4 id="confirmed_case_info_title">Confirmed Case Info</h4>
							<div id="confirmed_case_info">
								<p>{this.state.confirmed_case_user_type}</p>
								<p>{confirmed_case_info.ic_num}</p>
								<p>{confirmed_case_info.ic_fname}</p>
							</div>
						</div>
					)}
					{checked_in_premise === "none" ? (
						<h5>No check in found</h5>
					) : loading_confirmed_case_check_in === true ? (
						<p>Loading...</p>
					) : checked_in_premise === null ||
					  casual_contacts_visitors === null ||
					  ttl_contact_counts === null ? (
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

						<div class="casual_contacts_outer">
							<div class="casual_contacts_trace_info">
								<h5>
									{"Traced check ins from " +
										traceFromDate +
										" to " +
										traceUntilDate}
								</h5>
								<h5>{"Total Check Ins: " + ttl_check_ins + " check in(s)"}</h5>
								<h5>
									{"Total Number of Casual Contacts: " +
										ttl_contact_counts +
										" contact(s)"}
								</h5>
							</div>

							<br />
							<ReactTable
								data={checked_in_premise}
								columns={[
									{
										Header: "Premise Name",
										accessor: "user_premiseowner.premise_name",
										Cell: (row) => <div class="table_column">{row.value}</div>,
									},
									{
										Header: "Check In Time",
										accessor: "time_check_in",
										Cell: (row) => <div class="table_column">{row.value}</div>,
									},
									{
										Header: "Time Range (From)",
										accessor: "time_from",
										Cell: (row) => <div class="table_column_grey">{row.value}</div>,
									},
									{
										Header: "Time Range (To)",
										accessor: "time_to",
										Cell: (row) => <div class="table_column_grey">{row.value}</div>,
									},
									{
										Header: "Number of Contacts",
										accessor: "casual_contact_counts",
										Cell: (row) => (
											<div class="table_column">
												{row.value + " contact(s)"}
											</div>
										),
									},
									{
										Header: "View Casual Contacts",
										accessor: "_id",
										Cell: ({ value }) => (
											<div class="table_column">
												{/* <span>4 person </span> */}
												<button
													class="btn btn-secondary"
													variant="secondary"
													disabled={this.isDisabled(value)}
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
							<br />
							<button
								class="btn btn-primary"
								id="long_btn"
								onClick={() => {
									this.saveCasualContacts();
								}}
							>
								Save
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default search_casual_contacts;
