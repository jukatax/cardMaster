/*####################################################*/
/*#################### ng-app ########################*/
/*####################################################*/
var app = angular.module('cardMaster', []);
app.controller('cardMaster' , function($scope){
    $scope.mobile = navigator.userAgent.match(/(mobile|iphone|ipad|x11|samsung)/i)?true:false;
    $scope.logo='';
    $scope.textLeft=6;
    $scope.textTop=10;
    $scope.fxPos=10;
    $scope.fyPos=50;
    $scope.showPrint = false;
    $scope.hideSettings = false;
    $scope.back = false;
    $scope.print = true;
    $scope.backgroundImage='';
    $scope.logoImage='';
    $scope.bImage = '';
    $scope.rotateBtn = false;
    $scope.bckrndRemove = false;
    $scope.printMe = function(){
        for(var i=0;i<8;i++){
            jQuery('.main-right .card-preview').clone().appendTo('#printingContainer .row');
        }
        $scope.showPrint = true;
        $scope.hideSettings = true;
        $scope.back = true;
        $scope.print = false;
    };
    $scope.settings = function(){
        $scope.showPrint = false;
        $scope.hideSettings = false;
        $scope.back = false;
        $scope.print = true;
        jQuery('#printingContainer .row').html('');
    };
    $scope.clearVal = function(a){
        jQuery('#'+a).val('');
        if(a.match('cimage')){
            jQuery('.companyLogo').css({'background-image':'none','background-attachment':'none'});
                $scope.logoImage = '';
                $scope.rotateBtn = false;
        }else{
            jQuery('.card-preview').css({'background-image':'','background-attachment':'none'});
                $scope.backgroundImage='';
                $scope.bckrndRemove = false;
        }
    };
    /*####################################################*/
    //file upload to background image
    function onChange(event) {
        jQuery('#xPos').val('0.1');
        jQuery('#yPos').val('0.1');
        var file = event.target.files[0];
        var imageType = /(image\/jpeg|image\/jpg|image\/png|image\/svg|image\/gif)/;
        console.log('File type: '+file.type+'\nFile size is: '+file.size+'\nFile name is: '+file.name+'\n');
        var elem = event.target.id;
        if (file.type.match(imageType) && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var contents = event.target.result; //most useful for text files
                if(elem=='bimage'){
                    $scope.backgroundImage = reader.result;
                    jQuery('.card-preview').css({'background':'url("'+reader.result+'") no-repeat center center','background-size':'cover','background-color':$scope.backgroundColor}).attr('data-img' , reader.result);
                    //$scope.$emit('imageChanged' , 'bimage');
                    $scope.$apply(function(){
                        $scope.bckrndRemove = true;
                        $scope.backgroundImage=reader.result;
                    });
                    $scope.bckrndRemove = true;
                    //$scope.backgroundImage=reader.result;
                }else{
                    jQuery('.companyLogo').css({'background':'url("'+reader.result+'") no-repeat center center','background-size':'cover'}).attr('data-img' , reader.result);
                    $scope.$emit('imageChanged' , 'cimage');
                    $scope.$apply(function() {
                        $scope.rotateBtn = true;
                        $scope.logoImage = reader.result;
                    });
                }
            };
            reader.readAsDataURL(file);
        }else{
            jQuery(event.target).val('');
            jQuery(event.target).parent().children('.imageError').fadeIn( 500 ).delay( 2000 ).fadeOut( 500 );
        }
    }
    jQuery('#bimage,#cimage').off('change').on('change',function(e){ onChange(e); });
    /*####################################################*/
    //form submit to ajax php
    /*$("#cardDetails").on('submit',(function(e) {
        e.preventDefault();
        $('#loading').show();
        $.ajax({
            url: "fileupload.php", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false
            success: function(data)   // A function to be called if request succeeds
            {
                $('#loading').hide();
                $("#message").html(data);
            }
        });
    }));*/



    /*####################################################*/
    //fix width of input suffix labels

});
/*app.directive('ngPrinter' , function(){
    return {
        restrict: 'A',
        controller : 'cardMaster',
        link: function(scope, element, attr, ctrl){
            //*####################################################*!/
            //*################# Handle PDF #######################*!/
            //*####################################################*!/
            var doc = new jsPDF();
            var specialElementHandlers = {
                '#editor': function (element, renderer) {
                    return true;
                }
            };

            $('.print').click(function () {
                scope.printMe();
                doc.fromHTML($('#printingContainer .row').html(), 15, 15, {
                    'width': 170,
                    'elementHandlers': specialElementHandlers
                });
                doc.save('sample-file.pdf');
            });
            //*####################################################*!/
            //*####################################################*!/
            //*####################################################*!/

        }
    }
});*/
app.directive('myDraggable', ['$document', function($document) {
    return {
        restrict : "A",
        controller : 'cardMaster',
        link: function (scope, element, attr, ctrl) {
            var startX = 0, startY = 0, x = 0, y = 0;


            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                if(element.attr('class').match(/moveTextWrapper/i)) {
                    scope.$apply(function () {
                        scope.textLeft = x;
                        scope.textTop = y;
                    });
                }else{
                element.css({
                    top: y + 'px',
                    left: x + 'px',
                    'border-radius': scope.bradius,
                    'background' : 'url('+scope.logoImage+') no-repeat center center' //if image has been rotated keep the rotated one
                });
                    scope.$apply(function () {
                        scope.xPos = x;
                        scope.yPos = y;
                    });
                }
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        }
    };
}]);
//*#####################################################################*!/
//*################## rotater for background image #####################*!/
//*#####################################################################*!/
app.directive('rotater', ['$document', function($document) {
    return {
        restrict : "A",
        controller : 'cardMaster',
        link: function (scope, element, attr, ctrl) {
            var angleInDegrees;
            //create temp canvas
            var canvas = document.createElement('canvas');
            canvas.width = element.width;
            canvas.height = element.height;
            var ctx = canvas.getContext('2d');

            //create temp image
            var image=document.createElement("img");
            image.setAttribute('crossOrigin' , 'Anonymous');
            image.onload=function(){
                ctx.drawImage(image,canvas.width/2-image.width/2,canvas.height/2-image.width/2);
            };
            scope.$on('imageChanged' , function(e,target){
                console.log('#### data-img changed ####',target);
                image.src = jQuery(element).attr('data-img');
                canvas.width = image.width;
                canvas.height = image.height;
                angleInDegrees=0;
                jQuery(window).trigger('getres');
            });

            scope.rotater = function(target){
                angleInDegrees=90;
                drawRotated(angleInDegrees , target);
            };

            function drawRotated(degrees , target){
                ctx.clearRect(0,0,image.width,image.height);
                ctx.save();
                ctx.translate(canvas.width/2,canvas.height/2);
                ctx.rotate(degrees*Math.PI/180);
                ctx.drawImage(image,-image.width/2,-image.width/2);
                ctx.restore();
                //update the image
                setTimeout(function(){
                    image.setAttribute( 'src' , canvas.toDataURL() );
                    element.attr('data-img' , canvas.toDataURL());
                    element.css({'background-image':'url('+canvas.toDataURL()+')' , 'background' : 'url('+canvas.toDataURL()+') no-repeat center center','background-size':'cover'});

                    scope.$apply(function(){
                        scope.logoImage = canvas.toDataURL();
                    });

                } , 500);
            }

        }
    };
}]);
/*####################################################*/
/*################# END ng-app #######################*/
/*####################################################*/

jQuery('document').ready(function(){
    jQuery('body').removeClass('hideMe');
    /*####################################################*/
    /*####################################################*/
    //fix width of input labels
    var lblWidths = [];
    jQuery('.input-group-addon.lbl').each(function(ind,elem){
        lblWidths.push(jQuery(elem).width());
    });
    lblWidths.sort(function(a, b){return b-a});
    jQuery('.input-group-addon.lbl').width(lblWidths[0]);
    //fix elem height of two main boxes
    jQuery(window).on('resize getres' , function(){
        jQuery('.main-left').outerHeight()>jQuery('.main-center').outerHeight()?jQuery('.main-center,.main-right').outerHeight(jQuery('.main-left').outerHeight()):jQuery('.main-left,.main-right').outerHeight(jQuery('.main-center').outerHeight());
    }).trigger('getres');

});