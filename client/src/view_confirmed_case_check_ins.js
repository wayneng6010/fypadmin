import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class view_confirmed_case_check_ins extends Component {
	constructor() {
		super();
		this.state = {
			group_record_id: null,
			check_in_records: null,
			selected_records_group: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.state.group_record_id = this.props.match.params.group_record_id;
		this.startup();
		// alert(this.props.match.params.group_record_id);
	}

	// getEachPremiseName = async (confirmed_case_check_ins) => {
	// 	// var confirmed_case_check_ins_returned = new Array();
	// 	var counter = 0;

	// 	confirmed_case_check_ins.forEach(async function (item) {
	// 		// alert(JSON.stringify(item.check_in_record.user_premiseowner));
	// 		await fetch("/getEachPremiseName", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				user_premiseowner_id: item.check_in_record.user_premiseowner,
	// 			}),
	// 		})
	// 			.then((res) => {
	// 				// console.log(JSON.stringify(res.headers));
	// 				return res.json();
	// 			})
	// 			.then((jsonData) => {
	// 				// alert(JSON.stringify(jsonData.premise_name));
	// 				// var jsonDataReturned = jsonData;
	// 				item.premise_name = jsonData.premise_name;
	// 				// alert(JSON.stringify(item));

	// 				// alert(JSON.stringify(item));
	// 				// confirmed_case_check_ins_returned.push(item);
	// 				// alert(JSON.stringify(confirmed_case_check_ins_returned));
	// 				// this.getEachPremiseName(jsonData);
	// 				// jsonDataReturned.forEach(function (item) {
	// 				// item.premise_name = item.premise_name;
	// 				// alert(JSON.stringify(item.check_in_record.user_premiseowner));
	// 				// });
	// 			})
	// 			.catch((error) => {
	// 				alert("Error: " + error);
	// 			});

	// 		counter += 1;

	// 		// if (counter == confirmed_case_check_ins.length) {
	// 		// 	// console.log("endOfLoop");
	// 		// 	alert(JSON.stringify(confirmed_case_check_ins_returned));
	// 		// 	this.setState({ check_in_records: confirmed_case_check_ins_returned });
	// 		// }
	// 	});
	// 	// alert(JSON.stringify(this.state.check_in_records));
	// 	// this.setState({ check_in_records: confirmed_case_check_ins_returned });
	// };

	getCasualContactCount = async (checkInRecord) => {
		await fetch("/getCasualContactCount", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ checkInRecord }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				this.setState({ check_in_records: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	startup = async () => {
		// alert(this.state.group_record_id);
		await fetch("/getSelectedSavedCasualContactsGroups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ group_record_id: this.state.group_record_id }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				var jsonDataReturned = jsonData;
				if (jsonDataReturned.hasOwnProperty("confirmed_case_visitor")) {
					// alert(JSON.stringify(item.confirmed_case_visitor));
					jsonDataReturned.visitor_and_dependent_fname =
						jsonDataReturned.confirmed_case_visitor.ic_fname;
					jsonDataReturned.visitor_and_dependent_ic_num =
						jsonDataReturned.confirmed_case_visitor.ic_num;
				} else if (
					jsonDataReturned.hasOwnProperty("confirmed_case_dependent")
				) {
					// alert(JSON.stringify(item.confirmed_case_dependent));
					jsonDataReturned.visitor_and_dependent_fname =
						jsonDataReturned.confirmed_case_dependent.ic_fname + " (Dependent)";
					jsonDataReturned.visitor_and_dependent_ic_num =
						jsonDataReturned.confirmed_case_dependent.ic_num;
				}
				jsonDataReturned.date_created = jsonDataReturned.date_created
					.replace("T", " ")
					.substring(0, jsonDataReturned.date_created.indexOf(".") - 3);
				// alert(JSON.stringify(jsonDataReturned));

				this.setState({ selected_records_group: jsonDataReturned });
				// alert(JSON.stringify(this.state.records_group));

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

		await fetch("/getConfirmedCaseCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				group_record_id: this.state.group_record_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// var jsonDataReturned = jsonData;

				jsonData.forEach(function (item) {
					// alert(JSON.stringify(item.check_in_record.user_premiseowner));
					item.check_in_record.date_created = item.check_in_record.date_created
						.replace("T", " ")
						.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
				});

				// this.setState({ check_in_records: jsonData });
				this.getCasualContactCount(jsonData);

				// this.getEachPremiseName(jsonData);
				// alert(JSON.stringify(this.state.check_in_records));
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

	isDisable = (value) => {
		// alert(value);
		return false;
	};

	render() {
		var {
			group_record_id,
			check_in_records,
			selected_records_group,
		} = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Confirmed Case Check Ins</div>
				</div>
				<div class="page_content">
					<h2>Confirmed Case Check Ins</h2>
					<br />
					{selected_records_group == null ? (
						<p>Loading...</p>
					) : (
						<div>
							<div id="confirmed_case_header_outer">
								<h5>Confirmed Case Info</h5>
								<div id="confirmed_case_header_inner">
									<p>{selected_records_group.visitor_and_dependent_fname}</p>
									<p>{selected_records_group.visitor_and_dependent_ic_num}</p>
								</div>
							</div>
							<div id="casual_contact_header_outer">
								<h5>Casual Contacts Record Details</h5>
								<div id="casual_contact_header_inner">
									<p>
										{"Check ins of " +
											selected_records_group.day_range_check_in +
											" days before"}
									</p>
									<p>
										{"Check ins of " +
											selected_records_group.time_range_check_in_before +
											" before, " +
											selected_records_group.time_range_check_in_after +
											" after"}
									</p>
									{/* <p>
										{"Check in time range after: " +
											selected_records_group.time_range_check_in_after}
									</p> */}
									{/* <p>
										{"Created at " + selected_records_group.date_created}
									</p> */}
								</div>
							</div>
						</div>
					)}

					{/* excel download button */}
					{group_record_id == null ? (
						<p>Loading...</p>
					) : (
						<div>
							<Link
								target="_blank"
								to={{
									pathname: `/download_excel_infected_premise/${group_record_id}`,
								}}
							>
								<button class="manage_btn register btn btn-success">
									Download Excel File
								</button>
							</Link>
						</div>
					)}
					<br />
					{check_in_records == null ? (
						<p>Loading...</p>
					) : (
						<ReactTable
							data={check_in_records}
							columns={[
								{
									Header: "Check In Premise",
									accessor: "user_premiseowner.premise_name",
								},
								{
									Header: "Total Casual Contact",
									accessor: "casual_contact_count",
								},
								// {
								// 	Header: "Confirmed Case IC",
								// 	accessor: "confirmed_case_visitor.ic_num",
								// },
								// {
								// 	Header: "Day Range",
								// 	accessor: "day_range_check_in",
								// },
								// {
								// 	Header: "Time Range (Before)",
								// 	accessor: "time_range_check_in_before",
								// },
								// {
								// 	Header: "Time Range (After)",
								// 	accessor: "time_range_check_in_after",
								// },
								{
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
								},
								{
									Header: "View Casual Contacts",
									// accessor: "check_in_record._id",
									id: "id",
									accessor: (d) =>
										`${d.check_in_record._id}` +
										"/" +
										`${d.saved_casual_contacts_group}`,

									Cell: ({ value }) => (
										<div>
											{/* <span>4 person </span> */}
											<Link
												to={{
													pathname: `/view_casual_contact_check_ins/${value}`,
												}}
											>
												<button
													class="manage_btn register btn btn-success"
													disabled={this.isDisable(value)}
												>
													View
												</button>
											</Link>
										</div>
									),
								},
							]}
							defaultPageSize={10}
							className="-striped -highlight"
						/>
					)}
				</div>
			</div>
		);
	}
}

export default view_confirmed_case_check_ins;
