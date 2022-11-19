const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/LogiCreation');
}

const reviewSchema = new mongoose.Schema({ name: String });

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    fname: String,
    name: String,
    price: Number,
    money:Number,
    department: String, 
    reviews: reviewSchema,
    reviews_number: Number
})

const User = mongoose.model("User", userSchema);
const Review = mongoose.model("Review", reviewSchema);

exports.User = User;
exports.Review = Review;