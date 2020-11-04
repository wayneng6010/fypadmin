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
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class download_excel_casual_contacts extends Component {
	constructor() {
		super();
		this.verifyToken();
		this.state = {
			check_in_premises: null,
			check_in_id: null,
			group_record_id: null,
			check_in_records: null,
			confirmed_case_details: null,
			selected_check_in_records: null,
			dependent_record: null,
			visitor_record: null,
			verify_token: false,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.state.check_in_id = this.props.match.params.check_in_id;
		this.state.group_record_id = this.props.match.params.check_in_group_id;
		// alert(this.state.check_in_id + " " + this.state.group_record_id);
		this.startup();
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

	startup = async () => {
		// alert(this.state.group_record_id);
		// await fetch("/getConfirmedCaseCheckIns", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		// check_in_id: this.state.check_in_id,
		// 		group_record_id: "5f56262a43b9694580bcfdea",
		// 	}),
		// })
		// 	.then((res) => {
		// 		// console.log(JSON.stringify(res.headers));
		// 		return res.json();
		// 	})
		// 	.then((jsonData) => {
		// 		// alert(JSON.stringify(jsonData));
		// 		var jsonDataReturned = jsonData;
		// 		var premises_arr = new Array();
		// 		jsonDataReturned.forEach(function (item) {
		// 			premises_arr.push(item.user_premiseowner);
		// 		});
		// 		this.setState({ check_in_premises: premises_arr });
		// 	})
		// 	.catch((error) => {
		// 		alert("Error: " + error);
		// 	});

		// await fetch("/getSimpCasualContactCheckIns", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		check_in_id: "5f43561cd405ce34145766f0",
		// 		group_record_id: "5f56262a43b9694580bcfdea",
		// 	}),
		// })
		// 	.then((res) => {
		// 		// console.log(JSON.stringify(res.headers));
		// 		return res.json();
		// 	})
		// 	.then((jsonData) => {
		// 		alert(JSON.stringify(jsonData));
		// 		// var jsonDataReturned = jsonData;
		// 		// var premises_arr = new Array();
		// 		// jsonDataReturned.forEach(function (item) {
		// 		// 	premises_arr.push(item.user_premiseowner);
		// 		// });
		// 		this.setState({ check_in_records: jsonData });
		// 	})
		// 	.catch((error) => {
		// 		alert("Error: " + error);
		// 	});

		var { check_in_id, group_record_id } = this.state;

		await fetch("/getSelectedSavedCasualContactsGroups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ group_record_id: group_record_id }),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				var confirmed_case_arr = new Array();
				var jsonDataReturned = jsonData;
				if (jsonDataReturned.hasOwnProperty("confirmed_case_visitor")) {
					confirmed_case_arr.push({
						_id: jsonDataReturned._id,
						visitor_and_dependent_fname:
							jsonDataReturned.confirmed_case_visitor.ic_fname,
						visitor_and_dependent_ic_num:
							jsonDataReturned.confirmed_case_visitor.ic_num,
					});
				} else if (
					jsonDataReturned.hasOwnProperty("confirmed_case_dependent")
				) {
					confirmed_case_arr.push({
						_id: jsonDataReturned._id,
						visitor_and_dependent_fname:
							jsonDataReturned.confirmed_case_dependent.ic_fname +
							" (Dependent)",
						visitor_and_dependent_ic_num:
							jsonDataReturned.confirmed_case_dependent.ic_num,
					});
				}
				// jsonDataReturned.date_created = jsonDataReturned.date_created
				// 	.replace("T", " ")
				// 	.substring(0, jsonDataReturned.date_created.indexOf(".") - 3);

				this.setState({ confirmed_case_details: confirmed_case_arr });

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
				check_in_id: check_in_id,
				check_in_group_id: group_record_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				var premise_arr = new Array();

				jsonData.check_in_record.date_created = jsonData.check_in_record.date_created
					.replace("T", " ")
					.substring(0, jsonData.check_in_record.date_created.indexOf(".") - 3);

				premise_arr.push({
					_id: jsonData._id,
					premise_name: jsonData.user_premiseowner.premise_name,
					premise_owner_name: jsonData.user_premiseowner.owner_fname,
					premise_owner_phone_no: jsonData.user_premiseowner.phone_no,
					premise_owner_email: jsonData.user_premiseowner.email,
					premise_owner_state: jsonData.user_premiseowner.premise_state,
					premise_owner_address:
						jsonData.user_premiseowner.premise_address +
						", " +
						jsonData.user_premiseowner.premise_postcode +
						" " +
						jsonData.user_premiseowner.premise_state,
					confirmed_case_check_in_date_time:
						jsonData.check_in_record.date_created,
				});

				this.setState({ selected_check_in_records: premise_arr });
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
				check_in_id: check_in_id,
				check_in_group_id: group_record_id,
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));

				var jsonDataReturned = jsonData;
				var visitor_arr = new Array();
				var dependent_arr = new Array();

				jsonDataReturned.forEach(function (item) {
					item.check_in_record.date_created = item.check_in_record.date_created
						.replace("T", " ")
						.substring(0, item.check_in_record.date_created.indexOf(".") - 3);

					if (item.hasOwnProperty("visitor_dependent")) {
						dependent_arr.push({
							_id: item._id,
							visitor_fname: item.user_visitor.ic_fname,
							visitor_ic_num: item.user_visitor.ic_num,
							visitor_ic_address: item.user_visitor.ic_address,
							visitor_phone_no: item.user_visitor.phone_no,
							visitor_email: item.user_visitor.email,
							dependent_fname: item.visitor_dependent.ic_fname,
							dependent_ic_num: item.visitor_dependent.ic_num,
							dependent_check_in_date_time: item.check_in_record.date_created,
						});
					} else if (item.hasOwnProperty("user_visitor")) {
						visitor_arr.push({
							_id: item._id,
							visitor_fname: item.user_visitor.ic_fname,
							visitor_ic_num: item.user_visitor.ic_num,
							visitor_ic_address: item.user_visitor.ic_address,
							visitor_phone_no: item.user_visitor.phone_no,
							visitor_email: item.user_visitor.email,
							visitor_check_in_date_time: item.check_in_record.date_created,
						});
					}
				});

				this.setState({
					dependent_record: dependent_arr,
					visitor_record: visitor_arr,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var {
			check_in_premises,
			check_in_records,
			confirmed_case_details,
			selected_check_in_records,
			dependent_record,
			visitor_record,
			verify_token,
		} = this.state;

		if (!verify_token) return <div />;

		const confirmed_case_details_dataSet = confirmed_case_details;
		const selected_check_in_records_dataSet = selected_check_in_records;
		const visitor_record_dataSet = visitor_record;
		const dependent_record_dataSet = dependent_record;

		// const styledDataSet = [
		// 	{
		// 		columns: [
		// 			{
		// 				value: "Confirmed Case Name",
		// 				widthPx: 200,
		// 				style: { font: { sz: "24", bold: true } },
		// 			},
		// 			{
		// 				value: "Confirmed Case IC",
		// 				widthPx: 200,
		// 				style: { font: { sz: "24", bold: true } },
		// 			},
		// 		],
		// 		data: [dataSet],
		// 	},
		// ];

		return (
			<div>
				{confirmed_case_details == null ||
				selected_check_in_records == null ||
				dependent_record == null ||
				visitor_record == null ? (
					<p>Download will begin shortly ...</p>
				) : (
					<ExcelFile hideElement>
						<ExcelSheet
							data={confirmed_case_details_dataSet}
							name="Confirmed Case"
						>
							<ExcelColumn label="ID" value="_id" />
							<ExcelColumn
								label="Confirmed Case Name"
								value="visitor_and_dependent_fname"
							/>
							<ExcelColumn
								label="Confirmed Case IC"
								value="visitor_and_dependent_ic_num"
							/>
						</ExcelSheet>
						<ExcelSheet
							data={selected_check_in_records_dataSet}
							name="Premise Checked In"
						>
							<ExcelColumn label="ID" value="_id" />
							<ExcelColumn label="Premise Name" value="premise_name" />
							<ExcelColumn label="Owner Name" value="premise_owner_name" />
							<ExcelColumn
								label="Owner Phone No."
								value="premise_owner_phone_no"
							/>
							<ExcelColumn label="Owner Email" value="premise_owner_email" />
							<ExcelColumn label="Premise State" value="premise_owner_state" />
							<ExcelColumn
								label="Premise Address"
								value="premise_owner_address"
							/>
							<ExcelColumn
								label="Confirmed Case Check In Time"
								value="confirmed_case_check_in_date_time"
							/>
						</ExcelSheet>
						<ExcelSheet data={visitor_record_dataSet} name="Visitor">
							<ExcelColumn label="ID" value="_id" />
							<ExcelColumn label="Name" value="visitor_fname" />
							<ExcelColumn label="IC Number" value="visitor_ic_num" />
							<ExcelColumn
								label="Check In Time"
								value="visitor_check_in_date_time"
							/>
							<ExcelColumn
								label="Residential Address"
								value="visitor_ic_address"
							/>
							<ExcelColumn label="Phone Number" value="visitor_phone_no" />
							<ExcelColumn label="Email" value="visitor_email" />
							{/* <ExcelColumn
						label="Checked In Premise Address"
						value="premise_address"
					/> */}
							{/* <ExcelColumn label="Check In Record ID" value="_id" /> */}
							{/* <ExcelColumn label="Wallet Money" value="amount" />
					<ExcelColumn label="Gender" value="sex" />
					<ExcelColumn
						label="Marital Status"
						value={(col) => (col.is_married ? "Married" : "Single")}
					/> */}
						</ExcelSheet>
						<ExcelSheet data={dependent_record_dataSet} name="Dependent">
							<ExcelColumn label="ID" value="_id" />
							<ExcelColumn label="Dependent Name" value="dependent_fname" />
							<ExcelColumn
								label="Dependent IC Number"
								value="dependent_ic_num"
							/>
							<ExcelColumn
								label="Dependent Check In Time"
								value="dependent_check_in_date_time"
							/>
							<ExcelColumn
								label="Dependent Under (Name)"
								value="visitor_fname"
							/>
							<ExcelColumn
								label="Dependent Under (IC Number)"
								value="visitor_ic_num"
							/>
							<ExcelColumn
								label="Dependent Under (Residential Address)"
								value="visitor_ic_address"
							/>
							<ExcelColumn
								label="Dependent Under (Phone Number)"
								value="visitor_phone_no"
							/>
							<ExcelColumn
								label="Dependent Under (Email)"
								value="visitor_email"
							/>
						</ExcelSheet>
					</ExcelFile>
				)}
			</div>
		);
	}
}

export default download_excel_casual_contacts;
