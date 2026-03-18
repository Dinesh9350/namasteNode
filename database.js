const {MongoClient} = require("mongodb");

const URI = "mongodb+srv://dinesh:ehSvIfGheAl4dxWR@cluster0.l8wsd6i.mongodb.net/"
const dbName = "HelloWorld";

const client = new MongoClient(URI);

async function main(){
    await client.connect();
    console.log("connection established successfully");
    const db = client.db(dbName);
    const collection = db.collection("User");

    const data = {
        firstName: "Nishant",
        lastName: "Baliyan",
        city: "Muzzafarnager",
        job: "UI/UX"
    }
    const insertManyresult = await collection.insertMany([data]);
    console.log("insertManyresult :", insertManyresult);

    const result = await collection.find({}).toArray();
    console.log("Result :", result);

    return "Done"
}

main().then(console.log).catch(console.error).finally(()=> client.close());
