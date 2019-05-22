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

    //convert timestamp to date
    var d = convertToDate(productData.expirationDate);
    var date = d.getDate();
    if (date < 10) { date = "0" + date };
    var month = d.getMonth();
    if (month < 10) { month = "0" + month };
    var expiryDate = (date + '.' + month + '.' + d.getFullYear());

    var imageHtml = "";
    if (productData.imageId != null) {
        var source = "http://" + host + ":8080/cloud-api/images/" + productData.imageId;
        imageHtml = "<img src='" + source + "'>";
    }
    // image that manager can paste to DB
    managerModalHtml = "<span>зображення товару:</span>";

    managerModalHtml += "<div class=\"inputsData\">";
    managerModalHtml += "<div id='drop_file_zone' ondrop='upload_file(event);' ondragover='return false'>" +
        "<div class='drag_upload_file'>" +
        "<p>перетягніть сюди зображення</p>" +
        "<p>або</p>" +
        "<input class='selectImage' type='button' value='вибрати файл' onclick='file_explorer();'>" +
        "<input type='file' id='selectfile'>" +
        "</div>" +
        "</div>";
    managerModalHtml += "<div class=\"imgContainer\" contentEditable=\"false\">" +
        imageHtml +
        "</div>"; //end of imgContainer
    managerModalHtml += "<span>назва товару:</span>" +
        "<input class=\"inputData productName\" type=\"text\" value=\"" + productData.name + "\"required>" +
        "<span>к-ть товару:</span>" +
        "<input class=\"inputData productAmount\" type=\"text\" value=\"" + productData.amount + "\">" +
        "<span>строк придатності:</span>" +
        "<input type=\"text\" id=\"datepicker\">" + expiryDate + "</input>" +
        // expiryDate +
        "<span>ціна:</span>" +
        "<input class=\"inputData productPrice\" type=\"text\" value=\"" + productData.price + "\">" +
        "<span>знижка:</span>" +
        "<input class=\"inputData productDiscount\" type=\"text\" value=\"" + discount + "\">" +

        // ingredients
        "<span>Інгредієнти:</span>" +
        "<textarea class=\"productIngredients\" rows=\"4\">" + productData.stringIngredients + "</textarea>";
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
        saveMeal(productData);

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

function saveMeal(productData) {

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
            MeaL.imageId = productData["imageId"];

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
                    "image": productData.image,
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
    // let's collect image

    var imageId = "";
    if ($(".addEditModal").find("img")[0] != undefined) {
        var imageSrc = $(".addEditModal").find("img")[0].src;
        var srcArray = imageSrc.split("/");
        // imageId = imageSrc.substring(
        //     imageSrc.indexOf("images") + 1,
        //     imageSrc.length
        // );
        imageId = srcArray[srcArray.length - 1];
    }
    // // let's get imageBlob from imageSrc
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', imageSrc, true);
    // xhr.responseType = 'blob';
    // xhr.onload = function(e) {
    //     if (this.status == 200) {
    // var imageBlob = this.response;
    // myBlob is now the blob that the object URL pointed to.

    productData["imageId"] = imageId;
    productData["name"] = $(".addEditModal").find(".productName").val();
    productData["amount"] = $(".addEditModal").find(".productAmount").val();
    productData["expirationDate"] = $(".addEditModal").find("#datepicker").val();

    if (productData["expirationDate"] != "") productData["expirationDate"] = convertToTimestamp(productData["expirationDate"]);
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

    // return output productData data
    return productData;
    // callback();
}
//     };
//     // let's get imageBlob from imageSrc
//     xhr.send();
// }

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
}

function putMeal(MeaL) {
    // call to PUT
    $.ajax({
        // url: "http://" + host + "/cloud-api/meals/update",
        url: "http://" + host + ":8080/cloud-api/meals/update",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(
            MeaL,
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

// working with image
function upload_file(e) {
    e.preventDefault();
    e.stopPropagation();
    var fileobj = e.dataTransfer.files[0];
    // upload image to back
    ajax_file_upload(fileobj);
}

function file_explorer() {
    document.getElementById('selectfile').click();
    document.getElementById('selectfile').onchange = function() {
        var fileobj = document.getElementById('selectfile').files[0];

        // upload image to back
        ajax_file_upload(fileobj);
    };
}

// function blobToHtmlImage(file_obj) {
//     var imageHtml = "";
//     if (file_obj != undefined && file_obj != "") {
//         if (file_obj.type.includes("image")) {

//             var source = window.webkitURL.createObjectURL(file_obj);
//             imageHtml = "<img src='" + source + "'>";

//             return imageHtml;
//         }
//     } else {
//         return "";
//     }
// }

function ajax_file_upload(file_obj) {
    if (file_obj != undefined && file_obj != "") {
        var form_data = new FormData();
        form_data.append('file', file_obj);
        // post to back
        $.ajax({
            type: 'POST',
            url: "http://" + host + ":8080/cloud-api/files/upload",
            contentType: false,
            processData: false,
            data: form_data,
            success: function(response) {
                var imageId = response.id;
                var source = "http://" + host + ":8080/cloud-api/images/" + imageId;
                var imageHtml = "<img src='" + source + "'>";
                $(".addEditModal .imgContainer").html(imageHtml);
            }
        });
    }
}