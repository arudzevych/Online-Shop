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
            //     //  let's display content
            displayContent(content);
        }
    });
}

function displayContent(content) {

    // =============================
    // if (content[0] != null) {
    if (content != null) {
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


            // expirationDate
            var expiryDate = timestampToDate(content[i].expirationDate);

            // let's perform autometed discount (by expiration day)===
            content[i] = checkNewDiscount(content[i]);
            // ====
            //   productHtml+=" <p class=\"code\">"+codes[i]+"</p>";
            productHtml += " <p class=\"name\">" + content[i].name + "</p>";
            // productHtml += " <p class=\"amount\">" + content[i].amount + "</p>";
            productHtml += " <p class=\"expirationDate\">" + expiryDate + "</p>";
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
            productHtml += " <button class=\"cart\">у кошик <i class=\"fas fa-shopping-basket\"></i></button>";
            productHtml += " </div>";

            if ((counter % countInRow) - 1 == 0) { //than end of new row
                productHtml += "</div>"; //close .productRow
            }
            counter++;
        }
        // defense from unclosed .productRow
        if ((counter - 1) % 2 == 0 && content.length != 0) productHtml += "</div>";

        $(".products").html(productHtml);

        // tabs
        //click tabs
        $('.tabs a span').toArray().forEach(function(element) {
            //создаем обработчик счелчков
            $(element).on('click', function() {
                var $element = $(element)
                $('.tabs a span').removeClass("active");
                $(element).addClass('active');
                $('.tabs-content').empty();
                if ($element.parent().is(":nth-child(1)")) {
                    displayContent(hasDiscount);
                } else {
                    showDiscountedItems();
                }
                //return false so browser don't follow the link
                return false;
            })
        })





        // add filters
        var filtersHtml = "";
        filtersHtml += "<span class=\"popularity\">popularity</span>";
        $(".filters").html(filtersHtml);
    }

}
// /////////////////////////////////////////
// filters in action
$(".filters").click(function(event) {
        var target = event.target;
        // if user click on filter
        if ($(target).is("span")) {
            var className = $(target).attr('class');
            if (className == "popularity") {
                // let's apply popularity filter
                // get orders
                $.ajax({
                    // url: "http://" + host + "/cloud-api/meals/popularity",
                    url: "http://" + host + ":8080/cloud-api/meals/popularity",

                    type: "GET",
                    crossDomain: true,
                    success: function(content) {
                        //     //  let's display content
                        // displayContent(content);
                        // var a = content;
                        // add to cookie current filter
                        var filtersObject = addToFiltersCookie(className);
                        applyFilters(filtersObject, content);
                    }
                });
            }
        }
    })
    // add to filter session and retriev all filters from session
