const mongoConnect = require("../util/mongodb").mongoConnect;
const getDb = require("../util/mongodb").getdb;
const mongodb = require("mongodb");

class Product {
  constructor(title, imageUrl, price, description, prodId, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.prodId = prodId ? prodId : null;
    this.userId = userId ? new mongodb.ObjectId(userId) : null;
  }

  create() {
    // console.log("model", this.prodId);
    const db = getDb();
    if (this.prodId && !this.userId) {
      //   console.log(this.prodId);
      return db
        .collection("product")
        .updateOne({ _id: new mongodb.ObjectId(this.prodId) }, { $set: this })
        .then((prod) => {
          //   console.log(prod);
          return prod;
        })
        .catch((err) => console.log(err));
    } else {
      return db
        .collection("product")
        .insertOne(this)
        .then((result) => {
          // console.log("model", result);
        })
        .catch((err) => console.log(err));
    }
  }

  static find() {
    const db = getDb();
    return db
      .collection("product")
      .find()
      .toArray()
      .then((product) => {
        return product;
        // console.log("model", product);
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("product")
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((product) => {
        // console.log("model", product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static delete(id) {
    const db = getDb();
    return db
      .collection("product")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Product;
