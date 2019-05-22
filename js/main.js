// main variables:
// main content array variable
host = window.location.hostname
uploadContent();
// initialize and upload content
function uploadContent() {
    $.ajax({
        //   // тут замість app/selectFrom.php напиши адресу до свого серверу 
        //   // (що буде повертати адресу картинки у форматі json)
        // url: "http://" + host + "/cloud-api/meals/select",
        url: "http://" + host + ":8080/cloud-api/meals/select",

        type: "GET",
        crossDomain: true,
        success: function(content) {

            // var dataArray = []
            // var names = [];

            // content = data._embedded.meals;
            // for (i in dataArray) {
            //     names.push(dataArray[i].name);
            // }
            //     //  let's display content
            displayContent(content);
        }
    });
}

function displayContent(content) {

    // =============================
    if (content[0] != null) {
        var productHtml = " ";
        var productsCount = content.length;


        var counter = 0; //row counter
        var countInRow = 2;
        for (var i = 0; i < productsCount; i++) {

            if (counter % countInRow == 0)
                productHtml += "<div class=\"productRow\">";

            //   var filter = filters[i];
            productHtml += "<div class=\"product\">";
            //+images[i];
            var imageHtml = "";
            if (content[i].imageId != null) {
                var source = "http://" + host + ":8080/cloud-api/images/" + content[i].imageId;
                imageHtml = "<img src='" + source + "'>";
            }
            productHtml += imageHtml;
            //   productHtml+=" <p class=\"code\">"+codes[i]+"</p>";
            productHtml += " <p class=\"name\">" + content[i].name + "</p>";
            productHtml += " <p class=\"amount\">" + content[i].amount + "</p>";
            productHtml += " <p class=\"expirationDate\">" + content[i].expirationDate + "</p>";
            productHtml += " <p class=\"mealJSON hide\">" + JSON.stringify(content[i]) + "</p>";
            if (content[i].discount != null && content[i].discount != 0) {
                var old_price = parseFloat(content[i].price, 10);
                // let's calculate new price
                var real_discount = content[i].discount * 0.01;
                var newPrice = old_price - old_price * real_discount;
                // let's truncate
                newPrice = Number((newPrice).toFixed(4)); // 6.7
                productHtml += " <p class=\"discount \" title='знижка'>" +

                    "<span class=\"fa-stack fa-lg\">" +
                    "<i class=\"fa fa-certificate fa-stack-2x\"></i>" +
                    "<i class=\"fa fa-tag fa-stack-1x fa-inverse\"></i>" +
                    "</span> знижка " +
                    "<span class=\"discountExactly\">" + content[i].discount + "</span> % </p>";

                productHtml += " <p class=\"oldPrice\" title='стара ціна за шт'>" + content[i].price + "</p>" +
                    " <p class=\"price newPrice\" title='ціна за шт'>" + newPrice + "</p>";

            } else {
                productHtml += " <p class=\"price\" title='ціна за шт'>" + content[i].price + "</p>";
            }
            //   productHtml+=" <p class=\"price\">"+prices[i]+"</p>";
            //   productHtml+=" <p class=\"characteristics\" hidden>"+characteristics[i]+"</p>"
            productHtml += " <button class=\"cart\">у кошик <i class=\"fas fa-shopping-basket\"></i></button>";
            productHtml += " </div>";

            if ((counter % countInRow) - 1 == 0) { //than end of new row
                productHtml += "</div>"; //close .productRow
            }
            counter++;
        }
        // defense from unclosed .productRow
        if ((counter - 1) % 2 == 0 && content.length != 0) productHtml += "</div>";

        // $(productHtml).appendTo(".products");
        $(".products").html(productHtml);
    }

}



// ===================================================
// collect product input data
function collectProductData() {
    // output array
    var productArray = [];

    var prodName = $(".addEditModal").find(".productName").val();
    var prodAmount = $(".addEditModal").find(".productAmount").val();

    productArray.push(prodName);
    productArray.push(prodAmount);
    // return output productArray data
    return productArray;
}

