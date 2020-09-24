// ==UserScript==
// @name        Universal Interactive Booru Image Resizer
// @namespace   Quin15
// @version     1.1.4
// @author      Quin15
// @downloadURL https://github.com/Quin15/Booru-Image-Resizer/raw/master/universal-interactive-booru-image-resizer.user.js
// @updateURL   https://github.com/Quin15/Booru-Image-Resizer/raw/master/universal-interactive-booru-image-resizer.user.js
// @grant       none

// @match       *://chan.sankakucomplex.com/*
// @match       *://danbooru.donmai.us/*
// @match       *://gelbooru.com/*
// @match       *://safebooru.org/*
// @match       *://tbib.org/*
// @match       *://nozomi.la/*
// @match       *://rule34.xxx/*
// @match       *://rule34.paheal.net/*
// @match       *://yande.re/*
// @match       *://konachan.com/*
// @match       *://e621.net/*
// @match       *://drunkenpumken.booru.org/*

// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////        USER SETTINGS        /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

var CheckKeyPress = true; // Enable or disable this setting to check for ALT+R to change image size percentage // 1 to enable, other to disable.
var imageDecreaseAmount = 1.2; // Increase image multiplied by this amount on a single click // Default = 1.2x
var imageIncreaseAmount = 1.2; // Decrease image multiplied by this amount on a double click // Default = 1.2x
var singleClickDecrease = true; // Single click decrease image size // Default true // false means single click increases and double click decreases
window.KeyControl = ['Alt', 'r']; // Determines which keys will activate prompt for image resizing

//////////////////////////////////////////////////////////////////////////////////////

if (singleClickDecrease) {
    window.singleClickAction = 1;
    window.doubleClickAction = 2;
} else {
    window.singleClickAction = 2;
    window.doubleClickAction = 1;
};


if (CheckKeyPress == true) {
    window.selectedPercentage = 100;
    window.CheckKeyPressed = {};
    for (var e = 0; e < window.KeyControl.length; e++) {
        window.CheckKeyPressed[window.KeyControl[e]] = true;
    };

    window.keysPressed = {};
    document.addEventListener('keydown', (event) => {
        window.keysPressed[event.key] = true;
        if (JSON.stringify(window.keysPressed) == JSON.stringify(window.CheckKeyPressed)) {
            window.keysPressed = {};
            var inputPercent = window.prompt("Resize image to input percentage", window.selectedPercentage.toFixed(2));
            if (parseFloat(inputPercent) > 0) {
                window.selectedPercentage = parseFloat(inputPercent);
            };
            PercentageResize();
        };

        //console.log(JSON.stringify(window.keysPressed))
        //console.log(JSON.stringify(window.CheckKeyPressed))
    });

    document.addEventListener('keyup', (event) => {
        delete window.keysPressed[event.key];
        //console.log(JSON.stringify(window.keysPressed))
        //console.log(JSON.stringify(window.CheckKeyPressed))
    });

    setInterval(function() {window.keysPressed = {};}, 1000);
};

var site = window.location.hostname;

if (site == 'chan.sankakucomplex.com') {
    try {
        // Remove ad Div and image padding to save extra space at top of page
        document.querySelector('#post-content').style.padding = '0px';
        var adDivs = document.querySelectorAll('#sp1');
        for (var i = 0; i < adDivs.length; i++) {
            adDivs[i].remove();
        };

        window.DOMimage = document.querySelector('#image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    var currentDOMimgHeight = window.DOMimage.height;
                    var currentDomimgWidth = window.DOMimage.width
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight / imageDecreaseAmount;
                        window.DOMimage.width = currentDomimgWidth / imageDecreaseAmount;
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight * imageIncreaseAmount;
                        window.DOMimage.width = currentDomimgWidth * imageIncreaseAmount;
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.height = window.DOMimageNewHeight;
                        window.DOMimage.width = window.DOMimageNewWidth;
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height;
            var imageWidth = window.DOMimage.width;

            var windowHeight = window.innerHeight;
            var windowWidth = document.documentElement.clientWidth - document.querySelector('#post-view div[class="sidebar"]').getWidth() - window.getComputedStyle(document.querySelector('#post-view div[class="sidebar"]')).marginRight.replace('px', '') - 10;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.height = windowHeight;
                window.DOMimage.width = (windowHeight / imageHeight) * imageWidth;
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.width = windowWidth;
                window.DOMimage.height = (windowWidth / imageWidth) * imageHeight;
            }
            window.DOMimageNewHeight = window.DOMimage.height;
            window.DOMimageNewWidth = window.DOMimage.width;

            window.DOMimage.scrollIntoView(false);
        };

        window.DOMimage.click(); // Get larger image if exists
        setTimeout(ResizeImage, 200);
        window.DOMimage.addEventListener('click', window.CheckClick);

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("chan.sankaku Error: " + err);};
};

