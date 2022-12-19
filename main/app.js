const express = require("express");
const Sequelize = require("sequelize");
const { OPEN_READWRITE } = require("sqlite3");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "my.db",
});

let FoodItem = sequelize.define(
  "foodItem",
  {
    name: Sequelize.STRING,
    category: {
      type: Sequelize.STRING,
      validate: {
        len: [3, 10],
      },
      allowNull: false,
    },
    calories: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  }
);

const app = express();
// TODO
// app.post('/food-items', async(req, res) => {

// })

app.get("/create", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    for (let i = 0; i < 10; i++) {
      let foodItem = new FoodItem({
        name: "name " + i,
        category: ["MEAT", "DAIRY", "VEGETABLE"][Math.floor(Math.random() * 3)],
        calories: 30 + i,
      });
      await foodItem.save();
    }
    res.status(201).json({ message: "created" });
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/food-items", async (req, res) => {
  try {
    let foodItems = await FoodItem.findAll();
    res.status(200).json(foodItems);
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

app.post("/food-items", async (req, res) => {
  try {
    // TODO
    if (Object.keys(req.body).length == 0) {
      //   res.status(400).json({ message: "body is missing" });
      throw { message: "body is missing" };
    }

    if (!req.body.name || !req.body.category || !req.body.calories) {
      //   res.status(400).json({ message: "malformed request" });
      throw { message: "malformed request" };
    }

    if (req.body.calories < 0) {
      //   res.status(400).json({ message: "calories should be a positive number" });
      throw { message: "calories should be a positive number" };
    }

    if (
      req.body.category !== "MEAT" &&
      req.body.category !== "DAIRY" &&
      req.body.category !== "VEGETABLE"
    ) {
      //   res.status(400).json({ message: "not a valid category" });
      throw { message: "not a valid category" };
    }

    let foodItem = new FoodItem({
      name: req.body.name,
      category: req.body.category,
      calories: req.body.calories,
    });
    await foodItem.save();

    res.status(201).send({
      message: "created",
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = app;
