const { Posts, validationFun } = require("../models/post");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

//GET /posts  ====> Returns array of posts

router.get("/", async (req, res) => {
  //GET /posts ===> it should search posts according to given string as a query parameter
  if (req.query.query) {
    const schema = {
      query: Joi.string().required()
    };
    const result = Joi.validate(req.query, schema);
    if (result.error) {
      res.send({ status: 404, error: result.error.details[0].message });

      return;
    }
    try {
      const posts = await Posts.find();
      let query = req.query.query;
      let filteredPosts = [];

      for (let i = 0; i < posts.length; i++) {
        if (
          posts[i].title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          posts[i].desc.toLowerCase().indexOf(query.toLowerCase()) !== -1
        ) {
          filteredPosts.push(posts[i]);
        }
      }
      if (filteredPosts.length > 0) {
        res.send({ status: 200, data: filteredPosts });
      } else {
        res.send({ status: 200, error: "Not found" });
      }
    } catch {
      res.send({ status: 400, error: "Not found" });
    }
  }

  //GEt All Posts
  else {
    try {
      const posts = await Posts.find();
      res.send({ status: 200, data: posts });
    } catch {
      res.send({ status: 400, error: "Not found" });
    }
  }
});

//GET /posts/:id  ===> Returns sepecifc post object by id

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post);
    if (post) return res.send({ status: 200, data: post });

    throw new Error("Not Found");
  } catch (e) {
    res.send({ status: 200, error: "Not Found" });
  }
});

//POST /posts [title, body]  ====> Returns newly added post object

router.post("/", async (req, res) => {
  const { error } = validationFun(req.body);
  if (error) {
    res.send({ status: 404, error: error.details[0].message });

    return;
  }
  let post = new Posts({
    title: req.body.title,
    img: req.body.img,
    desc: req.body.desc
  });
  post = await post.save();
  res.send({ status: 200, data: post });
});

//PUT /posts/:id [title, body]   ====> It should update specific post's id and body

router.put("/:id", async (req, res) => {
  try {
    const { error } = validationFun(req.body);
    if (error) {
      res.send({ status: 404, error: error.details[0].message });
      return;
    }
    const post = await Posts.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      img: req.body.img,
      desc: req.body.desc
    });
    if (post) return res.send({ status: 200, data: post });
    throw new Error("such doucment not exist");
  } catch (e) {
    res.send({ status: 200, error: "such doucment not exist" });
  }
});

//DELETE /posts/:id     ===> It should delete specific post by id

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findByIdAndRemove(req.params.id);
    if (post) return res.send({ status: 200, msg: " Deleted Post" });
    throw new Error("such doucment not exist");
  } catch (e) {
    res.send({ status: 200, error: "such doucment not exist" });
  }
});

//DELETE /posts   ===> It should remove all posts

router.delete("/", (req, res) => {
  const result = Posts.deleteMany({});
  if (!result) return res.send({ status: 200, msg: "error found" });
  res.send({ status: 200, msg: " All Posts Deleted" });
});

//Validation_Function

module.exports = router;
