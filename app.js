const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static("public"));


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My new Vilaa",
        dicription: "By the Villa",
        price: 12000,
        image: "",
        location: "canngut , Goa",
        country: "India",
    });
    await sampleListing.save();
    console.log("sample was save");
    res.send("succes");
});



// Index route
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings: allListings });
});


// new Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//Create route  
app.post("/listings", async (req, res) => {
     console.log(req.body);
  const listing = new Listing(req.body.listing);
  await listing.save();
  res.redirect("/listings");
});


app.use(express.static(path.join(__dirname,"/public")));

//Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// Edit route
app.get("/listings/:id/edit",async (req,res) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update route
app.put("/listings/:id", async(req,res) =>{
     let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new:true});
    res.redirect(`/listings/${id}`);
});

// Delete route
app.delete("/listings/:id", async(req,res) =>{
let { id } = req.params;
let deleteList = await Listing.findByIdAndDelete(id);
console.log(deleteList);
res.redirect("/listings");
});





app.get("/", (req, res) => {
    res.send("workinkg");

});

app.listen(8080, (req, res) => {
    console.log("port is runnig on 8080");
});