# quickoffice
Quickoffice is Javascript library for quick Content creation for blogs, and other forms of content creation. Quickoffice makes it alot easier to create contents for publishing. It supports images, embedded links, and texts.

### Getting started

- Simply add jQuery, fontawesome to your project before Quickoffice.js
- Add Quickoffice stylesheet
- Initialize Quickoffice class
var quickoffice = new Quickoffice;

- Set the Controller to an empty HTML element
quickoffice.controller(:HTMLElement)

- And thats it, you have set up your Quickoffice editor :+1:

## Methods and Objects

- `controller(HTMLElement)`            
- `fetchInputData()`
- `fetch(url:String, method:String, data:Array:String)`

### Method description and use

- `controller()`
    This accepts the html element to append Quickoffice editor

- `fetchInputData()`
    This returns 3 objects;
    `getImagePath`: This returns an array of path to all images set in the editor
    `content`: This returns an array of HTML element of all the content created in the editor (note this does not return the title heading)
    `title`: This returns the title of the content set in the editor

- `fetch()`
    This is an ajax request that accepts 3 parameters and returns a promise
    - url: The url to the file that controls the uploading of data returned from the `fetchInputData()` method.
    - method: This specifies whether `POST` or `GET` request.
    - data: This sends data to the url.

 ### Working example

 HTML
 ```
    <head>
        <meta charset="utf-8"/>
        <title></title>
        <link rel="stylesheet" href="quickoffice-1.0.0/css/quickoffice.min.css" type="text/css">
        <link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css"/>
    </head>
    <body>
        <form class="quickoffice-wrapper" enctype="multipart/form-data" method="post">
            <div class="quickoffice"></div>
            <button class="quickoffice-btn">Submit</button>
        </form>
        <script src = "jquery-3.2.1.min.js"></script>
        <script src="quickoffice-1.0.0/js/quickoffice.min.js"></script>
     </body>
 
 ```
 Javascript
 ```
 // select the html element
 let office = $('quickoffice');
 let btn = $('.quickoffice-btn');
 var quickoffice = new Quickoffice();
 quickoffice.controller(office);
 // submit the form
 btn.click(function(e){
    e.preventDefault();
    var images = quickoffice.fetchInputData().getImagePath;
    quickoffice.fetch("http://www.example.com/upload.php", "post",images).then((resp)=>{
        console.log(resp);
    });
               
 })
 ```