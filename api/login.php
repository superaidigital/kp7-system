<?php
// api/login.php

require 'config.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    send_json_response(['status' => 'error', 'message' => 'Username and password are required.']);
}

$stmt = $conn->prepare("SELECT username, password, role, firstName, lastName, position, phone, email FROM users WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    // ลบรหัสผ่านออกจากข้อมูลที่จะส่งกลับไป
    unset($user['password']);
    send_json_response(['status' => 'success', 'user' => $user]);
} else {
    // ใช้ http_response_code เพื่อส่ง status ที่ถูกต้อง
    http_response_code(401); 
    send_json_response(['status' => 'error', 'message' => 'Invalid username or password.']);
}

$stmt->close();
?>