<?php
function imgupl(){
    $errors = array(0);
    $success = array(1);
    $errString = '';
    $target_dir = "../img/uploads/";
    $target_file = $target_dir . basename($_FILES["bimage"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimagesize($_FILES["bimage"]["tmp_name"]);
        if ($check !== false) {
            $uploadOk = 1;
        } else {
            array_push($errors, "File is not an image");
            $uploadOk = 0;
        }
    }
// Check if file already exists
    if (file_exists($target_file)) {
        array_push($errors, "File already exists");
        $uploadOk = 0;
    }
// Check file size < 200KB
    if ($_FILES["bimage"]["size"] > 200000) {
        array_push($errors, "File is too large.");
        $uploadOk = 0;
    }
// Allow certain file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif"
    ) {
        array_push($errors, "Wrong file type");
        $uploadOk = 0;
    }
// Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        foreach ($errors as $err => $err_value) {
            $errString = $errString . ' ' . $err_value;
        }
        return $errors;
// if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["bimage"]["tmp_name"], $target_file)) {
            array_push($success, $target_file);
            return $success;
        } else {
            //echo "Sorry, there was an error uploading your file.";
            array_push($errors,"There was an error uploading your file");
            return  $errors;
        }
    }
}
imgupl();
?>