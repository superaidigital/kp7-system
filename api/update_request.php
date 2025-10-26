<?php
// api/update_request.php
declare(strict_types=1);

// Use __DIR__ for reliable path resolution
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth_check.php'; // Ensure user is logged in

$json_data = file_get_contents('php://input');
// Add error handling for json_decode
$data = json_decode($json_data, true);
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    handle_error("Invalid JSON input: " . json_last_error_msg());
}

$requestNumber = trim($data['requestNumber'] ?? '');
$newStatus = trim($data['status'] ?? '');
// Use htmlspecialchars for notes before inserting into history, though prepared statement helps
$notes = isset($data['notes']) ? htmlspecialchars(trim($data['notes']), ENT_QUOTES, 'UTF-8') : null; // Sanitize notes for history
$updatedBy = trim($data['updatedBy'] ?? ''); // This should come from the logged-in user session ideally

if (empty($requestNumber) || empty($newStatus) || empty($updatedBy)) {
    send_json_response(['status' => 'error', 'message' => 'Missing required fields (requestNumber, status, updatedBy).'], 400);
}

// Start transaction
if (!$conn->begin_transaction()) {
     handle_error("Failed to begin transaction: " . $conn->error, $conn);
}

// Initialize statement variables
$stmt_update_request = null;
$stmt_history = null;

try {
    // --- 1. Update the `requests` table ---
    // REMOVED `notes = ?` because the 'requests' table does not have this column
    // Double-check 'status' and 'lastUpdatedBy' column names
    $sql_update_request = "UPDATE requests SET status = ?, lastUpdatedBy = ? WHERE requestNumber = ?";
    $stmt_update_request = $conn->prepare($sql_update_request);
    if ($stmt_update_request === false) {
        handle_error("Prepare statement failed (update requests): " . $conn->error . " | SQL: " . $sql_update_request, $conn);
    }

    // Bind parameters: status (s), lastUpdatedBy (s), requestNumber (s)
    if (!$stmt_update_request->bind_param('sss', $newStatus, $updatedBy, $requestNumber)) {
        handle_error("Binding parameters failed (update requests): " . $stmt_update_request->error, $stmt_update_request);
    }

    if (!$stmt_update_request->execute()) {
        handle_error("Execute failed (update requests): " . $stmt_update_request->error, $stmt_update_request);
    }
    // Check affected rows *after* execute
    $affected_rows_request = $stmt_update_request->affected_rows;
    error_log("Affected rows requests: " . $affected_rows_request); // Log affected rows
    $stmt_update_request->close(); // Close statement immediately after use

    // --- 2. Insert into `status_history` table ---
    // Column names: requestNumber, status, date, notes, updatedBy (verified from SQL)
    // `date` column uses NOW() in SQL, so no need to bind it
    $sql_history = "INSERT INTO status_history (requestNumber, status, date, notes, updatedBy) VALUES (?, ?, NOW(), ?, ?)";
    $stmt_history = $conn->prepare($sql_history);
    if ($stmt_history === false) {
        handle_error("Prepare statement failed (insert history): " . $conn->error . " | SQL: " . $sql_history, $conn);
    }

    // Bind parameters: requestNumber (s), status (s), notes (s), updatedBy (s)
    // Note: Use the sanitized $notes variable here
    if (!$stmt_history->bind_param('ssss', $requestNumber, $newStatus, $notes, $updatedBy)) {
        handle_error("Binding parameters failed (insert history): " . $stmt_history->error, $stmt_history);
    }

    if (!$stmt_history->execute()) {
        handle_error("Execute failed (insert history): " . $stmt_history->error, $stmt_history);
    }
    $affected_rows_history = $stmt_history->affected_rows; // Get affected rows for history insert
    error_log("Affected rows history: " . $affected_rows_history); // Log affected rows
    $stmt_history->close(); // Close statement immediately after use

    // If both queries were successful, commit the transaction
    if ($affected_rows_request >= 0 && $affected_rows_history > 0) { // Check >= 0 for UPDATE as 0 is valid if data didn't change
        if (!$conn->commit()) {
            handle_error("Transaction commit failed: " . $conn->error, $conn);
        }
        send_json_response(['status' => 'success', 'message' => 'Request updated successfully.']);
    } else if ($affected_rows_request == 0) {
        // Handle case where requestNumber might not exist or status was already the same
        error_log("Update request warning: Request number '$requestNumber' not found or status unchanged.");
         if (!$conn->commit()) { // Commit history even if request wasn't updated
            handle_error("Transaction commit failed (after no request update): " . $conn->error, $conn);
        }
        // Decide if this should be an error or success with a specific message
        send_json_response(['status' => 'warning', 'message' => 'Request found, status history logged, but main request status might be unchanged or requestNumber invalid.'], 200);

    } else {
         // Should not happen if execute didn't throw error, but as a safeguard
        throw new Exception("Update executed but reported unexpected affected rows (Request: $affected_rows_request, History: $affected_rows_history).");
    }

} catch (mysqli_sql_exception $e) {
    $conn->rollback(); // Rollback on database errors
    handle_error(
        "Database error during update request: " . $e->getMessage() . " (Code: " . $e->getCode() . ") | RequestNumber: " . $requestNumber,
        isset($conn) ? $conn : null
    );
} catch (Throwable $e) {
    $conn->rollback(); // Rollback on other errors
    handle_error(
        "An unexpected error occurred during update request: " . $e->getMessage() . " | RequestNumber: " . $requestNumber . " | File: " . $e->getFile() . " | Line: " . $e->getLine(),
        isset($conn) ? $conn : null
    );
} finally {
    // Ensure statements are closed if they were initialized and not already closed
     if (isset($stmt_update_request) && $stmt_update_request instanceof mysqli_stmt && $stmt_update_request->errno === 0) { // Check if not already closed
         try { $stmt_update_request->close(); } catch (Exception $e) { error_log("Error closing stmt_update_request in finally: " . $e->getMessage()); }
     }
     if (isset($stmt_history) && $stmt_history instanceof mysqli_stmt && $stmt_history->errno === 0) { // Check if not already closed
         try { $stmt_history->close(); } catch (Exception $e) { error_log("Error closing stmt_history in finally: " . $e->getMessage()); }
     }
    // Connection is closed within send_json_response or handle_error
}
?>

