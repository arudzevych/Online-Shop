// main variables:
host = window.location.hostname

// initialize and upload content
function uploadProducts() {
    $.ajax({

        // url: "http://" + host + "/cloud-api/meals/select",
        url: "http://" + host + ":8080/cloud-api/meals/select",

        type: "GET",
        crossDomain: true,
        success: function(dataArray) {

            // let's display content
            displayAdminContent(dataArray);

        }
    });
}

// initialize and upload forecast content 
function uploadForcasteProducts() {
    $.ajax({

        // url: "http://" + host + "/cloud-api/meals/select",
        url: "http://" + host + ":8080/cloud-api/meals/select",

        type: "GET",
        crossDomain: true,
        success: function(dataArray) {

            // let's display content
            // displayAdminContent(dataArray);
            alert("forecast");

        }
    });
}
// display products that market has
function displayAdminContent(content) {
    if (content[0] != null) {
        var productManagerHtml = " ";
        var productsCount = content.length;

        var counter = 0; //row counter
        var countInRow = 3; //number products in one row
        for (var i = 0; i < productsCount; i++) {
            if (counter % countInRow == 0) { //than new row
                productManagerHtml += "<div class=\"productRow\">";
            }
            productManagerHtml += "<div class=\"product\">";
            // "<div class=\"img-container\">"+
            // content[i].image+
            // "</div>";
            // productManagerHtml+=" <p class=\"code\">"+codes[i]+"</p>";
            var mealJSON = JSON.stringify(content[i]);
            var name = content[i].name;

            //convert timestamp to date
            var d = convertToDate(content[i].expirationDate);
            var date = d.getDate();
            if (date < 10) { date = "0" + date };
            var month = d.getMonth();
            if (month < 10) { month = "0" + month };
            var expiryDate = (date + '.' + month + '.' + d.getFullYear());


            productManagerHtml += " <p class=\"name\">" + content[i].name + "</p>";
            productManagerHtml += " <p class=\"amount\">" + content[i].amount + "</p>";
            productManagerHtml += " <p class=\"expirationDate\">" + expiryDate + "</p>";
            productManagerHtml += " <p class=\"mealJSON hide\">" + mealJSON + "</p>";
            productManagerHtml += " <p class=\"price\">" + content[i].price + "</p>";
            productManagerHtml += " <p class=\"discount hide\">" + content[i].discount + "</p>";

            productManagerHtml += " </div>";
            if ((counter % countInRow - (countInRow - 1)) == 0) { //than end of new row
                productManagerHtml += "</div>";
            }
            counter++;
        }
        if (counter % countInRow != 0 && productsCount != 0) {
            productManagerHtml += "</div>";
        }
        // draw
        $(".productManager").html(productManagerHtml);
    }
}
// for inserting substring into string 
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function convertToDate(timestamp) {
    var date = new Date(timestamp);
    return date;
}

$(".forecastProduct").click(uploadForcasteProducts);