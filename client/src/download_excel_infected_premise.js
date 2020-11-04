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

class download_excel_infected_premise extends Component {
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
			infected_premise: null,
			verify_token: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
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
				var infected_premise_arr = new Array();
				jsonData.forEach(function (item) {
					infected_premise_arr.push({
						_id: item._id,
						premise_name: item.user_premiseowner.premise_name,
						premise_owner_name: item.user_premiseowner.owner_fname,
						premise_owner_phone_no: item.user_premiseowner.phone_no,
						premise_owner_email: item.user_premiseowner.email,
						premise_owner_state: item.user_premiseowner.premise_state,
						premise_owner_address:
							item.user_premiseowner.premise_address +
							", " +
							item.user_premiseowner.premise_postcode +
							" " +
							item.user_premiseowner.premise_state,
						confirmed_case_check_in_date_time:
							item.check_in_record.date_created,
						casual_contact_count: item.casual_contact_count,
					});
				});
				this.setState({ infected_premise: infected_premise_arr });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	startup = async () => {
		var { group_record_id } = this.state;

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
				this.setState({ confirmed_case_details: confirmed_case_arr });
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
				group_record_id: group_record_id,
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
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var { confirmed_case_details, infected_premise, verify_token } = this.state;

		const confirmed_case_details_dataSet = confirmed_case_details;
		const infected_premise_dataSet = infected_premise;

		if (!verify_token) return <div />;

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
				{confirmed_case_details == null || infected_premise == null ? (
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
						<ExcelSheet data={infected_premise_dataSet} name="Infected Premise">
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
							<ExcelColumn
								label="Number of Casual Contact"
								value="casual_contact_count"
							/>
						</ExcelSheet>
					</ExcelFile>
				)}
			</div>
		);
	}
}

export default download_excel_infected_premise;
