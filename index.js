require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 8080;

require("./db/db")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
