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
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({}) => (
	<img
		src={require("./assets/marker_icon.png")}
		style={{ height: 35, width: 35 }}
	/>
);

class view_confirmed_case_check_ins extends Component {
	constructor() {
		super();
		this.verifyToken();
		this.state = {
			group_record_id: null,
			check_in_records: null,
			selected_records_group: null,
			premise_details: null,
			show_phone_no_qr: false,
			search_query: null,
			verify_token: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.state.group_record_id = this.props.match.params.group_record_id;
		this.startup();
		// alert(this.props.match.params.group_record_id);
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
				jsonData.sort(function compare(a, b) {
					return (
						new Date(a.check_in_record.date_created) -
						new Date(b.check_in_record.date_created)
					);
				});
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
				if (jsonData == false) {
					alert("No record found");
				} else {
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
							jsonDataReturned.confirmed_case_dependent.ic_fname +
							" (Dependent)";
						jsonDataReturned.visitor_and_dependent_ic_num =
							jsonDataReturned.confirmed_case_dependent.ic_num;
					}
					jsonDataReturned.date_created = jsonDataReturned.date_created.substring(
						0,
						10
					);
					// alert(JSON.stringify(jsonDataReturned));

					this.setState({
						selected_records_group: jsonDataReturned,
					});
				}
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
				// alert(JSON.stringify(jsonData[0]));
				// var jsonDataReturned = jsonData;
				if (jsonData == false) {
					alert("No record found");
				} else {
					jsonData.forEach(function (item) {
						// alert(JSON.stringify(item.check_in_record.user_premiseowner));
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);

						item.user_premiseowner.date_created
							.replace("T", " ")
							.substring(
								0,
								item.user_premiseowner.date_created.indexOf(".") - 3
							);
					});

					// this.setState({ check_in_records: jsonData });
					this.getCasualContactCount(jsonData);
				}
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
		var { check_in_records } = this.state;
		value = value.split("/")[0];

