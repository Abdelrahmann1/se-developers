<?php
// submit-sheet.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Only POST method allowed"]);
    exit;
}

// Get form data
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
// $email = trim($_POST['email'] ?? '');
$compound = trim($_POST['compound'] ?? '');

if (empty($name) || empty($phone) || empty($compound)) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// Your Google Apps Script Web App URL (keep this private!)
$scriptURL = "https://script.google.com/macros/s/AKfycby5io5W_E8_PHm9XkFC1JqX7LXiNTrNZMSe9Wnb9Jy38GyLxU6N4iSvjv2nb5Od120L/exec";

// Prepare data for Google Apps Script
$postData = http_build_query([
    'Name' => $name,
    'Phone' => $phone,
    'Compound' => $compound
]);

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $scriptURL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Only for debugging; remove in production
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Check response
if ($httpCode === 200 && !empty($response)) {
    // Optional: log response for debugging (to a file)
    // file_put_contents('gas_response.log', $response . "\n", FILE_APPEND);

    // Assume success if GAS returns 200
    echo json_encode(["success" => true]);
} else {
    error_log("GAS Error: HTTP $httpCode, Response: " . $response);
    echo json_encode(["success" => false, "error" => "Failed to submit data"]);
}
?>