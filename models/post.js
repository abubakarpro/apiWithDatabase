const mongoose = require("mongoose");
const Joi = require("joi");

///Mongoose Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  desc: { type: String, required: true }
});

const Posts = mongoose.model("Posts", postSchema);

function validationFun(post) {
  const schema = {
    title: Joi.string().required(),
    img: Joi.string().required(),
    desc: Joi.string().required()
  };
  return Joi.validate(post, schema);
}

exports.Posts = Posts;
exports.validationFun = validationFun;