if (site == 'danbooru.donmai.us') {

    try {
        window.DOMimage = document.querySelector('#image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.style.height = (window.DOMimage.style.height.replace('px', '') / imageDecreaseAmount) + "px";
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') / imageDecreaseAmount) + "px";
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.style.height = (window.DOMimage.style.height.replace('px', '') * imageIncreaseAmount) + "px";
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * imageIncreaseAmount) + "px";
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.style.height = window.DOMimageNewHeight + 'px';
                        window.DOMimage.style.width = window.DOMimageNewWidth + 'px';
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.style.height.replace('px', '');
            var imageWidth = window.DOMimage.style.width.replace('px', '');

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth - document.querySelector('#sidebar').offsetWidth;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.style.height = windowHeight + "px";
                window.DOMimage.style.width = ((windowHeight / imageHeight) * imageWidth) + "px";
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.style.width = windowWidth + "px";
                window.DOMimage.style.height = ((windowWidth / imageWidth) * imageHeight) + "px";
            }
            window.DOMimageNewHeight = window.DOMimage.style.height.replace('px', '');
            window.DOMimageNewWidth = window.DOMimage.style.width.replace('px', '');

            window.DOMimage.scrollIntoView(false);
        };

        if (document.querySelector('a[class="image-view-original-link"]')) {
            document.querySelector('a[class="image-view-original-link"]').click();} // Get larger image if exists

        setTimeout(ResizeImage, 300);
        window.DOMimage.addEventListener('click', window.CheckClick);
        $(window.DOMimage).removeClass("fit-width");
        
        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("danbooru.donmai Error: " + err);};
};

if (site == 'gelbooru.com') {

    try {
        window.DOMimage = document.querySelector('#image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') / imageDecreaseAmount) + "px";
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * imageIncreaseAmount) + "px";
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.style.width = window.DOMimageNewWidth + 'px';
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewWidth) * window.DOMimage.width;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height
            var imageWidth = window.DOMimage.width

            var windowHeight = window.innerHeight;
            var windowWidth = document.querySelector('#post-view').offsetWidth;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.style.width = ((windowHeight / imageHeight) * imageWidth) + 'px'
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.style.width = windowWidth + 'px';
            }
            window.DOMimageNewWidth = window.DOMimage.style.width.replace('px', '');
            window.DOMimage.scrollIntoView(false);
        };

        if (document.querySelector('#resized_notice a')) {
            document.querySelector('#resized_notice a').click();} // Get larger image if exists
        if (document.querySelector('div[class="contain-push"] div:nth-child(2) a img')) {
            document.querySelector('div[class="contain-push"] div:nth-child(2) a img').parentElement.parentElement.remove()}; // Remove random banner if exists
        var bannerDivs = document.querySelectorAll('div[class="alert alert-info"]');
        for (var i = 0; i < bannerDivs.length; i++) {
            bannerDivs[i].remove();
        };

        setTimeout(ResizeImage, 300);
        window.DOMimage.addEventListener('click', window.CheckClick);

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("gelbooru Error: " + err);};
}