		var disabled = false;
		check_in_records.forEach(function (item) {
			// alert(value);
			if (item.check_in_record._id == value) {
				// alert("as");
				if (item.casual_contact_count == 0) {
					disabled = true;
				}
			}
		});
		// alert(disabled);
		return disabled;
	};

	handleClose = () => {
		this.setState({ modal_show: false, show_phone_no_qr: false });
	};

	handleShow = (premise_details) => {
		this.setState({
			modal_show: true,
			premise_details: premise_details,
			region: {
				lat: parseFloat(premise_details.premise_lat),
				lng: parseFloat(premise_details.premise_lng),
			},
			place_lat: parseFloat(premise_details.premise_lat),
			place_lng: parseFloat(premise_details.premise_lng),
		});
	};

	handleCopyID = (sid) => {
		navigator.clipboard.writeText(sid);
		// alert("ID copied: " + sid);
	};

	submitSearch = async () => {
		var { search_query } = this.state;

		if (search_query == null) {
			this.startup();
			return;
		}

		if (search_query.trim() == "") {
			this.startup();
			return;
		}

		await fetch("/search_confirmed_case_check_in", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				group_record_id: this.state.group_record_id,
				search_query: search_query,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				// var jsonDataReturned = jsonData;
				if (jsonData == false) {
					alert("No record found");
				} else {
					jsonData.forEach(function (item) {
						// alert(JSON.stringify(item.check_in_record.user_premiseowner));
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);

						item.user_premiseowner.date_created
							.replace("T", " ")
							.substring(
								0,
								item.user_premiseowner.date_created.indexOf(".") - 3
							);
					});

					this.getCasualContactCount(jsonData);
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var {
			group_record_id,
			check_in_records,
			selected_records_group,
			premise_details,
			region,
			place_lat,
			place_lng,
			show_phone_no_qr,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		return (
			<div class="">
				<NavBar />
				<Modal size="lg" show={this.state.modal_show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Contact Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{premise_details === null ? (
							<p></p>
						) : (
							<div>
								{premise_details === null ? (
									<p></p>
								) : (
									<div>
										<div>
											<h5>Premise Details</h5>
											{/* <p>{premise_details._id}</p> */}
											<p>{"Premise Name: " + premise_details.premise_name}</p>
											<p>
												{"Premise Address: " +
													premise_details.premise_address +
													", " +
													premise_details.premise_postcode +
													", " +
													premise_details.premise_state}
											</p>
											<a
												href={`https://www.google.com/maps/place/?q=place_id:${premise_details.premise_id}`}
												target="_blank"
											>
												View on Google Map
											</a>
											<div style={{ height: "300px", width: "70%" }}>
												<GoogleMapReact
													// bootstrapURLKeys={
													// 	{
													// 		key: "tempapikey",
													// 	}
													// }
													center={region}
													defaultZoom={16}
												>
													<AnyReactComponent
														lat={place_lat}
														lng={place_lng}
														// text="My Marker"
													/>
												</GoogleMapReact>
											</div>
											<hr />
											<h5>Owner Details</h5>
											<p>{"Owner's Name: " + premise_details.owner_fname}</p>
											<p>
												{"Owner's Phone No.: " + premise_details.phone_no + " "}
												<span
													class="show_phone_no_qr"
													onClick={() => {
														if (show_phone_no_qr) {
															this.setState({ show_phone_no_qr: false });
														} else {
															this.setState({ show_phone_no_qr: true });
														}
													}}
												>
													{show_phone_no_qr
														? "Hide Phone No. QR code"
														: "Show Phone No. QR code"}
												</span>
											</p>

											{show_phone_no_qr === false ? (
												<p></p>
											) : (
												<div>
													<img
														width="150"
														src={`https://qrcode.tec-it.com/API/QRCode?data=tel%3a${premise_details.phone_no}`}
													/>
													<br />
													<br />
												</div>
											)}

											<p>
												Owner's Email:{" "}
												<a
													href={"mailto:" + premise_details.email}
													target="_blank"
												>
													{premise_details.email}
												</a>
											</p>
										</div>
									</div>
								)}
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
					<div class="page_title">View Confirmed Case Check Ins</div>
				</div>
				<div class="page_content">
					<div class="navigation_breadcrumb">
						<p>
							<Link
								target="_blank"
								to={{
									pathname: `/view_casual_contacts`,
								}}
							>
								<span class="">Confirmed Case Record</span>
							</Link>
							<span class=""> / Confirmed Case Check Ins</span>
						</p>
					</div>
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
								<h5>Confirmed Case Record Details</h5>
								<div id="casual_contact_header_inner">
									<p>
										{"Filtered check ins of " +
											selected_records_group.day_range_check_in +
											" days before from " +
											selected_records_group.date_created}
									</p>
									<p>
										{"Traced casual contact check ins of " +
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
					<div class="search_outer">
						<div class="row">
							<input
								type="text"
								class="form-control col-sm-3"
								id="search_query"
								name="search_query"
								value={this.state.search_query}
								onChange={(e) => {
									this.setState({ search_query: e.target.value });
								}}
								placeholder="Search ID / Premise Name / Premise State"
							/>
							<button
								class="btn btn-success col-sm-1 ml-2"
								onClick={() => {
									this.submitSearch();
								}}
								type="submit"
							>
								Search
							</button>
						</div>
					</div>
					<br />
					{check_in_records == null ? (
						<p>Loading...</p>
					) : (
						<ReactTable
							data={check_in_records}
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
									Header: "Check In Premise",
									accessor: "user_premiseowner.premise_name",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Premise State",
									accessor: "user_premiseowner.premise_state",
									width: 170,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Total Casual Contact",
									accessor: "casual_contact_count",
									width: 150,
									Cell: (row) => (
										<div class="table_column">{row.value + " person(s)"}</div>
									),
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
									Header: "Check In Entry Point",
									accessor: "check_in_record.premise_qr_code.entry_point",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
									width: 200,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Premise Details",
									accessor: "user_premiseowner",
									width: 250,
									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="btn btn-secondary"
												variant="secondary"
												onClick={() => {
													this.handleShow(value);
												}}
											>
												View Premise Details
											</button>
										</div>
									),
								},
								{
									Header: "View Casual Contacts",
									// accessor: "check_in_record._id",
									id: "id",
									width: 250,
									accessor: (d) =>
										`${d.check_in_record._id}` +
										"/" +
										`${d.saved_casual_contacts_group}`,

									Cell: ({ value }) => (
										<div class="table_column">
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
													View Casual Contacts
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
					<br />
				</div>
			</div>
		);
	}
}

export default view_confirmed_case_check_ins;
