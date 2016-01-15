/**
 * Created by b12mac on 10/12/15.
 */
//jQuery('h1').css({'font-size':'4em'});
/*####################################################*/
/*#################### ng-app ########################*/
/*####################################################*/
var app = angular.module('cardMaster', []);
app.controller('cardMaster' , function($scope){

    //show hide comma if both values are present for city and postcode
    jQuery('#pc,#city').on('blur',function(){
        if(jQuery('#city').val().trim()!='' && jQuery('#pc').val().trim()!=''){
            $('.city.pc.pdata .comma').show();
        }else{
            $('.city.pc.pdata .comma').hide();
        }
    });
    jQuery('#tel,#mob').on('blur',function(){
        if(jQuery('#tel').val().trim()!='' && jQuery('#mob').val().trim()!=''){
            $('.tel.mob.pdata .comma').show();
        }else{
            $('.tel.mob.pdata .comma').hide();
        }
    });
    /*####################################################*/
    //file upload to background image
    function onChange(event) {
        jQuery('#xPos').val('0.1');
        jQuery('#yPos').val('0.1');
        jQuery('#logoSize').val('30').trigger('change');
        var file = event.target.files[0];
        var imageType = /(image\/jpeg|image\/jpg|image\/png|image\/svg|image\/gif)/;
        console.log(file.type);
        console.log(event.target.id);
        var elem = event.target.id;
        if (file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = function(event) {
                if(elem=='bimage'){
                    jQuery('.card-preview').css({'background':'url("'+reader.result+'") no-repeat center center','background-size':'cover'});
                }else{
                    jQuery('.companyLogo').css({'background':'url("'+reader.result+'") no-repeat center center','background-size':'cover'});
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
    $("#cardDetails").on('submit',(function(e) {
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
    }));
    /*####################################################*/
    //change x position of Logo
    jQuery('#xPos').off('change').on('change',function(e){
        jQuery('.companyLogo').css('left',jQuery(e.target).val()+'cm')
    });
    jQuery('#yPos').off('change').on('change',function(e){
        jQuery('.companyLogo').css('top',jQuery(e.target).val()+'cm')
    });
    jQuery('#logoSize').off('change').on('change',function(e){
        jQuery('.companyLogo').css({'width':jQuery(e.target).val()+'px','height':jQuery(e.target).val()+'px'})
    });
    /*####################################################*/
    //change text style
    jQuery('#fSize').off('change').on('change',function(e){
        jQuery('.personal-details').css('font-size',jQuery(e.target).val()+'px')
    });
    jQuery('#fColor').off('change').on('change',function(e){
        jQuery('.personal-details').css('color',jQuery(e.target).val())
    });
    jQuery('#fType').off('change').on('change',function(e){
        jQuery('.personal-details').css({'font-family':'"'+jQuery(e.target).val()+'"'})
    });

});
app.directive('cardPreview' , function(){
    return {
        restrict: 'EAC',
        template: ''
    }
});
/*####################################################*/
/*################# END ng-app #######################*/
/*####################################################*/