var express = require('express');
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json()); //Brukes til å tolke JSON

var pool = mysql.createPool({
   connectionLimit: 2,
   host: "mysql-ait.stud.idi.ntnu.no",
   user: "thomabmo",
   password: "9LftkrjD",
   database: 'thomabmo',
   debug: false
});

//"remove" an article
app.delete("/articles", (request, response) =>{
   pool.getConnection((error, connection) =>{
      
      if(error){
         console.error("Feil ved kobling til databasen");
         response.json({ error: "feil ved oppkobling"});
      } else{
         console.log("Connected to database");

         var values = [request.body.id];
         connection.query(
            "UPDATE Articles SET visible = 0 WHERE articleID = ?", values,

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Show all articles
app.get("/articles", (request, response) =>{
   pool.getConnection((error, connection) =>{

      if(error){
         console.error("Error when connecting to database");
         response.json({ error: "error when connecting"});

      }else{
         console.log("Connected to database");

         connection.query(
            "SELECT * FROM Articles",

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Show all visible articles
app.get("/articles/visible", (request, response) =>{
   pool.getConnection((error, connection) =>{

      if(error){
         console.error("Error when connecting to database");
         response.json({ error: "error when connecting"});

      }else{
         console.log("Connected to database");

         connection.query(
            "SELECT * FROM Articles WHERE visible = 1",

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Show all invisible articles
app.get("/articles/invisible", (request, response) =>{
   pool.getConnection((error, connection) =>{

      if(error){
         console.error("Error when connecting to database");
         response.json({ error: "error when connecting"});

      }else{
         console.log("Connected to database");

         connection.query(
            "SELECT * FROM Articles WHERE visible = 0",

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Show all important articles
app.get("/articles/important", (request, response) =>{
   pool.getConnection((error, connection) =>{

      if(error){
         console.error("Error when connecting to database");
         response.json({ error: "error when connecting"});

      }else{
         console.log("Connected to database");

         connection.query(
            "SELECT * FROM Articles WHERE importance = 1",

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Show all non-important articles
app.get("/articles/non-important", (request, response) =>{
   pool.getConnection((error, connection) =>{

      if(error){
         console.error("Error when connecting to database");
         response.json({ error: "error when connecting"});

      }else{
         console.log("Connected to database");

         connection.query(
            "SELECT * FROM Articles WHERE importance = 0",

            (error, SQLresponse) => {
               connection.release();
               if(error){
                  console.error(error);
                  response.json({ error: "error updating rows"});
               }else{
                  console.log(SQLresponse);
                  response.json(SQLresponse);
               }
            }
         );
      }
   });
});

//Post a new article
app.post("/articles", (request, response) => {
   console.log("recived POST-request from client");
   console.log("Navn: " + request.body.navn);
   pool.getConnection((err, connection) => {
      if(err) {
         console.error("Feil ved oppkobling");
         response.json({ error: "Feil ved oppkobling"});
      }else{
         console.log("Fikk databasekobling");
         var values = [request.body.headline, request.body.content, request.body.image, request.body.importance];
         connection.query(
            "INSERT INTO Articles VALUES (DEFAULT,?,?,DEFAULT,?,?,1)", values,
            err => {
               if(err){
                  console.error(err);
                  response.status(500);
                  response.json({ error: "Feil ved insert"});
               }else{
                  console.log("insert ok");

                  values = [request.body.headline, request.body.content, request.body.category];

                  connection.query(
                     "INSERT INTO Article_Category VALUES ((SELECT articleID FROM Articles WHERE headline = ? AND content = ?),?)", values,
                     err => {
                        connection.release();
                        if(err){
                           console.error(err);
                           response.status(500);
                           response.json({ error: "Feil ved insert"});
                        }else{
                           console.log("insert ok");
                           response.status(200).send("");
                        }
                     }
                  );
               }
            }
         );
      }
   });
});


/*

app.get("/person", (req, res) =>{
   console.log("Fikk request fra klient");
   pool.getConnection((err, connection) => {
      console.log("Connected to database");
      if (err){
         console.error("Error when connection to database");
         res.json({ error: "feil ved oppkobling"});
      } else{
         connection.query(
             "SELECT navn, alder, adresse, bilde_base64 FROM person",
             (err, rows) => {
                connection.release();
                if (err){
                   console.error(err);
                   res.json({ error: "error querying"});
                } else{
                   console.log(rows);
                   res.json(rows);
                }
             }
         );
      }
   });
});

app.get("/person/:personId", (req, res) => {
   console.log("Fikk request fra klient");
   pool.getConnection((err, connection) => {
      console.log("connected to database");
      if(err){
         console.error("Feil ved kobling til databasen");
         res.json({ error: "feil ved oppkobling"});
      } else{
         connection.query(
            "SELECT navn, alder, adresse FROM person WHERE id=?", req.params.personId,
            
            (err, rows) => {
               connection.release();
               if(err){
                  console.error(err);
                  res.json({ error: "error querying"});
               }else{
                  console.log(rows);
                  res.json(rows);
               }
            }
         );
      }
   });
});


app.post("/test", (req, res) => {
   console.log("Fikk POST-request fra klient");
   console.log("Navn: " + req.body.navn);
   res.status(200);
   res.json({ message: "success"});
});

app.post("/person", (req, res) => {
   console.log("Fikk POST-request fra klienten");
   console.log("Navn: " + req.body.navn);
   pool.getConnection((err, connection) => {
      if(err) {
         console.error("Feil ved oppkobling");
         res.json({ error: "Feil ved oppkobling"});
      }else{
         console.log("Fikk databasekobling");
         var val = [req.body.id, req.body.navn, req.body.adresse, req.body.alder];
         connection.query(
            "INSERT INTO person (id,navn,adresse,alder) VALUES (?,?,?,?)", val,
            err => {
               if(err){
                  console.log(err);
                  res.status(500);
                  res.json({ error: "Feil ved insert"});
               }else{
                  console.log("insert ok");
                  res.status(200).send("");
               }
            }
         );
      }
   });
});
*/
var server = app.listen(4000);