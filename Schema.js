const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db =
	"mongodb+srv://dbUser:627233@clustertesting-j5vap.mongodb.net/COVID19ContactTracing?retryWrites=true&w=majority";
const path = require("path");

//Connect to MongoDB database
mongoose
	.connect(process.env.MONGODB_URI || db, { useNewUrlParser: true })
	.then(() => {
		console.log("Connected to database");
	})
	.catch(() => {
		console.log("Error Connected to database");
	});

// // user schema
// const userSchema = new mongoose.Schema({
// 	name: { type: String },
// 	email: { type: String },
// 	password: { type: String },
// 	date: { type: Date, default: Date.now },
// });

// user schema
const userVisitorSchema = new mongoose.Schema({
	ic_num: { type: String, required: true },
	ic_fname: { type: String, required: true },
	ic_address: { type: String, required: true },
	phone_no: { type: String, required: true },
	email: { type: String, required: true },
	home_lat: { type: Number, required: true },
	home_lng: { type: Number, required: true },
	home_id: { type: String, required: true },
	password: { type: String, required: true },
	// date_created: { type: String, required: true },
	// date_created: { type: Date, default: Date.now },
	date_created: { type: Date },
});

// user premise owner schema
const userPremiseOwnerSchema = new mongoose.Schema({
	owner_fname: { type: String, required: true },
	premise_name: { type: String, required: true },
	phone_no: { type: String, required: true },
	email: { type: String, required: true },
	premise_address: { type: String, required: true },
	premise_postcode: { type: String, required: true },
	premise_state: { type: String, required: true },
	premise_lat: { type: Number, required: true },
	premise_lng: { type: Number, required: true },
	premise_id: { type: String, required: true },
	password: { type: String, required: true },
	date_created: { type: Date },
	premise_qr_codes: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "premise_qr_code" },
	],
});

// premise qr code schema
const premiseQRCodeSchema = new mongoose.Schema({
	entry_point: { type: String, required: true },
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	date_created: { type: Date },
});

// check in record schema
const checkInRecordSchema = new mongoose.Schema({
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	premise_qr_code: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "premise_qr_code",
	},
	visitor_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	date_created: { type: Date },
});

// dependent schema
const visitorDependentSchema = new mongoose.Schema({
	ic_num: { type: String, required: true },
	ic_fname: { type: String, required: true },
	relationship: { type: String, required: true },
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	date_created: { type: Date },
});

// saved casual contact groups schema
const savedCasualContactsGroupSchema = new mongoose.Schema({
	confirmed_case_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	confirmed_case_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	day_range_check_in: { type: String, required: true },
	time_range_check_in_before: { type: String, required: true },
	time_range_check_in_after: { type: String, required: true },
	completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// dependent schema
const savedConfirmedCaseCheckInSchema = new mongoose.Schema({
	saved_casual_contacts_group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_casual_contacts_group",
	},
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// dependent schema
const savedCasualContactCheckInSchema = new mongoose.Schema({
	saved_casual_contacts_group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_casual_contacts_group",
	},
	saved_confirmed_case_check_in: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_confirmed_case_check_in",
	},
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	visitor_dependent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "visitor_dependent",
	},
	completed: { type: Boolean, required: true },
	date_created: { type: Date },
});

// hotspot
const hotspotSchema = new mongoose.Schema({
	saved_casual_contacts_group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "saved_casual_contacts_group",
	},
	check_in_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "check_in_record",
	},
	user_premiseowner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_premiseowner",
	},
	user_visitor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user_visitor",
	},
	place_name: { type: String },
	place_address: { type: String },
	place_state: { type: String },
	description: { type: String },
	remark: { type: String },
	type: { type: String, required: true },
	place_id: { type: String, required: true },
	place_lat: { type: String, required: true },
	place_lng: { type: String, required: true },
	// date_end: { type: Date },
	date_created: { type: Date },
});

// staff
const staffSchema = new mongoose.Schema({
	fname: { type: String, required: true },
	email: { type: String, unique: true, index: true, required: true },
	role: { type: Number, required: true },
	password: { type: String, required: true },
	phone_no: { type: String },
	first_login: { type: Boolean, required: true },
	last_login: { type: Date },
	date_created: { type: Date, required: true },
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const userVisitor = mongoose.model("user_visitor", userVisitorSchema);
const userPremiseOwner = mongoose.model(
	"user_premiseowner",
	userPremiseOwnerSchema
);
const premiseQRCode = mongoose.model("premise_qr_code", premiseQRCodeSchema);
const checkInRecord = mongoose.model("check_in_record", checkInRecordSchema);
const visitorDependent = mongoose.model(
	"visitor_dependent",
	visitorDependentSchema
);
const savedCasualContactsGroup = mongoose.model(
	"saved_casual_contacts_group",
	savedCasualContactsGroupSchema
);
const savedConfirmedCaseCheckIn = mongoose.model(
	"saved_confirmed_case_check_in",
	savedConfirmedCaseCheckInSchema
);
const savedCasualContactCheckIn = mongoose.model(
	"saved_casual_contact_check_in",
	savedCasualContactCheckInSchema
);
const hotspot = mongoose.model("hotspot", hotspotSchema);
const staff = mongoose.model("staff", staffSchema);

module.exports.userVisitor = userVisitor;
module.exports.userPremiseOwner = userPremiseOwner;
module.exports.premiseQRCode = premiseQRCode;
module.exports.checkInRecord = checkInRecord;
module.exports.visitorDependent = visitorDependent;
module.exports.savedCasualContactsGroup = savedCasualContactsGroup;
module.exports.savedConfirmedCaseCheckIn = savedConfirmedCaseCheckIn;
module.exports.savedCasualContactCheckIn = savedCasualContactCheckIn;
module.exports.hotspot = hotspot;
module.exports.staff = staff;
