const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/LogiCreation');
}

const reviewSchema = new mongoose.Schema({ 
  name: String, 
  message: String });

const messageSchema = new mongoose.Schema({
  name: String, 
  to: String,
  message: String
})

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    fname: String,
    name: String,
    price: Number,
    money: Number,
    job: String, 
    img: String,
    reviews: reviewSchema,
    message: [messageSchema], 
    reviews_number: Number
})

const User = mongoose.model("User", userSchema);
const Review = mongoose.model("Review", reviewSchema);
const Message = mongoose.model("Message", messageSchema);
exports.User = User;
exports.Review = Review;
exports.Message = Message;