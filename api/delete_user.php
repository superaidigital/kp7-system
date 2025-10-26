<?php
// api/delete_user.php

require 'config.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$username = $data['username'] ?? '';

if (empty($username)) {
    send_json_response(['status' => 'error', 'message' => 'Username is required.']);
}

$stmt = $conn->prepare("DELETE FROM users WHERE username = ?");
$stmt->bind_param('s', $username);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        send_json_response(['status' => 'success', 'message' => 'User deleted successfully.']);
    } else {
        send_json_response(['status' => 'error', 'message' => 'User not found.']);
    }
} else {
    send_json_response(['status' => 'error', 'message' => 'Failed to delete user: ' . $stmt->error]);
}

$stmt->close();
?>