// when manager click on save button
$(".addEditModal").click(function(event) {
    // var myModal=this;
    var target = event.target;
    if ($(target).is(".save")) {
        // manager clicks eectly on save button
        var productDataArray = collectProductData();
        // call to addEditProduct.php
        $.ajax({
            // url: "http://" + host + "/cloud-api/meals",
            url: "http://" + host + ":8080/cloud-api/meals",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "name": productDataArray[0],
                "amount": productDataArray[1],
                "expirationDate": null,
                "discount": null,
            }),
            type: "POST",
            crossDomain: true,
            success: function() {
                // refresh products
                uploadContent();
            }
        })
    }
})


// if client want to see product details:
// open characteristics page when click on image
$(".products").click(function(event) {
        var target = event.target;
        if ($(target).is(".name")) {


            // find current .product div
            var currProduct = $(target).parent(".product");
            // find current image and it's name
            // var image = $(currProduct).find("img")[0].outerHTML;
            var name = $(currProduct).find(".name")[0].outerHTML;
            var mealJSON = $(currProduct).find(".mealJSON").text();
            var meal = JSON.parse(mealJSON);
            // var currCharacteristicsJSON = $(currProduct).find(".characteristics").text();
            // var currCharacteristics = JSON.parse(currCharacteristicsJSON);
            var ingredients = meal.ingredients;
            var ingredientsHtml = " ";
            // left part page
            ingredientsHtml += "<div class=\"characteristics-container\">";
            ingredientsHtml += "<div class=\"left-charactersistics\">" +
                "<button class=\"backButton\">назад</button>" +
                // image +
                "<b>" + name + "</b>" +
                // "<p class=\"code\" hidden>" + code + "</p>" +
                "</div>";
            // Right part page
            ingredientsHtml += "<div class=\"right-charactersistics\">" +
                "<h3>Інгредієнти</h3>" +
                "<ul>";
            $(ingredients).each(function(index, element) {
                ingredientsHtml += "<li>" + element.name + "</li>";
            })
            ingredientsHtml += "</ul>" +
                "</div>" +
                "</div>"; //end of .characteristics-container
            // ingredientsHtml += "<div class=\"commentsDiv hide\"></div>"
            // load characteristics content to .products div
            $(".products").html(ingredientsHtml);
            // hide search bar and .currentFilters div
            // $(".wrap").addClass("hide");
        }
    })
    // if user click on .backButton to back to main page
$(".products").click(function(event) {
    var target = event.target;
    // if target is .backButton
    if ($(target).is(".backButton")) {
        // show search bar (.wrap), .filters div and .currentFilters div
        // $(".wrap").removeClass("hide");
        //  upload content to .products
        uploadContent();
    }
})

// product serach
$(".searchButton").click(function() {
        // implement search
        uploadContent();
    }) //end of click

$('.searchTerm').keypress(function(event) {
    if (event.which == 13) {
        // implement search
        searchAction();
    }
});

// implement search function
function searchAction() {
    // get .searchTerm text
    var term = $(".searchTerm").val();
    $(".product").each(function(index, value) {
            // let's hide all of them
            $(value).addClass("hide");
            if (term != "") {
                // get name
                var prodName = $(value).find(".name").text();
                //if term is substring of product name
                if (prodName.toLowerCase().includes(term.toLowerCase())) {
                    // then remove css class .hide
                    $(value).removeClass("hide");
                }
            }
        }) //end of each
}

// blob to html image
function blobToHtmlImage(file_obj) {
    var imageHtml = "";
    if (file_obj != undefined && file_obj != "" && file_obj != null) {
        if (file_obj.type.includes("image")) {

            var source = window.webkitURL.createObjectURL(file_obj);
            imageHtml = "<img src='" + source + "'>";

            return imageHtml;
        }
    } else {
        return "";
    }
}