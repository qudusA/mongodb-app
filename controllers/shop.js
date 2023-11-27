const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.findToCart()
    .then((cart) => {
      // console.log("cart contr ", cart);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cart,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let foundProd, qty;
  Product.findById(prodId)
    .then((product) => {
      if (!product) return;
      foundProd = product;
      return Cart.findToCart();
    })
    .then((foundCart) => {
      // copy in to new arr
      const [...copiedCart] = foundCart;
      // find the index of the item intended to add in the copied item
      const foundIndx = copiedCart.findIndex((cur, idx, arr) => {
        return cur.prodId.toString() === foundProd._id.toString();
      });

      // if exist increment qty
      if (foundIndx >= 0) {
        const obj = copiedCart.slice(foundIndx, foundIndx + 1)[0];
        qty = obj.quantity + 1;
        return Cart.updateCart(obj._id, obj.title, obj.price, qty);
      }
      // if not set qty to 1
      if (foundIndx === -1) {
        qty = 1;
      }
      const cart = new Cart(
        foundProd.title,
        foundProd.price,
        qty,
        foundProd._id
      );

      return cart.addToCart();
    })
    .then((cart) => {
      if (!cart.insertedId) return res.redirect("/cart");

      const [...newArr] = req.user.cart;
      newArr.push(cart.insertedId);
      User.updateUser(req.user._id, newArr);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const [...usercat] = req.user.cart;
  const ind = usercat.findIndex((cur, indx) => {
    return cur.toString() === prodId.toString();
  });
  const i = usercat.splice(ind, 1);

  User.updateUser(req.user._id, usercat);
  Cart.deleteFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
