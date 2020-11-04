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

class view_casual_contact_check_ins extends Component {
	constructor() {
		super();
		this.verifyToken();
		this.state = {
			check_in_id: null,
			check_in_group_id: null,
			check_in_records: null,
			contact_info: null,
			selected_records_group: null,
			selected_check_in_records: null,
			show_phone_no_qr: false,
			search_query: null,
			verify_token: false,
		};
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

	// signals that the all components have rendered properly
	componentDidMount() {
		// this.state.check_in_id = this.props.match.params.check_in_id;
		// this.state.check_in_group_id = this.props.match.params.check_in_group_id;
		// alert("1 "+this.props.match.params.check_in_id);
		// alert("2 " + this.props.match.params.check_in_group_id);
		// var param =
		// 	this.props.match.params.check_in_id +
		// 	this.props.match.params.check_in_group_id;
		// var param_array = param.split(",");
		// alert(param_array[0]);
		// alert(param_array[1]);
		// this.state.check_in_id = param_array[0];
		// this.state.check_in_group_id = param_array[1];

		this.state.check_in_id = this.props.match.params.check_in_id;
		this.state.check_in_group_id = this.props.match.params.check_in_group_id;
		this.startup();
	}

	startup = async () => {
		// alert(this.state.check_in_id);
		await fetch("/getSelectedSavedCasualContactsGroups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ group_record_id: this.state.check_in_group_id }),
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

		await fetch("/getSelectedConfirmedCaseCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				check_in_id: this.state.check_in_id,
				check_in_group_id: this.state.check_in_group_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				jsonData.check_in_record.date_created = jsonData.check_in_record.date_created
					.replace("T", " ")
					.substring(0, jsonData.check_in_record.date_created.indexOf(".") - 3);
				this.setState({ selected_check_in_records: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});

		await fetch("/getCasualContactCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				check_in_id: this.state.check_in_id,
				check_in_group_id: this.state.check_in_group_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == false) {
					alert("No record found");
				} else {
					var jsonDataReturned = jsonData;

					var ic_firstTwoChar, birth_year, age;
					var d = new Date();
					var this_year = d.getFullYear();
					var ic_lastChar, gender;

					jsonDataReturned.forEach(function (item) {
						if (item.hasOwnProperty("visitor_dependent")) {
							ic_lastChar = item.visitor_dependent.ic_num.slice(
								item.visitor_dependent.ic_num.length - 1
							);
							if (ic_lastChar % 2 == 0) {
								gender = "Female";
							} else {
								gender = "Male";
							}

							ic_firstTwoChar = item.visitor_dependent.ic_num.substring(0, 2);
							if (
								ic_firstTwoChar < parseInt(this_year.toString().substring(2, 4))
							) {
								birth_year = 2000 + parseInt(ic_firstTwoChar);
							} else {
								birth_year = 1900 + parseInt(ic_firstTwoChar);
							}
							age = this_year - birth_year;

							item["ic_num_merged"] = item.visitor_dependent.ic_num;
							item["role"] = "Dependent";
							item["ic_fname_merged"] = item.visitor_dependent.ic_fname;
							item["contact_info_merged"] = {
								visitor_fname: item.user_visitor.ic_fname,
								visitor_ic_num: item.user_visitor.ic_num,
								visitor_ic_address: item.user_visitor.ic_address,
								visitor_home_lat: item.user_visitor.home_lat,
								visitor_home_lng: item.user_visitor.home_lng,
								visitor_home_id: item.user_visitor.home_id,
								visitor_phone_no: item.user_visitor.phone_no,
								visitor_email: item.user_visitor.email,
								dependent_fname: item.visitor_dependent.ic_fname,
								dependent_ic_num: item.visitor_dependent.ic_num,
								dependent_relationship: item.visitor_dependent.relationship,
								dependent_age: age,
								dependent_gender: gender,
							};
						} else if (item.hasOwnProperty("user_visitor")) {
							ic_lastChar = item.user_visitor.ic_num.slice(
								item.user_visitor.ic_num.length - 1
							);
							if (ic_lastChar % 2 == 0) {
								gender = "Female";
							} else {
								gender = "Male";
							}

							ic_firstTwoChar = item.user_visitor.ic_num.substring(0, 2);
							if (
								ic_firstTwoChar < parseInt(this_year.toString().substring(2, 4))
							) {
								birth_year = 2000 + parseInt(ic_firstTwoChar);
							} else {
								birth_year = 1900 + parseInt(ic_firstTwoChar);
							}
							age = this_year - birth_year;

							item["ic_num_merged"] = item.user_visitor.ic_num;
							item["role"] = "Visitor";
							item["ic_fname_merged"] = item.user_visitor.ic_fname;
							item["contact_info_merged"] = {
								visitor_fname: item.user_visitor.ic_fname,
								visitor_ic_num: item.user_visitor.ic_num,
								visitor_ic_address: item.user_visitor.ic_address,
								visitor_home_lat: item.user_visitor.home_lat,
								visitor_home_lng: item.user_visitor.home_lng,
								visitor_home_id: item.user_visitor.home_id,
								visitor_phone_no: item.user_visitor.phone_no,
								visitor_email: item.user_visitor.email,
								visitor_age: age,
								visitor_gender: gender,
							};
						}
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
					});

					jsonDataReturned.sort(function compare(a, b) {
						return (
							new Date(a.check_in_record.date_created) -
							new Date(b.check_in_record.date_created)
						);
					});

					this.setState({ check_in_records: jsonDataReturned });
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	handleCheckContacted = (e) => {
		var value = e.target.value;
		alert(value + " saved");
	};

	handleClose = () => {
		this.setState({ modal_show: false, show_phone_no_qr: false });
	};

	handleShow = (contact_info) => {
		this.setState({
			modal_show: true,
			contact_info: contact_info,
			region: {
				lat: parseFloat(contact_info.visitor_home_lat),
				lng: parseFloat(contact_info.visitor_home_lng),
			},
			place_lat: parseFloat(contact_info.visitor_home_lat),
			place_lng: parseFloat(contact_info.visitor_home_lng),
		});
		// alert(JSON.stringify(value));
		// this.view_casual_contacts(confirmed_case_check_in_id);
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

		await fetch("/search_casual_contact_check_in", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				check_in_id: this.state.check_in_id,
				check_in_group_id: this.state.check_in_group_id,
				search_query: this.state.search_query,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				if (jsonData == false) {
					alert("No record found");
				} else {
					var jsonDataReturned = jsonData;

					var ic_firstTwoChar, birth_year, age;
					var d = new Date();
					var this_year = d.getFullYear();
					var ic_lastChar, gender;
					jsonDataReturned.forEach(function (item) {
						if (item.hasOwnProperty("visitor_dependent")) {
							ic_lastChar = item.visitor_dependent.ic_num.slice(
								item.visitor_dependent.ic_num.length - 1
							);
							if (ic_lastChar % 2 == 0) {
								gender = "Female";
							} else {
								gender = "Male";
							}

							ic_firstTwoChar = item.visitor_dependent.ic_num.substring(0, 2);
							if (
								ic_firstTwoChar < parseInt(this_year.toString().substring(2, 4))
							) {
								birth_year = 2000 + parseInt(ic_firstTwoChar);
							} else {
								birth_year = 1900 + parseInt(ic_firstTwoChar);
							}
							age = this_year - birth_year;

							item["ic_num_merged"] = item.visitor_dependent.ic_num;
							item["role"] = "Dependent";
							item["ic_fname_merged"] = item.visitor_dependent.ic_fname;
							item["contact_info_merged"] = {
								visitor_fname: item.user_visitor.ic_fname,
								visitor_ic_num: item.user_visitor.ic_num,
								visitor_ic_address: item.user_visitor.ic_address,
								visitor_home_lat: item.user_visitor.home_lat,
								visitor_home_lng: item.user_visitor.home_lng,
								visitor_home_id: item.user_visitor.home_id,
								visitor_phone_no: item.user_visitor.phone_no,
								visitor_email: item.user_visitor.email,
								dependent_fname: item.visitor_dependent.ic_fname,
								dependent_ic_num: item.visitor_dependent.ic_num,
								dependent_relationship: item.visitor_dependent.relationship,
								dependent_age: age,
								dependent_gender: gender,
							};
						} else if (item.hasOwnProperty("user_visitor")) {
							ic_lastChar = item.user_visitor.ic_num.slice(
								item.user_visitor.ic_num.length - 1
							);
							if (ic_lastChar % 2 == 0) {
								gender = "Female";
							} else {
								gender = "Male";
							}

							ic_firstTwoChar = item.user_visitor.ic_num.substring(0, 2);
							if (
								ic_firstTwoChar < parseInt(this_year.toString().substring(2, 4))
							) {
								birth_year = 2000 + parseInt(ic_firstTwoChar);
							} else {
								birth_year = 1900 + parseInt(ic_firstTwoChar);
							}
							age = this_year - birth_year;

							item["ic_num_merged"] = item.user_visitor.ic_num;
							item["role"] = "Visitor";
							item["ic_fname_merged"] = item.user_visitor.ic_fname;
							item["contact_info_merged"] = {
								visitor_fname: item.user_visitor.ic_fname,
								visitor_ic_num: item.user_visitor.ic_num,
								visitor_ic_address: item.user_visitor.ic_address,
								visitor_home_lat: item.user_visitor.home_lat,
								visitor_home_lng: item.user_visitor.home_lng,
								visitor_home_id: item.user_visitor.home_id,
								visitor_phone_no: item.user_visitor.phone_no,
								visitor_email: item.user_visitor.email,
								visitor_age: age,
								visitor_gender: gender,
							};
						}
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
					});

					jsonDataReturned.sort(function compare(a, b) {
						return (
							new Date(a.check_in_record.date_created) -
							new Date(b.check_in_record.date_created)
						);
					});

					this.setState({ check_in_records: jsonDataReturned });
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var {
			check_in_id,
			check_in_group_id,
			check_in_records,
			contact_info,
			selected_check_in_records,
			selected_records_group,
			show_phone_no_qr,
			region,
			place_lat,
			place_lng,
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
						{contact_info === null ? (
							<p></p>
						) : (
							<div>
								{contact_info.hasOwnProperty("dependent_fname") ? (
									<div>
										<h5>
											Dependent under{" "}
											{contact_info.visitor_fname +
												" with IC " +
												contact_info.visitor_ic_num}
										</h5>
										<p>
											{"Name of Dependent: " + contact_info.dependent_fname}
										</p>
										<p>
											{"IC No. of Dependent: " + contact_info.dependent_ic_num}
										</p>
										<p>{"Age: " + contact_info.dependent_age}</p>
										<p>{"Gender: " + contact_info.dependent_gender}</p>
										<p>
											{"Relationship: " + contact_info.dependent_relationship}
										</p>
										<hr />
										<h5>Contact Information of {contact_info.visitor_fname}</h5>
									</div>
								) : (
									<div>
										<h5>Visitor</h5>
										<p>{"Name: " + contact_info.visitor_fname}</p>
										<p>{"IC No.: " + contact_info.visitor_ic_num}</p>
										<p>{"Age: " + contact_info.visitor_age}</p>
										<p>{"Gender: " + contact_info.visitor_gender}</p>
									</div>
								)}
								<p>
									{"Phone No.: " + contact_info.visitor_phone_no + " "}
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
											src={`https://qrcode.tec-it.com/API/QRCode?data=tel%3a${contact_info.visitor_phone_no}`}
										/>
										<br />
										<br />
									</div>
								)}

								<p>
									Email:{" "}
									<a
										href={"mailto:" + contact_info.visitor_email}
										target="_blank"
									>
										{contact_info.visitor_email}
									</a>
								</p>

								<p>
									{"Residential Address: " + contact_info.visitor_ic_address}
								</p>
								<a
									href={`https://www.google.com/maps/place/?q=place_id:${contact_info.visitor_home_id}`}
									target="_blank"
								>
									View on Google Map
								</a>
								<div style={{ height: "350px", width: "80%" }}>
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
					<div class="page_title">View Casual Contact Check Ins</div>
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
							<span class=""> / </span>
							<Link
								target="_blank"
								to={{
									pathname: `/view_confirmed_case_check_ins/${check_in_group_id}`,
								}}
							>
								<span class="">Confirmed Case Check Ins</span>
							</Link>
							<span class=""> / Casual Contact Check Ins</span>
						</p>
					</div>
					<h2>Casual Contact Check Ins</h2>
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
						</div>
					)}
					{selected_check_in_records == null ? (
						<p>Loading...</p>
					) : (
						<div id="premise_header_outer">
							<h5>Confirmed Case Checked In Premise Details</h5>
							<div id="premise_header_inner">
								<p>
									{selected_check_in_records.user_premiseowner.premise_name}
								</p>
								<p>
									{"Entry point: " +
										selected_check_in_records.check_in_record.premise_qr_code
											.entry_point}
								</p>
								<p>
									{"Checked in at " +
										selected_check_in_records.check_in_record.date_created}
								</p>
							</div>
						</div>
					)}

					{/* excel download button */}
					{check_in_id == null || check_in_group_id == null ? (
						<p>Loading...</p>
					) : (
						<div>
							<Link
								target="_blank"
								to={{
									pathname: `/download_excel_casual_contacts/${check_in_id}/${check_in_group_id}`,
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
								placeholder="Search ID"
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
									Header: "Name",
									accessor: "ic_fname_merged",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "IC",
									accessor: "ic_num_merged",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Role",
									accessor: "role",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								// {
								// 	Header: "Visitor Name",
								// 	accessor: "user_visitor.ic_fname",
								// },
								// {
								// 	Header: "Visitor IC",
								// 	accessor: "user_visitor.ic_num",
								// },
								// {
								// 	Header: "Dependent Name",
								// 	accessor: "visitor_dependent.ic_fname",
								// },
								// {
								// 	Header: "Dependent IC",
								// 	accessor: "visitor_dependent.ic_num",
								// },
								// {
								// 	Header: "Relationship",
								// 	accessor: "visitor_dependent.relationship",
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
									Header: "Check In Entry Point",
									accessor: "check_in_record.premise_qr_code.entry_point",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Contact Details",
									accessor: "contact_info_merged",

									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="btn btn-secondary"
												variant="secondary"
												onClick={() => {
													this.handleShow(value);
												}}
											>
												View Contact Details
											</button>
										</div>
									),
								},
								// {
								// 	Header: "Contacted",
								// 	accessor: "_id",
								// 	Cell: ({ value }) => (
								// 		<div>
								// 			{/* <span>4 person </span>
								// 			<Link
								// 				to={{
								// 					pathname: `/view_casual_contact_check_ins/${value}`,
								// 				}}
								// 			>
								// 				<button class="manage_btn register btn btn-success btn-lg">
								// 					View
								// 				</button>
								// 			</Link> */}
								// 			<input
								// 				name="is_contacted"
								// 				type="checkbox"
								// 				// checked={this.state.isGoing}
								// 				value={value}
								// 				onChange={this.handleCheckContacted.bind(this)}
								// 			/>
								// 		</div>
								// 	),
								// },
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

export default view_casual_contact_check_ins;
