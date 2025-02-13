var express = require("express");
var glob = require("glob");
var fs = require("fs");
var Product = require("../models/product");

var router = express.Router();

const JSON_DUMMY_FILES = "dummy_data";
const JSON_STRESS_FILES = "stress_data";

// Return all products
router.get("/api/products", function (req, res, next) {
  Product.find()
    .then((products) => {
      res.json({ products: products });
    })
    .catch((err) => {
      return next(err);
    });
});

// Return specific product by ID
router.get("/api/products/:id", function (req, res, next) {
  var id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (product === null) {
        return res
          .status(404)
          .json({ message: "Product with id ${id} not found" });
      }
      res.json(product);
    })
    .catch((err) => {
      return next(err);
    });
});

// Add a new product
router.post("/api/products", function (req, res, next) {
  var newproduct = new Product(req.body);
  newproduct.save().catch((error) => {
    console.log("Error storing object: " + error);
    return res.status(400).json({ message: "Error storing object: " + error });
  });
  return res.status(201).json(newproduct);
});

// Update a product given an ID
router.patch("/api/products/:id", function (req, res, next) {
  var id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (product == null) {
        return res
          .status(404)
          .json({ message: "Product with id ${id} not found" });
      }
      product.name = req.body.name || product.name;
      product.category = req.body.category || product.category;
      product.price = req.body.price || product.price;
      product.nrReserved = req.body.nrReserved || product.nrReserved;
      product.nrOrdered = req.body.nrOrdered || product.nrOrdered;
      product.save().then(() => res.json(product));
    })
    .catch((err) => {
      return next(err);
    });
});

// Delete all products
router.delete("/api/products", function (req, res, next) {
  Product.deleteMany({}).catch(function (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while clearing database: " + error });
  });
  return res.status(200).json({ message: "ok" });
});

// Delete a product given an ID
router.delete("/api/products/:id", function (req, res, next) {
  var id = req.params.id;
  Product.findOneAndDelete({ _id: id })
    .then((product) => {
      if (product === null) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    })
    .catch((err) => {
      return next(err);
    });
});

// Batch-add some predefined products
router.post("/api/products/testdata", function (req, res, next) {
  var newproducts = [];
  // load JSON files from dir
  glob.sync("*.json", { cwd: JSON_DUMMY_FILES }).map((f) => {
    var json_string = fs.readFileSync(JSON_DUMMY_FILES + "/" + f);
    // uses the Mongoose magic to create a new product DTO from JSON data
    var raw = JSON.parse(json_string);
    var product = new Product(raw);
    product.save().catch((err) => {
      console.log("Error storing object: " + err);
      return res.status(500).json({ message: "Error storing object: " + err });
    });
    newproducts.push(product);
  });
  res.status(201).json({ products: newproducts });
});

// Batch-add a bunch of products (generate a non-blocking long running request)
router.post("/api/products/stress", function (req, res, next) {
  var loadparam = req.query.loadparam || 100;
  console.log("Starting stress test");
  var raw;
  // load one example JSON file
  glob.sync("*.json", { cwd: JSON_STRESS_FILES }).map((f) => {
    var json_string = fs.readFileSync(JSON_STRESS_FILES + "/" + f);
    raw = JSON.parse(json_string);
  });
  console.log(raw);
  console.log("Load: " + loadparam);
  // create X copies of this object
  var products = [];
  for (var i = 0; i < loadparam; i++) {
    console.log("Saving product " + i);
    var product = new Product(raw);
    product.save().catch((err) => {
      console.log("Error storing object: " + err);
      return res.status(500).json({ message: "Error storing object: " + err });
    });
    products[i] = product;
    console.log(products[i]);
  }
});

// Batch-remove stress test data
router.post("/api/products/unstress", function (req, res, next) {
  var raw;
  // load one example JSON file
  glob.sync("*.json", { cwd: JSON_STRESS_FILES }).map((f) => {
    var json_string = fs.readFileSync(JSON_STRESS_FILES + "/" + f);
    raw = JSON.parse(json_string);
  });
  // remove the objects again
  Product.deleteMany({ name: raw.name }).catch((err) => {
    return next(err);
  });
});

router.post("/api/products/:id/like", function (req, res, next) {
  const id = req.params.id;

  Product.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 } })
    .then((product) => {
      if (product) res.status(204).end();
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

router.post("/api/products/:id/dislike", function (req, res, next) {
  const id = req.params.id;

  Product.findOneAndUpdate({ _id: id }, { $inc: { dislikes: 1 } })
    .then((product) => {
      if (product) res.status(204).end();
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

module.exports = router;
