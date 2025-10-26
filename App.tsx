import React, { useState, useEffect, useCallback } from 'react';
import type { FormData, RequestData } from './types'; // Assuming Status is correctly imported/defined in types.ts
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { RequestForm } from './components/RequestForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SuccessModal } from './components/SuccessModal';
// Removed StatusTracker import as StatusDetailPage is used
// import { StatusTracker } from './components/StatusTracker';
import { CheckStatusPrompt } from './components/CheckStatusPrompt';
import { ManualPage } from './components/ManualPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminRequestDetail } from './components/admin/AdminRequestDetail';
import { AdminReportsPage } from './components/admin/AdminReportsPage';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminStaffReportsPage } from './components/admin/AdminStaffReportsPage';
import { StatusDetailPage } from './components/StatusDetailPage'; // Replaces StatusTracker for detail view
import { useLanguage } from './context/LanguageContext';

// Define Page types including the new statusDetail
export type Page = 'home' | 'request' | 'checkStatus' | 'manual' | 'contact' | 'login' | 'adminDashboard' | 'adminDetail' | 'adminReports' | 'statusTracker' | 'adminUserManagement' | 'adminStaffReports' | 'statusDetail';

// User interface remains the same
export interface User {
    username: string;
    role: 'admin' | 'hr';
    firstName: string;
    lastName: string;
    position: string;
    phone: string;
    email: string;
}
export interface UserCredentials extends User {
    password?: string; // Optional for updates
}

// Initial form data remains the same
const initialFormData: FormData = {
    prefix: 'นาย',
    otherPrefix: '',
    firstName: '',
    lastName: '',
    nationalId: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    purpose: '',
    quantity: 1,
    deliveryMethod: 'pickup',
    shippingAddress: '',
};

// Get API base URL from environment variable
// Create a .env.local file in the project root with:
// VITE_API_BASE_URL=http://localhost/kp7-system/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/kp7-system/api'; // Fallback for safety

// --- Simple Error Message Component ---
const ErrorMessage: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-50 flex items-center justify-between max-w-sm" role="alert">
             <div>
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{message}</span>
            </div>
            <button onClick={onClose} className="ml-4 text-red-500 hover:text-red-700">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};

// --- API Helper Function ---
// Includes credentials for session cookies
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include', // Send cookies with requests
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, defaultOptions);

    // Attempt to parse JSON regardless of status code initially
    let result;
    try {
        result = await response.json();
    } catch (e) {
        // If parsing fails, create a generic error result
        result = { status: 'error', message: `HTTP error ${response.status} - Invalid JSON response` };
    }

    if (!response.ok) {
        // Throw an error with the message from the parsed JSON or a default one
        throw new Error(result?.message || `HTTP error ${response.status}`);
    }

    // Also check for 'status: "error"' in the JSON response even if HTTP status is 2xx
    if (result?.status === 'error') {
        throw new Error(result.message || 'API returned an error status.');
    }

    return result; // Contains { status: 'success', ... }
};


