/*!
 * VERSION: 1.0.0
 * DATE: 2019-5-31
 *
 * @license Copyright (c) 2019, Quickoffice. All rights reserved.
 * 
 * @author: Inioluwa Sogelola, inioluwwa4.is@gmail.com
 */
'use strict';


var Quickoffice = function () {},
    mydata = [],
    images = [],
    saving,
    saved,
    title = [],
    $ = $,
    doc = this.document,
    p = Quickoffice.prototype;
p.constructor = Quickoffice;
Quickoffice.version = "1.0.0";

//Checks and calls each input field
p.controller = function (vars) {
    var vars = vars = $(vars);
    //    jQuery Compatibility check
    if (typeof $ != "undefined") {
        //        checks if HTML element is found
        if (vars.length > 0) {
            //            Initializes the first Input as Title
            nextInput(vars, "Title goes here", "text")

            vars.focusin(function (e) {
                //                    Get Index of focused/present input field

                var elementIndex = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);

                //                    Sets the placeholder of the next input field to content
                if (typeof $(e.target.parentElement).next().val() == "undefined") {
                    nextInput(vars, "Content", "text", elementIndex, e)
                }
            })
            //            When User inputs chars
            vars.keyup(function (e) {
                //                returns if User as inputed a value
                if (e.target.parentElement.querySelector('textarea').value.length >= 1) {
                    //                    Get Index of focused/present input field

                    if (e.keyCode) {
                        var elementIndex = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);

                        //                    Sets the first Input field with Header tag for titles
                        if (elementIndex == 0) {
                            let str = "<h1>" + e.target.value.toString() + "</h1>";
                            saveChanges(title, elementIndex, str.replace(/(?:\r\n|\r|\n)/g, '<br>'), 1);
                        } else {
                            if (e.target.id !== "video-embedded") {
                                let str = "<p>" + e.target.value.toString() + "</p>";
                                saveChanges(mydata, elementIndex, str.replace(/(?:\r\n|\r|\n)/g, '<br>'), 1);
                            } else {
                                let str = e.target.value.toString();
                                saveChanges(mydata, elementIndex, str.replace(/(?:\r\n|\r|\n)/g, '<br>'), 1);
                            }

                        }
                        //                    Sets the placeholder of the next input field to content
                        if (typeof $(e.target.parentElement).next().val() == "undefined") {
                            nextInput(vars, "Content", "text", elementIndex, e)
                        }
                    }
                }
                //                returns if input field is empty
                else if (e.target.value.length < 1) {

                    var elementIndex = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentElement);

                    //                    Sets the first Input field with Header tag for 
                    if (elementIndex == 0) {
                        let str = "<h1>" + e.target.value.toString() + "</h1>"
                        saveChanges(title, elementIndex, str.replace(/(?:\r\n|\r|\n)/g, '<br>'), 1);
                    } else {
                        var length = mydata.length;
                        let str = "<p>" + e.target.value.toString() + "</p>"

                        mydata.splice(elementIndex - 1, 1, '');
                        saveChanges(mydata, elementIndex, "", 1);
                        saveChanges(mydata, length, null, 0);
                    }
                }
            })

        } else {
            throw new ReferenceError("HTML element not found")
        }
    } else {
        throw new ReferenceError("jQuery is required")
    }
};
p.fetchInputData = function () {
    return {
        title: title[0],
        content: mydata.join(" ").toString(),
        getImagePath: (function(){
            
                var formdata = new FormData();

                    for(var i = 0; i < images.length; i++){
                    formdata.append('image[]', images[i]);   
                } 
            return formdata;
        })(),
    }
};
p.fetch = (url, type, data) => {
    return new Promise((resolve, reject) => {

        jQuery.ajax({
            type: type,
            url: url,
            data: data,
            contentType: false,
            processData: false,
            cache: false,
            success: function (response) {
                return resolve(response);
            },
            error: function (_, e, response) {
                if (response == 'Not Found') {
                    throw new ReferenceError('could not ' + type.toLowerCase() + ' data. ');
                }
            }


        })
    })
};
p.getImages = () => {

}

