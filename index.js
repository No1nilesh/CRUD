const express = require("express");
const connectToMongo = require('./db');
connectToMongo();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require('./routes/notes'))

app.listen(port, ()=>{
    console.log(`this app is listing on port ${port}...`)
})
