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
    $('#pc,#city').on('blur',function(){
        if($('#city').val()!='' && $('#pc').val()!=''){
            $('.comma').show();
        }else{
            $('.comma').hide();
        }
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