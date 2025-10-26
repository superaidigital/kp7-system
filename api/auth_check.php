<?php
// api/auth_check.php
// Include this file at the beginning of protected API endpoints.

require_once 'config.php'; // Ensures session is started and includes helpers

/**
 * Checks if a user is logged in and optionally checks their role.
 * Sends a 401 or 403 response and exits if authentication/authorization fails.
 *
 * @param array|null $allowedRoles An array of allowed roles (e.g., ['admin', 'hr']). If null, only checks login status.
 * @return array Returns the user data from the session if successful.
 */
function require_auth(array $allowedRoles = null): array {
    if (!isset($_SESSION['user']) || !is_array($_SESSION['user'])) {
        send_json_response(['status' => 'error', 'message' => 'Authentication required.'], 401);
    }

    $user = $_SESSION['user'];

    if ($allowedRoles !== null) {
        if (!isset($user['role']) || !in_array($user['role'], $allowedRoles, true)) {
            // Log the attempt
            error_log("Authorization failed: User '{$user['username']}' (Role: {$user['role']}) tried to access resource requiring roles: " . implode(', ', $allowedRoles));
            send_json_response(['status' => 'error', 'message' => 'Forbidden.'], 403);
        }
    }

    // Return user data for potential use in the API endpoint
    return $user;
}

?>
