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

class view_simp_casual_contact_check_ins extends Component {
	constructor() {
		super();
		this.state = {
			check_in_id: null,
			group_record_id: null,
			check_in_records: null,
			contact_info: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		// this.state.check_in_id = this.props.match.params.check_in_id;
		// this.state.check_in_group_id = this.props.match.params.check_in_group_id;
		// alert("1 "+this.props.match.params.check_in_id);
		// alert("2 " + this.props.match.params.check_in_group_id);
		// this.setState({ group_record_id: this.props.match.params.group_record_id });
		this.state.group_record_id = this.props.match.params.group_record_id;
		// alert(this.props.match.params.group_record_id );
		this.startup();
	}

	startup = async () => {
		alert(this.state.group_record_id);
		await fetch("/getSimpCasualContactCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// check_in_id: this.state.check_in_id,
				group_record_id: this.state.group_record_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				alert(JSON.stringify(jsonData));

				// var jsonDataReturned = jsonData;
				// var group_user_id = new Array();
				// jsonDataReturned.forEach(function (item) {
				// 	if (!group_user_id.includes(item.user_visitor._id)) {
				// 		group_user_id.push(item.user_visitor._id);
				// 	}
				// });

				// var arrLength_id = group_user_id.length;
				// var group_user_record = new Array();
				// for (var i = 0; i < arrLength_id; i++) {
				// 	jsonDataReturned.forEach(function (item) {
				// 		if (item.user_visitor._id == group_user_id[i]) {
				// 			var id_existed = false;
				// 			group_user_record.forEach(function (item) {
				// 				if (item._id == group_user_id[i]) {
				// 					id_existed = true;
				// 				}
				// 			});
				// 			if (!id_existed) {
				// 				group_user_record.push(item.user_visitor._id);
				// 			}
				// 		}
				// 	});
				// }
				// alert(JSON.stringify(group_user_record));
				// var arrLength = group_user_id.length;
				// var group_user_record = new Array();
				// jsonDataReturned.forEach(function (item) {
				// 	for (var i = 0; i < arrLength; i++) {
				// 		if (group_user_id[i] == item.user_visitor._id) {
				// 			if (item.hasOwnProperty("visitor_dependent")) {
				// 				group_user_record.push({
				// 					record_id: item._id,
				// 					visitor_fname: item.user_visitor.ic_fname,
				// 					visitor_ic_num: item.user_visitor.ic_num,
				// 					visitor_ic_address: item.user_visitor.ic_address,
				// 					visitor_phone_no: item.user_visitor.phone_no,
				// 					visitor_email: item.user_visitor.email,
				// 					dependent_fname: item.visitor_dependent.ic_fname,
				// 					dependent_ic_num: item.visitor_dependent.ic_num,
				// 				});
				// 			} else if (item.hasOwnProperty("user_visitor")) {
				// 				group_user_record.push({
				// 					record_id: item._id,
				// 					visitor_fname: item.user_visitor.ic_fname,
				// 					visitor_ic_num: item.user_visitor.ic_num,
				// 					visitor_ic_address: item.user_visitor.ic_address,
				// 					visitor_phone_no: item.user_visitor.phone_no,
				// 					visitor_email: item.user_visitor.email,
				// 				});
				// 			}
				// 		}
				// 	}
				// });
				// alert(JSON.stringify(group_user_record));

				// jsonDataReturned.forEach(function (item) {
				// 	if (item.hasOwnProperty("visitor_dependent")) {
				// 		item["ic_num_merged"] = item.visitor_dependent.ic_num;
				// 		item["ic_fname_merged"] =
				// 			item.visitor_dependent.ic_fname + " (Dependent)";
				// 		item["contact_info_merged"] = {
				// 			visitor_fname: item.user_visitor.ic_fname,
				// 			visitor_ic_num: item.user_visitor.ic_num,
				// 			visitor_ic_address: item.user_visitor.ic_address,
				// 			visitor_phone_no: item.user_visitor.phone_no,
				// 			visitor_email: item.user_visitor.email,
				// 			dependent_fname: item.visitor_dependent.ic_fname,
				// 			dependent_ic_num: item.visitor_dependent.ic_num,
				// 		};
				// 	} else if (item.hasOwnProperty("user_visitor")) {
				// 		item["ic_num_merged"] = item.user_visitor.ic_num;
				// 		item["ic_fname_merged"] = item.user_visitor.ic_fname;
				// 		item["contact_info_merged"] = {
				// 			visitor_fname: item.user_visitor.ic_fname,
				// 			visitor_ic_num: item.user_visitor.ic_num,
				// 			visitor_ic_address: item.user_visitor.ic_address,
				// 			visitor_phone_no: item.user_visitor.phone_no,
				// 			visitor_email: item.user_visitor.email,
				// 		};
				// 	}
				// 	item.check_in_record.date_created = item.check_in_record.date_created
				// 		.replace("T", " ")
				// 		.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
				// });

				this.setState({ check_in_records: jsonData });

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
		var { check_in_records, contact_info } = this.state;
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
					<h2>Saved Simplified Casual Contact Check In Record</h2>
					{check_in_records == null ? (
						<p></p>
					) : (
						<ReactTable
							data={check_in_records}
							columns={[
								// {
								// 	Header: "Name",
								// 	accessor: "ic_fname_merged",
								// },
								// {
								// 	Header: "IC",
								// 	accessor: "ic_num_merged",
								// },
								{
									Header: "Visitor Name",
									accessor: "user_visitor.ic_fname",
								},
								{
									Header: "Visitor IC",
									accessor: "user_visitor.ic_num",
								},
								{
									Header: "Dependent Name",
									accessor: "visitor_dependent.ic_fname",
								},
								{
									Header: "Dependent IC",
									accessor: "visitor_dependent.ic_num",
								},
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
							defaultPageSize={5}
							className="-striped -highlight"
						/>
					)}
				</div>
			</div>
		);
	}
}

export default view_simp_casual_contact_check_ins;
