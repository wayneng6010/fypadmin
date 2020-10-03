const express = require("express");
const app = express();
const axios = require("axios");
const userVisitor = require("./Schema").userVisitor;
const userPremiseOwner = require("./Schema").userPremiseOwner;
const premiseQRCode = require("./Schema").premiseQRCode;
const checkInRecord = require("./Schema").checkInRecord;
const visitorDependent = require("./Schema").visitorDependent;
const savedCasualContactsGroup = require("./Schema").savedCasualContactsGroup;
const savedConfirmedCaseCheckIn = require("./Schema").savedConfirmedCaseCheckIn;
const savedCasualContactCheckIn = require("./Schema").savedCasualContactCheckIn;
const hotspot = require("./Schema").hotspot;
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
var path = require("path");

// cookie parser
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

//calling API
//localhost:5000/getArtist?artist_search=artistName
app.get("/getArtist", (req, res) => {
	// default value "smith" for startup search
	const artist_search =
		req.query.artist_search == "" ? "smith" : req.query.artist_search;

	// sort option
	const order = req.query.order;

	const querystr = `https://api.deezer.com/search/artist?q=${artist_search}&order=${order}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistTopTrack", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}/top`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistRelatedNews", (req, res) => {
	const artist_name = req.query.artist_name;
	const sortBy = req.query.sortBy;
	const language = req.query.language;
	const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

	const querystr = `https://newsapi.org/v2/everything?q="${artist_name}"&apiKey=${apikey_news}&sortBy=${sortBy}&language=${language}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameArtist
app.get("/getSameArtist", (req, res) => {
	Artist.findOne({ ID: req.query.artist_id, UserID: req.cookies["uid"] })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/saveArtist?artist_id=artistID
app.get("/saveArtist", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}`;

	axios
		.get(querystr)
		.then((response) => {
			const artist = new Artist({
				ID: response.data.id,
				Name: response.data.name,
				PictureURL: response.data.picture_medium,
				AlbumNum: response.data.nb_album,
				FansNum: response.data.nb_fan,
				UserID: req.cookies["uid"], // identify saved artist belong to which user
			});

			artist
				.save()
				.then((response) => {
					res.send(response.data);
				})
				.catch((error) => {
					res.status(400).json(error);
				});
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getAllArtist
app.get("/getAllArtist", (req, res) => {
	Artist.find({ UserID: req.cookies["uid"] })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/updateArtistImage?imageurl=imageURL
app.get("/updateArtistImage", (req, res) => {
	const record_id = req.query.record_id;
	const image_url = req.query.image_url;
	console.log("record:", record_id);
	console.log("url:", image_url);

	Artist.findOneAndUpdate(
		{ _id: record_id },
		{ $set: { PictureURL: image_url } },
		{ new: true },
		(err, place) => {
			if (err) return res.send(false);
			return res.send(true);
		}
	);
});

//localhost:5000/deleteArtist?title=MovieTitle
app.get("/deleteArtist", (req, res) => {
	Artist.deleteOne({ _id: req.query.record_id })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameEmail
app.get("/getSameEmail", (req, res) => {
	User.findOne({ email: req.query.email })
		.then((response) => {
			console.log(response);
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//localhost:5000/register
app.post("/register", async (req, res) => {
	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashPsw = await bcrypt.hash(req.body.user.psw, salt);

	const user = new User({
		name: req.body.user.name,
		email: req.body.user.email,
		password: hashPsw,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/testing", async (req, res) => {
	var now = new Date();
	const user = new visitorDependent({
		ic_num: "432131-02-1234",
		ic_fname: "Judy Ban",
		relationship: "Grandparent",
		user_visitor: "5f3ce1e22beafc1ea0501bc9",
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).json(error);
	}
	// check if email exist
	// const user = await userVisitor.findOne({ phone_no: req.query.phone_no });
	// if (!user) {
	// 	return res.send(false);
	// }

	// const check_in_records = await checkInRecord
	// 	.findOne({ _id: req.body.phone_no })
	// 	.populate("user_visitor");
	// if (!check_in_records) {
	// 	return res.send(false);
	// }
	// res.send(check_in_records);

	// const visitor = await userVisitor.findOne({ ic_num: req.body.visitor_id });
	// if (!visitor) {
	// 	return res.send(false);
	// } else {
	// 	var visitor_id = visitor._id;
	// 	const check_in_records = await checkInRecord.find({
	// 		$and: [
	// 			{ user_visitor: visitor_id },
	// 			{ date_created: { $gte: new Date(req.body.date_from) } },
	// 		],
	// 	});
	// 	if (!check_in_records) {
	// 		return res.send(false);
	// 	} else {
	// 		const check_in_contacts_records = await checkInRecord.find({
	// 			$and: [
	// 				{ user_visitor: { $ne: visitor_id } },
	// 				{ user_premiseowner: check_in_records[0].user_premiseowner },
	// 				{
	// 					date_created: {
	// 						$gte: new Date(req.body.date_from),
	// 						$lte: new Date("2020-08-24T14:11:36.038+00:00"),
	// 					},
	// 				},
	// 			],
	// 		});
	// 		res.send(check_in_contacts_records);
	// 	}
	// }
});

app.post("/getSavedCasualContactsGroups", async (req, res) => {
	const savedGroups = await savedCasualContactsGroup
		.find()
		.populate("confirmed_case_visitor")
		.populate("confirmed_case_dependent")
		.exec();

	if (!savedGroups) {
		return res.send(false);
	}

	// var counter = 0;
	// savedGroups.forEach(async function (item) {
	// 	const savedCheckInCount = await savedConfirmedCaseCheckIn.countDocuments({
	// 		saved_casual_contacts_group: item._id,
	// 	});
	// 	item.check_in_count = savedCheckInCount;
	// 	console.log(item.check_in_count);

	// 	if (counter == savedGroups.length - 1) {
	// 		res.send(savedGroups);
	// 	}
	// 	counter += 1;
	// });

	res.send(savedGroups);
});

app.post("/getCheckInCount", async (req, res) => {
	var counter = 0;
	var groupRecord = req.body.groupRecord;
	groupRecord.forEach(async function (item) {
		const savedCheckInCount = await savedConfirmedCaseCheckIn.countDocuments({
			saved_casual_contacts_group: item._id,
		});
		item.check_in_count = savedCheckInCount;
		// console.log(item.check_in_count);
		const savedCasualContactCount = await savedCasualContactCheckIn.countDocuments(
			{
				saved_casual_contacts_group: item._id,
			}
		);
		item.casual_contact_count = savedCasualContactCount;

		if (counter == groupRecord.length - 1) {
			res.send(groupRecord);
		}
		counter += 1;
	});
});

app.post("/getCasualContactCount", async (req, res) => {
	var counter = 0;
	var checkInRecord = req.body.checkInRecord;
	checkInRecord.forEach(async function (item) {
		// console.log(item);
		const savedCasualContactCount = await savedCasualContactCheckIn.countDocuments(
			{
				$and: [
					{
						saved_casual_contacts_group: item.saved_casual_contacts_group,
					},
					{ saved_confirmed_case_check_in: item.check_in_record._id },
				],
			}
		);

		// const savedCasualContactCount = await savedCasualContactCheckIn
		// 	.find({
		// 		$and: [
		// 			{
		// 				saved_casual_contacts_group: item.saved_casual_contacts_group,
		// 			},
		// 			{ saved_confirmed_case_check_in: item.check_in_record._id },
		// 		],
		// 	})
		// 	.count();

		item.casual_contact_count = savedCasualContactCount;

		if (counter == checkInRecord.length - 1) {
			res.send(checkInRecord);
		}
		counter += 1;
	});
});

app.post("/getHotspotCount", async (req, res) => {
	var counter = 0;
	var groupRecord = req.body.groupRecord;
	groupRecord.forEach(async function (item) {
		const savedHotspotCount = await hotspot.countDocuments({
			saved_casual_contacts_group: item._id,
		});
		item.hotspot_count = savedHotspotCount + " place(s)";

		if (counter == groupRecord.length - 1) {
			res.send(groupRecord);
		}
		counter += 1;
	});
});

app.post("/getSavedHotspot_premise", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					saved_casual_contacts_group: req.body.group_record_id,
				},
				{ type: "premise" },
			],
		})
		.populate("check_in_record")
		.populate("user_premiseowner")
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.post("/getSavedHotspot_home", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			$and: [
				{
					saved_casual_contacts_group: req.body.group_record_id,
				},
				{ type: "residential" },
			],
		})
		.populate("user_visitor")
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.post("/getSavedHotspot_manual_added", async (req, res) => {
	const savedHotspot = await hotspot
		.find({
			type: "manual_added",
		})
		.exec();

	if (!savedHotspot) {
		return res.send(false);
	}
	res.send(savedHotspot);
});

app.get("/searchLocation", (req, res) => {
	const search_query = req.query.search_query;
	const api_key = "key";
	const querystr = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search_query}&components=country:my&types=establishment&key=${api_key}`;
	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.get("/getSearchLocation", (req, res) => {
	const place_id = req.query.place_id;
	const api_key = "key";
	// const querystr = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${home_address}&key=${api_key}`;
	const querystr = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry&key=${api_key}`;

	axios
		.get(querystr)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

app.post("/add_new_hotspot", async (req, res) => {
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	const place_name = req.body.place_name;
	const place_state = req.body.place_state;
	const place_address = req.body.place_address;
	const description = req.body.description;
	const remark = req.body.remark;
	var now = new Date();
	
	const savedHotspot = new hotspot({
		type: "manual_added",
		place_name: place_name,
		place_address: place_address,
		place_state: place_state,
		description: description,
		remark: remark,
		place_id: place_id,
		place_lat: place_lat,
		place_lng: place_lng,
		date_created: new Date(now.getTime() + 480 * 60000),
	});
	try {
		const newHotspot = await savedHotspot.save();
		res.send("success");
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post("/saveNewHotspotLocation", (req, res) => {
	const record_id = req.body.record_id;
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	console.log(record_id);
	console.log(place_id);
	console.log(place_lat);
	console.log(place_lng);

	hotspot.findOneAndUpdate(
		{ _id: record_id },
		{
			$set: { place_id: place_id, place_lat: place_lat, place_lng: place_lng },
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/saveHotspotDetails_manual_added", (req, res) => {
	const record_id = req.body.record_id;
	const place_id = req.body.place_id;
	const place_lat = req.body.place_lat;
	const place_lng = req.body.place_lng;
	const place_name = req.body.place_name;
	const place_state = req.body.place_state;
	const place_address = req.body.place_address;
	const description = req.body.description;
	const remark = req.body.remark;

	hotspot.findOneAndUpdate(
		{ _id: record_id },
		{
			$set: {
				place_id: place_id,
				place_lat: place_lat,
				place_lng: place_lng,
				place_name: place_name,
				place_state: place_state,
				place_address: place_address,
				description: description,
				remark: remark,
			},
		},
		{ new: true },
		(err, place) => {
			if (err) return res.send("failed");
			return res.send("success");
		}
	);
});

app.post("/getSelectedSavedCasualContactsGroups", async (req, res) => {
	const savedGroups = await savedCasualContactsGroup
		.findOne({
			_id: req.body.group_record_id,
		})
		.populate("confirmed_case_visitor")
		.populate("confirmed_case_dependent")
		.exec();

	if (!savedGroups) {
		return res.send(false);
	}
	res.send(savedGroups);
});

app.post("/getEachPremiseName", async (req, res) => {
	const premise_info = await userPremiseOwner.findOne({
		_id: req.body.user_premiseowner_id,
	});

	if (!premise_info) {
		return res.send(false);
	}
	res.send(premise_info);
});

app.post("/getConfirmedCaseCheckIns", async (req, res) => {
	// console.log(req.body.group_record_id);
	const savedCheckIns = await savedConfirmedCaseCheckIn
		.find({ saved_casual_contacts_group: req.body.group_record_id })
		.populate("check_in_record")
		.populate("user_premiseowner")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getSelectedConfirmedCaseCheckIns", async (req, res) => {
	// console.log(req.body.group_record_id);
	const savedCheckIns = await savedConfirmedCaseCheckIn
		.findOne({
			$and: [
				{
					saved_casual_contacts_group: req.body.check_in_group_id,
				},
				{ check_in_record: req.body.check_in_id },
			],
		})
		.populate("check_in_record")
		.populate("user_premiseowner")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getCasualContactCheckIns", async (req, res) => {
	console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			$and: [
				{
					saved_confirmed_case_check_in: req.body.check_in_id,
				},
				{ saved_casual_contacts_group: req.body.check_in_group_id },
			],
		})
		.populate("check_in_record")
		.populate("user_visitor")
		.populate("visitor_dependent")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/getSimpCasualContactCheckIns", async (req, res) => {
	console.log(req.body.check_in_id);
	const savedCheckIns = await savedCasualContactCheckIn
		// .find({ saved_confirmed_case_check_in: req.body.check_in_id })
		.find({
			saved_casual_contacts_group: req.body.group_record_id,
		})
		.populate("check_in_record")
		.populate("user_visitor")
		.populate("visitor_dependent")
		.exec();

	if (!savedCheckIns) {
		return res.send(false);
	}
	res.send(savedCheckIns);
});

app.post("/savedCasualContactsGroup", async (req, res) => {
	console.log(req.body.confirmed_case_id);
	console.log(req.body.confirmed_case_user_type);
	console.log(req.body.check_in_day_range);
	console.log(req.body.check_in_time_range_before);
	console.log(req.body.check_in_time_range_after);
	console.log(req.body.checked_in_premise);
	console.log(req.body.casual_contacts_visitors);
	var now = new Date();
	var savedGroup, confirmed_case_info;
	if (req.body.confirmed_case_user_type == "Visitor") {
		savedGroup = new savedCasualContactsGroup({
			confirmed_case_visitor: req.body.confirmed_case_id,
			day_range_check_in: req.body.check_in_day_range,
			time_range_check_in_before: req.body.check_in_time_range_before,
			time_range_check_in_after: req.body.check_in_time_range_after,
			completed: false,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		confirmed_case_info = await userVisitor.findOne({
			ic_num: req.body.confirmed_case_ic_num,
		});
	} else if (req.body.confirmed_case_user_type == "Dependent") {
		savedGroup = new savedCasualContactsGroup({
			confirmed_case_dependent: req.body.confirmed_case_id,
			day_range_check_in: req.body.check_in_day_range,
			time_range_check_in_before: req.body.check_in_time_range_before,
			time_range_check_in_after: req.body.check_in_time_range_after,
			completed: false,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		const dependent = await visitorDependent.findOne({
			ic_num: req.body.confirmed_case_ic_num,
		});
		confirmed_case_info = await userVisitor.findOne({
			_id: dependent.user_visitor,
		});
	}

	try {
		var saved_group = await savedGroup.save();
		req.body.checked_in_premise.forEach(async function (item) {
			console.log(item._id);
			savedCheckIn = new savedConfirmedCaseCheckIn({
				saved_casual_contacts_group: saved_group._id,
				check_in_record: item._id,
				user_premiseowner: item.user_premiseowner._id,
				completed: false,
				date_created: new Date(now.getTime() + 480 * 60000),
			});
			await savedCheckIn.save();
		});

		req.body.casual_contacts_visitors.forEach(async function (item) {
			console.log(item);
			if (item.visitor_dependent !== undefined) {
				saved_casual_contact_check_in = new savedCasualContactCheckIn({
					saved_casual_contacts_group: saved_group._id,
					saved_confirmed_case_check_in: item.check_in_record_id,
					check_in_record: item._id,
					user_visitor: item.user_visitor._id,
					visitor_dependent: item.visitor_dependent._id,
					completed: false,
					date_created: new Date(now.getTime() + 480 * 60000),
				});
			} else {
				saved_casual_contact_check_in = new savedCasualContactCheckIn({
					saved_casual_contacts_group: saved_group._id,
					saved_confirmed_case_check_in: item.check_in_record_id,
					check_in_record: item._id,
					user_visitor: item.user_visitor._id,
					completed: false,
					date_created: new Date(now.getTime() + 480 * 60000),
				});
			}
			await saved_casual_contact_check_in.save();
		});

		savedHomeHotspot = new hotspot({
			saved_casual_contacts_group: saved_group._id,
			type: "residential",
			user_visitor: confirmed_case_info._id,
			place_id: confirmed_case_info.home_id,
			place_lat: confirmed_case_info.home_lat,
			place_lng: confirmed_case_info.home_lng,
			date_created: new Date(now.getTime() + 480 * 60000),
		});
		await savedHomeHotspot.save();

		req.body.checked_in_premise.forEach(async function (item) {
			console.log(item._id);
			savedHotspot = new hotspot({
				saved_casual_contacts_group: saved_group._id,
				type: "premise",
				check_in_record: item._id,
				user_premiseowner: item.user_premiseowner._id,
				place_id: item.user_premiseowner.premise_id,
				place_lat: item.user_premiseowner.premise_lat,
				place_lng: item.user_premiseowner.premise_lng,
				date_created: new Date(now.getTime() + 480 * 60000),
			});
			await savedHotspot.save();
		});

		return res.send(true);
	} catch (error) {
		res.status(400).json(error);
	}

	// return res.send(true);
});

app.post("/search_confirmed_case_info_visitor", async (req, res) => {
	const visitor = await userVisitor.findOne({ ic_num: req.body.ic_number });
	if (!visitor) {
		// const dependent = await visitorDependent.findOne({
		// 	ic_num: req.body.ic_number,
		// });
		// if (!dependent) {
		// 	return res.send(false);
		// } else {
		// 	return res.send(dependent);
		// }
		return res.send(false);
	} else {
		return res.send(visitor);
	}
});

app.post("/search_confirmed_case_info_dependent", async (req, res) => {
	const dependent = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!dependent) {
		return res.send(false);
	} else {
		return res.send(dependent);
	}
});

app.post("/search_check_in_records_dependent", async (req, res) => {
	const confirmed_dependent = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_dependent) {
		return res.send(false);
	} else {
		var confirmed_dependent_id = confirmed_dependent._id;
		const check_in_records = await checkInRecord
			.find({
				$and: [
					{
						// $and: [
						// { user_visitor: confirmed_dependent_id },
						// { visitor_dependent: { $exists: false } },
						visitor_dependent: confirmed_dependent_id,
						// { visitor_dependent: confirmed_visitor_id  },
						// ],
					},
					// { user_visitor: confirmed_visitor_id },
					{ date_created: { $gte: new Date(req.body.date_from) } },
				],
			})
			.populate("user_premiseowner")
			.exec();

		if (!check_in_records) {
			return res.send(false);
		}
		res.send(check_in_records);
	}
});

app.post("/search_check_in_records_visitor", async (req, res) => {
	const confirmed_visitor = await userVisitor.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		var confirmed_visitor_id = confirmed_visitor._id;
		const check_in_records = await checkInRecord
			.find({
				$and: [
					{
						$and: [
							{ user_visitor: confirmed_visitor_id },
							{ visitor_dependent: { $exists: false } },
							// { visitor_dependent: confirmed_visitor_id  },
						],
					},
					// { user_visitor: confirmed_visitor_id },
					{ date_created: { $gte: new Date(req.body.date_from) } },
				],
			})
			.populate("user_premiseowner")
			.exec();

		if (!check_in_records) {
			return res.send(false);
		}
		res.send(check_in_records);
		// if (!check_in_records) {
		// 	return res.send(false);
		// } else {
		// 	const check_in_contacts_records = await checkInRecord.find({
		// 		$and: [
		// 			{ user_visitor: { $ne: visitor_id } },
		// 			{ user_premiseowner: check_in_records[0].user_premiseowner },
		// 			{
		// 				date_created: {
		// 					$gte: new Date(req.body.date_from),
		// 					$lte: new Date("2020-08-24T14:11:36.038+00:00"),
		// 				},
		// 			},
		// 		],
		// 	});
		// 	res.send(check_in_contacts_records);
		// }
	}
});

app.post("/search_casual_contacts_visitor", async (req, res) => {
	// console.log("hey");
	var check_in_contacts_records_arr = new Array();
	const confirmed_visitor = await userVisitor.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		// return res.send(true);
		var confirmed_visitor_id = confirmed_visitor._id;
		var counter = 0;
		console.log(JSON.stringify(req.body.check_in_timerange));
		req.body.check_in_timerange.forEach(async function (item) {
			// console.log(item);
			const check_in_contacts_records = await checkInRecord
				.find({
					$and: [
						{
							$or: [
								{ user_visitor: { $ne: confirmed_visitor_id } },
								{ visitor_dependent: { $exists: true, $ne: null } },
								// { visitor_dependent: confirmed_visitor_id  },
							],
						},
						{
							user_premiseowner: item.user_premiseowner,
						},
						{
							date_created: {
								$gte: new Date(item.time_from),
								$lte: new Date(item.time_to),
							},
						},
					],
				})
				.populate("user_visitor", { ic_num: 1, ic_fname: 1 })
				.populate("visitor_dependent", { ic_num: 1, ic_fname: 1 })
				.exec();
			// .populate("user_visitor");

			// console.log(check_in_contacts_records);
			// console.log(item.check_in_record_id);
			var check_in_record_id = item.check_in_record_id;
			check_in_contacts_records.forEach(async function (item) {
				// console.log(item.user_visitor);
				// var innerObj = {};
				// innerObj[check_in_record_id] = item;
				// item.check_in_record_id = check_in_record_id;
				// Object.assign(item, {"check_in_record_id": check_in_record_id});
				// item[_id] = { "_id": item._id};

				// item["check_in_record_id"] = check_in_record_id;
				if (item.visitor_dependent !== undefined) {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				} else {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						// visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				}
			});

			if (counter == req.body.check_in_timerange.length - 1) {
				console.log(check_in_contacts_records_arr);
				res.send(check_in_contacts_records_arr);
			}

			// console.log(check_in_contacts_records_arr_final);
			// res.send(check_in_contacts_records);
			counter += 1;
		});
		// res.send(check_in_contacts_records_arr_final);
	}
});

app.post("/search_casual_contacts_dependent", async (req, res) => {
	// console.log("hey");
	var check_in_contacts_records_arr = new Array();
	const confirmed_visitor = await visitorDependent.findOne({
		ic_num: req.body.ic_number,
	});
	if (!confirmed_visitor) {
		return res.send(false);
	} else {
		// return res.send(true);
		var confirmed_visitor_id = confirmed_visitor._id;
		var counter = 0;
		console.log(req.body.check_in_timerange);
		req.body.check_in_timerange.forEach(async function (item) {
			// console.log(item);
			const check_in_contacts_records = await checkInRecord
				.find({
					$and: [
						{
							visitor_dependent: { $ne: confirmed_visitor_id },
							// { visitor_dependent: confirmed_visitor_id  },
						},
						{
							user_premiseowner: item.user_premiseowner,
						},
						{
							date_created: {
								$gte: new Date(item.time_from),
								$lte: new Date(item.time_to),
							},
						},
					],
				})
				.populate("user_visitor", { ic_num: 1, ic_fname: 1 })
				.populate("visitor_dependent", { ic_num: 1, ic_fname: 1 })
				.exec();
			// .populate("user_visitor");

			// console.log(check_in_contacts_records);
			// console.log(item.check_in_record_id);
			var check_in_record_id = item.check_in_record_id;
			check_in_contacts_records.forEach(async function (item) {
				// console.log(item);
				// check_in_contacts_records_arr.push(item);
				if (item.visitor_dependent !== undefined) {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				} else {
					check_in_contacts_records_arr.push({
						_id: item._id,
						check_in_record_id: check_in_record_id,
						user_visitor: item.user_visitor,
						user_premiseowner: item.user_premiseowner,
						premise_qr_code: item.premise_qr_code,
						// visitor_dependent: item.visitor_dependent,
						date_created: item.date_created,
					});
				}
			});
			if (counter == req.body.check_in_timerange.length - 1) {
				console.log(check_in_contacts_records_arr);
				res.send(check_in_contacts_records_arr);
			}

			// console.log(check_in_contacts_records_arr_final);
			// res.send(check_in_contacts_records);
			counter += 1;
		});
		// res.send(check_in_contacts_records_arr_final);
	}
});

//localhost:5000/login
app.post("/login", async (req, res) => {
	// check if email exist
	const user = await User.findOne({ email: req.body.user.email });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.psw, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	// create and assign a token
	const token = jwt.sign({ _id: user._id }, "vE7YWqEuJQOXjlKxU7e4SOl");

	// save token and user id to cookie
	res.cookie("auth-token", token); // to verify if user have login
	res.cookie("uid", user._id); // while be used while saving artist
	res.cookie("uname", user.name); // will be display on navigation bar (logged in as UserName)
	res.send(true);
});

app.post("/logout", async (req, res) => {
	// clear auth-token cookie and user id cookie
	res
		.clearCookie("auth-token")
		.clearCookie("uid")
		.clearCookie("uname")
		.send(true);
});

app.get("/verifyToken", (req, res) => {
	const token = req.cookies["auth-token"];
	console.log(req.cookies["uid"]);

	// if dont have the token
	if (!token) {
		console.log("Access Denied");
		return res.send("Access Denied");
	}
	try {
		// verify token
		const verified = jwt.verify(token, "vE7YWqEuJQOXjlKxU7e4SOl");
		// store user ID and time of token issued to indicate that the user is authenticated
		req.user = verified;
		return res.send("Access Granted");
	} catch (err) {
		console.log("Invalid token");
		return res.send("Invalid token");
	}
});

app.get("/getUserName", (req, res) => {
	const username = req.cookies["uname"];
	res.send(username);
});

// heroku
if (process.env.NODE_ENV === "production") {
	// Exprees will serve up production assets
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
