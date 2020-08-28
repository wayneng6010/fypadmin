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
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.state.group_record_id = this.props.match.params.group_record_id;
		this.startup();
		// alert(this.props.match.params.group_record_id);
	}

	getEachPremiseName = async (confirmed_case_check_ins) => {
		var confirmed_case_check_ins_returned = new Array();
		var counter = 0;

		confirmed_case_check_ins.forEach(async function (item) {
			// alert(JSON.stringify(item.check_in_record.user_premiseowner));
			await fetch("/getEachPremiseName", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_premiseowner_id: item.check_in_record.user_premiseowner,
				}),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.json();
				})
				.then((jsonData) => {
					// alert(JSON.stringify(jsonData.premise_name));
					// var jsonDataReturned = jsonData;
					item.premise_name = jsonData.premise_name;
					// alert(JSON.stringify(item));

					// alert(JSON.stringify(item));
					// confirmed_case_check_ins_returned.push(item);
					// alert(JSON.stringify(confirmed_case_check_ins_returned));
					// this.getEachPremiseName(jsonData);
					// jsonDataReturned.forEach(function (item) {
					// item.premise_name = item.premise_name;
					// alert(JSON.stringify(item.check_in_record.user_premiseowner));
					// });
				})
				.catch((error) => {
					alert("Error: " + error);
				});

			counter += 1;

			// if (counter == confirmed_case_check_ins.length) {
			// 	// console.log("endOfLoop");
			// 	alert(JSON.stringify(confirmed_case_check_ins_returned));
			// 	this.setState({ check_in_records: confirmed_case_check_ins_returned });
			// }
		});
		// alert(JSON.stringify(this.state.check_in_records));
		// this.setState({ check_in_records: confirmed_case_check_ins_returned });
	};

	startup = async () => {
		alert(this.state.group_record_id);
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

				// jsonDataReturned.forEach(function (item) {
				// 	alert(JSON.stringify(item.check_in_record.user_premiseowner));
				// });

				this.setState({ check_in_records: jsonData });
				// this.getEachPremiseName(jsonData);
				alert(JSON.stringify(this.state.check_in_records));
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

	render() {
		var { check_in_records } = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Confirmed Case Check Ins</div>
				</div>
				<div class="page_content">
					<h2>Saved Confirmed Case Check In Record</h2>
					{check_in_records == null ? (
						<p></p>
					) : (
						<ReactTable
							data={check_in_records}
							columns={[
								{
									Header: "Check In Premise",
									accessor: "user_premiseowner.premise_name",
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
									accessor: d => `${d.check_in_record._id}` + "," +`${d.saved_casual_contacts_group}`,
									
									Cell: ({ value }) => (
										<div>
											<span>4 person </span>
											<Link
												to={{
													pathname: `/view_casual_contact_check_ins/${value}`,
												}}
											>
												<button class="manage_btn register btn btn-success btn-lg">
													View
												</button>
											</Link>
										</div>
									),
								},
							]}
							defaultPageSize={5}
							className="-striped -highlight"
						/>
					)}
				</div>
			</div>
		);
	}
}

export default view_confirmed_case_check_ins;