function addToFiltersCookie(filter) {
    var filtersObject = {};
    // let's try to get filterArray session variable
    try { filtersObject = JSON.parse(getCookie['filtersObject']); } catch (e) {}
    // add current filter to session array
    if (filter != undefined) filtersObject[filter] = true;
    setCookie('filtersObject', JSON.stringify(filtersObject));
    return filtersObject;
}
// apply filters
function applyFilters(filtersObject, content) {
    //type code here:)

    // perform sorting by popularity as it needed by popularity filter:
    //      let's display content
    displayContent(content);
    showFilters(filtersObject);
}
// show filters
function showFilters(filtersObject) {
    var currentFiltersHtml = " ";
    // $(Object.keys(filtersObject)).each(function(filter) {
    if (filtersObject.popularity)
        currentFiltersHtml += "<span class=\"popularity\">popularity&nbsp;&nbsp;<i class=\"fa fa-times\" aria-hidden=\"true\"></i></span>";
    // })
    $(".currentFilters").html(currentFiltersHtml);
}
// filter onclose hendler
$(".currentFilters").click(function(event) {
    var target = event.target;
    if ($(target).is("i")) {
        var filterToHide = $(target).parent().attr('class');
        // get filters
        var filtersObjectJSON = getCookie("filtersObject");
        var filtersObject = JSON.parse(filtersObjectJSON);
        delete filtersObject[filterToHide];
        filtersObjectJSON = JSON.stringify(filtersObject);
        setCookie("filtersObject", filtersObjectJSON);
        // // apply filters
        // applyFilters(filtersObject);
        //      let's display content
        uploadContent();
        showFilters(filtersObject);
    }
});
//   end filter section
// ===================================================
function showDiscountedItems() {
    $.ajax({
        // url: "http://" + host + "/cloud-api/meals/select",
        url: "http://" + host + ":8080/cloud-api/meals/select",

        type: "GET",
        crossDomain: true,
        success: function(content) {
            var hasDiscount = [];
            content.forEach(function(item) {

                item = checkNewDiscount(item);

                if (item.discount != null & item.discount != 0) {
                    hasDiscount.push(item);
                }

            })
            displayContent(hasDiscount);
        }
    });
}
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
        if ($(target).is("img")) {


            // find current .product div
            var currProduct = $(target).parent(".product");
            // find current image and it's name
            // var image = $(currProduct).find("img")[0].outerHTML;
            var name = $(currProduct).find(".name")[0].outerHTML;
            var mealJSON = $(currProduct).find(".mealJSON").text();
            var meal = JSON.parse(mealJSON);
            // image>>>
            var imageHtml = "";
            if (meal.imageId != null) {
                var source = "http://" + host + ":8080/cloud-api/images/" + meal.imageId;
                imageHtml = "<img src='" + source + "'>";
            }
            // <<<image

            var ingredients = meal.ingredients;
            var ingredientsHtml = " ";
            // left part page
            ingredientsHtml += "<div class=\"characteristics-container\">";
            ingredientsHtml += "<div class=\"left-charactersistics\">" +
                "<button class=\"backButton\">назад</button>" +
                imageHtml +
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


// set cookie
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function checkNewDiscount(product) {
    var currentDateTimestamp = Date.now();
    var myCurrentDate = timestampToDate(currentDateTimestamp);
    // expirationDate
    var expiryDate = timestampToDate(product.expirationDate);

    var newDiscount = calculateDiscount(myCurrentDate, expiryDate);
    // var discount = content[i].discount;
    if (product.discount == null || product.discount == 0) {
        product.discount = newDiscount;
    }
    return product;
}

function calculateDiscount(myCurrentDate, expirationDate) {
    var discount = 0;
    // transform expiration date to timestamp
    var expirationDateTimestamp = dateToTimestamp(expirationDate);
    // transform myCurrentDate to timstamp
    var splitedCurrentDate = myCurrentDate.split(".");
    var year = splitedCurrentDate[2];
    // !!!!!because of bag of Date.now()? we must to increment month!!!!!>>>>>
    var monthInt = parseInt(splitedCurrentDate[1]);
    monthInt += 1;

    // <<<<<!!!!!because of bag of Date.now()? we must to increment month!!!!!
    var day = splitedCurrentDate[0];
    var myDate = new Date(year, monthInt, day);
    var myCurrentDateTimestamp = myDate.getTime();
    var deltaTime = expirationDateTimestamp - myCurrentDateTimestamp;

    // test
    expirationDate = timestampToDate(expirationDateTimestamp);
    myCurrentDate = timestampToDate(myCurrentDateTimestamp);


    var cd = 24 * 60 * 60 * 1000;
    var daysDelta = Math.floor(deltaTime / cd);
    if (daysDelta < 5) {
        if (daysDelta >= 3) {
            // if 3 <= daysDelta < 5
            discount = 10;
        } else {
            if (daysDelta >= 2) {
                // if 2 <= daysDelta < 3
                discount = 20;
            } else {
                // if daysDelta < 2
                discount = 30;
            }
        }
    }
    return discount;
}
// convert to date
function timestampToDate(timestamp) {
    // var date = new Date(timestamp);
    var d = new Date(timestamp);
    var date = d.getDate();
    if (date < 10) { date = "0" + date };
    var month = d.getMonth();
    if (month < 10) { month = "0" + month };
    var expiryDate = (date + '.' + month + '.' + d.getFullYear());
    return expiryDate;
}
// convert date to timestamp
function dateToTimestamp(expiryDate) {
    var splitedExpiryDate = expiryDate.split(".");
    var year = splitedExpiryDate[2];
    var month = splitedExpiryDate[1];
    var day = splitedExpiryDate[0];
    var myDate = new Date(year, month, day);
    var timestamp = myDate.getTime();
    // console.log(timestamp);
    return timestamp;
};


// jquery outerHtml:
jQuery.fn.outerHTML = function(s) {
    return s ?
        this.before(s).remove() :
        jQuery("<p>").append(this.eq(0).clone()).html();
};