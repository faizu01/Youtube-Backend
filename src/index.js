import connectToDB from "./db/index.js";
import app from "./app.js";

connectToDB()
  .then(() => {
    app.listen(process.env.PORT , () => {
      console.log(`Server Started Successfully at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connection Failed with MongoDB !!");
  });
