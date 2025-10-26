<?php
// api/get_requests.php

require_once 'auth_check.php'; // Check authentication first
$user = require_auth(['admin', 'hr']); // Only allow admin and hr

$role = $user['role']; // Get role from authenticated session user

// Use Prepared Statements
$sql = "SELECT requestNumber, submissionDate, status, prefix, otherPrefix, firstName, lastName, nationalId FROM requests";
$params = [];
$types = '';

// Filter out admin_officer status for HR role
if ($role === 'hr') {
    $sql .= " WHERE status != ?";
    $params[] = 'admin_officer';
    $types .= 's';
}

$sql .= " ORDER BY submissionDate DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    handle_error("Get requests prepare failed", $conn);
}

// Bind parameters if any exist
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

if (!$stmt->execute()) {
    handle_error("Get requests execute failed", $stmt);
}

$result = $stmt->get_result();
$requests = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        // Optional: Cast types if needed by frontend
        // $row['quantity'] = (int)$row['quantity'];
        $requests[] = $row;
    }
    $stmt->close();
    send_json_response(['status' => 'success', 'data' => $requests]);
} else {
     // This else block might be redundant because execute failure is handled above
     handle_error("Failed to fetch requests result", $stmt);
}
?>
