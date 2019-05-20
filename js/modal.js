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
// profileModal
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
        productData["prodMealJSON"] = $(product).find(".mealJSON ").text();

        // store product data to Session:
        // var productData = [prodName, prodPrice, prodExpirationDate, prodMealJSON];
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

function drawModal(toggleModal) {
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
                // let's fetch user from cookie
                var userJSON = getCookie("CuRrEnT_uSeR");
                var user = JSON.parse(userJSON);

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
                    // var oldPrice = item.prodOldPrice;
                    // var expirationDate = item.prodExpirationDate;
                    // var clientAmount = item.clientAmount;

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
                    "<span>ваше ім'я:</span>" +
                    "<span class=\"buyerName\"><b>" + user.username + "</b></span>" +
                    "<span>ваш е-мейл:</span>" +
                    "<span class=\"buyerEmail\"><b>" + user.email + "</b></span>" +
                    // "<span>Ваш телефон:</span>" +
                    // "<span class=\"buyerPhone\"><b>" + user.phone + "</b></span>" +
                    // "<span>Адреса доставки:</span>" +
                    // "<input class=\"destinationPoint\" type=\"text\">" +
                    "<br>" +
                    "<span>адреси доставки:</span>" +
                    "<select class='destinationPoint'>";
                user.adresses.forEach(function(element) {
                    checkoutHtml += "<option>" + element + "</option>";
                })
                checkoutHtml += "</select>" +
                    "</div>" +
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
    // let's fetch user (for get from it userId) from cookie
    var userJSON = getCookie("CuRrEnT_uSeR");
    var user = JSON.parse(userJSON);
    // let's get checket meals ids
    idMealList = [];
    // fetch from sessionStorage
    for (var i = 0; i < sessionStorage.length; i++) {
        var item = sessionStorage.getItem(sessionStorage.key(i));
        item = JSON.parse(item);
        var meal = JSON.parse(item.prodMealJSON);

        idMealList.push(meal.id);
    }
    // let's get payment (totalPrice):
    var totalPrice = getCookie("totalPrice")
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
                "name": user.username,
                "userId": user.id,
                // "phone": user.phone,
                "destinationPoint": checkoutData.destinationPoint,
                "payment": totalPrice,
                "idMealList": idMealList,
            }),
            type: "POST",
            crossDomain: true,
            success: function() {
                // close modal
                sessionStorage.clear();
                var successHtml = "<div class=\"successContainer\">" +
                    "<div class=\"row2\">ми отримали Ваше замовлення :)</div>" +
                    "</div>";
                $(".checkoutModal").find(".modal-content").html(successHtml);
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

        "<span>логін*:</span>" +
        "<input class=\"inputData login\" type=\"text\" value=\"user1\">" +
        "<span>пароль*:</span>" +
        "<input class=\"inputData password\" type=\"text\" value=\"user1\">" +
        "<span>е-мейл*:</span>" +
        "<input class=\"inputData email\" type=\"text\" value=\"user1@gmail.com\">" +
        "<span>адреси доставки (введіть через enter):</span>" +
        "<textarea class=\"inputData adresses\" rows=\"4\">вацлава гавела 5г\nполітехнічна 35\nгарматна 16</textarea>" +

        "<span class='mandatory_fields'>* - обов'язкові поля</span>" +
        "<br>" +
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

        setCookie("CuRrEnT_uSeR_pAsSwOrD", userPassword);
        // send login request
        $.ajax({
            // url: "http://" + host + "/cloud-api/login",
            url: "http://" + host + ":8080/cloud-api/login",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(userName + ":" + userPassword));
            },
            type: 'GET',
            success: function(user) {

                var userJSON = JSON.stringify(user);

                setCookie("CuRrEnT_uSeR", userJSON);
                performLoginState();
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
        // hide user profile
        $(profileButton).hide();
        // if user perform login
    } else {
        // don't show user profile button if user is not logged in
        var checkloginState = checkLoginStateCookie();


        setCookie("loginState", "true");
        var showAuthButton = '<i class="fas fa-sign-out-alt"></i>вихід';
        $(".showAuthButton").html(showAuthButton);
        // show user profile
        $(profileButton).show();

    }
}

function checkLoginStateCookie() {
    // var state = sessionStorage.getItem("loginState");
    var state = getCookie("loginState");
    // unlogged
    if (state == undefined) {
        var showAuthButton = 'вхід<i class="fas fa-sign-in-alt"></i>';
        $(".showAuthButton").html(showAuthButton);
        // hide user profile
        $(profileButton).hide();
        return false;
        // logged
    } else {
        var showAuthButton = '<i class="fas fa-sign-out-alt"></i>вихід';
        $(".showAuthButton").html(showAuthButton);
        // show user profile
        $(profileButton).show();
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
        var adresses = $(myModal).find(".adresses").val();

        adresses = adresses.split('\n');
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
                "adresses": adresses,
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



profileButton.addEventListener("click", OpenUserProfile);
closeProfileButton.addEventListener("click", toggleProfile);

// draw Profile modal
function drawProfileModal() {
    var userJSON = getCookie("CuRrEnT_uSeR");
    var user = JSON.parse(userJSON);

    var adressesString = "";
    // let's get delivary adresses in good format
    for (var i = 0; i < user.adresses.length; i++) {
        if (i < (user.adresses.length - 1)) {
            adressesString += user.adresses[i] + "\n";
        } else {
            adressesString += user.adresses[i];
        }
    }

    var profileHtml = //"<div class=profile-data" +
        "<div class=\"inputsData\">" +
        "<div id=modal-title class='inputData'>Особисті дані</div>" +
        "<br>" +
        "<div id=name>ім'я: <b>" + user.username + "</b></div>" +

        "<div id=email class='inputData'>e-мейл: <b>" + user.email + "</b></div>" +
        "<br>" +
        "<span>адреси доставки (введіть через enter):</span>" +
        "<textarea class=\"inputData adresses\" rows=\"4\">" + adressesString + "</textarea>" +
        "</div>";


    profileHtml += "<div class=\"checkoutContainer\">" +
        "<button class=\"doubleDackerButton changeProfile\">зберегти</button>" +
        "</div>";

    $(".userProfileModal .modal-content").html(profileHtml);
    // show modal
    profileModal.classList.toggle("show-modal");
    // hide .mainPageButtonContainer and filters divs
    $(".mainPageButtonContainer").addClass("hide");
}



// signUpModal if user press .sign_upButton 
$(".userProfileModal").click(function(event) {
    var myModal = this;
    var target = event.target;
    if ($(target).is(".changeProfile")) {
        // get user
        var userJSON = getCookie("CuRrEnT_uSeR");
        var user = JSON.parse(userJSON);
        // get editUser
        var adresses = $(".userProfileModal").find(".adresses").val();
        user.adresses = adresses.split("\n");
        // set user to cookie
        setCookie("CuRrEnT_uSeR", JSON.stringify(user));
        // get user password, that user entered when login
        var userPassword = getCookie("CuRrEnT_uSeR_pAsSwOrD");
        // call to PUT
        $.ajax({
            // url: "http://" + host + "/cloud-api/user/update" + user.id,
            url: "http://" + host + ":8080/cloud-api/user/update/" + user.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "username": user.username,
                "password": userPassword,
                "email": user.email,
                "adresses": user.adresses,
            }),
            type: "PUT",
            crossDomain: true,
            success: function() {
                var successHtml = "<div class=\"successContainer\">" +
                    "<div class=\"row2\">профіль було збережено :)</div>" +
                    "</div>";
                $(".userProfileModal").find(".modal-content").html(successHtml);
            }
        })


    }
})