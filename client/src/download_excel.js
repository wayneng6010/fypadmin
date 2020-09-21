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

class download_excel extends Component {
	constructor() {
		super();
		this.state = {
			check_in_premises: null,
			check_in_records: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.startup();
	}

	startup = async () => {
		// alert(this.state.group_record_id);
		await fetch("/getConfirmedCaseCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// check_in_id: this.state.check_in_id,
				group_record_id: "5f56262a43b9694580bcfdea",
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				// alert(JSON.stringify(jsonData));
				var jsonDataReturned = jsonData;
				var premises_arr = new Array();
				jsonDataReturned.forEach(function (item) {
					premises_arr.push(item.user_premiseowner);
				});
				this.setState({ check_in_premises: premises_arr });
			})
			.catch((error) => {
				alert("Error: " + error);
			});

		await fetch("/getSimpCasualContactCheckIns", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// check_in_id: this.state.check_in_id,
				group_record_id: "5f56262a43b9694580bcfdea",
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				alert(JSON.stringify(jsonData));
				// var jsonDataReturned = jsonData;
				// var premises_arr = new Array();
				// jsonDataReturned.forEach(function (item) {
				// 	premises_arr.push(item.user_premiseowner);
				// });
				this.setState({ check_in_records: jsonData });
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	render() {
		var { check_in_premises, check_in_records } = this.state;

		const dataSet1 = check_in_premises;
		const dataSet2 = check_in_records;

		// const dataSet2 = [
		// 	{
		// 		name: "Johnson",
		// 		total: 25,
		// 		remainig: 16,
		// 	},
		// 	{
		// 		name: "Josef",
		// 		total: 25,
		// 		remainig: 7,
		// 	},
		// ];
		return (
			<ExcelFile>
				<ExcelSheet data={dataSet1} name="Premises">
					<ExcelColumn label="Checked In Premise Name" value="premise_name" />
					<ExcelColumn label="Checked In Premise Address" value="premise_address" />
					<ExcelColumn label="Checked In Postcode" value="premise_postcode" />
					<ExcelColumn label="Checked In State" value="premise_state" />
					{/* <ExcelColumn label="Check In Record ID" value="_id" /> */}
					{/* <ExcelColumn label="Wallet Money" value="amount" />
					<ExcelColumn label="Gender" value="sex" />
					<ExcelColumn
						label="Marital Status"
						value={(col) => (col.is_married ? "Married" : "Single")}
					/> */}
				</ExcelSheet>
				<ExcelSheet data={dataSet2} name="Casual Contacts Contact Info">
					<ExcelColumn label="Record ID" value="_id" />
				</ExcelSheet>
			</ExcelFile>
		);
	}
}

export default download_excel;
