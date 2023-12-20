import { Router } from "express";
import productsDao from "../dao/mdbManagers/products.dao.js";
import { cartModel } from "../dao/models/cart.model.js";
import cartsDao from "../dao/mdbManagers/carts.dao.js";

const viewsRouter = Router();

viewsRouter.get("/productManager", async (req, res) => {
  const products = await productsDao.getAllProducts();
  res.render("productManager", {
    title: "Products Mongoose",
    products,
  });
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

viewsRouter.get("/products", async (req, res) => {
  const { page, limit, sort } = req.query;
  const products = await productsDao.getAllProducts(page, limit, sort);

  res.render("products", {
    title: "Products",
    products,
  });
});

viewsRouter.get("/carts/", async (req, res) => {
  const carts = await cartsDao.getAllCarts();
  res.render("carts", {
    title: "Carts",
    carts,
  });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsDao.getCartById(cid);
  res.render("cart", {
    title: "Cart",
    cart,
  });
});

export { viewsRouter };
