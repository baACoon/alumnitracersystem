<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow all origins (you can restrict this to your React app's URL)

// Connect to the database
$db = mysqli_connect('localhost', 'root', '', 'alumni');
if (mysqli_connect_errno()) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Get the data sent from React
$tup_id = mysqli_real_escape_string($db, $_POST['tup_id']);
$password = mysqli_real_escape_string($db, $_POST['password']);
$birthdate = mysqli_real_escape_string($db, $_POST['birthdate']);

// Validation
if (empty($tup_id) || empty($password) || empty($birthdate)) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$password = md5($password); // Ensure this matches the registration encryption

// Check if the user exists
$query = "SELECT * FROM users WHERE tup_id='$tup_id' AND password='$password' AND birthdate='$birthdate'";
$results = mysqli_query($db, $query);

if (mysqli_num_rows($results) == 1) {
    $_SESSION['tup_id'] = $tup_id;
    echo json_encode(['success' => 'You are now logged in']);
} else {
    echo json_encode(['error' => 'Invalid TUP-ID/password combination']);
}
?>
