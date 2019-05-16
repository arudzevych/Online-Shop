// main content array variable
host = window.location.hostname
    // add/edit modal
var addEditModal = document.querySelector(".addEditModal");
var closeaddEditButton = document.querySelector(".addEditModal .close-button");

// modal>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$(".productManager").click(function(event) {
    var target = event.target; //must be button
    //if target is button with class= "cart"
    // if ($(target).is("img")){
    var product = {};
    if ($(target).is(".product")) {
        product = target;
    } else {
        if ($(target).is("img") || $(target).is("p")) {
            product = $(target).parents(".product");
        }
    };
    EditProduct(product);
    //end of if
});
// when manager clicks on .addProduct button
$(".addProduct").click(function() {
    AddProduct();
})

function EditProduct(product) {
    if (product != undefined) {
        // product data object
        var productData = {};

        // product
        // var prodImage = $(product).find("img")[0].outerHTML;
        productData = JSON.parse($(product).find(".mealJSON").text());

        drawAdminModal(productData);
    }
}

function AddProduct() {
    // product data object
    var productData = {};

    productData["name"] = "";
    productData["amount"] = "";
    productData["expirationDate"] = "";
    productData["price"] = "";
    productData["discount"] = "";


    drawAdminModal(productData);
}

function drawAdminModal(productData) {

    // html text that i paste to appropriate textarea
    var ingredients = productData.ingredients;

    if (ingredients != undefined) {

        var stringIngredients = "";
        for (var i = 0; i < ingredients.length; i++) {
            if (i == 0) { stringIngredients += ingredients[i].name; } else {
                stringIngredients += "\n" + ingredients[i].name;
            }
        }

        productData["stringIngredients"] = stringIngredients;
        // let's draw modalAdminHtml
        var managerModalHtml = drawExactlyAdminModalHtml(productData, false);

        $(".addEditModal .modal-content").html(managerModalHtml);
        // show modal
        addEditModal.classList.toggle("show-modal");
        datePicker();
        // }
        // });
    } else {
        productData["ingredients"] = "";
        productData["stringIngredients"] = "";
        //     // let's draw modalAdminHtml
        var managerModalHtml = drawExactlyAdminModalHtml(productData, true);

        $(".addEditModal .modal-content").html(managerModalHtml);
        //     // show modal
        addEditModal.classList.toggle("show-modal");
        datePicker();

    }
}

function datePicker() {
    var minDate = new Date();
    $("#datepicker").datepicker({
        dateFormat: 'dd.mm.yy',
        minDate: minDate,
    });
}

function drawExactlyAdminModalHtml(productData, addNew) {
    // image that manager can paste to DB
    var managerModalHtml = "";
    var discount = "";
    if (productData.discount != null) discount = productData.discount;
    //  managerModalHtml+= "<span>зображення товару:</span>";
    // managerModalHtml += "<div class=\"imgContainer\" contentEditable=\"true\">" +
    //     image +
    //     "</div>"; //end of imgContainer
    managerModalHtml += "<div class=\"inputsData\">" +
        "<span>назва товару:</span>" +
        "<input class=\"inputData productName\" type=\"text\" value=\"" + productData.name + "\"required>" +
        "<span>к-ть товару:</span>" +
        "<input class=\"inputData productAmount\" type=\"text\" value=\"" + productData.amount + "\">" +
        "<span>строк придатності:</span>" +
        "<input type=\"text\" id=\"datepicker\">" +
        // '<input type="date" id="datepicker" data-date-inline-picker="true" onselect=getChosenDate min=' + dateString + '/>' +
        productData.expirationDate +
        "<span>ціна:</span>" +
        "<input class=\"inputData productPrice\" type=\"text\" value=\"" + productData.price + "\">" +
        "<span>знижка:</span>" +
        "<input class=\"inputData productDiscount\" type=\"text\" value=\"" + discount + "\">" +

        // ingredients
        "<span>Інгредієнти:</span>" +
        "<textarea class=\"productIngredients\" rows=\"4\">" + productData.stringIngredients + "</textarea>";
    // "<textarea class=\"ingredientsEntityJSON hide\" rows=\"50\">" + productData.ingredients + "</textarea>" +
    // full meal
    if (addNew) {
        managerModalHtml += "<textarea class=\"mealJSON hide\" rows=\"50\"></textarea>";
    } else {
        managerModalHtml += "<textarea class=\"mealJSON hide\" rows=\"50\">" + JSON.stringify(productData) + "</textarea>";

    }
    managerModalHtml += "</div>";

    managerModalHtml += "<div class=\"saveContainer\">" +
        "<button class=\"save\">зберегти</button>" +
        "<button class=\"delete\">видалити</button>" +
        "</div>";
    return managerModalHtml;
}


