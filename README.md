Universal Interactive Booru Image Resizer
=========================================

**Disclaimer:** This code is messy. It has a bunch of duplicate code. It's not pretty, but it works fine. I made this for myself by myself without the intention of putting it out there, but I thought others may find this useful.

About
--------
This is a script that resizes images on booru sites to exactly fit the clients window, on either width or height whilst keeping the original image proportions. It then grants the user the ability to zoom in or out however much they want using simple mouse clicks or taps. It also allows users to resize images to exact decimal percentages. More info on the user actions below.


Websites
--------

  * ![Image](https://chan.sankakucomplex.com/favicon.ico "icon") chan.sankakucomplex.com
  * ![Image](https://danbooru.donmai.us/favicon.ico "icon") danbooru.donmai.us
  * ![Image](https://gelbooru.com//favicon.ico "icon") gelbooru.com
  * ![Image](https://safebooru.org/favicon.ico "icon") safebooru.org
  * ![Image](https://tbib.org//favicon.ico "icon") tbib.org
  * ![Image](https://nozomi.la//favicon.ico "icon") nozomi.la
  * ![Image](https://rule34.xxx/favicon.ico "icon") rule34.xxx
  * ![Image](https://rule34.paheal.net//favicon.ico "icon") rule34.paheal.net
  * ![Image](https://yande.re/favicon.ico "icon") yande.re
  * <img src="https://konachan.com/favicon.ico" width="16"> konachan.com
  * ![Image](https://e621.net//favicon.ico "icon") e621.net
  * ![Image](https://drunkenpumken.booru.org/favicon.ico "icon") drunkenpumken.booru.org
  
  Interactability 
  -----------
<table>
<thead>
  <tr>
    <th>Action</th>
    <th>Result</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Single Click</td>
    <td>Change image size (default: Decrease by 1.2x)</td>
  </tr>
  <tr>
    <td>Double Click</td>
    <td>Change image size (default: Increase by 1.2x)</td>
  </tr>
  <tr>
    <td>Triple Click</td>
    <td>Reset zoom to 100% and realign image</td>
  </tr>
  <tr>
    <td>ALT + R</td>
    <td>Prompt to manually change zoom level percentage</td>
  </tr>
</tbody>
</table>

  User Settings 
  -----------
 <table>
<thead>
  <tr>
    <th>Setting</th>
    <th>Default Value</th>
    <th>Explanation</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>CheckKeyPress</td>
    <td>true</td>
    <td>Enables or disables the checking of the key presses for the percentage prompt. Disabling this setting means you can no longer set an exact image size</td>
  </tr>
  <tr>
    <td>imageDecreaseAmount</td>
    <td>1.2</td>
    <td>Decreases the image by x amount on the increase image click event</td>
  </tr>
  <tr>
    <td>imageIncreaseAmount</td>
    <td>1.2</td>
    <td>Increases the image by x amount on the increase image click event</td>
  </tr>
  <tr>
    <td>singleClickDecrease</td>
    <td>true</td>
    <td>Single clicking an image will decreases it's size and double clicking will increase its size. Change this setting to false to flip this behaviour</td>
  </tr>
  <tr>
    <td>KeyControl</td>
    <td>['Alt', 'r']</td>
    <td>Determines which keys will activate prompt for image resizing. For example: ['Alt', 'Control', 'q'] for Alt+Ctrl+Q. If yopu're not sure what the keycode for a certain key is check using https://keycode.info/ then copy "event.key"</td>
  </tr>
</tbody>
</table>
