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
// signUp modal
var signUpModal = document.querySelector(".signUpModal");
var closeSignUpButton = document.querySelector(".signUpModal .close-button");
var showSignUpButton = document.querySelector(".showSignUpButton");
// checkout modal
var checkoutModal = document.querySelector(".checkoutModal");
var closeCheckoutButton = document.querySelector(".checkoutModal .close-button");
// comment modal
var commentModal = document.querySelector(".commentModal");
var closeCommentButton = document.querySelector(".commentModal .close-button");
var profileModal = document.querySelector(".userProfileModal")
var profileButton = document.querySelector(".showUserProfileButton")
var closeProfileButton = document.querySelector(".userProfileModal .close-button")
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
        // product Data object
        productData = {};
        // product
        // var prodImage = $(product).find("img")[0].outerHTML;
        productData["prodName"] = $(product).find(".name").text();
        productData["prodPrice"] = $(product).find(".price").text();
        productData["prodOldPrice"] = $(product).find(".oldPrice").text();
        productData["prodExpirationDate"] = $(product).find(".expirationDate").text();
        productData["prodMeal_href"] = $(product).find(".meal_href ").text();

        // store product data to Session:
        // var productData = [prodName, prodPrice, prodExpirationDate, prodMeal_href];
        // open popup
        var cartArray = addToSession(productData);
        drawModal(true);
    }
}
// open/close cart:
function OpenCart() {
    // sessionStorage = ""
    // open popup
    // var cartArray = addToSession();
    drawModal(true);
    // hide .mainPageButtonContainer and .filters
    $(".mainPageButtonContainer").addClass("hide");
}
// open/close auth:
function OpenAuth() {
    // // open popup
    // var cartArray=addToSession();
    drawAuthModal();
    // hide .mainPageButtonContainer and .filters
    $(".mainPageButtonContainer").addClass("hide");
}

// open/close signUp modal:
function OpenSignUp() {
    // // open popup
    drawSignUpModal();
    // hide .mainPageButtonContainer
    $(".mainPageButtonContainer").addClass("hide");
}

// open/close userProfile modal:
function OpenUserProfile() {
    // // open popup
    drawProfileModal();
    // hide .mainPageButtonContainer
    $(".mainPageButtonContainer").addClass("hide");
}

// add to session product and retriev all products from session
function addToSession(productData) {
    // add current product to session array

    if (productData != undefined) {
        // foreach every pruduct object in sessionStorage
        Object.keys(sessionStorage).forEach(function(name) {

            if (name == productData.prodName) {

                var productJSON = sessionStorage.getItem(name);
                product = JSON.parse(productJSON);
                if (product.clientAmount != undefined) {

                    var clientAmount = parseInt(product.clientAmount, 10) + 1;
                    productData["clientAmount"] = clientAmount.toString(10);
                }
            }
        })
        sessionStorage.setItem(productData.prodName, JSON.stringify(productData)); //cartArray.push(productData);
    }
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
        item["clientAmount"] = amount;
        sessionStorage.setItem(item.prodName, JSON.stringify(item));
    });


    cartModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

function toggleAuth() {
    authModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and div
    $(".mainPageButtonContainer").removeClass("hide");
}

function toggleSignUp() {
    signUpModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and div
    $(".mainPageButtonContainer").removeClass("hide");
}


function toggleProfile() {
    profileModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and div
    $(".mainPageButtonContainer").removeClass("hide");
}

