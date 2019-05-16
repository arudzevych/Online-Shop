// main variables:
// main content array variable
host = window.location.hostname
uploadContent();
// initialize and upload content
function uploadContent() {
    $.ajax({
        //   // тут замість app/selectFrom.php напиши адресу до свого серверу 
        //   // (що буде повертати адресу картинки у форматі json)
        // url: "http://" + host + "/cloud-api/meals",
        url: "http://" + host + ":8080/cloud-api/meals",

        type: "GET",
        crossDomain: true,
        success: function(data) {

            var dataArray = []
            var names = [];

            content = data._embedded.meals;
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
        // var names = content[0];
        // var codes = content[1];
        // var images = content[2];
        // var prices = content[3];
        // var filters = content[4];
        // var characteristics = content[5];

        var counter = 0; //row counter
        var countInRow = 2;
        for (var i = 0; i < productsCount; i++) {

            if (counter % countInRow == 0)
                productHtml += "<div class=\"productRow\">";

            //   var filter = filters[i];
            productHtml += "<div class=\"product\">"; //+images[i];
            //   productHtml+=" <p class=\"code\">"+codes[i]+"</p>";
            productHtml += " <p class=\"name\">" + content[i].name + "</p>";
            productHtml += " <p class=\"amount\">" + content[i].amount + "</p>";
            // productHtml += " <p class=\"expirationDate\">" + content[i].expirationDate + "</p>";
            productHtml += " <p class=\"meal_href hide\">" + content[i]._links.self.href + "</p>";
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