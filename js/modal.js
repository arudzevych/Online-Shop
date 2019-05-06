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
        drawModal(cartArray);
    }
}
// open/close cart:
function OpenCart() {
    // open popup
    var cartArray = addToSession();
    drawModal(cartArray);
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
    var cartArray = [];
    // let's try to get cartArray session variable
    try { cartArray = JSON.parse(sessionStorage['cartArray']); } catch (e) {}
    // add current product to session array
    if (productData != undefined) cartArray.push(productData);
    sessionStorage['cartArray'] = JSON.stringify(cartArray);

    return cartArray;
}

function toggleCart() {
    cartModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

function toggleAuth() {
    authModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

function drawModal(cartArray) {
    var cartHtml = "<div class=\"deleteCartContainer\">" +
        "<button class=\"deleteCart\">очистити кошик</button>" +
        "</div>";
    cartHtml += "<div class=\"cartProducts\">";
    cartArray.forEach(function(element, index, arr) {
        var name = element[0];
        var amount = element[1];
        var expirationDate = element[2];
        var meal_href = element[3];
        cartHtml += "<div class=\"cartProduct\">";
        // cartHtml += "<div class=\"imgContainer\">" +
        //     image +
        //     "</div>"; //end of imgContainer
        cartHtml += "<p>" + name + "</p>";
        cartHtml += "<p>" + amount + "</p>";
        cartHtml += "<p>" + expirationDate + "</p>" +
            "</div>";
    });
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
        sessionStorage['cartArray'] = "";
        var successHtml = "<div class=\"successContainer\">" +
            "<div class=\"row2\">У кошику нічого немає:(</div>" +
            "</div>";
        $(this).find(".modal-content").html(successHtml)
    } else {
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
        "<input class=\"inputData login\" type=\"text\" value=\"ваш логін\">" +
        "<span>пароль:</span>" +
        "<input class=\"inputData password\" type=\"text\" value=\"ваш пароль\">" +
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
showAuthButton.addEventListener("click", OpenAuth);

// end cart modal<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// checkout modal:
function toggleCheckout() {
    checkoutModal.classList.toggle("show-modal");
    // show .mainPageButtonContainer and .filters divs
    $(".mainPageButtonContainer").removeClass("hide");
}

// if user press .sign_inButton 
$(".authModal").click(function(event) {
    var myModal = this;
    var target = event.target;
    if ($(target).is(".sign_inButton")) {
        var userName = $(myModal).find(".login").val();
        var userPassword = $(myModal).find(".password").val();
        // // open products array in cart
        // var cartArray=addToSession();

        // var cartArrayJson=JSON.stringify(cartArray);
        $.ajax({
            url: 'app/login.php',
            data: {
                'userName': userName,
                'userPassword': userPassword,
            },
            type: 'POST',
            success: function(data) {
                // var successHtml=
                // "<div class=\"successContainer\">"+
                // "<div class=\"row2\">Ваше замовленя відпрвлено до наших менеджерів.</div>"+
                // "<div class=\"row3\">Дякуємо за увагу до нашого магазину! :)</div>"+
                // "</div>";
                // $(".checkoutModal .modal-content").html(successHtml);
            }
        })
    }
});