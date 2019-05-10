// main content array variable
host = window.location.hostname
    // cart modal
var cartModal = document.querySelector(".cartModal");
var closeCartButton = document.querySelector(".cartModal .close-button");
var showCartButton = document.querySelector(".showCartButton");
// authorization modal
var authModal = document.querySelector(".authModal");
var closeAuthButton = document.querySelector(".authModal .close-button");
var showAuthButton = document.querySelector(".showAuthButton");
// checkout modal
var checkoutModal = document.querySelector(".checkoutModal");
var closeCheckoutButton = document.querySelector(".checkoutModal .close-button");
// comment modal
var commentModal = document.querySelector(".commentModal");
var closeCommentButton = document.querySelector(".commentModal .close-button");
// cart modal>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// add product from main page
$(".products").click(function(event) {
    var target = event.target; //must be button
    if ($(target).is(".cart")) //if target is button with class= "cart"
        var product = $(target).parent();
    AddToCart(product);
});
// add to cart:
function AddToCart(product) {
    if (product != undefined) {
        // product
        // var prodImage = $(product).find("img")[0].outerHTML;
        var prodName = $(product).find(".name").text();
        var prodAmount = $(product).find(".amount").text();
        var prodExpirationDate = $(product).find(".expirationDate").text();
        var prodMeal_href = $(product).find(".meal_href ").text();

        // store product data to Session:
        var productData = [prodName, prodAmount, prodExpirationDate, prodMeal_href];
        // open popup
        var cartArray = addToSession(productData);
        drawModal();
    }
}
// open/close cart:
function OpenCart() {
    // sessionStorage = ""
    // open popup
    // var cartArray = addToSession();
    drawModal();
    // hide .mainPageButtonContainer and .filters
    $(".mainPageButtonContainer").addClass("hide");
}
// open/close cart:
function OpenAuth() {
    // // open popup
    // var cartArray=addToSession();
    drawAuthModal();
    // hide .mainPageButtonContainer and .filters
    $(".mainPageButtonContainer").addClass("hide");
}

// add to session product and retriev all products from session
function addToSession(productData) {
    // add current product to session array
    if (productData != undefined) sessionStorage.setItem(productData[0], JSON.stringify(productData)); //cartArray.push(productData);

    return sessionStorage;
}


