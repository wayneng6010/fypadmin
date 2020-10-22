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
		src={require("./assets/hotspot_icon.png")}
		style={{ height: 35, width: 35 }}
	/>
);

class view_hotspots_each extends Component {
	constructor() {
		super();
		this.state = {
			group_record_id: null,
			premise_hotpots_record: null,
			home_hotpots_record: null,
			selected_records_group: null,
			modal_show: false,
			modal_show_1: false,
			premise_details: null,
			premise_place: null,
			search_prediction: null,
			search_prediction_selected: true,
			region: null,
			place_lat: null,
			place_lng: null,
			place_id: null,
			search_query: null,
			show_phone_no_qr: false,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.state.group_record_id = this.props.match.params.group_record_id;
		this.startup();
		// alert(this.props.match.params.group_record_id);
	}

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

		await fetch("/getSavedHotspot_premise", {
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
				// alert(JSON.stringify(jsonData));
				// var jsonDataReturned = jsonData;
				if (!Object.keys(jsonData).length) {
					this.setState({ premise_hotpots_record: "none" });
					return;
				} else {
					jsonData.forEach(function (item) {
						// alert(JSON.stringify(item.check_in_record.user_premiseowner));
						item.date_created = item.date_created
							.replace("T", " ")
							.substring(0, item.date_created.indexOf(".") - 3);
						item.check_in_record.date_created = item.check_in_record.date_created
							.replace("T", " ")
							.substring(0, item.check_in_record.date_created.indexOf(".") - 3);
						item.hotspotDetailsMerged = {
							record_id: item._id,
							place_id: item.place_id,
							place_lat: parseFloat(item.place_lat),
							place_lng: parseFloat(item.place_lng),
						};
					});

					this.setState({ premise_hotpots_record: jsonData });
				}

				// this.getCasualContactCount(jsonData);

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

		await fetch("/getSavedHotspot_home", {
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
				if (!Object.keys(jsonData).length) {
					this.setState({ home_hotpots_record: "none" });
					return;
				} else {
					// alert(JSON.stringify(jsonData[0]));
					jsonData[0].date_created = jsonData[0].date_created
						.replace("T", " ")
						.substring(0, jsonData[0].date_created.indexOf(".") - 3);

					jsonData[0].hotspotDetailsMerged = {
						record_id: jsonData[0]._id,
						place_id: jsonData[0].place_id,
						place_lat: parseFloat(jsonData[0].place_lat),
						place_lng: parseFloat(jsonData[0].place_lng),
					};

					this.setState({ home_hotpots_record: jsonData });
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	isDisable = (value) => {
		// alert(value);
		return false;
	};

	handleClose = () => {
		this.setState({ modal_show: false });
	};

	handleShow = (premise_details) => {
		this.setState({
			modal_show: true,
			premise_details: premise_details,
		});

		// alert(JSON.stringify(value));
		// this.view_casual_contacts(confirmed_case_check_in_id);
	};

	handleClose_1 = () => {
		this.setState({ modal_show_1: false });
	};

	handleShow_1 = (premise_place) => {
		this.setState({
			modal_show_1: true,
			premise_place: premise_place,
			region: {
				lat: premise_place.place_lat,
				lng: premise_place.place_lng,
			},
			place_lat: premise_place.place_lat,
			place_lng: premise_place.place_lng,
			place_id: premise_place.place_id,
		});
		// alert(JSON.stringify(value));
		// this.view_casual_contacts(confirmed_case_check_in_id);
	};

	saveNewHotspotLocation = async (record_id) => {
		// alert(
		// 	record_id +
		// 		" " +
		// 		this.state.place_id +
		// 		" " +
		// 		this.state.place_lat +
		// 		" " +
		// 		this.state.place_lng
		// );
		await fetch("/saveNewHotspotLocation", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				record_id: record_id,
				place_id: this.state.place_id,
				place_lat: this.state.place_lat.toString(),
				place_lng: this.state.place_lng.toString(),
			}),
		})
			.then((res) => {
				// console.log(JSON.stringify(res.headers));
				return res.text();
			})
			.then((response) => {
				if (response == "success") {
					alert("Saved successfully");
					this.startup();
				} else {
					alert("Failed to save");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	getSearchLocation = async (place_id) => {
		const query_get_home_location = `/getSearchLocation?place_id=${place_id}`;
		console.log(query_get_home_location);
		await axios
			.get(query_get_home_location)
			.then((response) => {
				// console.log(response.data);
				// console.log(response.data.results[0].geometry.location.lat);
				// console.log(response.data.results[0].geometry.location.lng);
				var latitude_res = response.data.result.geometry.location.lat;
				var longitude_res = response.data.result.geometry.location.lng;
				this.setState({
					region: {
						lat: latitude_res,
						lng: longitude_res,
					},
					place_lat: latitude_res,
					place_lng: longitude_res,
					place_id: place_id,
				});

				// this.setState({ latitude: latitude, longitude: longitude });
			})
			.catch((error) => {
				alert(error);
			});
	};

	onPressResult = async (place_id, place_name) => {
		// alert(place_id + place_name);
		this.setState({
			search_prediction_selected: true,
			search_query: "",
			place_name: place_name,
		});
		await this.getSearchLocation(place_id);
	};

	searchLocation = async (value) => {
		// alert(value);
		const query_search_home_adress = `/searchLocation?search_query=${value}`;
		console.log(query_search_home_adress);
		await axios
			.get(query_search_home_adress)
			.then((response) => {
				// alert(response.data);
				// console.log(response.data.results[0].geometry.location.lng);
				this.setState({ search_prediction_selected: false });
				var predicted_places = [];
				var predictions = response.data.predictions;
				// console.log("result: " + JSON.stringify(predictions));
				predictions.forEach(function (item) {
					predicted_places.push({
						place_name: item.description,
						place_id: item.place_id,
					});
					// console.log(item.structured_formatting.main_text);
				});

				this.setState({
					search_prediction: predicted_places,
				});
				// alert(JSON.stringify(this.state.search_prediction));
				// this.setState({ latitude: latitude, longitude: longitude });
			})
			.catch((error) => {
				alert(error);
			});
	};

	handleChange = async (e) => {
		this.setState({ search_query: e.target.value });
		if (e.target.value.length == 10) {
			await this.searchLocation(e.target.value);
			// alert(value);
			// alert(this.state.search_query);
		} else {
			this.setState({
				search_prediction: [],
			});
		}
		// alert(e.target.value);
	};

	static defaultProps = {
		center: {
			lat: 59.95,
			lng: 30.33,
		},
		zoom: 11,
	};

	confirm_delete = async (record_id) => {
		if (window.confirm("Confirm to delete?")) {
			await fetch("/delete_one_hotspot_record", {
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
		var {
			premise_hotpots_record,
			home_hotpots_record,
			selected_records_group,
			premise_details,
			premise_place,
			search_prediction,
			region,
			place_lat,
			place_lng,
			search_prediction_selected,
			show_phone_no_qr,
		} = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Hotspots</div>
				</div>
				<div class="page_content">
					<h2>Hotspots</h2>
					<Modal
						size="lg"
						show={this.state.modal_show}
						onHide={this.handleClose}
					>
						<Modal.Header closeButton>
							<Modal.Title>Premise Details</Modal.Title>
						</Modal.Header>
						<Modal.Body>
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

					<Modal
						size="lg"
						show={this.state.modal_show_1}
						onHide={this.handleClose_1}
					>
						<Modal.Header closeButton>
							<Modal.Title>Hotspot Details</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{premise_place === null ? (
								<p></p>
							) : (
								<div>
									<div>
										<h5>Search for new location</h5>
										{/* <p>{premise_place.record_id}</p>
										<p>{premise_place.place_lat}</p>
										<p>{premise_place.place_lng}</p>
										<p>{premise_place.place_id}</p> */}
										<div class="search_place_outer">
											{/* <div class="label_outer">
												<label for="ic_number">Confirmed case IC number</label>
											</div> */}
											<input
												placeholder="Search place"
												type="text"
												className="form-control"
												name="search_query"
												id="search_query"
												ref="search_query"
												value={this.state.search_query}
												onChange={(e) => {
													this.handleChange(e);
												}}
												// onKeyPress={this.handleChange(this.value)}
												required
											/>
										</div>
										<div
											class={
												search_prediction_selected
													? "predict_dropdown_hidden"
													: "predict_dropdown_show"
											}
										>
											{search_prediction === null ? (
												<p></p>
											) : (
												search_prediction.map((item) => (
													<p
														style={{ paddingVertical: 10, cursor: "pointer" }}
														key={item.place_id}
														onClick={() =>
															this.onPressResult(item.place_id, item.place_name)
														}
													>
														{item.place_name}
													</p>
												))
											)}
										</div>
										<br />
										<div style={{ height: "500px", width: "100%" }}>
											<GoogleMapReact
												// bootstrapURLKeys={
												// 	{
												// 		key: "api_key",
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
								</div>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.handleClose_1}>
								Cancel
							</Button>
							{premise_place === null ? (
								<p></p>
							) : (
								<Button
									variant="primary"
									onClick={() => {
										this.saveNewHotspotLocation(premise_place.record_id);
									}}
								>
									Save Changes
								</Button>
							)}
						</Modal.Footer>
					</Modal>
					{/* <div style={{ height: "100vh", width: "100%" }}>
						<GoogleMapReact
							bootstrapURLKeys={{ key: "api_key" }}
							defaultCenter={this.props.center}
							defaultZoom={this.props.zoom}
						>
							<AnyReactComponent
								lat={59.955413}
								lng={30.337844}
								text="My Marker"
							/>
						</GoogleMapReact>
					</div> */}
					<br />
					{selected_records_group == null ? (
						<p></p>
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

					<h4 class="mb-3">
						<img
							class="mb-2 mr-3"
							src="https://www.flaticon.com/svg/static/icons/svg/2948/2948176.svg"
							width={30}
						/>
						Residential Location Hotspot
					</h4>
					{home_hotpots_record == null ? (
						<p></p>
					) : home_hotpots_record == "none" ? (
						<p class="no_record">No record found</p>
					) : (
						<ReactTable
							data={home_hotpots_record}
							columns={[
								{
									Header: "Home Address",
									accessor: "user_visitor.ic_address",
									minWidth: 400,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "View Hotspot Details",
									accessor: "hotspotDetailsMerged",

									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="manage_btn register btn btn-success"
												// disabled={this.isDisable(value)}
												onClick={() => {
													this.handleShow_1(value);
												}}
											>
												View / Edit
											</button>
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
												onClick={() => {
													this.confirm_delete(value);
												}}
												// disabled={this.isDisable(value)}
											>
												Delete
											</button>
										</div>
									),
								},
							]}
							defaultPageSize={1}
							className="-striped -highlight"
						/>
					)}

					<br />
					<h4 class="mb-3">
						<img
							class="mb-2 mr-3"
							src="https://www.flaticon.com/svg/static/icons/svg/126/126122.svg"
							width={30}
						/>
						Premise Hotspot
					</h4>
					{premise_hotpots_record == null ? (
						<p></p>
					) : premise_hotpots_record == "none" ? (
						<p class="no_record">No record found</p>
					) : (
						<ReactTable
							data={premise_hotpots_record}
							columns={[
								{
									Header: "Check In Premise",
									accessor: "user_premiseowner.premise_name",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "State",
									accessor: "user_premiseowner.premise_state",
									Cell: (row) => <div class="table_column">{row.value}</div>,
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
									Header: "Check In Date",
									accessor: "check_in_record.date_created",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								// {
								// 	Header: "Date Created",
								// 	accessor: "date_created",
								// },
								{
									Header: "View Premise Details",
									// accessor: "check_in_record._id",
									// id: "id",
									accessor: "user_premiseowner",

									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="manage_btn register btn btn-secondary"
												// disabled={this.isDisable(value)}
												onClick={() => {
													this.handleShow(value);
												}}
											>
												View
											</button>
										</div>
									),
								},
								{
									Header: "View Hotspot Details",
									accessor: "hotspotDetailsMerged",

									Cell: ({ value }) => (
										<div class="table_column">
											<button
												class="manage_btn register btn btn-success"
												// disabled={this.isDisable(value)}
												onClick={() => {
													this.handleShow_1(value);
												}}
											>
												View / Edit
											</button>
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
												// disabled={this.isDisable(value)}
												onClick={() => {
													this.confirm_delete(value);
												}}
											>
												Delete
											</button>
										</div>
									),
								},
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

export default view_hotspots_each;