function drawModal() {

    var cartHtml = "<div class=\"deleteCartContainer\">" +
        "<button class=\"deleteCart\">очистити кошик</button>" +
        "</div>";
    cartHtml += "<div class=\"cartProducts\">";
    // total price sum 
    var totalPrice = 0;
    var totalOldPrice = 0;
    //     cartArray.forEach(function(element, index, arr) {
    for (var i = 0; i < sessionStorage.length; i++) {
        var itemJSON = sessionStorage.getItem(sessionStorage.key(i));

        var item = JSON.parse(itemJSON);
        var name = item.prodName;
        var price = item.prodPrice;
        var oldPrice = item.prodOldPrice;
        var expirationDate = item.prodExpirationDate;
        var meal_href = item.prodMeal_href
        var clientAmount = item.clientAmount;


        // clientAmount increment

        if (clientAmount == undefined) clientAmount = 1;

        // totalPrice increment
        if (oldPrice == "") oldPrice = price;
        totalOldPrice += parseFloat(oldPrice * parseInt(clientAmount, 10), 10);
        totalPrice += parseFloat(price * parseInt(clientAmount, 10), 10);


        cartHtml += "<div class=\"cartProduct\">";
        // cartHtml += "<div class=\"imgContainer\">" +
        //     image +
        //     "</div>"; //end of imgContainer
        cartHtml += "<p class=cartItemName>" + name + "</p>";
        cartHtml += "<p>" + price + "</p>";
        cartHtml += "<p>" + expirationDate + "</p>";
        cartHtml += "<button class=removeCartItemButton type=button>видалити</button>";
        cartHtml += "<br>";
        cartHtml += "<input class=\"cartItemQuantity\" type=\"number\" value=\"" + clientAmount + "\" min=\"1\" max=\"1000\"></input>";
        cartHtml += "</div>";
        //     });
    };
    if (totalPrice == totalOldPrice) totalOldPrice = ""
    cartHtml += "</div>" +
        "</div>"; //cartProducts end

    cartHtml += "<div class=\"totalSumContainer\">вартість кошику: <div class='oldPrice'>" + totalOldPrice + " </div><b> " + totalPrice + "</b></div>";
    cartHtml += "<div class=\"checkoutContainer\">" +
        "<button class=\"checkout doubleDackerButton\">оформити замовлення</button>";

    // let's save totalPrice to sessionStorage
    setCookie("totalPrice", totalPrice);

    $(".cartModal .modal-content").html(cartHtml);
    // show modal
    if (toggleModal) cartModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer and filters divs
    $(".mainPageButtonContainer").addClass("hide");

    // if clientAmount is changed in cart
    $(".cartItemQuantity").change(function(event) {
        var target = event.target;
        var name = $(target).parent(".cartProduct").find(".cartItemName").text();

        // Object.keys(sessionStorage).forEach(function(product){

        // })
        var product = sessionStorage.getItem(name);
        product = JSON.parse(product);
        product["clientAmount"] = $(target).val();
        if (product["clientAmount"] == "") product["clientAmount"] = "1";

        sessionStorage.setItem(name, JSON.stringify(product));
        drawModal(false);
    });
}
// In Cart:
$(".cartModal").click(function(event) {
        var target = event.target;
        if ($(target).is(".deleteCart")) {
            sessionStorage.clear();
            var successHtml = "<div class=\"successContainer\">" +
                "<div class=\"row2\">У кошику нічого немає:(</div>" +
                "</div>";
            $(this).find(".modal-content").html(successHtml);
        } else {
            // if c;ient want to delete current product item
            if ($(target).is(".removeCartItemButton")) {
                var itemToDelete = $(target).parent();
                var nameToDelete = $(itemToDelete).find(".cartItemName").text();
                sessionStorage.removeItem(nameToDelete);
                $(itemToDelete).remove();
                drawModal(false);
            }
            if ($(target).is(".checkout")) {
                // close cart modal
                cartModal.classList.toggle("show-modal");
                // initialize checkout html that i will paste to checkoutModal
                var checkoutHtml = "<div class=\"checkoutProducts\">";
                // open products array in cart
                for (var i = 0; i < sessionStorage.length; i++) {
                    var itemJSON = sessionStorage.getItem(sessionStorage.key(i));

                    var item = JSON.parse(itemJSON);
                    var name = item.prodName;
                    var price = item.prodPrice;
                    var oldPrice = item.prodOldPrice;
                    var expirationDate = item.prodExpirationDate;
                    var meal_href = item.prodMeal_href
                    var clientAmount = item.clientAmount;

                    checkoutHtml += "<div class=\"checkoutProduct\">"
                        // checkoutHtml += "<div class=\"imgContainer\">" +
                        //     image +
                        //     "</div>";
                    checkoutHtml += "<p>" + name + "</p>";
                    checkoutHtml += "<p>" + price + "</p>" +
                        "</div>";
                }
                // add inputs of client's contact data to checkoutHtml
                checkoutHtml += "</div>" + //end of "checkoutProducts div
                    "<div class=\"buyerData\">" +
                    "<span>Ваше ім'я:</span>" +
                    "<input class=\"buyerName\" type=\"text\">" +
                    "<span>Ваш е-мейл:</span>" +
                    "<input class=\"buyerEmail\" type=\"text\">" +
                    "<span>Ваш телефон:</span>" +
                    "<input class=\"buyerPhone\" type=\"text\">" +
                    "<span>Адреса доставки:</span>" +
                    "<input class=\"destinationPoint\" type=\"text\">" +
                    "<span>Загальна ціна: <b>" + getCookie("totalPrice") + "</b></span>" +
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
    // authModal if user press .sign_inButton 
$(".checkoutModal").click(function(event) {
    var myModal = this;
    var target = event.target;
    // let's collect order details 
    var checkoutData = collectCheckoutModal();
    // let's create order
    if ($(target).is(".checkoutButton")) {
        // call to POST
        $.ajax({
            // url: "http://" + host + "/cloud-api/registration",
            url: "http://" + host + ":8080/cloud-api/order/create",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "name": checkoutData.name,
                "userId": null, //getCookie("userId"),
                "phone": checkoutData.phone,
                "destinationPoint": checkoutData.destinationPoint,
                "payment": getCookie("totalPrice"),
                "idMealList": null,
            }),
            type: "POST",
            crossDomain: true,
            success: function() {
                // close modal
                sessionStorage.clear();
                var successHtml = "<div class=\"successContainer\">" +
                    "<div class=\"row2\">ми отримали Ваше замовлення :)</div>" +
                    "</div>";
                $(this).find(".modal-content").html(successHtml);
                // // refresh products
                // uploadProducts();
            }
        })
    }
});
// collect product input data
function collectCheckoutModal() {

    // output array
    var checkoutData = {};
    checkoutData["name"] = $(".checkoutModal").find(".buyerName").val();
    checkoutData["phone"] = $(".checkoutModal").find(".buyerPhone").val();
    checkoutData["destinationPoint"] = $(".checkoutModal").find(".destinationPoint").val();

    // return output productArray data
    return checkoutData;
}
// Authorization madal
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
// Sign up modal
function drawSignUpModal() {
    var signUpHtml = "<div class=\"inputsData\">" +

        "<span>логін:</span>" +
        "<input class=\"inputData login\" type=\"text\" value=\"user1\">" +
        "<span>пароль:</span>" +
        "<input class=\"inputData password\" type=\"text\" value=\"user1\">" +
        "<span>е-мейл:</span>" +
        "<input class=\"inputData email\" type=\"text\" value=\"user1@gmail.com\">" +

        "</div>";

    signUpHtml += "<div class=\"checkoutContainer\">" +
        "<button class=\"doubleDackerButton sign_upButton\">зареєструватись</button>" +
        "</div>";


    $(".signUpModal .modal-content").html(signUpHtml);
    // show modal
    signUpModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer div
    $(".mainPageButtonContainer").addClass("hide");
}

closeCartButton.addEventListener("click", toggleCart);
closeCheckoutButton.addEventListener("click", toggleCheckout);
closeAuthButton.addEventListener("click", toggleAuth);
closeSignUpButton.addEventListener("click", toggleSignUp);
showCartButton.addEventListener("click", OpenCart);
showSignUpButton.addEventListener("click", OpenSignUp);


$(showAuthButton).click(function(event) {
    var loginState = checkLoginStateCookie();
    if (!loginState) {
        OpenAuth();
    } else {
        // if user wants to logouts
        // send logout request
        $.ajax({
            // url: "http://" + host + "/cloud-api/logout",
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
            // url: "http://" + host + "/cloud-api/login",
            url: "http://" + host + ":8080/cloud-api/login",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(userName + ":" + userPassword));
            },
            type: 'GET',
            success: function(data) {
                performLoginState();
                setCookie("username", userName)
                // close modal
                toggleAuth();
                if (userName == "admin") { window.open('admin.html'); }
            }
        })
    }
});
// let's change authButton and sessionStorage
function performLoginState() {

    var state = checkLoginStateCookie();
    // if user perform succesfuly logout
    if (state == true) {

        deleteCookie("loginState");
        var showAuthButton = 'вхід<i class="fas fa-sign-in-alt"></i>';
        $(".showAuthButton").html(showAuthButton);
        $(profileButton).hide();

        // if user perform login
    } else {
        setCookie("loginState", "true");
        $(profileButton).show();
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

// signUpModal if user press .sign_upButton 
$(".signUpModal").click(function(event) {
    var myModal = this;
    var target = event.target;
    if ($(target).is(".sign_upButton")) {

        // if user wants to login:
        var userName = $(myModal).find(".login").val();
        var userPassword = $(myModal).find(".password").val();
        var userEmail = $(myModal).find(".email").val();

        // call to POST
        $.ajax({
            // url: "http://" + host + "/cloud-api/registration",
            url: "http://" + host + ":8080/cloud-api/registration",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "username": userName,
                "password": userPassword,
                "email": userEmail,
            }),
            type: "POST",
            crossDomain: true,
            success: function() {
                // close modal
                toggleSignUp();
                // // refresh products
                // uploadProducts();
            }
        })
    }
});

