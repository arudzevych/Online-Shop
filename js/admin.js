// main variables:
// main content array variable
host = window.location.hostname
    // initialize and upload content
function uploadProducts() {
    $.ajax({
        //   // тут замість app/selectFrom.php напиши адресу до свого серверу 
        //   // (що буде повертати адресу картинки у форматі json)
        // url: "http://" + host + "/cloud-api/meals",
        url: "http://" + host + ":8080/cloud-api/meals",

        type: "GET",
        crossDomain: true,
        success: function(data) {
            var dataArray = []

            dataArray = data._embedded.meals;

            // let's display content
            displayAdminContent(dataArray);

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

            var name = content[i].name;
            // let's get and modify meal_href
            var meal_href = content[i]._links.self.href;

            var mealsStartIndex = meal_href.indexOf("meals");
            var indexToInsert = mealsStartIndex - 1;
            // var hostEndIndex = hostStartIndex + host.length;
            var result_meal_href = meal_href.splice(indexToInsert, 0, "/cloud-api");

            //let's get and modify ingredients href:
            var ingredients_href = content[i]._links.ingredients.href;
            var mealsStartIndex = ingredients_href.indexOf("meals");
            var indexToInsert = mealsStartIndex - 1;
            // var hostEndIndex = hostStartIndex + host.length;
            var result_ingredients_href = ingredients_href.splice(indexToInsert, 0, "/cloud-api");

            productManagerHtml += " <p class=\"name\">" + content[i].name + "</p>";
            productManagerHtml += " <p class=\"amount\">" + content[i].amount + "</p>";
            productManagerHtml += " <p class=\"expirationDate\">" + content[i].expirationDate + "</p>";
            productManagerHtml += " <p class=\"meal_href hide\">" + result_meal_href + "</p>";
            productManagerHtml += " <p class=\"ingredients hide\">" + result_ingredients_href + "</p>";
            productManagerHtml += " </div>";
            if ((counter % countInRow - (countInRow - 1)) == 0) { //than end of new row
                productManagerHtml += "</div>";
            }
            counter++;
        }
        if (counter % countInRow != 0 && productsCount != 0) {
            productManagerHtml += "</div>";
        }
        // show up products characteristics
        $(".productManager").html(productManagerHtml);
    }
}
// for inserting substring into string 
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};