//Load new input container
function nextInput(vars, title, inputType, elementindex, root) {
    let i = 0;
    var inputfield = doc.createElement('textarea'); /*Create input field*/
    var outerdiv = doc.createElement('div'); /*Create input field*/
    outerdiv.classList = "outerdiv";
    var type = doc.createAttribute('type');
    type.value = inputType;
    inputfield.setAttributeNode(type); /*Set input type value*/
    inputfield.placeholder = title; /*Set placeholder value*/
    inputfield.classList = "inputfield"; /*Set class value*/
    outerdiv.append(inputfield) || outerdiv.appendChild(inputfield);
    vars.append(outerdiv) || vars.append(outerdiv);

    //    For input fields with content placeholders
    if (title == "Content") {
        i++;
        if (i > 0) {
            var input = doc.createElement('input'); /*Create input field*/
            var inputtype = doc.createAttribute('type');
            var inputname = doc.createAttribute('name');
            var accept = doc.createAttribute('accept');
            inputtype.value = 'file';
            inputname.value = 'image' + elementindex;
            accept.value = "image/x-png,image/gif,image/jpeg";
            input.setAttributeNode(accept); /*Set input accept type */
            input.setAttributeNode(inputtype); /*Set input file type value*/
            input.setAttributeNode(inputname); /*Set input file name value*/
            input.classList = "inputfield cam"; /*Set class value*/

            outerdiv.append(input) || outerdiv.appendChild(input);

            outerdiv.append(init_button(vars, elementindex));
            outerdiv.append(init_closebutton(vars));


            var img = doc.createElement('img');
            outerdiv.append(img);

            for (let j = 0; j < $('.more-btn').length; j++) {
                //                Click on  the more button
                let clicked = false;
                ($('.more-btn')[j]).addEventListener('click', function (e) {

                    var opt = e.target.parentElement.querySelector('.options');
                    var inputouterdiv = e.target.parentElement.parentElement;
                    if (!clicked) {
                        $(e.target.parentElement.parentElement).addClass('clicked');
                        $(opt).addClass('active');

                        var cameraBtn = e.target.parentElement.querySelector('.camera'),
                            playBtn = e.target.parentElement.querySelector('.play');

                        //                        Upload an image
                        cameraBtn.querySelector('.fa').addEventListener('click', function (e) {


                            //                           set id of input when upload image button is click
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').id = Array.from(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children).indexOf(e.target.parentElement.parentNode.parentNode.parentNode);
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').style.display = 'none';

                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').style.display = 'block';
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').style.visibility = 'visible';
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').value = "";

                            getImage(mydata, elementindex, e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input'));

                            if (typeof e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').files[0] !== "undefined") {
                                img.src = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').files[0].name;
                                clicked = !clicked;
                            }
                            $(opt.parentElement.parentElement).removeClass('embedded');
                            $(opt.parentElement.parentElement).removeClass('clicked');
                            $(opt).removeClass('active');

                        });

                        //                        Click on play
                        playBtn.querySelector('.fa').addEventListener('click', function (e) {

                            $(e.target.parentElement.parentElement.parentElement.parentElement.parentElement).removeClass('clicked');

                            //                            remove active class from options
                            $(opt).removeClass('active');

                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').style.display = 'block';
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').value = "";
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').id = "video-embedded";
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector('textarea').placeholder = "Paste a YouTube, Vine or other video link";

                            $(e.target.parentElement.parentElement.parentElement.parentElement).addClass('embedded');
                            if (typeof e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').files[0] !== "undefined") {
                                img.src = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('input').files[0].name;
                                e.target.parentElement.parentElement.parentElement.parentElement.append(img);
                            }
                        });
                        clicked = !clicked;
                    } else {
                        $(opt.parentElement.parentElement).removeClass('embedded');
                        $(opt.parentElement.parentElement).removeClass('clicked');
                        $(opt).removeClass('active');
                        opt.parentElement.parentElement.querySelector('textarea').style.display = 'block';
                        opt.parentElement.parentElement.querySelector('textarea').id = '';
                        opt.parentElement.parentElement.querySelector('textarea').value = '';
                        mydata.splice(Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode) - 1, 1, '');
                        opt.parentElement.parentElement.querySelector('textarea').placeholder = 'Content';

                        opt.parentElement.parentElement.querySelector('input').style.display = 'none';
                        opt.parentElement.parentElement.querySelector('input').style.visibility = 'hidden';
                        clicked = !clicked;

                    }

                });
            }
            for (let j = 0; j < $('.close-btn').length; j++) {
                ($('.close-btn')[j]).addEventListener('click', function (e) {
                    if (typeof ($(e.target.parentElement).prev()[0]) !== "undefined") {

                        var elementIndex = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentElement);

                        if (($(e.target.parentElement).prev()[0]).querySelector('textarea').getAttribute('placeholder') == 'Content') {
                        }
                        var div = ($(e.target.parentElement.parentElement)[0]).querySelectorAll('.outerdiv');
                        var divLength = div.length;



                        for (let i = 1; i < divLength; i++) {
                            if (($(e.target.parentElement).next()[0])) {
                                if (i > 1) {
                                    (div[i]).querySelector('input').setAttribute('id', i - 1);
                                    (div[i]).querySelector('.camera').setAttribute('for', i - 1);
                                    (div[i]).querySelector('.camera').setAttribute('for', i - 1);
                                    (div[i]).querySelector('.play').setAttribute('for', i - 1);
                                }
                            }
                        }
                        ($(e.target.parentElement).prev()[0]).querySelector('textarea').focus();

                        if (typeof (e.target.parentElement.querySelector("input").files[0]) != "undefined") {
                            _deleteImages(e.target.parentElement.querySelector("input").files[0]);
                        }
                        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
                        mydata.splice(elementIndex - 1, 1);

                    }
                })
            }
        }
    }
}