function toggleCart() {

    //save every product amount to sessionStorage
    $(".cartProducts .cartProduct").each(function() {
        var name = $(this).find(".cartItemName").text();
        var amount = $(this).find(".cartItemQuantity").val();
        // exactly save current pruduct amount to sassionStorage:
        var itemJSON = sessionStorage.getItem(name);
        var item = JSON.parse(itemJSON);
        item.push(amount);
        sessionStorage.setItem(item[0], JSON.stringify(item));
    });


    cartModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

function toggleAuth() {
    authModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

function drawModal() {
    var cartHtml = "<div class=\"deleteCartContainer\">" +
        "<button class=\"deleteCart\">очистити кошик</button>" +
        "</div>";
    cartHtml += "<div class=\"cartProducts\">";

    //     cartArray.forEach(function(element, index, arr) {
    for (var i = 0; i < sessionStorage.length; i++) {
        var itemJSON = sessionStorage.getItem(sessionStorage.key(i));

        var item = JSON.parse(itemJSON);
        var name = item[0];
        var amount = item[1];
        var expirationDate = item[2];
        var meal_href = item[3]
        var clientAmount = item[4];
        if (clientAmount == undefined) clientAmount = 1;
        cartHtml += "<div class=\"cartProduct\">";
        // cartHtml += "<div class=\"imgContainer\">" +
        //     image +
        //     "</div>"; //end of imgContainer
        cartHtml += "<p class=cartItemName>" + name + "</p>";
        cartHtml += "<p>" + amount + "</p>";
        cartHtml += "<p>" + expirationDate + "</p>";
        cartHtml += "<button class=removeCartItemButton type=button>видалити</button>";
        cartHtml += "<br>";
        cartHtml += "<input class=\"cartItemQuantity\" type=\"number\" value=\"" + clientAmount + "\" min=\"1\" max=\"1000\"></input>";
        cartHtml += "</div>";
        //     });
    }
    cartHtml += "</div>" +
        "</div>"; //cartProducts end
    cartHtml += "<div class=\"checkoutContainer\">" +
        "<button class=\"checkout doubleDackerButton\">оформити замовлення</button>";

    $(".cartModal .modal-content").html(cartHtml);
    // show modal
    cartModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer and filters divs
    $(".mainPageButtonContainer").addClass("hide");
}
// In Cart:
$(".cartModal").click(function(event) {
    var target = event.target;
    if ($(target).is(".deleteCart")) {
        sessionStorage.clear();
        var successHtml = "<div class=\"successContainer\">" +
            "<div class=\"row2\">У кошику нічого немає:(</div>" +
            "</div>";
        $(this).find(".modal-content").html(successHtml)
    } else {
        // if c;ient want to delete current product item
        if ($(target).is(".removeCartItemButton")) {
            var itemToDelete = $(target).parent();
            var nameToDelete = $(itemToDelete).find(".cartItemName").text();
            sessionStorage.removeItem(nameToDelete);
            $(itemToDelete).remove();
        }
        if ($(target).is(".checkout")) {
            // close cart modal
            cartModal.classList.toggle("show-modal");
            // initialize checkout html that i will paste to checkoutModal
            var checkoutHtml = "<div class=\"checkoutProducts\">";
            // open products array in cart
            var cartArray = addToSession();
            // paste products from cart to checkout html
            cartArray.forEach(function(element, index, arr) {
                var image = element[0];
                var name = element[1];
                var price = element[2];
                var code = element[3];
                checkoutHtml += "<div class=\"checkoutProduct\">"
                checkoutHtml += "<div class=\"imgContainer\">" +
                    image +
                    "</div>";
                checkoutHtml += "<p>" + name + "</p>";
                checkoutHtml += "<p>" + price + "</p>";
                checkoutHtml += "<p>" + code + "</p></div>";
            });
            // add inputs of client's contact data to checkoutHtml
            checkoutHtml += "</div>" + //end of "checkoutProducts div
                "<div class=\"buyerData\">" +
                "<span>Ваше ім'я:</span>" +
                "<input class=\"buyerName\" type=\"text\">" +
                "<span>Ваш е-мейл:</span>" +
                "<input class=\"buyerEmail\" type=\"text\">" +
                "<span>Ваш телефон:</span>" +
                "<input class=\"buyerPhone\" type=\"text\">" +
                "</div>";
            checkoutHtml += "<div class=\"chekoutButtonContainer\">" +
                "<button class=\"checkoutButton doubleDackerButton\">підтвердити замовлення</button>" +
                "</div>";
            // paste checkoutHtml to checkoutModal
            $(".checkoutModal .modal-content").html(checkoutHtml);
            // show checkout modal
            checkoutModal.classList.toggle("show-modal");
        }
    }
})

function drawAuthModal() {
    var authHtml = "<div class=\"inputsData\">" +
        "<span>логін:</span>" +
        "<input class=\"inputData login\" type=\"text\" value=\"admin\">" +
        "<span>пароль:</span>" +
        "<input class=\"inputData password\" type=\"text\" value=\"admin\">" +
        "</div>";

    authHtml += "<div class=\"checkoutContainer\">" +
        "<button class=\"doubleDackerButton sign_inButton\">вхід</button>" +
        "</div>";


    $(".authModal .modal-content").html(authHtml);
    // show modal
    authModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer and filters divs
    $(".mainPageButtonContainer").addClass("hide");
}

closeCartButton.addEventListener("click", toggleCart);
closeAuthButton.addEventListener("click", toggleAuth);
showCartButton.addEventListener("click", OpenCart);
// showAuthButton.addEventListener("click", OpenAuth);
$(showAuthButton).click(function(event) {
    var loginState = checkLoginStateCookie();
    if (!loginState) {
        OpenAuth();
    } else {
        // if user wants to logouts
        // send logout request
        $.ajax({
            // url:"http://"+host+"/cloud-api/meals",
            url: "http://" + host + ":8080/cloud-api/logout",
            type: 'GET',
            success: function(data) {
                performLoginState();
                // window.open('admin.html');

            }
        })
    }

});

// end cart modal<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// checkout modal:
function toggleCheckout() {
    checkoutModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

// authModal if user press .sign_inButton 
$(".authModal").click(function(event) {
    var myModal = this;
    var target = event.target;
    if ($(target).is(".sign_inButton")) {

        // if user wants to login:
        var userName = $(myModal).find(".login").val();
        var userPassword = $(myModal).find(".password").val();
        // send login request
        $.ajax({
            // url:"http://"+host+"/cloud-api/meals",
            url: "http://" + host + ":8080/cloud-api/login",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(userName + ":" + userPassword));
            },
            type: 'GET',
            success: function(data) {
                performLoginState();
                if (userName == "admin") { window.open('admin.html'); }
            }
        })
    }
});
// let's change authButton and sessionStorage
function performLoginState() {
    // var state = sessionStorage.getItem("loginState");
    var state = checkLoginStateCookie();
    // if user perform succesfuly logout
    if (state == true) {
        deleteCookie("loginState");
        // setCookie("loginState", "false");
        // sessionStorage.setItem("loginState", false);
        var showAuthButton = 'вхід<i class="fas fa-sign-in-alt"></i>';
        $(".showAuthButton").html(showAuthButton);

        // if user perform login
    } else {

        setCookie("loginState", "true");
        var showAuthButton = '<i class="fas fa-sign-out-alt"></i>вихід';
        $(".showAuthButton").html(showAuthButton);
    }
}

function checkLoginStateCookie() {
    // var state = sessionStorage.getItem("loginState");
    var state = getCookie("loginState");
    // unlogged
    if (state == undefined) {
        var showAuthButton = 'вхід<i class="fas fa-sign-in-alt"></i>';
        $(".showAuthButton").html(showAuthButton);
        return false;
        // logged
    } else {
        var showAuthButton = '<i class="fas fa-sign-out-alt"></i>вихід';
        $(".showAuthButton").html(showAuthButton);
        return true;
    }
}

// function checkLoginState() {
//     // call to POST
//     $.ajax({
//         // url:"http://"+host+"/cloud-api/meals",
//         url: "http://" + host + ":8080/cloud-api/meals",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: null,
//         type: "POST",
//         crossDomain: true,
//         success: function() {
//             // close modal
//             // addEditModal.classList.toggle("show-modal");
//             // refresh products
//             // uploadProducts();
//         },
//         error: function(XMLHttpRequest, textStatus, errorThrown) {
//             // alert("Status: " + XMLHttpRequest.status);
//             if (XMLHttpRequest.status == "400") {
//                 alert("logged");
//             } else {
//                 alert("unlogged");
//             }
//         }
//     })

// }
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