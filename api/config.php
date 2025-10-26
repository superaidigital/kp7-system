<?php
// api/config.php

// === การตั้งค่าการเชื่อมต่อฐานข้อมูล ===
// กรุณาเปลี่ยนค่าเหล่านี้ให้ตรงกับการตั้งค่าเซิร์ฟเวอร์ของคุณ
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); //  <-- เปลี่ยนเป็น username ของคุณ
define('DB_PASSWORD', '');     //  <-- เปลี่ยนเป็น password ของคุณ
define('DB_NAME', 'kp7_request_system'); // <-- เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ

// === การตั้งค่า Headers ===
// อนุญาตการเข้าถึงจากทุก Origin (สำหรับ Development)
// ใน Production ควรเปลี่ยน '*' เป็นโดเมนของ Frontend ของคุณ เช่น 'https://your-app.com'
header("Access-Control-Allow-Origin: *");
// ระบุ Methods ที่อนุญาต
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// ระบุ Headers ที่อนุญาต
header("Access-control-allow-headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// ตั้งค่า Content-Type เริ่มต้นเป็น JSON
header('Content-Type: application/json; charset=utf-8');

// จัดการกับ Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// === สร้างการเชื่อมต่อฐานข้อมูล (MySQLi) ===
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// ตั้งค่า Character Set เป็น utf8mb4 เพื่อรองรับภาษาไทย
$conn->set_charset("utf8mb4");

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    // ใช้ die() เพื่อหยุดการทำงานทันทีหากเชื่อมต่อไม่ได้
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// ฟังก์ชันสำหรับส่ง JSON response และจบการทำงาน
function send_json_response($data) {
    global $conn;
    echo json_encode($data);
    $conn->close();
    exit();
}
?>