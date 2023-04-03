const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create spending Schema & model
const SpendingSchema = new Schema({
    type: {
        type: String,
        required: [true, "type field is required"]
    },
    date: {
        type: String,
        required: [true, "date field is required"]
    },
    price: {
        type: Number,
        required: [true, "price field is required"]
    },
    note: {
        type: String,
        default: ""
    }
});

const Spending = mongoose.model("data", SpendingSchema);

module.exports = Spending;