if (site == 'tbib.org' || site == 'safebooru.org' || site == 'rule34.xxx' || site == 'yande.re' || site == 'konachan.com' || site == 'drunkenpumken.booru.org') {
    document.querySelector('#post-view div[class="sidebar"]').style.maxWidth = "220px";
    try {
        window.DOMimage = document.querySelector('#image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    var currentDOMimgHeight = window.DOMimage.height;
                    var currentDomimgWidth = window.DOMimage.width;

                    console.log(window.singleClickAction);

                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight / imageDecreaseAmount;
                        window.DOMimage.width = currentDomimgWidth / imageDecreaseAmount;
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight * imageIncreaseAmount;
                        window.DOMimage.width = currentDomimgWidth * imageIncreaseAmount;
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.height = window.DOMimageNewHeight;
                        window.DOMimage.width = window.DOMimageNewWidth;
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height
            var imageWidth = window.DOMimage.width

            var windowHeight = window.innerHeight;
            var windowWidth = document.documentElement.clientWidth - document.querySelector('#post-view div[class="sidebar"]').clientWidth - window.getComputedStyle(document.querySelector('#post-view div[class="sidebar"]')).marginRight.replace('px', '') - 50;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.height = windowHeight;
                window.DOMimage.width = (windowHeight / imageHeight) * imageWidth;
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.width = windowWidth;
                window.DOMimage.height = (windowWidth / imageWidth) * imageHeight;
            }
            window.DOMimageNewHeight = window.DOMimage.height;
            window.DOMimageNewWidth = window.DOMimage.width;

            window.DOMimage.scrollIntoView(false);
        };

        if (document.querySelector('#resized_notice a')) {
            setTimeout(function(){document.querySelector('#resized_notice a').click();}, 300); // Get larger image if exists
        } else {
            var tryimage = () => {
                if (image.domain.include('http')) {
                    document.querySelector('#image').src = document.querySelector('#image').src = image.domain + '/' + image.base_dir + '/' + image.dir + '/' + image.img;
                    document.querySelector('#image').width = image.width;
                    document.querySelector('#image').height = image.height;
                } else {
                    setTimeout(tryimage, 200);
                };
            };
        };

        setTimeout(ResizeImage, 300);
        window.DOMimage.addEventListener('click', window.CheckClick);

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("booru Error: " + err);};
}

if (site == 'rule34.paheal.net') {
    try {
        window.DOMimage = document.querySelector('#main_image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    var currentDOMimgHeight = window.DOMimage.height;
                    var currentDomimgWidth = window.DOMimage.width
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight / imageDecreaseAmount;
                        window.DOMimage.width = currentDomimgWidth / imageDecreaseAmount;
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight * imageIncreaseAmount;
                        window.DOMimage.width = currentDomimgWidth * imageIncreaseAmount;
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.height = window.DOMimageNewHeight;
                        window.DOMimage.width = window.DOMimageNewWidth;
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height
            var imageWidth = window.DOMimage.width

            var windowHeight = window.innerHeight;
            var windowWidth = document.querySelector('#Imagemain div[class="blockbody"]').clientWidth;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.height = windowHeight;
                window.DOMimage.width = (windowHeight / imageHeight) * imageWidth;
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.width = windowWidth;
                window.DOMimage.height = (windowWidth / imageWidth) * imageHeight;
            }
            window.DOMimageNewHeight = window.DOMimage.height;
            window.DOMimageNewWidth = window.DOMimage.width;

            window.DOMimage.scrollIntoView(false);
        };

        setTimeout(ResizeImage, 300);
        $(DOMimage).unbind("click");
        window.DOMimage.addEventListener('click', window.CheckClick);
        window.DOMimage.style = "";

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("rule34.paheal Error: " + err);};
}

if (site == 'nozomi.la') {

    try {
        window.DOMimage = document.querySelector('div[class="post"] a img');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    var currentDOMimgHeight = window.DOMimage.height;
                    var currentDomimgWidth = window.DOMimage.width
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight / imageDecreaseAmount;
                        window.DOMimage.width = currentDomimgWidth / imageDecreaseAmount;
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight * imageIncreaseAmount;
                        window.DOMimage.width = currentDomimgWidth * imageIncreaseAmount;
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.height = window.DOMimageNewHeight;
                        window.DOMimage.width = window.DOMimageNewWidth;
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height
            var imageWidth = window.DOMimage.width

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth - document.querySelector('div[class="sidebar"]').clientWidth;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.height = windowHeight;
                window.DOMimage.width = (windowHeight / imageHeight) * imageWidth;
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.width = windowWidth;
                window.DOMimage.height = (windowWidth / imageWidth) * imageHeight;
            }
            window.DOMimageNewHeight = window.DOMimage.height;
            window.DOMimageNewWidth = window.DOMimage.width;

            window.DOMimage.scrollIntoView(false);
        };
        document.querySelector('div[class="post"] a').removeAttribute('href')
        setTimeout(ResizeImage, 300);
        window.DOMimage.addEventListener('click', window.CheckClick);
        window.DOMimage.style.maxWidth = "1000%";

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("Nozomi Error: " + err);};
};

