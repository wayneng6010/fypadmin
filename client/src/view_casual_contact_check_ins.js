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

class view_casual_contact_check_ins extends Component {
	constructor() {
		super();
		this.state = {
			check_in_id: null,
			check_in_group_id: null,
			check_in_records: null,
			contact_info: null,
			selected_records_group: null,
			selected_check_in_records: null,
		};
	}

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

				var jsonDataReturned = jsonData;
				jsonDataReturned.forEach(function (item) {
					if (item.hasOwnProperty("visitor_dependent")) {
						item["ic_num_merged"] = item.visitor_dependent.ic_num;
						item["ic_fname_merged"] =
							item.visitor_dependent.ic_fname + " (Dependent)";
						item["contact_info_merged"] = {
							visitor_fname: item.user_visitor.ic_fname,
							visitor_ic_num: item.user_visitor.ic_num,
							visitor_ic_address: item.user_visitor.ic_address,
							visitor_phone_no: item.user_visitor.phone_no,
							visitor_email: item.user_visitor.email,
							dependent_fname: item.visitor_dependent.ic_fname,
							dependent_ic_num: item.visitor_dependent.ic_num,
						};
					} else if (item.hasOwnProperty("user_visitor")) {
						item["ic_num_merged"] = item.user_visitor.ic_num;
						item["ic_fname_merged"] = item.user_visitor.ic_fname;
						item["contact_info_merged"] = {
							visitor_fname: item.user_visitor.ic_fname,
							visitor_ic_num: item.user_visitor.ic_num,
							visitor_ic_address: item.user_visitor.ic_address,
							visitor_phone_no: item.user_visitor.phone_no,
							visitor_email: item.user_visitor.email,
						};
					}
					item.check_in_record.date_created = item.check_in_record.date_created
						.replace("T", " ")
						.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
				});

				this.setState({ check_in_records: jsonDataReturned });

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

	handleCheckContacted = (e) => {
		var value = e.target.value;
		alert(value + " saved");
	};

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (contact_info) => {
		this.setState({ modal_show: true, contact_info: contact_info });
		// alert(JSON.stringify(value));
		// this.view_casual_contacts(confirmed_case_check_in_id);
	};

	render() {
		var {
			check_in_id,
			check_in_group_id,
			check_in_records,
			contact_info,
			selected_check_in_records,
			selected_records_group,
		} = this.state;
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
										<p>
											Dependent under{" "}
											{contact_info.visitor_fname +
												" with IC " +
												contact_info.visitor_ic_num}
										</p>
										<p>{contact_info.dependent_fname}</p>
										<p>{contact_info.dependent_ic_num}</p>
									</div>
								) : (
									<div>
										<p>Visitor</p>
										<p>{contact_info.visitor_fname}</p>
										<p>{contact_info.visitor_ic_num}</p>
									</div>
								)}

								<p>{contact_info.visitor_phone_no}</p>
								<img
									width="150"
									src={`https://qrcode.tec-it.com/API/QRCode?data=tel%3a${contact_info.visitor_phone_no}`}
								/>
								<br />
								<br />
								<p>{contact_info.visitor_email}</p>
								<p>{contact_info.visitor_ic_address}</p>
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
							<h5>Checked In Premise Details</h5>
							<div id="premise_header_inner">
								<p>
									{selected_check_in_records.user_premiseowner.premise_name}
								</p>
								<p>
									{"Confirmed case checked in at " +
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

					<br />

					{check_in_records == null ? (
						<p>Loading...</p>
					) : (
						<ReactTable
							data={check_in_records}
							columns={[
								{
									Header: "Name",
									accessor: "ic_fname_merged",
								},
								{
									Header: "IC",
									accessor: "ic_num_merged",
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
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
								},
								{
									Header: "Contact Details",
									accessor: "contact_info_merged",

									Cell: ({ value }) => (
										<div>
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
				</div>
			</div>
		);
	}
}

export default view_casual_contact_check_ins;
