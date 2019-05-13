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
        productData["igredients"] = $(product).find(".ingredients").text();

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
                // let's draw modalAdminHtml
                var managerModalHtml = drawExactlyAdminModalHtml(productData);

                $(".addEditModal .modal-content").html(managerModalHtml);
                // show modal
                addEditModal.classList.toggle("show-modal");
            }
        });
    } else {
        productData["ingredients"] = "";
        // let's draw modalAdminHtml
        var managerModalHtml = drawExactlyAdminModalHtml(productData);

        $(".addEditModal .modal-content").html(managerModalHtml);
        // show modal
        addEditModal.classList.toggle("show-modal");
    }
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
        "<input class=\"inputData productName\" type=\"text\" value=\"" + productData.name + "\">" +
        "<span>к-ть товару:</span>" +
        "<input class=\"inputData productAmount\" type=\"text\" value=\"" + productData.amount + "\">" +
        "<span>строк придатності:</span>" +
        "<input class=\"inputData productExpirationDate\" type=\"text\" value=\"" + productData.expirationDate + "\">" +
        "<input class=\"inputData meal_href hide\" type=\"text\" value=\"" + productData.meal_href + "\">" +
        "<span>ціна:</span>" +
        "<input class=\"inputData productPrice\" type=\"text\" value=\"" + productData.price + "\">" +
        "<span>знижка:</span>" +
        "<input class=\"inputData productDiscount\" type=\"text\" value=\"" + productData.discount + "\">" +

        // ingredients
        "<span>Інгредієнти:</span>" +
        "<textarea class=\"productIngredients\" rows=\"4\">" + productData.ingredients + "</textarea>" +

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
            var productData = collectProductData();

            var buffObj = {}

            Object.keys(productData).forEach(function(item) {
                var element = productData[item];
                if (element == "") element = null
                buffObj[item] = element;
            });

            productData = buffObj;
            if (productData.meal_href != "undefined") {
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
    // collect product input data
function collectProductData() {
    // output array
    var productData = {};
    productData["name"] = $(".addEditModal").find(".productName").val();
    productData["amount"] = $(".addEditModal").find(".productAmount").val();
    productData["expirationDate"] = $(".addEditModal").find(".productExpirationDate").val();
    productData["meal_href"] = $(".addEditModal").find(".meal_href").val();
    productData["price"] = $(".addEditModal").find(".productPrice").val();
    productData["discount"] = $(".addEditModal").find(".productDiscount").val();

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