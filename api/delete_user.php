<?php
// api/delete_user.php

require_once 'auth_check.php'; // Check authentication first
$currentUser = require_auth(['admin']); // Only allow admin

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$username = filter_var($data['username'] ?? '', FILTER_SANITIZE_STRING);

if (empty($username)) {
    send_json_response(['status' => 'error', 'message' => 'Username is required.'], 400);
}

// Prevent admin from deleting themselves
if ($username === $currentUser['username']) {
    send_json_response(['status' => 'error', 'message' => 'You cannot delete your own account.'], 403);
}

$stmt = $conn->prepare("DELETE FROM users WHERE username = ?");
 if (!$stmt) {
    handle_error("Delete user prepare failed", $conn);
}
$stmt->bind_param('s', $username);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        send_json_response(['status' => 'success', 'message' => 'User deleted successfully.']);
    } else {
        // User not found is arguably not an "error" but a client-side issue (trying to delete non-existent)
        send_json_response(['status' => 'error', 'message' => 'User not found.'], 404);
    }
} else {
     handle_error("Failed to delete user", $stmt);
}

$stmt->close();
?>
