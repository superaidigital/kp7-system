<?php
// api/get_users.php

require 'config.php';

$sql = "SELECT username, role, firstName, lastName, position, phone, email FROM users ORDER BY username ASC";
$result = $conn->query($sql);
$users = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    send_json_response(['status' => 'success', 'data' => $users]);
} else {
    send_json_response(['status' => 'error', 'message' => 'Failed to fetch users: ' . $conn->error]);
}
?>