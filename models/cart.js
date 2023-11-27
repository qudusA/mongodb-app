const getDb = require("../util/mongodb").getdb;
const mongodb = require("mongodb");

class Cart {
  // #quantity = 0;
  constructor(title, price, qty, prodId) {
    this.title = title;
    this.price = price;
    this.quantity = qty;
    this.prodId = new mongodb.ObjectId(prodId);
  }

  //   stopped here
  addToCart() {
    const db = getDb();
    return db.collection("cart").insertOne(this);
  }

  static findToCart() {
    const db = getDb();
    return db.collection("cart").find().toArray();
  }

  static findCartById(id) {
    const db = getDb();
    return db.collection("cart").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static deleteFromCart(id) {
    const db = getDb();
    return db.collection("cart").deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  static updateCart(id, t, p, q) {
    const db = getDb();
    return db
      .collection("cart")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { title: t, price: p, quantity: q } }
      );
  }
}

module.exports = Cart;
