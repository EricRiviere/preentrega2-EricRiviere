import express from "express";
import { ProductRouter } from "./routes/products.routes.js";
import { CartsRouter } from "./routes/carts.routes.js";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import messagesDao from "./dao/mdbManagers/messages.dao.js";

//Server
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  `Server listening on port ${PORT}`;
});

//Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/TESTPreentrega")
  .then(() => console.log("DB connected"))
  .catch((error) => console.log("Error: " + error));

//SocketServer
const io = new Server(httpServer);

//Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Api routers
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartsRouter);

//Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//Static
app.use(express.static(`${__dirname}/public`));

//ViewRouter
app.use("/", viewsRouter);

//Socket
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("message", async (data) => {
    console.log(data);
    await messagesDao.createMessage(data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});