// when manager click on save button
$(".addEditModal").click(function(event) {
    // var myModal=this;
    var target = event.target;
    if ($(target).is(".save")) {

        // manager clicks exectly on save button
        var productData = collectProductData();

        // let's check productData format:
        var uncorrectFields = checkProductData(productData);
        if (uncorrectFields != "") {
            alert("неправильний формат полів: " + uncorrectFields);
        } else {

            var buffObj = {}

            Object.keys(productData).forEach(function(item) {
                var element = productData[item];
                if (element == "") element = null
                buffObj[item] = element;
            });

            productData = buffObj;

            // if it is UPDATE
            if (productData.mealJSON != null) {
                // fetch old source meal
                var MeaL = JSON.parse(productData.mealJSON);
                // edite this source meal with new customization
                MeaL.name = productData["name"];
                MeaL.amount = productData["amount"];
                MeaL.expirationDate = productData["expirationDate"];
                MeaL.price = productData["price"];
                MeaL.discount = productData["discount"];

                // flag defining that lod ingredients are same to new ones
                var sameIngredients = true;
                // new ingredients
                var newIngredients = JSON.parse(productData.ingredients);
                // let's foreach by old ingredients
                MeaL.ingredients.forEach(function(oldIngredient) {
                    if (!newIngredients.includes(oldIngredient.name)) { sameIngredients = false; }
                })
                if (MeaL.ingredients.length != newIngredients.length) sameIngredients = false;
                // if old ingredients are note same as new ingredients 
                if (!sameIngredients) {
                    //let's update ingredients 
                    getIngredientsToUpdate(MeaL, newIngredients, insertIngredientsToUpdate);


                } else {
                    // we won't update ingredients

                    // let's delete helper stringIngredients
                    delete MeaL.stringIngredients;
                    // call to PUT meal
                    putMeal(MeaL);
                }

                // if it is CREATE
            } else {
                // call to POST
                $.ajax({
                    // url: "http://" + host + "/cloud-api/meals/add",
                    url: "http://" + host + ":8080/cloud-api/meals/add",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "name": productData.name,
                        "amount": productData.amount,
                        "discount": productData.discount,
                        "price": productData.price,
                        "expirationDate": productData.expirationDate,
                        "ingredients": JSON.parse(productData.ingredients),
                    }),
                    type: "POST",
                    crossDomain: true,
                    success: function() {
                        // close modal
                        addEditModal.classList.toggle("show-modal");
                        // refresh products
                        uploadProducts();
                    }
                })
            }
        }
    }
    if ($(target).is(".delete")) {
        // manager clicks eectly on save button
        var productData = collectProductData();
        var MeaL = JSON.parse(productData.mealJSON);
        // delete request
        $.ajax({
            // url: "http://" + host + "/cloud-api/meals/"+productData.id,
            url: "http://" + host + ":8080/cloud-api/meals/" + MeaL.id,
            data: {
                "name": productData.name,
            },
            type: "DELETE",
            success: function() {
                // close modal
                addEditModal.classList.toggle("show-modal");
                // refresh products
                uploadProducts();
            }
        })
    }
})



function convertToTimestamp(expiryDate) {
    var splitedExpiryDate = expiryDate.split(".");
    var year = splitedExpiryDate[2];
    var month = splitedExpiryDate[1];
    var day = splitedExpiryDate[0];
    var myDate = new Date(year, month, day);
    var timestamp = myDate.getTime();
    console.log(timestamp);
    return timestamp;
};

// collect product input data
function collectProductData() {
    // output array
    var productData = {};
    productData["name"] = $(".addEditModal").find(".productName").val();
    productData["amount"] = $(".addEditModal").find(".productAmount").val();
    productData["expirationDate"] = $(".addEditModal").find("#datepicker").val();

    if (productData["expirationDate"] != "") productData["expirationDate"] = convertToTimestamp(expiryDate);
    productData["mealJSON"] = $(".addEditModal").find(".mealJSON").val();
    // let's truncate price to two symbols after dot, comma
    productData["price"] = $(".addEditModal").find(".productPrice").val();
    // price = Number((parseFloat(price, 10)).toFixed(2));
    // productData["price"] = price.toString(10);
    productData["discount"] = $(".addEditModal").find(".productDiscount").val();
    productData["ingredientsEntityJSON"] = $(".addEditModal").find(".ingredientsEntityJSON").val();
    // only inicizlyze product characteristics
    var prodIngredients = [];
    var prodIngredientsString = $(".addEditModal").find(".productIngredients").val();
    // collect product charackteristics into array
    prodIngredients = prodIngredientsString.split("\n");

    productData["ingredients"] = JSON.stringify(prodIngredients);


    // return output productArray data
    return productData;
}

