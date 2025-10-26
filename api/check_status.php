<?php
// api/check_status.php

require 'config.php';

$requestNumber = $_GET['requestNumber'] ?? '';

if (empty($requestNumber)) {
    send_json_response(['status' => 'error', 'message' => 'Request number is required.']);
}

// 1. ดึงข้อมูลหลักของคำขอ
$stmt_request = $conn->prepare("SELECT * FROM requests WHERE requestNumber = ?");
$stmt_request->bind_param('s', $requestNumber);
$stmt_request->execute();
$result_request = $stmt_request->get_result();
$requestData = $result_request->fetch_assoc();

if (!$requestData) {
    send_json_response(['status' => 'error', 'message' => 'Request not found.']);
}
// แปลง quantity เป็น number
$requestData['quantity'] = (int)$requestData['quantity'];


// 2. ดึงประวัติสถานะทั้งหมด
$stmt_history = $conn->prepare("SELECT status, date, notes, updatedBy FROM status_history WHERE requestNumber = ? ORDER BY date ASC");
$stmt_history->bind_param('s', $requestNumber);
$stmt_history->execute();
$result_history = $stmt_history->get_result();
$statusHistory = [];
while ($row = $result_history->fetch_assoc()) {
    $statusHistory[] = $row;
}

$requestData['statusHistory'] = $statusHistory;

send_json_response(['status' => 'success', 'data' => $requestData]);

$stmt_request->close();
$stmt_history->close();
?>