import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class view_casual_contacts extends Component {
	constructor() {
		super();
		this.state = {
			records_group: null,
		};
		this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {
		await fetch("/getSavedCasualContactsGroups", {
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
				var jsonDataReturned = jsonData;
				jsonDataReturned.forEach(function (item) {
					if (item.hasOwnProperty("confirmed_case_visitor")) {
						// alert(JSON.stringify(item.confirmed_case_visitor));
						item.visitor_and_dependent_fname =
							item.confirmed_case_visitor.ic_fname;
						item.visitor_and_dependent_ic_num =
							item.confirmed_case_visitor.ic_num;
					} else if (item.hasOwnProperty("confirmed_case_dependent")) {
						// alert(JSON.stringify(item.confirmed_case_dependent));
						item.visitor_and_dependent_fname =
							item.confirmed_case_dependent.ic_fname + " (Dependent)";
						item.visitor_and_dependent_ic_num =
							item.confirmed_case_dependent.ic_num;
					}
					item.date_created = item.date_created
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
				});
				// alert(JSON.stringify(jsonDataReturned));

				this.setState({ records_group: jsonDataReturned });

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
	};

	render() {
		var { records_group } = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Casual Contacts</div>
				</div>
				<div class="page_content">
					<h2>Saved Casual Contact Group Record</h2>

					{records_group == null ? (
						<p>Loading ...</p>
					) : (
						<ReactTable
							data={records_group}
							columns={[
								{
									Header: "Confirmed Case Name",
									accessor: "visitor_and_dependent_fname",
								},
								{
									Header: "Confirmed Case IC",
									accessor: "visitor_and_dependent_ic_num",
								},
								{
									Header: "Day Range",
									accessor: "day_range_check_in",
								},
								{
									Header: "Time Range (Before)",
									accessor: "time_range_check_in_before",
								},
								{
									Header: "Time Range (After)",
									accessor: "time_range_check_in_after",
								},
								{
									Header: "Date Created",
									accessor: "date_created",
								},
								{
									Header: "View Casual Contacts",
									accessor: "_id",
									Cell: ({ value }) => (
										<div class="centerButton">
											{/* <span>4 person </span> */}
											<Link
												to={{
													pathname: `/view_confirmed_case_check_ins/${value}`,
												}}
											>
												<button class="manage_btn register btn btn-success">
													View
												</button>
											</Link>
										</div>
									),
								},
								{
									Header: "Delete",
									accessor: "_id",
									Cell: ({ value }) => (
										<div class="centerButton">
											<button class="manage_btn register btn btn-danger">
												Delete
											</button>
										</div>
									),
								},
								// {
								// 	Header: "View Simplified Casual Contacts",
								// 	accessor: "_id",
								// 	Cell: ({ value }) => (
								// 		<div>
								// 			{/* <span>4 person </span> */}
								// 			<Link
								// 				to={{
								// 					pathname: `/view_simp_casual_contact_check_ins/${value}`,
								// 				}}
								// 			>
								// 				<button class="manage_btn register btn btn-success">
								// 					View Simplified
								// 				</button>

								// 			</Link>
								// 		</div>
								// 	),
								// },
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

export default view_casual_contacts;
