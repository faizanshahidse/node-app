require("dotenv").config();

const app = require("./app");

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, (req, res) => {
  console.log(`App is listening on PORT ${PORT}`);
});
