// ==UserScript==
// @name        Universal Interactive Booru Image Resizer
// @namespace   Quin15
// @version     0.0.1
// @author      Quin15
// @downloadURL https://github.com/Quin15/userscripts/raw/master/universal-interactive-booru-image-resizer.js

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

//////////////////////////////////////////////////////////////////////////////////////

// Enable or disable this setting to check for ALT+R to change image size percentage
var CheckKeyPress = true; // 1 to enable, other to disable.

if (CheckKeyPress == true) {
    document.onkeydown = keydown;
};

//////////////////////////////////////////////////////////////////////////////////////

window.selectedPercentage = 100;
function keydown (evt) {
    if (!evt) evt = event;
    if (evt.altKey && evt.keyCode === 82) {
        var inputPercent = window.prompt("Resize image to input percentage", window.selectedPercentage.toFixed(2));
        if (parseFloat(inputPercent) > 0) {
            window.selectedPercentage = parseFloat(inputPercent);
        };
        PercentageResize();
    };
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.height = currentDOMimgHeight / 1.2;
                        window.DOMimage.width = currentDomimgWidth / 1.2;
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.height = currentDOMimgHeight * 1.2;
                        window.DOMimage.width = currentDomimgWidth * 1.2;
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.style.height = (window.DOMimage.style.height.replace('px', '') / 1.2) + "px";
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') / 1.2) + "px";
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.style.height = (window.DOMimage.style.height.replace('px', '') * 1.2) + "px";
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * 1.2) + "px";
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') / 1.2) + "px";
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * 1.2) + "px";
                    } else {
                        // Triple click - Revert image back to default new size
                        window.DOMimage.style.width = window.DOMimageNewWidth + 'px';
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

        document.querySelector('div[class="contain-push"] div:nth-child(2) a img').parentElement.parentElement.remove() // Remove random banner
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
                    var currentDomimgWidth = window.DOMimage.width
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.height = currentDOMimgHeight / 1.2;
                        window.DOMimage.width = currentDomimgWidth / 1.2;
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.height = currentDOMimgHeight * 1.2;
                        window.DOMimage.width = currentDomimgWidth * 1.2;
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.height = currentDOMimgHeight / 1.2;
                        window.DOMimage.width = currentDomimgWidth / 1.2;
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.height = currentDOMimgHeight * 1.2;
                        window.DOMimage.width = currentDomimgWidth * 1.2;
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.height = currentDOMimgHeight / 1.2;
                        window.DOMimage.width = currentDomimgWidth / 1.2;
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.height = currentDOMimgHeight * 1.2;
                        window.DOMimage.width = currentDomimgWidth * 1.2;
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
                    if (window.clickCount == 1) {
                        // Single click - Make image 1.2 times smaller
                        window.DOMimage.height = currentDOMimgHeight / 1.2;
                        window.DOMimage.width = currentDomimgWidth / 1.2;
                    } else if(window.clickCount == 2) {
                        // Double click - Make image 1.2 times larger
                        window.DOMimage.height = currentDOMimgHeight * 1.2;
                        window.DOMimage.width = currentDomimgWidth * 1.2;
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
        window.DOMimage.style.height = (window.DOMimage.style.height.replace('px', '') * 1.2) + "px";
        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * 1.2) + "px";
    } else if (site == 'gelbooru.com'){
        window.DOMimage.style.width = (window.DOMimage.style.width.replace('px', '') * 1.2) + "px";
    };
};