// =========================================================================
// user profile modal

// don't show user profile button if user is not logged in
var checkloginState = checkLoginStateCookie();
if (!checkloginState) {
    $(profileButton).hide();
} else {
    $(profileButton).show();
}

profileButton.addEventListener("click", OpenUserProfile)
closeProfileButton.addEventListener("click", toggleProfile);

// draw Profile modal
function drawProfileModal() {

    var profileHtml = "<div class=profile-data" +
        "<div id=modal-title>Особисті дані</div>" + 
        // "<div class=name-container" +
        "<div id=name>Ім'я</div>" + 
        // "</div>" +
        // "<div class=email-container" +
        "<div id=email>Електронна пошта</div>" + 
        // "</div>" +
        // "<div class=delivery-address-container" +
        "<div class=user-delivery-address>Адреси доставки</div>" +
        "<select id=user-delivery-address>" +
            "<option>Адреса 1</option>" +
            "<option>Адреса 2</option>" +
        "</select>" + "</div>" 
        // + "</div>"

    $(".userProfileModal .modal-content").html(profileHtml);
    // show modal
    profileModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer and filters divs
    $(".mainPageButtonContainer").addClass("hide");


    //send ajax request to get user information
    $(function() {
        var $profileHtml = $(".userProfileModal .modal-content");
        // var name = $(".name-container")
        // var email = $(".email-container")

        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: "http://" + host + ":8080/cloud-api/users",
            // url: "http://" + host + "/cloud-api/users",
            success: function(data) {
                console.log(data);

                var dataArray = [];
                dataArray = data._embedded.users;
                console.log(dataArray);

                var userName = getCookie("username");
                console.log(userName);

                dataArray.forEach(function(item) {
                    if (item.username === userName) {
                        var userHtml = "<div class=username>" + item.username + "</div>" +
                        "<div class=user-email>" + item.email + "</div>"
                        $profileHtml.append(userHtml)

                        // $(name).append("<div class=username>" + item.username + "</div>")
                        // $(email).append("<div class=user-email>" + item.email + "</div>")
                    }
                })
            }
        })
    })


}