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
        productData["name"] = $(product).find(".name").text();
        productData["amount"] = $(product).find(".amount").text();
        productData["expirationDate"] = $(product).find(".expirationDate").text();
        productData["meal_href"] = $(product).find(".meal_href").text();
        productData["price"] = $(product).find(".price").text()
        productData["discount"] = $(product).find(".discount").text()
        productData["ingredients"] = $(product).find(".ingredients").text();

        drawAdminModal(productData);
    }
}

function AddProduct() {
    // product data object
    var productData = {};

    productData["name"] = "";
    productData["amount"] = "";
    productData["expirationDate"] = "";
    productData["meal_href"] = undefined;
    productData["price"] = "";
    productData["discount"] = "";


    drawAdminModal(productData);
}

function drawAdminModal(productData) {

    // html text that i paste to appropriate textarea
    var ingredients = productData["ingredients"];

    if (ingredients != undefined) {
        // let's get ingredients:
        $.ajax({
            //   // тут замість app/selectFrom.php напиши адресу до свого серверу 
            //   // (що буде повертати адресу картинки у форматі json)
            url: ingredients,

            type: "GET",
            crossDomain: true,
            success: function(data) {
                var dataArray = []
                var ingredientsArray = [];
                dataArray = data._embedded.ingredients;
                var ingredientsEntityJSON = JSON.stringify(data._embedded.ingredients);

                dataArray.forEach(function(element) {
                    ingredientsArray.push(element.name);
                });
                // // try to parse ingredients json data
                // try {
                //     ingredientsArray = JSON.parse(ingredients);
                // } catch (e) {
                //     // error occurs usually when characteristics=="";
                // }
                ingredientsHtml = ingredientsArray.join("\n");
                productData["ingredients"] = ingredientsArray.join("\n");
                productData["ingredientsEntityJSON"] = ingredientsEntityJSON;
                // let's draw modalAdminHtml
                var managerModalHtml = drawExactlyAdminModalHtml(productData);

                $(".addEditModal .modal-content").html(managerModalHtml);
                // show modal
                addEditModal.classList.toggle("show-modal");
                datePicker();
            }
        });
    } else {
        productData["ingredients"] = "";
        // let's draw modalAdminHtml
        var managerModalHtml = drawExactlyAdminModalHtml(productData);

        $(".addEditModal .modal-content").html(managerModalHtml);
        // show modal
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

function drawExactlyAdminModalHtml(productData) {
    // image that manager can paste to DB
    var managerModalHtml = "";
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
        "<input class=\"inputData meal_href hide\" type=\"text\" value=\"" + productData.meal_href + "\">" +
        "<span>ціна:</span>" +
        "<input class=\"inputData productPrice\" type=\"text\" value=\"" + productData.price + "\">" +
        "<span>знижка:</span>" +
        "<input class=\"inputData productDiscount\" type=\"text\" value=\"" + productData.discount + "\">" +

        // ingredients
        "<span>Інгредієнти:</span>" +
        "<textarea class=\"productIngredients\" rows=\"4\">" + productData.ingredients + "</textarea>" +
        "<textarea class=\"ingredientsEntityJSON hide\" rows=\"50\">" + productData.ingredientsEntityJSON + "</textarea>" +

        "</div>";

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
            if (productData.meal_href != "undefined") {

                var ingredients = JSON.parse(productData.ingredients);
                // if (ingredients[0] != "") {
                ////let's update ingredients 
                // } else {
                // we won't update ingredients
                // call to PUT meal
                putMeal(productData, null);
                // }
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
        // call to addEditProduct.php
        $.ajax({
            url: productData.meal_href,
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
    var expiryDate = $(".addEditModal").find("#datepicker").val();
    productData["expirationDate"] = convertToTimestamp(expiryDate);
    productData["meal_href"] = $(".addEditModal").find(".meal_href").val();
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
function getIngredientsToUpdate(updateIngredients, callback) {
    // updateIngredients // ingredients that admin just type
    $.ajax({
        //   // тут замість app/selectFrom.php напиши адресу до свого серверу 
        //   // (що буде повертати адресу картинки у форматі json)
        // url: "http://" + host + "/cloud-api/ingredients",
        url: "http://" + host + ":8080/cloud-api/ingredients",

        type: "GET",
        crossDomain: true,
        success: function(data) {
            var dataArray = []
                // full ingredients
            var fullIngredients = [];
            // new ingredients
            var newIngredients = [];
            dataArray = data._embedded.ingredients;

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

            callback(fullIngredients, newIngredients);
        }
    });
}

function NamefieldIncludesInObjectsArray(ObjArray, field) {
    ObjArray.filter(function(e) {
        if (e.name === ingredient) return e
    });
}

function insertIngredientsToUpdate(fullIngredients, newIngredients, callback) {
    // call to POST
    $.ajax({
        // url: "http://" + host + "/cloud-api/ingredients/add",
        url: "http://" + host + ":8080/cloud-api/ingredients/add",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "ingredients": newIngredients,
        }),
        type: "POST",
        crossDomain: true,
        success: function(newFullIngredients) {
            fullIngredients.concat(newFullIngredients);
            callback(fullIngredients);
        }
    })
}

function putMeal(productData, fullIngredients) {
    // var ingredients = JSON.parse(productData.ingredientsEntityJSON);
    // call to PUT
    $.ajax({
        url: productData.meal_href,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "name": productData.name,
            "amount": productData.amount,
            "discount": productData.discount,
            "price": productData.price,
            "expirationDate": productData.expirationDate,
            "ingredients": fullIngredients,
        }),
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
    var floatNumberCheck = new RegExp("^[0-9]{0,4}[.]?[0-9]{0,2}$");
    var matchStatePrice = floatNumberCheck.test(price);
    // validation for discount
    var discountNumberCheck = new RegExp("^[0-9]{0,2}$");
    var matchStateDiscount = discountNumberCheck.test(discount);

    if (!matchStatePrice || price == "0") {
        uncorrectFields += "\n - ціна";
    }
    if (!matchStateDiscount) {
        uncorrectFields += "\n - знижка";
    }
    return uncorrectFields;
}