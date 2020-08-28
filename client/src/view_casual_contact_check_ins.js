import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import NavBar from "./NavBar";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
// link this page to another page
import { Link } from "react-router-dom";

class view_casual_contact_check_ins extends Component {
	constructor() {
		super();
		this.state = {
			check_in_id: null,
			check_in_group_id: null,
			check_in_records: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		// this.state.check_in_id = this.props.match.params.check_in_id;
		// this.state.check_in_group_id = this.props.match.params.check_in_group_id;
		// alert("1 "+this.props.match.params.check_in_id);
		// alert("2 " + this.props.match.params.check_in_group_id);
		var param = this.props.match.params.check_in_id + this.props.match.params.check_in_group_id;
		var param_array = param.split(',')
		// alert(param_array[0]);
		// alert(param_array[1]);
		this.state.check_in_id = param_array[0];
		this.state.check_in_group_id = param_array[1];
		this.startup();
	}

	startup = async () => {
		alert(this.state.check_in_id);
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
				alert(JSON.stringify(jsonData));
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

	handleCheckContacted = async () => {
		alert("Saved");
	};

	render() {
		var { check_in_records } = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Casual Contact Check Ins</div>
				</div>
				<div class="page_content">
					<h2>Saved Casual Contact Check In Record</h2>
					{check_in_records == null ? (
						<p></p>
					) : (
						<ReactTable
							data={check_in_records}
							columns={[
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
								{
									Header: "Relationship",
									accessor: "visitor_dependent.relationship",
								},
								{
									Header: "Phone Number",
									accessor: "user_visitor.phone_no",
								},
								{
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
								},
								{
									Header: "View Casual Contacts",
									accessor: "_id",
									Cell: ({ value }) => (
										<div>
											{/* <span>4 person </span>
											<Link
												to={{
													pathname: `/view_casual_contact_check_ins/${value}`,
												}}
											>
												<button class="manage_btn register btn btn-success btn-lg">
													View
												</button>
											</Link> */}
											<input
												name="is_contacted"
												type="checkbox"
												// checked={this.state.isGoing}
												onChange={this.handleCheckContacted}
											/>
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

export default view_casual_contact_check_ins;
