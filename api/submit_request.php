<?php
// api/submit_request.php

// Allow requests from any origin (for development). 
// For production, you should restrict this to your frontend's domain.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database connection
require_once 'config.php';

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// -- VALIDATION (Simple validation, consider more robust validation for production) --
if (
    empty($data->prefix) ||
    empty($data->firstName) ||
    empty($data->lastName) ||
    empty($data->nationalId) ||
    empty($data->position) ||
    empty($data->department) ||
    empty($data->phone) ||
    empty($data->email) ||
    empty($data->purpose) ||
    !isset($data->quantity) ||
    empty($data->deliveryMethod)
) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Incomplete data provided."]);
    exit();
}

// -- PREPARE DATA --
$request_number = "REQ-" . time(); // Generate a unique request number
$submission_date = date('Y-m-d H:i:s');
$initial_status = 'pending';

// Sanitize and assign variables
$prefix = $mysqli->real_escape_string($data->prefix);
$other_prefix = isset($data->otherPrefix) ? $mysqli->real_escape_string($data->otherPrefix) : null;
$first_name = $mysqli->real_escape_string($data->firstName);
$last_name = $mysqli->real_escape_string($data->lastName);
$national_id = $mysqli->real_escape_string($data->nationalId);
$position = $mysqli->real_escape_string($data->position);
$department = $mysqli->real_escape_string($data->department);
$phone = $mysqli->real_escape_string($data->phone);
$email = $mysqli->real_escape_string($data->email);
$purpose = $mysqli->real_escape_string($data->purpose);
$quantity = intval($data->quantity);
$delivery_method = $mysqli->real_escape_string($data->deliveryMethod);
$shipping_address = ($delivery_method === 'postal' && isset($data->shippingAddress)) ? $mysqli->real_escape_string($data->shippingAddress) : null;

// -- DATABASE INSERTION using PREPARED STATEMENTS --

// Start transaction
$mysqli->begin_transaction();

try {
    // 1. Insert into `requests` table
    $sql1 = "INSERT INTO requests (request_number, submission_date, status, prefix, other_prefix, first_name, last_name, national_id, position, department, phone, email, purpose, quantity, delivery_method, shipping_address, last_updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt1 = $mysqli->prepare($sql1);
    if ($stmt1 === false) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }

    $updatedBySystem = 'System';
    $stmt1->bind_param("sssssssssssssisss", 
        $request_number, $submission_date, $initial_status, $prefix, $other_prefix, $first_name, $last_name, $national_id, 
        $position, $department, $phone, $email, $purpose, $quantity, $delivery_method, $shipping_address, $updatedBySystem
    );

    if (!$stmt1->execute()) {
        throw new Exception("Execute failed: " . $stmt1->error);
    }
    
    // Get the ID of the newly inserted request
    $request_id = $mysqli->insert_id;
    $stmt1->close();

    // 2. Insert into `status_history` table
    $sql2 = "INSERT INTO status_history (request_id, status, date, updated_by) VALUES (?, ?, ?, ?)";
    
    $stmt2 = $mysqli->prepare($sql2);
    if ($stmt2 === false) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    
    $stmt2->bind_param("isss", $request_id, $initial_status, $submission_date, $updatedBySystem);

    if (!$stmt2->execute()) {
        throw new Exception("Execute failed: " . $stmt2->error);
    }
    $stmt2->close();
    
    // If everything is fine, commit the transaction
    $mysqli->commit();

    // -- SEND SUCCESS RESPONSE --
    http_response_code(201); // Created
    echo json_encode([
        "status" => "success", 
        "message" => "Request submitted successfully.",
        "requestNumber" => $request_number
    ]);

} catch (Exception $e) {
    // If any query fails, rollback the transaction
    $mysqli->rollback();
    
    // -- SEND ERROR RESPONSE --
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "status" => "error", 
        "message" => "Database error: " . $e->getMessage()
    ]);
}

// Close connection
$mysqli->close();
?>