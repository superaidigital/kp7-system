<?php
// api/save_user.php

require 'config.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$username = $data['username'] ?? '';
// ตรวจสอบว่ามี password ส่งมาและไม่เป็นค่าว่าง
$password = (!empty($data['password'])) ? $data['password'] : null;
$role = $data['role'] ?? 'hr';
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$position = $data['position'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';

if (empty($username) || empty($firstName) || empty($lastName)) {
    send_json_response(['status' => 'error', 'message' => 'Username, first name, and last name are required.']);
}

// ตรวจสอบว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
$stmt_check = $conn->prepare("SELECT username FROM users WHERE username = ?");
$stmt_check->bind_param('s', $username);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
$is_editing = $result_check->num_rows > 0;
$stmt_check->close();

if ($is_editing) {
    // --- โหมดแก้ไข ---
    if ($password) {
        // อัปเดตพร้อมรหัสผ่านใหม่
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password = ?, role = ?, firstName = ?, lastName = ?, position = ?, phone = ?, email = ? WHERE username = ?");
        $stmt->bind_param('ssssssss', $hashed_password, $role, $firstName, $lastName, $position, $phone, $email, $username);
    } else {
        // อัปเดตโดยไม่เปลี่ยนรหัสผ่าน
        $stmt = $conn->prepare("UPDATE users SET role = ?, firstName = ?, lastName = ?, position = ?, phone = ?, email = ? WHERE username = ?");
        $stmt->bind_param('sssssss', $role, $firstName, $lastName, $position, $phone, $email, $username);
    }
    $message = 'User updated successfully.';
} else {
    // --- โหมดเพิ่มผู้ใช้ใหม่ ---
    if (!$password) {
        send_json_response(['status' => 'error', 'message' => 'Password is required for a new user.']);
    }
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, password, role, firstName, lastName, position, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('ssssssss', $username, $hashed_password, $role, $firstName, $lastName, $position, $phone, $email);
    $message = 'New user added successfully.';
}

if ($stmt->execute()) {
    send_json_response(['status' => 'success', 'message' => $message]);
} else {
    send_json_response(['status' => 'error', 'message' => 'Failed to save user: ' . $stmt->error]);
}

$stmt->close();
?>