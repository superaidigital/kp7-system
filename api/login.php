<?php
// api/login.php

require_once 'config.php'; // Use require_once for config

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Basic Input Validation
$username = filter_var($data['username'] ?? '', FILTER_SANITIZE_STRING);
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    send_json_response(['status' => 'error', 'message' => 'Username and password are required.'], 400);
}

$stmt = $conn->prepare("SELECT username, password, role, firstName, lastName, position, phone, email FROM users WHERE username = ?");
if (!$stmt) {
    handle_error("Login prepare failed", $conn);
}

$stmt->bind_param('s', $username);
if (!$stmt->execute()) {
     handle_error("Login execute failed", $stmt);
}

$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close(); // Close statement after fetching

if ($user && password_verify($password, $user['password'])) {
    // Login successful
    // Remove password hash before storing in session and sending
    unset($user['password']);

    // Regenerate session ID upon login to prevent session fixation
    session_regenerate_id(true);

    // Store essential user info in session
    $_SESSION['user'] = $user;

    send_json_response(['status' => 'success', 'user' => $user], 200);
} else {
    // Login failed
    // Log failed login attempt (optional, consider rate limiting)
    error_log("Failed login attempt for username: " . $username);
    send_json_response(['status' => 'error', 'message' => 'Invalid username or password.'], 401);
}
?>
