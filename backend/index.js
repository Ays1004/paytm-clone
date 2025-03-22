const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
//routes
const rootRouter = require("./routes/index");
const { default: mongoose } = require("mongoose");

mongoose.connect(
    "mongodb+srv://yewaleayush28:xSb3uWOh652NkiM3@cluster0.v6mox.mongodb.net/?retryWrites=true&w=majority"
);

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}/`);
});
