const mongoConnect = require("../util/mongodb").mongoConnect;
const getDb = require("../util/mongodb").getdb;
const mongodb = require("mongodb");
const Cart = require("./cart");

class User {
  constructor(email, password, phone) {
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.cart = [];
  }

  createUser() {
    const db = getDb();
    return db.collection("user").insertOne(this);
  }

  static deleteUser(id) {
    return db.collection("user").deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  static findById(id) {
    const db = getDb();
    return db.collection("user").findOne({ _id: new mongodb.ObjectId(id) });
    //   .next();
  }

  static updateUser(id, cartArr) {
    const db = getDb();
    return db
      .collection("user")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { cart: cartArr } }
      );
  }
}

module.exports = User;
