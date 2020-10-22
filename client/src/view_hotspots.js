import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class view_hotspots extends Component {
	constructor() {
		super();
		this.state = {
			records_group: null,
		};
		this.startup();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	getHotspotCount = async (groupRecord) => {
		await fetch("/getHotspotCount", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ groupRecord }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				this.setState({ records_group: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

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

				// this.setState({ records_group: jsonDataReturned });
				this.getHotspotCount(jsonDataReturned);
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

	isDisable = (value) => {
		var { records_group } = this.state;

		var disabled = false;
		records_group.forEach(function (item) {
			// alert(value);
			if (item._id == value) {
				// alert(item.hotspot_count);
				if (item.hotspot_count == 0) {
					disabled = true;
				}
			}
		});
		// alert(disabled);
		return disabled;
	};

	isDisable_1 = (value) => {
		var { records_group } = this.state;

		var disabled = false;
		records_group.forEach(function (item) {
			// alert(value);
			if (item._id == value) {
				// alert(item.hotspot_count);
				if (item.hotspot_count == 0) {
					disabled = true;
				}
			}
		});
		// alert(disabled);
		return disabled;
	};

	handleCopyID = (sid) => {
		navigator.clipboard.writeText(sid);
		// alert("ID copied: " + sid);
	};

	confirm_delete = async (record_id) => {
		if (
			window.confirm(
				"Confirm to delete? All of the hotspots record under this confirmed case will be deleted."
			)
		) {
			await fetch("/delete_all_hotspot_record", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ record_id: record_id }),
			})
				.then((res) => {
					// console.log(JSON.stringify(res.headers));
					return res.text();
				})
				.then((jsonData) => {
					if (jsonData) {
						this.startup();
						alert("Record has been deleted successfully");
					} else {
						alert("Error occured while deleting the record");
					}
				})
				.catch((error) => {
					alert("Error: " + error);
				});
		} else {
			return;
		}
	};

	render() {
		var { records_group } = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Existing Hotspots</div>
				</div>
				<div class="page_content">
					<h2>Confirmed Case Record</h2>
					<br />
					{records_group == null ? (
						<p>Loading ...</p>
					) : (
						<ReactTable
							data={records_group}
							columns={[
								{
									Header: "ID",
									accessor: "_id",
									width: 120,
									Cell: (row) => (
										<div class="table_column">
											{"..." +
												row.value.slice(row.value.length - 4).toUpperCase() +
												" "}
											<img
												src="https://www.flaticon.com/svg/static/icons/svg/60/60990.svg"
												width={17}
												title="Copy full ID"
												class="copy_id_icon"
												onClick={() => {
													this.handleCopyID(row.value);
												}}
											/>
										</div>
									),
								},
								{
									Header: "Confirmed Case Name",
									accessor: "visitor_and_dependent_fname",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Confirmed Case IC",
									accessor: "visitor_and_dependent_ic_num",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Total Hotspots",
									accessor: "hotspot_count",
									Cell: (row) => (
										<div class="table_column">{row.value + " place(s)"}</div>
									),
								},
								// {
								// 	Header: "Total Casual Contact",
								// 	accessor: "casual_contact_count",
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
									Header: "Date Created",
									accessor: "date_created",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "View Hotspots",
									accessor: "_id",
									Cell: ({ value }) => (
										<div class="table_column">
											{/* <span>4 person </span> */}
											<Link
												to={{
													pathname: `/view_hotspots_each/${value}`,
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
								{
									Header: "Delete",
									accessor: "_id",
									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="manage_btn register btn btn-danger"
												disabled={this.isDisable_1(value)}
												onClick={() => {
													this.confirm_delete(value);
												}}
											>
												Delete All
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

export default view_hotspots;
