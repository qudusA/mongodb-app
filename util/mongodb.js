const mongodb = require("mongodb");

mongodb.Promise = global.Promise;

let _db;
const mongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  mongoClient
    .connect("mongodb://127.0.0.1:27017/todaymongo")
    .then((client) => {
      //   console.log(client);
      _db = client.db();
      cb();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
};

exports.mongoConnect = mongoConnect;
exports.getdb = getDb;
