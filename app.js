const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()




app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema) //this created an empty items model array i mean


const item1 = new Item({
    name: "Welcome to your todo-list!!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete the item"
})

const defaultItems = [item1, item2, item3] //this created an array having items

const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema)

app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success!!! ");
                }
            })
            res.redirect("/")
        } else {

            res.render("list", { listTitle: "Today", newListItems: foundItems })
        }
    })
})

app.get("/:clists", function(req, res) {
    // res.render("list", { listTitle: "Work List", newListItems: workItems })
    const customLists = req.params.clists

    List.findOne({ name: customLists }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                // console.log("DNE");
                const list = new List({
                    name: customLists,
                    items: defaultItems
                })

                list.save()
                res.redirect("/:clists")
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
                console.log("E");
            }
        }
    })



})

app.get("/about", function(req, res) {
    res.render("about")
})

app.post("/", function(req, res) {
    const itemName = req.body.newItem //this gives us the name(coz we tapped this) of the mongoose object, that the user just made on frontend
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }


})

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox; //this will give us the value set in the list.ejs, so we had to set item._id there
    const listName = req.body.listName

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (err) {
                console.log("Error Logged");
            } else {
                res.redirect("/")
            }
        })
    }

})









app.post("/work", function(req, res) {
    let item = req.body.newItem
    workItems.push(item)
    res.redirect("/work")
})


app.listen(3000, function() {
    console.log("Server started");
})