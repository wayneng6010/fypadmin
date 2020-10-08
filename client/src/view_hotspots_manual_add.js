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

class view_hotspots_manual_add extends Component {
	constructor() {
		super();
		this.state = {
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
			hotspot_place_name: null,
			hotspot_description: null,
			hotspot_remark: null,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	// signals that the all components have rendered properly
	componentDidMount() {
		this.startup();
	}

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
		await fetch("/getSavedHotspot_manual_added", {
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
				// var jsonDataReturned = jsonData;

				jsonData.forEach(function (item) {
					// alert(JSON.stringify(item.check_in_record.user_premiseowner));
					item.date_created = item.date_created
						.replace("T", " ")
						.substring(0, item.date_created.indexOf(".") - 3);
					item.hotspotDetailsMerged = {
						record_id: item._id,
						place_id: item.place_id,
						place_lat: parseFloat(item.place_lat),
						place_lng: parseFloat(item.place_lng),
						hotspot_place_name: item.place_name,
						hotspot_place_address: item.place_address,
						hotspot_place_state: item.place_state,
						hotspot_description: item.description,
						hotspot_remark: item.remark,
					};
				});

				this.setState({ home_hotpots_record: jsonData });
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
			hotspot_place_name: premise_place.hotspot_place_name,
			hotspot_place_address: premise_place.hotspot_place_address,
			hotspot_place_state: premise_place.hotspot_place_state,
			hotspot_description: premise_place.hotspot_description,
			hotspot_remark: premise_place.hotspot_remark,
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

		var {
			place_id,
			place_lat,
			place_lng,
			hotspot_place_name,
			hotspot_place_address,
			hotspot_place_state,
			hotspot_description,
			hotspot_remark,
		} = this.state;

		if (
			hotspot_place_name == null ||
			hotspot_place_name == "" ||
			hotspot_description == null ||
			hotspot_description == "" ||
			hotspot_remark == null ||
			hotspot_remark == "" ||
			hotspot_place_address == null ||
			hotspot_place_address == "" ||
			hotspot_place_state == null ||
			hotspot_place_state == ""
		) {
			alert("Please fill in every input");
			return;
		}

		await fetch("/saveHotspotDetails_manual_added", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				record_id: record_id,
				place_id: place_id,
				place_lat: place_lat.toString(),
				place_lng: place_lng.toString(),
				place_name: hotspot_place_name,
				place_address: hotspot_place_address,
				place_state: hotspot_place_state,
				description: hotspot_description,
				remark: hotspot_remark,
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
				this.handleClose_1();
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
		} = this.state;
		return (
			<div class="">
				<NavBar />
				<div class="page_header">
					<div class="page_title">View Manual Added Hotspots</div>
				</div>
				<div class="page_content">
					<h2>Manual Added Hotspots</h2>
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
										<p>{premise_details.premise_name}</p>
										<p>
											{premise_details.premise_address +
												", " +
												premise_details.premise_postcode +
												", " +
												premise_details.premise_state}
										</p>
										<h5>Owner Details</h5>
										<p>{premise_details.owner_fname}</p>
										<p>{premise_details.phone_no}</p>
										<p>{premise_details.email}</p>
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
									<div id="update_hotspot_details_outer">
										<div class="input_outer">
											<div class="label_outer">
												<label for="place_name">Place Name</label>
											</div>
											<input
												placeholder="Place Name"
												type="text"
												className="form-control"
												name="place_name"
												id="place_name"
												ref="place_name"
												value={this.state.hotspot_place_name}
												onChange={(e) => {
													this.setState({ hotspot_place_name: e.target.value });
												}}
												required
											/>
										</div>

										<div class="input_outer">
											<div class="label_outer">
												<label for="place_address">Address</label>
											</div>
											<input
												placeholder="Address"
												type="text"
												className="form-control"
												name="place_address"
												id="place_address"
												ref="place_address"
												value={this.state.hotspot_place_address}
												onChange={(e) => {
													this.setState({
														hotspot_place_address: e.target.value,
													});
												}}
												required
											/>
										</div>

										<div class="input_outer">
											<div class="label_outer">
												<label for="place_state">State</label>
											</div>
											<select
												class="form-control"
												name="place_state"
												id="place_state"
												ref="place_state"
												value={this.state.hotspot_place_state}
												onChange={(e) => {
													this.setState({
														hotspot_place_state: e.target.value,
													});
												}}
											>
												<option value="KUALA LUMPUR">KUALA LUMPUR</option>
												<option value="LABUAN">LABUAN</option>
												<option value="PUTRAJAYA">PUTRAJAYA</option>
												<option value="JOHOR">JOHOR</option>
												<option value="KEDAH">KEDAH</option>
												<option value="KELANTAN">KELANTAN</option>
												<option value="MELAKA">MELAKA</option>
												<option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
												<option value="PAHANG">PAHANG</option>
												<option value="PERAK">PERAK</option>
												<option value="PERLIS">PERLIS</option>
												<option value="PULAU PINANG">PULAU PINANG</option>
												<option value="SABAH">SABAH</option>
												<option value="SARAWAK">SARAWAK</option>
												<option value="SELANGOR">SELANGOR</option>
												<option value="TERENGGANU">TERENGGANU</option>
											</select>
										</div>

										<div class="input_outer">
											<div class="label_outer">
												<label for="description">Description</label>
											</div>
											<textarea
												placeholder="Description"
												type="text"
												rows={3}
												className="form-control"
												name="description"
												id="description"
												ref="description"
												onChange={(e) => {
													this.setState({
														hotspot_description: e.target.value,
													});
												}}
												required
											>
												{this.state.hotspot_description}
											</textarea>
										</div>

										<div class="input_outer">
											<div class="label_outer">
												<label for="remark">Remark</label>
											</div>
											<textarea
												placeholder="Remark"
												type="text"
												rows={3}
												className="form-control"
												name="remark"
												id="remark"
												ref="remark"
												onChange={(e) => {
													this.setState({ hotspot_remark: e.target.value });
												}}
												required
											>
												{this.state.hotspot_remark}
											</textarea>
										</div>
										<br />

										<h5>Search for new location</h5>
										{/* <p>{premise_place.record_id}</p>
										<p>{premise_place.place_lat}</p>
										<p>{premise_place.place_lng}</p>
										<p>{premise_place.place_id}</p> */}

										<div class="search_place_outer">
											<input
												placeholder="Search place"
												type="text"
												className="form-control w-100"
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
										<div style={{ height: "400px", width: "100%" }}>
											<GoogleMapReact
												// bootstrapURLKeys={
												// 	{
												// 		key: "key",
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
							bootstrapURLKeys={{ key: "key" }}
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
					{home_hotpots_record == null ? (
						<p></p>
					) : (
						<ReactTable
							data={home_hotpots_record}
							columns={[
								{
									Header: "Place Name",
									accessor: "place_name",
									minWidth: 200,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "State",
									accessor: "place_state",
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								{
									Header: "Address",
									accessor: "place_address",
									minWidth: 300,
									Cell: (row) => <div class="table_column">{row.value}</div>,
								},
								// {
								// 	Header: "Description",
								// 	accessor: "description",
								// 	minWidth: 300,
								// },
								// {
								// 	Header: "Remark",
								// 	accessor: "remark",
								// 	minWidth: 300,
								// },
								{
									Header: "Date Created",
									accessor: "date_created",
									minWidth: 100,
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
												// disabled={this.isDisable(value)}
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

export default view_hotspots_manual_add;