function htmlspecialchars(text) {
    if (typeof text == 'string') {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    } else {
        throw new TypeError('htmlspecialchars expects a string, ' + typeof text + ' given.');
    }
}
//Left add button
function init_button(vars, index) {
    var icons = [["camera", "fa fa-camera"], ["play", "fa fa-play"]];
    var outerDiv = (vars[0]).querySelector('.outerdiv'),
        more = doc.createElement('div'),
        options = doc.createElement('div'),
        moreContainer = doc.createElement('div');
    moreContainer.classList = 'more-container';
    more.classList = 'more-btn';
    options.classList = 'options';
    for (var i = 0; i < icons.length; i++) {
        var fa = doc.createElement('i');
        var forattr = doc.createAttribute('for');
        forattr.value = index + 1;
        var label = doc.createElement('label');
        label.setAttributeNode(forattr);
        label.classList = icons[i][0];
        fa.classList = icons[i][1];
        label.append(fa);
        options.append(label);
    }
    moreContainer.append(more);
    moreContainer.append(options);
    return moreContainer;
}
//add close button
function init_closebutton(vars) {
    var outerDiv = (vars[0]).querySelector('.outerdiv'),
        more = doc.createElement('div');
    more.classList = 'close-btn';
    return more;
}

function init_inputValue(vars) {
    return vars
}

function saveChanges(mydata, elementIndex, target, start) {
    var promise = new Promise((resolve, reject) => {
        mydata.splice(elementIndex - start, 1, target);
        resolve('Saved');
        saving = 'saving...';
    });
    promise.then((resolve) => {
        saved = resolve;
    });
}

function getImage(mydata, elementIndex, p) {
    $(p).change(function (e) {

        var id = ($(p)[0]).getAttribute('id');
        saveChanges(mydata, id, "<img src = '" + p.files[0].name.toString() + "'/>", 1);
        _getImages(p.files[0]);
    })
}

function _getImages(value) {

    var n = 0;
    if (typeof mydata != "null" || typeof mydata != "undefined" || typeof mydata != null) {
        for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].toString().split("<img src =", 1).join(" ").length < 1) {
                if (mydata[i].toString().split("<img src = '" + value.name.toString() + "'/>", 1).join(" ").length < 1) {
                    images.splice(n, 1, value);
                }
                n++;
            }
        }
    }
}

function _deleteImages(value) {

    var j = 0;
    for (let i = 0; i < mydata.length; i++) {
        if (mydata[i].toString().split("<img src =", 1).join(" ").length < 1) {
            
            if (mydata[i].toString() == "<img src = '" + value.name.toString() + "'/>") {
                images.splice(j, 1);
            }
            j++;
        }
    }
}
