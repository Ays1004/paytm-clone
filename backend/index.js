const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const PORT = 3000;
//routes
const rootRouter = require("./routes/index");
const { default: mongoose } = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI
);

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}/`);
});
