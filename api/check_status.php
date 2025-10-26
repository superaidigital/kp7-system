<?php
// api/check_status.php

declare(strict_types=1);

// Use __DIR__ for reliable path resolution and check if require works
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    error_log("CRITICAL ERROR: config.php not found at " . $configPath . " in check_status.php");
    http_response_code(500);
    // Avoid sending detailed path in production response
    echo json_encode(['status' => 'error', 'message' => 'Server configuration error (config file missing).']);
    exit();
}
// Include config only once
require_once $configPath; // $conn, send_json_response, handle_error are now available

// Get and sanitize request number
$requestNumber = trim($_GET['requestNumber'] ?? '');

if (empty($requestNumber)) {
    send_json_response(['status' => 'error', 'message' => 'Request number is required.'], 400);
}

// Initialize statement variables to null for easier closing in finally/catch
$stmt_request = null;
$stmt_history = null;

try {
    // --- 1. Fetch main request data ---
    // Column names confirmed to match kp7_request_system (1).sql
    $sql_request = "SELECT id, requestNumber, submissionDate, status, prefix, otherPrefix, firstName, lastName, nationalId, position, department, phone, email, purpose, quantity, deliveryMethod, shippingAddress, lastUpdatedBy, notes FROM requests WHERE requestNumber = ?";
    $stmt_request = $conn->prepare($sql_request);
    if ($stmt_request === false) {
        handle_error("Prepare statement failed (requests): " . $conn->error . " | SQL: " . $sql_request, $conn);
    }

    if (!$stmt_request->bind_param('s', $requestNumber)) {
        handle_error("Binding parameters failed (requests): " . $stmt_request->error, $stmt_request);
    }
    if (!$stmt_request->execute()) {
        handle_error("Execute failed (requests): " . $stmt_request->error, $stmt_request);
    }

    $result_request = $stmt_request->get_result();
    if ($result_request === false) {
        handle_error("Getting result failed (requests): " . $stmt_request->error, $stmt_request);
    }

    $requestData = $result_request->fetch_assoc();
    // No need to close here yet, might need it in finally

    if ($requestData === null) {
        if ($stmt_request) $stmt_request->close();
        send_json_response(['status' => 'error', 'message' => 'Request not found.'], 404);
    }

    // Ensure quantity is an integer
    $requestData['quantity'] = isset($requestData['quantity']) ? (int)$requestData['quantity'] : 0;

    // --- 2. Fetch status history (Linked by requestNumber) ---
    $statusHistory = [];

    // Use requestNumber (VARCHAR) from $requestData to query history
    if (!isset($requestData['requestNumber']) || empty($requestData['requestNumber'])) {
         error_log("Request data integrity issue: missing or invalid 'requestNumber' after fetching request: " . $requestNumber . " in check_status.php");
         // Fallback: Continue without history
    } else {
        $historyRequestNumber = $requestData['requestNumber']; // Use the fetched requestNumber

        // Corrected SQL: Use `requestNumber` in WHERE clause
        // Column names 'date' and 'updatedBy' confirmed from kp7_request_system (1).sql
        $sql_history = "SELECT status, date, notes, updatedBy FROM status_history WHERE requestNumber = ? ORDER BY date ASC";
        $stmt_history = $conn->prepare($sql_history);

        if ($stmt_history === false) {
            handle_error("Prepare statement failed (status_history): " . $conn->error . " | SQL: " . $sql_history, $conn);
        }

        // Corrected Bind: Use 's' for string (requestNumber)
        if (!$stmt_history->bind_param('s', $historyRequestNumber)) {
            handle_error("Binding parameters failed (status_history): " . $stmt_history->error, $stmt_history);
        }

        if (!$stmt_history->execute()) {
            handle_error("Execute failed (status_history): " . $stmt_history->error, $stmt_history);
        }

        $result_history = $stmt_history->get_result();
        if ($result_history === false) {
            handle_error("Getting result failed (status_history): " . $stmt_history->error, $stmt_history);
        }

        while ($row = $result_history->fetch_assoc()) {
            $statusHistory[] = $row;
        }
        // No need to close here yet, might need it in finally
    }

    // Add history array
    $requestData['statusHistory'] = $statusHistory;

    // Close statements before sending success response
    if ($stmt_request) $stmt_request->close();
    if ($stmt_history) $stmt_history->close();

    // Send the successful response
    send_json_response(['status' => 'success', 'data' => $requestData]);

} catch (mysqli_sql_exception $e) {
    handle_error(
        "Database error during check status: " . $e->getMessage() . " (Code: " . $e->getCode() . ") | RequestNumber: " . $requestNumber,
        $conn
    );
} catch (Throwable $e) {
    handle_error(
        "An unexpected error occurred during check status: " . $e->getMessage() . " | RequestNumber: " . $requestNumber . " | File: " . $e->getFile() . " | Line: " . $e->getLine(),
        $conn
    );
} finally {
     if (isset($stmt_request) && $stmt_request instanceof mysqli_stmt) {
         try { $stmt_request->close(); } catch (Exception $e) { error_log("Error closing stmt_request in finally: " . $e->getMessage()); }
     }
     if (isset($stmt_history) && $stmt_history instanceof mysqli_stmt) {
         try { $stmt_history->close(); } catch (Exception $e) { error_log("Error closing stmt_history in finally: " . $e->getMessage()); }
     }
}
?>

