<?php
// api/get_requests.php

require 'config.php';

$role = $_GET['role'] ?? '';

$sql = "SELECT requestNumber, submissionDate, status, prefix, otherPrefix, firstName, lastName, nationalId FROM requests";

// ถ้าเป็น HR ไม่ต้องแสดงคำขอที่ส่งให้ Admin
if ($role === 'hr') {
    $sql .= " WHERE status != 'admin_officer'";
}

$sql .= " ORDER BY submissionDate DESC";

$result = $conn->query($sql);
$requests = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    send_json_response(['status' => 'success', 'data' => $requests]);
} else {
    send_json_response(['status' => 'error', 'message' => 'Failed to fetch requests: ' . $conn->error]);
}
?>