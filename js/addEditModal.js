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
        // product
        // var prodImage = $(product).find("img")[0].outerHTML;
        var prodName = $(product).find(".name").text();
        var prodAmount = $(product).find(".amount").text();
        var prodExpirationDate = $(product).find(".expirationDate").text();
        var meal_href = $(product).find(".meal_href").text();
        var ingredients_href = $(product).find(".ingredients").text();

        // store product data to array:
        var productData = [prodName, prodAmount, prodExpirationDate, meal_href, ingredients_href];

        drawAdminModal(productData);
    }
}

function AddProduct() {
    // set all parameters to ""
    // var prodImage = "";
    var prodName = "";
    var prodAmount = "";
    var prodExpirationDate = "";
    // store product data to array:
    var productData = [prodName, prodAmount, prodExpirationDate];

    drawAdminModal(productData);
}

function drawAdminModal(productData) {
    // main variables of this function
    // array of chracteristics
    var ingredientsArray = [];
    // html text that i paste to appropriate textarea
    var ingredientsHtml = " ";
    // collact prodact data
    // var image = productData[0];
    var name = productData[0];
    var amount = productData[1];
    var expirationDate = productData[2];
    var meal_href = productData[3];
    var ingredients = productData[4];

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

                // let's draw modalAdminHtml
                var managerModalHtml = drawExactlyAdminModalHtml(name, amount, expirationDate, meal_href, ingredientsHtml)

                $(".addEditModal .modal-content").html(managerModalHtml);
                // show modal
                addEditModal.classList.toggle("show-modal");
            }
        });
    } else {
        // let's draw modalAdminHtml
        var managerModalHtml = drawExactlyAdminModalHtml(name, amount, expirationDate, meal_href, ingredientsHtml)

        $(".addEditModal .modal-content").html(managerModalHtml);
        // show modal
        addEditModal.classList.toggle("show-modal");
    }
}

function drawExactlyAdminModalHtml(name, amount, expirationDate, meal_href, ingredientsHtml) {
    // image that manager can paste to DB
    var managerModalHtml = "";
    //  managerModalHtml+= "<span>зображення товару:</span>";
    // managerModalHtml += "<div class=\"imgContainer\" contentEditable=\"true\">" +
    //     image +
    //     "</div>"; //end of imgContainer
    managerModalHtml += "<div class=\"inputsData\">" +
        "<span>назва товару:</span>" +
        "<input class=\"inputData productName\" type=\"text\" value=\"" + name + "\">" +
        "<span>к-ть товару:</span>" +
        "<input class=\"inputData productAmount\" type=\"text\" value=\"" + amount + "\">" +
        "<span>строк придатності:</span>" +
        "<input class=\"inputData productExpirationDate\" type=\"text\" value=\"" + expirationDate + "\">" +
        "<input class=\"inputData meal_href hide\" type=\"text\" value=\"" + meal_href + "\">" +
        // ingredients
        "<span>Інгредієнти:</span>" +
        "<textarea class=\"productIngredients\" rows=\"4\">" + ingredientsHtml + "</textarea>" +

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

            // manager clicks eectly on save button
            var productDataArray = collectProductData();
            var buffArr = [];
            productDataArray.forEach(function(element) {
                if (element == "") element = null
                buffArr.push(element)
            });
            productDataArray = buffArr;
            if (productDataArray[3] != "undefined") {
                // call to PUT
                $.ajax({
                    url: productDataArray[3],
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "name": productDataArray[0],
                        "amount": productDataArray[1],
                        "discount": null,
                        "price": null,
                        "expirationDate": null,
                        "ingredients": null,
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
            } else {
                // call to POST
                $.ajax({
                    // url: "http://" + host + "/cloud-api/meals/add",
                    url: "http://" + host + ":8080/cloud-api/meals/add",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "name": productDataArray[0],
                        "amount": productDataArray[1],
                        "discount": null,
                        "price": null,
                        "expirationDate": productDataArray[2],
                        "ingredients": JSON.parse(productDataArray[4]),
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
        if ($(target).is(".delete")) {
            // manager clicks eectly on save button
            var productDataArray = collectProductData();
            // call to addEditProduct.php
            $.ajax({
                url: productDataArray[3],
                data: {
                    "name": productDataArray[3],
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
    // collect product input data
function collectProductData() {
    // output array
    var productArray = [];

    // var prodImage = $(".addEditModal").find("img")[0].outerHTML;
    var prodName = $(".addEditModal").find(".productName").val();
    var prodAmount = $(".addEditModal").find(".productAmount").val();
    var prodExpirationDate = $(".addEditModal").find(".productExpirationDate").val();
    var meal_href = $(".addEditModal").find(".meal_href").val();
    // only inicizlyze product characteristics
    var prodIngredients = [];
    var prodIngredientsString = $(".addEditModal").find(".productIngredients").val();
    // collect product charackteristics into array
    prodIngredients = prodIngredientsString.split("\n");

    prodIngredientsJSON = JSON.stringify(prodIngredients);
    // productArray.push(prodImage);
    productArray.push(prodName);
    productArray.push(prodAmount);
    productArray.push(prodExpirationDate);
    productArray.push(meal_href);
    productArray.push(prodIngredientsJSON);

    // return output productArray data
    return productArray;
}

$(closeaddEditButton).click(function() {
    // close modal
    addEditModal.classList.toggle("show-modal");
})