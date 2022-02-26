const File = require("./models/fileModel");
const fs = require("fs");
const connectDb = require("./config/db");

connectDb();

async function deleteExpiredData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let files = await File.find({ createdAt: { $lt: pastDate } });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove(); // removes file from upload folder
        console.log(`successfully deleted ${file.filename}`)
      } catch (error) {
          console.log(`Error occured ${error}`)
      }
    }
    console.log('Deletion Done!!');
  }
}

deleteExpiredData().then(process.exit);
