<?php
// api/submit_request.php

// Log entry point
error_log("submit_request.php accessed at " . date('Y-m-d H:i:s'));

// No auth_check here, assuming this is a public endpoint
require_once 'config.php'; // Use require_once
error_log("config.php included successfully."); // Log after include

$raw_data = file_get_contents("php://input");
error_log("Raw input data: " . $raw_data); // Log raw input
$data = json_decode($raw_data);

// Check if JSON decoding was successful
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    error_log("Failed to decode JSON input: " . json_last_error_msg());
    send_json_response(["status" => "error", "message" => "Invalid JSON input."], 400);
}
error_log("JSON decoded successfully."); // Log successful decode

// Basic Validation - More specific validation recommended
// ... (validation code remains the same) ...
if (
    !isset($data->prefix) || !is_string($data->prefix) ||
    !isset($data->firstName) || !is_string($data->firstName) || empty(trim($data->firstName)) ||
    !isset($data->lastName) || !is_string($data->lastName) || empty(trim($data->lastName)) ||
    !isset($data->nationalId) || !is_string($data->nationalId) || !preg_match('/^\d{13}$/', $data->nationalId) ||
    !isset($data->position) || !is_string($data->position) || empty(trim($data->position)) ||
    !isset($data->department) || !is_string($data->department) || empty(trim($data->department)) ||
    !isset($data->phone) || !is_string($data->phone) || !preg_match('/^\d{10}$/', $data->phone) ||
    !isset($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL) ||
    !isset($data->purpose) || !is_string($data->purpose) || empty(trim($data->purpose)) ||
    !isset($data->quantity) || !is_numeric($data->quantity) || intval($data->quantity) < 1 ||
    !isset($data->deliveryMethod) || !in_array($data->deliveryMethod, ['pickup', 'postal', 'email']) ||
    ($data->deliveryMethod === 'postal' && (!isset($data->shippingAddress) || empty(trim($data->shippingAddress))))
) {
    error_log("Validation failed."); // Log validation failure
    send_json_response(["status" => "error", "message" => "Incomplete or invalid data provided."], 400);
}
error_log("Validation passed."); // Log validation success

// Assign variables (consider using filter_var for sanitization if needed, though prepared statements help)
// ... (variable assignment remains the same) ...
$requestNumber = "REQ-" . time() ."-". random_int(100,999);
$submissionDate = date('Y-m-d H:i:s');
$initialStatus = 'pending';
$updatedBySystem = 'System';
$prefix = $data->prefix;
$otherPrefix = ($prefix === 'อื่นๆ' && isset($data->otherPrefix)) ? trim($data->otherPrefix) : null;
$firstName = trim($data->firstName);
$lastName = trim($data->lastName);
$nationalId = $data->nationalId;
$position = trim($data->position);
$department = trim($data->department);
$phone = $data->phone;
$email = $data->email;
$purpose = trim($data->purpose);
$quantity = intval($data->quantity);
$deliveryMethod = $data->deliveryMethod;
$shippingAddress = ($deliveryMethod === 'postal') ? trim($data->shippingAddress) : null;

// Use global $conn from config.php
global $conn;
error_log("Database connection object obtained."); // Log DB connection check

// Start transaction
if (!$conn->begin_transaction()) {
     error_log("Failed to begin transaction: " . $conn->error);
     handle_error("Failed to begin transaction", $conn);
}
error_log("Transaction started."); // Log transaction start

try {
    // 1. Insert into `requests` table using Prepared Statements
    error_log("Preparing statement for requests table..."); // Log before prepare
    $sql1 = "INSERT INTO requests (requestNumber, submissionDate, status, prefix, otherPrefix, firstName, lastName, nationalId, position, department, phone, email, purpose, quantity, deliveryMethod, shippingAddress, lastUpdatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt1 = $conn->prepare($sql1);
    if ($stmt1 === false) {
        throw new Exception("Prepare failed (requests): " . $conn->error);
    }
    error_log("Statement prepared successfully (requests). Binding params..."); // Log after prepare
    $stmt1->bind_param("sssssssssssssisss",
        $requestNumber, $submissionDate, $initialStatus, $prefix, $otherPrefix, $firstName, $lastName, $nationalId,
        $position, $department, $phone, $email, $purpose, $quantity, $deliveryMethod, $shippingAddress, $updatedBySystem
    );
    error_log("Params bound successfully (requests). Executing..."); // Log after bind
    if (!$stmt1->execute()) {
        throw new Exception("Execute failed (requests): " . $stmt1->error);
    }
    error_log("Statement executed successfully (requests). Closing statement..."); // Log after execute
    $stmt1->close();
    error_log("Statement closed (requests)."); // Log after close

    // 2. Insert into `status_history` table using Prepared Statements
    error_log("Preparing statement for status_history table..."); // Log before prepare history
    $sql2 = "INSERT INTO status_history (requestNumber, status, date, updatedBy) VALUES (?, ?, ?, ?)";
    $stmt2 = $conn->prepare($sql2);
     if ($stmt2 === false) {
        throw new Exception("Prepare failed (history): " . $conn->error);
    }
     error_log("Statement prepared successfully (history). Binding params..."); // Log after prepare history
    $stmt2->bind_param("ssss", $requestNumber, $initialStatus, $submissionDate, $updatedBySystem);
    error_log("Params bound successfully (history). Executing..."); // Log after bind history
    if (!$stmt2->execute()) {
        throw new Exception("Execute failed (history): " . $stmt2->error);
    }
    error_log("Statement executed successfully (history). Closing statement..."); // Log after execute history
    $stmt2->close();
    error_log("Statement closed (history). Committing transaction..."); // Log after close history

    // Commit transaction
    if (!$conn->commit()) {
         throw new Exception("Transaction commit failed: " . $conn->error);
    }
    error_log("Transaction committed successfully."); // Log commit success

    // Send Success Response
    error_log("Sending success response..."); // Log before success response
    send_json_response([
        "status" => "success",
        "message" => "Request submitted successfully.",
        "requestNumber" => $requestNumber
    ], 201); // 201 Created

} catch (Exception $e) {
    // Log detailed error before rollback
    error_log("Exception caught: " . $e->getMessage());
    // Rollback transaction on error
    $conn->rollback();
    error_log("Transaction rolled back."); // Log rollback
    // Log detailed error, send generic message
    handle_error("Submit request database error: " . $e->getMessage(), $conn);
}

// Note: send_json_response or handle_error will exit, so connection closing is handled there.
?>

