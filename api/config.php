<?php
// api/config.php
declare(strict_types=1);

// --- Error Reporting (Development: Show errors, Production: Log errors) ---
// IMPORTANT: Set display_errors to 0 in production
ini_set('display_errors', '1'); // 1 for dev, 0 for prod
ini_set('display_startup_errors', '1'); // 1 for dev, 0 for prod
error_reporting(E_ALL);
// Log errors to a file within the api directory
ini_set('log_errors', '1');
$log_path = __DIR__ . '/php_error.log';
ini_set('error_log', $log_path);

// --- Session Configuration ---
// Make sure session cookies are secure in production (HTTPS)
$cookie_secure = false; // Set to true if using HTTPS
$cookie_httponly = true;
$cookie_samesite = 'Lax'; // Lax or Strict
session_set_cookie_params([
    'lifetime' => 0, // Session expires when browser closes
    'path' => '/',
    'domain' => '', // Leave empty for current domain
    'secure' => $cookie_secure,
    'httponly' => $cookie_httponly,
    'samesite' => $cookie_samesite
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- CORS Headers ---
// IMPORTANT: Change '*' to your frontend origin in production
$allowed_origin = 'http://localhost:3000'; // Specific origin is required for credentials

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: " . $allowed_origin);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE"); // Allow needed methods
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Csrf-Token"); // Allow needed headers
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 1 day
    exit(0);
}

// Headers for actual requests (GET, POST, etc.)
header("Access-Control-Allow-Origin: " . $allowed_origin);
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8'); // Set AFTER checking OPTIONS

// --- Database Connection ---
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'kp7_request_system');

// Report mysqli errors as exceptions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = null; // Initialize $conn
try {
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    // No need to check $conn->connect_error explicitly here if mysqli_report is set
    $conn->set_charset("utf8mb4");
    error_log("Database connection successful."); // Log success

} catch (mysqli_sql_exception $e) {
    // Log the detailed connection error
    error_log("CRITICAL: Database connection failed: " . $e->getMessage() . " (Code: " . $e->getCode() . ")");
    // Send generic error response
    http_response_code(500);
    // Ensure content type is JSON even on early failure
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection error. Please contact support.' // Generic message for client
    ]);
    exit(); // Stop script execution
}

// --- Helper Functions ---

/**
 * Sends a JSON response and terminates the script.
 * Closes the database connection if available.
 * @param array $data The data to encode as JSON.
 * @param int $statusCode The HTTP status code to send (default: 200).
 */
function send_json_response(array $data, int $statusCode = 200) {
    global $conn;
    http_response_code($statusCode);
    if (!headers_sent()) {
         header('Content-Type: application/json; charset=utf-8');
    } else {
        error_log("Warning: Headers already sent before send_json_response called.");
    }
    echo json_encode($data);
    if ($conn instanceof mysqli) {
        try { $conn->close(); } catch(Exception $e) { /* ignore closing error */ }
    }
    exit();
}

/**
 * Logs an error, sends a generic JSON error response (HTTP 500),
 * and terminates the script. Closes statement/connection if provided.
 * @param string $logMessage The detailed message to log.
 * @param mysqli|mysqli_stmt|null $closeable A mysqli connection or statement to close.
 */
function handle_error(string $logMessage, $closeable = null) {
    error_log("Error handled: " . $logMessage); // Log the detailed error

    // Attempt to close resource if provided
    if ($closeable instanceof mysqli_stmt) {
        try { $closeable->close(); } catch(Exception $e) { error_log("Error closing statement in handle_error: " . $e->getMessage()); }
    } elseif ($closeable instanceof mysqli) {
         try { $closeable->close(); } catch(Exception $e) { error_log("Error closing connection in handle_error: " . $e->getMessage()); }
    }

    // Send generic error response to the client
    send_json_response([
        'status' => 'error',
        'message' => 'An internal server error occurred. Please try again later.'
    ], 500);
}
?>