if (site == 'e621.net') {
    try {
        window.DOMimage = document.querySelector('#image');
        window.clickCount = 0;
        window.timeout = 400;
        window.CheckClick = function() {
            window.clickCount++;
            if (window.clickCount == 1) {
                setTimeout(function() {
                    var currentDOMimgHeight = window.DOMimage.height;
                    var currentDomimgWidth = window.DOMimage.width
                    if (window.clickCount == window.singleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight / imageDecreaseAmount;
                        window.DOMimage.width = currentDomimgWidth / imageDecreaseAmount;
                    } else if(window.clickCount == window.doubleClickAction) {
                        window.DOMimage.height = currentDOMimgHeight * imageIncreaseAmount;
                        window.DOMimage.width = currentDomimgWidth * imageIncreaseAmount;
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.height = window.DOMimageNewHeight;
                        window.DOMimage.width = window.DOMimageNewWidth;
                        window.DOMimage.scrollIntoView(false);
                    }
                    window.selectedPercentage = (100 / window.DOMimageNewHeight) * window.DOMimage.height;
                    window.clickCount = 0;
                }, window.timeout || 400);
            };
        };

        var ResizeImage = () => {
            var imageHeight = window.DOMimage.height;
            var imageWidth = window.DOMimage.width;

            var windowHeight = window.innerHeight;
            var windowWidth = document.querySelector('#image-container').clientWidth;

            // if image height is more than window but image width when recalculated is not bigger than the image container
            if (imageHeight > windowHeight && (windowHeight / imageHeight) * imageWidth < windowWidth ) {
                window.DOMimage.height = windowHeight;
                window.DOMimage.width = (windowHeight / imageHeight) * imageWidth;
                // if image width is more than image container but image height when recalculated is not bigger than the window
            } else if (imageWidth > windowWidth && (windowWidth / imageWidth) * imageHeight < windowHeight) {
                window.DOMimage.width = windowWidth;
                window.DOMimage.height = (windowWidth / imageWidth) * imageHeight;
            }
            window.DOMimageNewHeight = window.DOMimage.height;
            window.DOMimageNewWidth = window.DOMimage.width;

            window.DOMimage.scrollIntoView(false);
        };

        if (document.querySelector('#image-resize-link')) {
            document.querySelector('#image-resize-link').click(); // Get larger image if exists
        };

        setTimeout(ResizeImage, 200);
        window.DOMimage.addEventListener('click', window.CheckClick);
        window.DOMimage.style.maxWidth = "1000%";

        // Ensure page scrolls to image on refresh
        window.onbeforeunload = function () {
            window.DOMimage.scrollIntoView(false);
        };

    } catch(err) {console.log("e621 Error: " + err);};
};

function PercentageResize() {
    if (site == 'chan.sankakucomplex.com' || site == 'tbib.org' || site == 'safebooru.org' || site == 'rule34.xxx' || site == 'yande.re' || site == 'konachan.com' || site == 'drunkenpumken.booru.org' || site == 'rule34.paheal.net' || site == 'nozomi.la' || site == 'e621.net') {
        window.DOMimage.height = window.DOMimageNewHeight * (window.selectedPercentage / 100);
        window.DOMimage.width = window.DOMimageNewWidth * (window.selectedPercentage / 100);
    } else if (site == 'danbooru.donmai.us') {
        window.DOMimage.style.height = window.DOMimageNewHeight * (window.selectedPercentage / 100) + 'px'
        window.DOMimage.style.width = window.DOMimageNewWidth * (window.selectedPercentage / 100) + 'px'
    } else if (site == 'gelbooru.com'){
        window.DOMimage.style.width = window.DOMimageNewWidth * (window.selectedPercentage / 100) + 'px'
    };
};