$(closeaddEditButton).click(function() {
    // close modal
    addEditModal.classList.toggle("show-modal");
})


// working with ingredients update
function getIngredientsToUpdate(MeaL, updateIngredients, callback) {
    // updateIngredients // ingredients that admin just type
    $.ajax({

        // url: "http://" + host + "/cloud-api/ingredients/select",
        url: "http://" + host + ":8080/cloud-api/ingredients/select",

        type: "GET",
        crossDomain: true,
        success: function(dataArray) {

            // full ingredients
            var fullIngredients = [];
            // new ingredients
            var newIngredients = [];
            // dataArray = data._embedded.ingredients;

            updateIngredients.forEach(function(ingredient) {
                // let's determine if Javascript array contains an object with an 
                // attribute that equals a given value?
                var fullIngredient = NamefieldIncludesInObjectsArray(dataArray, ingredient);
                if (fullIngredient) {
                    // this ingredient exists

                    // push full ingredient to fullIngredients
                    fullIngredients.push(fullIngredient);

                } else {
                    // ingredient is new

                    // push full ingredient to newIngredients
                    // this new ingredients must be created
                    newIngredients.push(ingredient);
                }
            })
            if (newIngredients.length == 0) {
                delete MeaL.stringIngredients
                MeaL["ingredients"] = fullIngredients;
                putMeal(MeaL);
            } else {
                callback(MeaL, fullIngredients, newIngredients, putMeal);
            }
        }
    });
}

function NamefieldIncludesInObjectsArray(ObjArray, field) {
    var finded = false;
    ObjArray.filter(function(e) {
        if (e.name == field) {
            finded = e;
        }
    });
    return finded;
}

function insertIngredientsToUpdate(MeaL, fullIngredients, newIngredients, callback) {
    var ingredientName = newIngredients[0];
    // 
    // if (ingredientName != null) {
    // call to POST
    $.ajax({
            // url: "http://" + host + "/cloud-api/ingredients/add",
            url: "http://" + host + ":8080/cloud-api/ingredients/add",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "name": ingredientName,
                "amount": null,
                "measure": null,
            }),
            type: "POST",
            crossDomain: true,
            success: function(newFullIngredient) {
                // add newFullIngredient to fullIngredients
                fullIngredients.push(newFullIngredient);

                // remove newFullIngredient.name from newIngredients
                // ========
                var index = newIngredients.indexOf(newFullIngredient.name);

                if (index > -1) {
                    newIngredients.splice(index, 1);
                }
                // ========

                if (newIngredients.length > 0) {
                    insertIngredientsToUpdate(MeaL, fullIngredients, newIngredients, putMeal)

                } else {
                    delete MeaL.stringIngredients
                    MeaL["ingredients"] = fullIngredients;
                    callback(MeaL);
                }
            }
        })
        // }
}

function putMeal(MeaL) {
    // var ingredients = JSON.parse(productData.ingredientsEntityJSON);
    // call to PUT
    $.ajax({
        // url: "http://" + host + "/cloud-api/meals/update",
        url: "http://" + host + ":8080/cloud-api/meals/update",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(
            MeaL,
            // "name": productData.name,
            // "amount": productData.amount,
            // "discount": productData.discount,
            // "price": productData.price,
            // "expirationDate": productData.expirationDate,
            // "ingredients": fullIngredients,
        ),
        type: "PUT",
        crossDomain: true,
        success: function() {
            // close modal
            addEditModal.classList.toggle("show-modal");
            // refresh products
            uploadProducts();
        }
    })
}

function checkProductData(productData) {
    var uncorrectFields = "";
    var price = productData.price;
    var discount = productData.discount;
    // validation for price
    var floatNumberCheck = new RegExp("^[0-9]{0,3}[.]?[0-9]{0,2}$");
    var matchStatePrice = floatNumberCheck.test(price);
    // validation for discount
    var discountNumberCheck = new RegExp("^[0-9]{0,2}$");
    var matchStateDiscount = discountNumberCheck.test(discount);

    if (!matchStatePrice || price == "0" || price == "") {
        uncorrectFields += "\n - ціна";
    }
    if (!matchStateDiscount) {
        uncorrectFields += "\n - знижка";
    }
    return uncorrectFields;
}