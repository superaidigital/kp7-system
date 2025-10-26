<?php
// api/update_request.php

require 'config.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$requestNumber = $data['requestNumber'] ?? '';
$newStatus = $data['status'] ?? '';
$notes = $data['notes'] ?? '';
$updatedBy = $data['updatedBy'] ?? '';

if (empty($requestNumber) || empty($newStatus) || empty($updatedBy)) {
    send_json_response(['status' => 'error', 'message' => 'Missing required fields.']);
}

$conn->begin_transaction();

try {
    // 1. อัปเดตตาราง requests
    $stmt_update = $conn->prepare("UPDATE requests SET status = ?, notes = ?, lastUpdatedBy = ? WHERE requestNumber = ?");
    $stmt_update->bind_param('ssss', $newStatus, $notes, $updatedBy, $requestNumber);
    if (!$stmt_update->execute()) {
        throw new Exception("Failed to update request: " . $stmt_update->error);
    }
    $stmt_update->close();

    // 2. เพิ่มประวัติใน status_history
    $stmt_history = $conn->prepare("INSERT INTO status_history (requestNumber, status, date, notes, updatedBy) VALUES (?, ?, NOW(), ?, ?)");
    $stmt_history->bind_param('ssss', $requestNumber, $newStatus, $notes, $updatedBy);
    if (!$stmt_history->execute()) {
        throw new Exception("Failed to log history: " . $stmt_history->error);
    }
    $stmt_history->close();

    $conn->commit();
    send_json_response(['status' => 'success', 'message' => 'Request updated successfully.']);

} catch (Exception $e) {
    $conn->rollback();
    send_json_response(['status' => 'error', 'message' => 'Update failed: ' . $e->getMessage()]);
}
?>