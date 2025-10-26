<?php
// api/get_users.php

require_once 'auth_check.php'; // Check authentication first
$user = require_auth(['admin']); // Only allow admin

// Use Prepared Statements (even though no user input here, it's good practice)
$sql = "SELECT username, role, firstName, lastName, position, phone, email FROM users ORDER BY username ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    handle_error("Get users prepare failed", $conn);
}

if (!$stmt->execute()) {
    handle_error("Get users execute failed", $stmt);
}

$result = $stmt->get_result();
$users = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $stmt->close();
    send_json_response(['status' => 'success', 'data' => $users]);
} else {
    // This else block might be redundant
    handle_error("Failed to fetch users result", $stmt);
}
?>
