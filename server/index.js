const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

//Cors allow the server to indicate a conexion from any origin.
app.use(cors());
app.use(express.json());

//Database credentials.
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "club_members",
});

//The POST APi call that adds the members to the database.
app.post("/create", (req, res) => {
  const { first_name, last_name, age, membership, address, car } = req.body;

  db.query(
    "INSERT INTO members (first_name, last_name, age, membership, address, car) VALUES (?,?,?,?,?,?)",
    [first_name, last_name, age, membership, address, car],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

//The GET APi call that retreives all the members from the database.
app.get("/members", (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//The PUT APi call that updates the members of the database.
app.put("/update", (req, res) => {
  const { id, first_name, last_name, age, membership, address, car } = req.body;
  db.query(
    "UPDATE members SET first_name = ?, last_name = ?, age = ?, membership = ?, address = ?, car = ? WHERE id = ?",
    [first_name, last_name, age, membership, address, car, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//The DELETE APi call that deletes the members from the database.
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM members WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
