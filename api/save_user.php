<?php
// api/save_user.php

require_once 'auth_check.php'; // Check authentication first
require_auth(['admin']); // Only allow admin

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Input Validation and Sanitization
$username = filter_var($data['username'] ?? '', FILTER_SANITIZE_STRING);
$password = (!empty($data['password'])) ? $data['password'] : null; // Keep password as is for now, will hash later
$role = in_array($data['role'] ?? '', ['hr', 'admin']) ? $data['role'] : 'hr'; // Default to 'hr' if invalid
$firstName = filter_var($data['firstName'] ?? '', FILTER_SANITIZE_STRING);
$lastName = filter_var($data['lastName'] ?? '', FILTER_SANITIZE_STRING);
$position = filter_var($data['position'] ?? '', FILTER_SANITIZE_STRING);
$phone = filter_var($data['phone'] ?? '', FILTER_SANITIZE_STRING); // Basic sanitize, could add regex validation
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL); // Validate email format

if (empty($username) || empty($firstName) || empty($lastName) || $email === false) {
    send_json_response(['status' => 'error', 'message' => 'Username, first name, last name are required, and email must be valid.'], 400);
}
// Optional: Add more validation (e.g., phone format)

// Check if user exists
$stmt_check = $conn->prepare("SELECT username FROM users WHERE username = ?");
if (!$stmt_check) handle_error("Save user check prepare failed", $conn);
$stmt_check->bind_param('s', $username);
if (!$stmt_check->execute()) handle_error("Save user check execute failed", $stmt_check);
$result_check = $stmt_check->get_result();
$is_editing = $result_check->num_rows > 0;
$stmt_check->close();

$stmt = null; // Initialize stmt
$message = '';

if ($is_editing) {
    // --- Edit Mode ---
    if ($password) {
        // Update with new password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        if ($hashed_password === false) handle_error("Password hashing failed");
        $stmt = $conn->prepare("UPDATE users SET password = ?, role = ?, firstName = ?, lastName = ?, position = ?, phone = ?, email = ? WHERE username = ?");
        if (!$stmt) handle_error("Save user update (pw) prepare failed", $conn);
        $stmt->bind_param('ssssssss', $hashed_password, $role, $firstName, $lastName, $position, $phone, $email, $username);
    } else {
        // Update without changing password
        $stmt = $conn->prepare("UPDATE users SET role = ?, firstName = ?, lastName = ?, position = ?, phone = ?, email = ? WHERE username = ?");
         if (!$stmt) handle_error("Save user update (no pw) prepare failed", $conn);
        $stmt->bind_param('sssssss', $role, $firstName, $lastName, $position, $phone, $email, $username);
    }
    $message = 'User updated successfully.';
} else {
    // --- Add New User Mode ---
    if (!$password) {
        send_json_response(['status' => 'error', 'message' => 'Password is required for a new user.'], 400);
    }
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
     if ($hashed_password === false) handle_error("Password hashing failed");
    $stmt = $conn->prepare("INSERT INTO users (username, password, role, firstName, lastName, position, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) handle_error("Save user insert prepare failed", $conn);
    $stmt->bind_param('ssssssss', $username, $hashed_password, $role, $firstName, $lastName, $position, $phone, $email);
    $message = 'New user added successfully.';
}

if ($stmt->execute()) {
    $stmt->close();
    send_json_response(['status' => 'success', 'message' => $message]);
} else {
    // Catch potential duplicate username error on insert
    if ($conn->errno === 1062) { // 1062 is the MySQL error code for duplicate entry
         handle_error("Save user failed: Username '{$username}' already exists.", $stmt, 409); // 409 Conflict
    } else {
        handle_error("Failed to save user", $stmt);
    }
}
?>
