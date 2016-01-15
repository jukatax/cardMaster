<?php
function imgupl(){
    $errors = array();
    $success = array();
    $errString = '';
    $succString='';
    $target_dir = "img/uploads/";
    if($_FILES["bimage"]){
    $target_file = $target_dir . basename($_FILES["bimage"]["name"]);
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    }
    if($_FILES["cimage"]){
        $target_file2 = $target_dir . basename($_FILES["cimage"]["name"]);
        $imageFileType2 = pathinfo($target_file2, PATHINFO_EXTENSION);
    }
    $uploadOk = 1;

// Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {

        $check = $_FILES["bimage"]?getimagesize($_FILES["bimage"]["tmp_name"]):getimagesize($_FILES["cimage"]["tmp_name"]);
        if ($check !== false) {
            $uploadOk = 1;
        } else {
            array_push($errors, "File is not an image");
            $uploadOk = 0;
        }
    }
// Check if file already exists
    if (file_exists($target_file) || file_exists($target_file2)) {
        array_push($errors, "File already exists");
        $uploadOk = 0;
    }
// Check file size < 200KB
    if (($_FILES["bimage"]&&$_FILES["bimage"]["size"] > 2000000) || ($_FILES["cimage"]&&$_FILES["cimage"]["size"] > 2000000) ) {
        array_push($errors, "File is too large.");
        $uploadOk = 0;
    }
// Allow certain file formats
    if (($imageFileType && $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif")||($imageFileType2 && $imageFileType2 != "jpg" && $imageFileType2 != "png" && $imageFileType2 != "jpeg"
            && $imageFileType2 != "gif")
    ) {
        array_push($errors, "Wrong file type");
        $uploadOk = 0;
    }
// Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        foreach ($errors as $err => $err_value) {
            $errString = $errString . ' ' . $err_value;
        }
        echo $errString;
// if everything is ok, try to upload file
    } else {
        if (($_FILES["bimage"] && move_uploaded_file($_FILES["bimage"]["tmp_name"], $target_file))||( $_FILES["cimage"] && move_uploaded_file($_FILES["cimage"]["tmp_name"], $target_file2)) ) {
            if($_FILES["bimage"]){array_push($success, 'bimage:'.$target_file);}
            if($_FILES["cimage"]){array_push($success, 'cimage:'.$target_file2);}
            foreach ($success as $s => $s_value) {
                $succString = $succString.''.$s_value.'|';
            }
            echo $succString;
        } else {
            //echo "Sorry, there was an error uploading your file.";
            array_push($errors,"There was an error uploading your file");
            echo $errString;
        }
    }
}
imgupl();
?>