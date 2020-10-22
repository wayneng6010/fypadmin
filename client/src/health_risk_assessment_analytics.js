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
import { Bar, Pie } from "react-chartjs-2";

class health_risk_assessment_analytics extends Component {
	constructor() {
		super();
		// this.startup();
		this.state = {
			hra_responses_yes: null,
			hra_responses_no: null,
			hra_results: null,
			hra_gender: null,
			hra_age: null,
		};
	}

	// signals that the all components have rendered properly
	componentDidMount = async () => {
		await fetch("/get_hra_responses_count", {
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
				// alert(JSON.stringify(jsonData));
				this.setState({
					hra_responses_yes: jsonData.yes,
					hra_responses_no: jsonData.no,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});

		await fetch("/get_hra_results_count", {
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
				// alert(JSON.stringify(jsonData));
				this.setState({
					hra_results: jsonData,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});

		await fetch("/get_hra_gender_count", {
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
				// alert(JSON.stringify(jsonData));
				this.setState({
					hra_gender: jsonData,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});

		await fetch("/get_hra_age_count", {
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
				// alert(JSON.stringify(jsonData));
				this.setState({
					hra_age: jsonData,
				});
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	startup = async () => {
		// await fetch("/testing", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		visitor_id: "991004-07-5721",
		// 		date_from: "2020-08-24T13:54:36.038+00:00",
		// 	}),
		// })
		// 	.then((res) => {
		// 		// console.log(JSON.stringify(res.headers));
		// 		return res.json();
		// 	})
		// 	.then((jsonData) => {
		// 		alert(JSON.stringify(jsonData));
		// 		// if (jsonData) {
		// 		// 	alert("Login successful");
		// 		// 	// this.props.navigation.navigate("visitor_home");
		// 		// } else {
		// 		// 	alert("Phone number or password is incorrect");
		// 		// }
		// 	})
		// 	.catch((error) => {
		// 		alert("Error: " + error);
		// 	});
	};

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (confirmed_case_check_in_id) => {
		this.setState({ modal_show: true });
		this.view_casual_contacts(confirmed_case_check_in_id);
	};

	handleSubmit = async (e) => {
		e.preventDefault();
	};

	render() {
		var {
			hra_age,
			hra_gender,
			hra_responses_yes,
			hra_responses_no,
			hra_results,
		} = this.state;

		// gender
		var data_gender;
		if (hra_gender !== null) {
			data_gender = {
				labels: ["Male", "Female"],
				datasets: [
					{
						data: hra_gender,
						backgroundColor: [
							"rgba(54, 162, 235, 0.5)",
							"rgba(255, 99, 132, 0.5)",
						],
						hoverBackgroundColor: [
							"rgba(54, 162, 235, 1)",
							"rgba(255, 99, 132, 1)",
						],
					},
				],
			};
		}

		// age
		var data_age;
		if (hra_age !== null) {
			data_age = {
				labels: [
					"0-14 years",
					"15-24 years",
					"25-64 years",
					"65 years and above",
				],
				datasets: [
					{
						label: "Age Range",
						backgroundColor: "rgba(173,131,110,0.2)",
						borderColor: "rgba(173,131,110,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(173,131,110,0.4)",
						hoverBorderColor: "rgba(173,131,110,1)",
						data: hra_age,
					},
				],
			};
		}

		// response
		var data_responses;
		if (hra_responses_yes !== null || hra_responses_no !== null) {
			data_responses = {
				labels: ["Q1", "Q2", "Q3", "Q4", "Q5"],
				datasets: [
					{
						label: "Yes",
						backgroundColor: "rgba(155,231,91,0.2)",
						borderColor: "rgba(155,231,91,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(155,231,91,0.4)",
						hoverBorderColor: "rgba(155,231,91,1)",
						data: hra_responses_yes,
					},
					{
						label: "No",
						backgroundColor: "rgba(255,99,132,0.2)",
						borderColor: "rgba(255,99,132,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(255,99,132,0.4)",
						hoverBorderColor: "rgba(255,99,132,1)",
						data: hra_responses_no,
					},
				],
			};
		}

		// results
		var data_results;
		if (hra_results !== null) {
			data_results = {
				labels: [
					"Health Check Recommended for COVID-19",
					"No Health Check Recommended for COVID-19",
				],
				datasets: [
					{
						data: hra_results,
						backgroundColor: [
							"rgba(255, 99, 132, 0.5)",
							"rgba(161, 237, 172, 0.5)",
						],
						hoverBackgroundColor: [
							"rgba(255, 99, 132, 1)",
							"rgba(161, 237, 172, 1)",
						],
					},
				],
			};
		}

		return (
			<div class="">
				<NavBar />

				<div class="page_header">
					<div class="page_title">Health Risk Assessment Analytics</div>
				</div>
				<div class="page_content">
					{hra_gender == null ||
					hra_age == null ||
					hra_responses_yes == null ||
					hra_responses_no == null ||
					hra_results == null ? (
						<p>Loading...</p>
					) : (
						<div>
							<h4 class="font-weight-bold mb-3">
								Respondent Demographic Overview
							</h4>
							<br />
							<div class="row px-3">
								<div class="col-sm-6">
									<Pie width={500} height={300} data={data_gender} />
								</div>
								<div class="col-sm-6">
									<Bar
										width={500}
										height={300}
										data={data_age}
										options={{
											scales: {
												yAxes: [
													{
														ticks: {
															beginAtZero: true,
															precision: 0,
														},
													},
												],
											},
										}}
									/>
								</div>
							</div>

							<br />
							<hr />
							<br />
							<h4 class="font-weight-bold mb-3">Responses Overview</h4>
							<div class="hra_questions">
								<p class="lead">
									Q1. Have you / your dependent traveled to (or living in) any
									of the <b>COVID-19 affected areas/countries</b> in the last 14
									days?
								</p>
								<p class="lead">
									Q2. Have you / your dependent had any <b>close contact</b>{" "}
									with a person who is known to have COVID-19 during the last 14
									days?
								</p>
								<p class="lead">
									Q3. Do you / your dependent have a <b>fever</b>?
								</p>
								<p class="lead">
									Q4. Do you / your dependent have a <b>cough</b>?
								</p>
								<p class="lead">
									Q5. Do you / your dependent have a <b>shortness of breath</b>?
								</p>
							</div>

							<div class="col-sm-8">
								<Bar
									width={500}
									height={300}
									data={data_responses}
									options={{
										scales: {
											yAxes: [
												{
													ticks: {
														beginAtZero: true,
														precision: 0,
													},
												},
											],
										},
									}}
								/>
							</div>

							<br />
							<hr />
							<br />
							<h4 class="font-weight-bold mb-3">Results Overview</h4>
							<br />
							<div class="col-sm-6">
								<Pie width={500} height={300} data={data_results} />
							</div>
							<br />
							<br />
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default health_risk_assessment_analytics;