const App: React.FC = () => {
    const { t } = useLanguage();
    const [page, setPage] = useState<Page>('home');
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [requestNumber, setRequestNumber] = useState('');
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);
    const [isSuccessOpen, setSuccessOpen] = useState(false);
    const [trackedRequest, setTrackedRequest] = useState<RequestData | null>(null);

    // Admin state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [requests, setRequests] = useState<RequestData[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
    const [users, setUsers] = useState<UserCredentials[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    // --- API Call Functions ---
    const fetchRequests = useCallback(async () => {
        if (!currentUser) return;
        try {
            // Role is implicitly checked by the backend via session
            const result = await fetchApi(`get_requests.php`); // Removed role from query param
            setRequests(result.data);
        } catch (error: any) {
            console.error("Failed to fetch requests:", error);
            setErrorMessage(error.message || 'Failed to load requests data.');
        }
    }, [currentUser]); // currentUser ensures this runs when user logs in/out

    const fetchUsers = useCallback(async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const result = await fetchApi(`get_users.php`);
            setUsers(result.data);
        } catch (error: any) {
            console.error("Failed to fetch users:", error);
            setErrorMessage(error.message || 'Failed to load users data.');
        }
    }, [currentUser]);

    // Fetch data when currentUser changes (login/logout)
    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            Promise.all([fetchRequests(), fetchUsers()])
                   .finally(() => setIsLoading(false));
        } else {
            // Clear admin-specific data on logout
            setRequests([]);
            setUsers([]);
        }
    }, [currentUser, fetchRequests, fetchUsers]);

    // --- Event Handlers ---
    const handleFormSubmit = () => {
        setConfirmationOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setConfirmationOpen(false);
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await fetchApi('submit_request.php', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setRequestNumber(result.requestNumber);
            setSuccessOpen(true);
            // Don't reset form data here, wait for modal close
        } catch (error: any) {
            console.error("Submission error:", error);
            setErrorMessage(`Error submitting request: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = async () => {
        setSuccessOpen(false);
        // Navigate to status detail page after successful submission
        await handleCheckStatus(requestNumber, 'statusDetail');
        setFormData(initialFormData); // Reset form only after navigating away
    };

    const handleGoBackHome = () => {
        setFormData(initialFormData);
        setRequestNumber('');
        setTrackedRequest(null);
        setPage('home');
    };

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await fetchApi('login.php', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            setCurrentUser(result.user);
            setPage('adminDashboard'); // Navigate on success
        } catch (error: any) {
            // Error message handled by fetchApi, just display it
            setErrorMessage(error.message || t('loginPage.invalidCredentials'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckStatus = async (reqNumber: string, targetPage: Page = 'statusDetail') => {
        setIsLoading(true);
        setErrorMessage('');
        setTrackedRequest(null); // Clear previous track result
        try {
            // Encode requestNumber for URL safety
            const result = await fetchApi(`check_status.php?requestNumber=${encodeURIComponent(reqNumber)}`);
            setTrackedRequest(result.data);
            setPage(targetPage);
        } catch (error: any) {
            setErrorMessage(error.message || t('checkStatus.notFound'));
            // Optionally, navigate back or stay on checkStatus page on error
             setPage('checkStatus'); // Stay on check status page
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            await fetchApi('logout.php', { method: 'POST' }); // Call logout endpoint
        } catch (error: any) {
            // Log error but proceed with frontend logout anyway
            console.error("Logout API error:", error);
        } finally {
             // Clear user state regardless of API call success
            setCurrentUser(null);
            // Data clearing happens in useEffect triggered by currentUser change
            setPage('home'); // Navigate to home
            setIsLoading(false);
        }
    };


    const handleViewDetails = (request: RequestData) => {
        setSelectedRequest(request);
        setPage('adminDetail');
    };

     const handleUpdateRequest = async (updatedRequest: RequestData) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            // Backend now gets updatedBy from session
            const payload = {
                requestNumber: updatedRequest.requestNumber,
                status: updatedRequest.status,
                notes: updatedRequest.notes
            };
            await fetchApi('update_request.php', {
                method: 'POST', // Or PUT if preferred and backend supports it
                body: JSON.stringify(payload)
            });

            // Re-fetch requests to get the latest data, including history
            await fetchRequests();

            // Find the *newly fetched* updated request to update the detail view
            setRequests(prevRequests => {
                const refreshedRequest = prevRequests.find(r => r.requestNumber === updatedRequest.requestNumber);
                if (refreshedRequest) {
                    setSelectedRequest(refreshedRequest); // Update detail view with fresh data
                } else {
                     setSelectedRequest(null); // Should not happen if fetch succeeded
                     setPage('adminDashboard'); // Go back if request disappears?
                }
                return prevRequests; // Return the updated list
            });
             alert(t('admin.details.updateSuccess')); // Use alert for simple success feedback for now


        } catch (error: any) {
            setErrorMessage(`Update failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUser = async (user: UserCredentials): Promise<boolean> => { // Return boolean for success/fail
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await fetchApi('save_user.php', {
                method: 'POST',
                body: JSON.stringify(user)
            });
            alert(result.message); // Use alert for simple feedback
            await fetchUsers(); // Refresh users list
            return true; // Indicate success to close modal
        } catch (error: any) {
            setErrorMessage(`Save failed: ${error.message}`);
            return false; // Indicate failure
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userToDelete: UserCredentials) => {
        if (userToDelete.username === currentUser?.username) {
            setErrorMessage(t('admin.userManagement.deleteSelfError'));
            return;
        }
        // Replace window.confirm with a proper modal in a real app
        if (window.confirm(t('admin.userManagement.deleteConfirm', { username: `${userToDelete.firstName} ${userToDelete.lastName}` }))) {
            setIsLoading(true);
            setErrorMessage('');
            try {
                await fetchApi('delete_user.php', {
                    method: 'POST', // Using POST, could be DELETE
                    body: JSON.stringify({ username: userToDelete.username })
                });
                alert(t('admin.userManagement.alerts.deleteSuccess')); // Simple feedback
                await fetchUsers(); // Refresh users list
            } catch (error: any) {
                setErrorMessage(`Delete failed: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackToDashboard = () => {
        setSelectedRequest(null);
        setPage('adminDashboard');
    };

    const handleNavigate = (targetPage: Page) => {
         // Clear error when navigating
        setErrorMessage('');
        // Redirect to login if trying to access admin pages without being logged in
        if (targetPage.startsWith('admin') && !currentUser) {
            setPage('login');
        } else {
            setPage(targetPage);
        }
    };

    // --- Page Rendering Logic ---
    const renderPage = () => {
        // Show loading indicator more selectively
         if (isLoading && page !== 'home' && page !== 'request' && !errorMessage) {
             return <div className="text-center p-12 text-slate-500">Loading...</div>;
        }

        switch (page) {
            case 'home':
                return <HomePage onNavigate={() => handleNavigate('request')} />;
            case 'request':
                return <RequestForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />;
            case 'checkStatus':
                // Pass onCheckStatus and potentially the error message
                return <CheckStatusPrompt onCheckStatus={handleCheckStatus} />;
            case 'statusDetail':
                // Show status detail or redirect back to check prompt if no request is tracked
                return trackedRequest
                       ? <StatusDetailPage request={trackedRequest} onGoBack={handleGoBackHome} />
                       : <CheckStatusPrompt onCheckStatus={handleCheckStatus} />; // Or redirect to 'checkStatus' page
            case 'manual':
                return <ManualPage />;
            case 'contact':
                return <ContactPage />;
            case 'login':
                 // Pass onLogin handler
                return <LoginPage onLogin={handleLogin} />;

            // Admin Pages - Conditionally render based on currentUser
            case 'adminDashboard':
                return currentUser
                       ? <AdminDashboard requests={requests} onViewDetails={handleViewDetails} currentUser={currentUser} />
                       : <LoginPage onLogin={handleLogin} />; // Redirect if not logged in
            case 'adminDetail':
                return currentUser && selectedRequest
                       ? <AdminRequestDetail request={selectedRequest} onUpdate={handleUpdateRequest} onBack={handleBackToDashboard} currentUser={currentUser} />
                       : <p>Request not found or not logged in.</p>; // Show message or redirect
            case 'adminReports':
                return currentUser
                       ? <AdminReportsPage requests={requests} onBack={handleBackToDashboard} currentUser={currentUser}/>
                       : <LoginPage onLogin={handleLogin} />;
            case 'adminUserManagement':
                return currentUser?.role === 'admin'
                       ? <AdminUserManagement users={users} onSave={handleSaveUser} onDelete={handleDeleteUser} currentUser={currentUser} />
                       : <p>Access Denied.</p>; // Show message or redirect
             case 'adminStaffReports':
                return currentUser?.role === 'admin'
                       ? <AdminStaffReportsPage requests={requests} users={users} onBack={handleBackToDashboard} />
                       : <p>Access Denied.</p>; // Show message or redirect

            default:
                 // Default to home page
                return <HomePage onNavigate={() => handleNavigate('request')} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative">
            <Header onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Render the current page */}
                {renderPage()}
            </main>
            {/* Render Error Message Component */}
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
            {/* Modals */}
            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                onConfirm={handleConfirmSubmit}
                formData={formData}
            />
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={handleSuccessClose}
                requestNumber={requestNumber}
            />
            <Footer />
             {/* Global Loading Overlay (Optional) */}
            {isLoading && !errorMessage && (
                 <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
        </div>
    );
};

export default App;
