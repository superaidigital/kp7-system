import React, { useState, useEffect, useCallback } from 'react';
import type { FormData, RequestData } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { RequestForm } from './components/RequestForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SuccessModal } from './components/SuccessModal';
import { StatusTracker } from './components/StatusTracker';
import { CheckStatusPrompt } from './components/CheckStatusPrompt';
import { ManualPage } from './components/ManualPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminRequestDetail } from './components/admin/AdminRequestDetail';
import { AdminReportsPage } from './components/admin/AdminReportsPage';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminStaffReportsPage } from './components/admin/AdminStaffReportsPage';
import { StatusDetailPage } from './components/StatusDetailPage';
import { useLanguage } from './context/LanguageContext';

export type Page = 'home' | 'request' | 'checkStatus' | 'manual' | 'contact' | 'login' | 'adminDashboard' | 'adminDetail' | 'adminReports' | 'statusTracker' | 'adminUserManagement' | 'adminStaffReports' | 'statusDetail';

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
    password?: string;
}

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

// Define the base URL for your API.
// IMPORTANT: Change this to your actual server path if it's different.
// For example: 'http://localhost/my-project/api'
const API_BASE_URL = 'http://localhost/kp7-system/api';

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

    const fetchRequests = useCallback(async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/get_requests.php?role=${currentUser.role}`);
            const result = await response.json();
            if (result.status === 'success') {
                setRequests(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            alert('Failed to load requests data.');
        }
    }, [currentUser]);

    const fetchUsers = useCallback(async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const response = await fetch(`${API_BASE_URL}/get_users.php`);
            const result = await response.json();
            if (result.status === 'success') {
                setUsers(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            alert('Failed to load users data.');
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            Promise.all([fetchRequests(), fetchUsers()]).finally(() => setIsLoading(false));
        }
    }, [currentUser, fetchRequests, fetchUsers]);


    const handleFormSubmit = () => {
        setConfirmationOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setConfirmationOpen(false);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/submit_request.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.status === 'success' && result.requestNumber) {
                setRequestNumber(result.requestNumber);
                setSuccessOpen(true);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error submitting request: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = async () => {
        setSuccessOpen(false);
        await handleCheckStatus(requestNumber, 'statusDetail');
        setFormData(initialFormData);
    };
    
    const handleGoBackHome = () => {
        setFormData(initialFormData);
        setRequestNumber('');
        setTrackedRequest(null);
        setPage('home');
    }

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                setCurrentUser(result.user);
                setPage('adminDashboard');
            } else {
                throw new Error(result.message || t('loginPage.invalidCredentials'));
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : t('loginPage.invalidCredentials'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCheckStatus = async (reqNumber: string, targetPage: Page = 'statusDetail') => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/check_status.php?requestNumber=${encodeURIComponent(reqNumber)}`);
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                setTrackedRequest(result.data);
                setPage(targetPage);
            } else {
                 throw new Error(result.message || t('checkStatus.notFound'));
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : t('checkStatus.notFound'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setRequests([]);
        setUsers([]);
        setPage('home');
    }

    const handleViewDetails = (request: RequestData) => {
        setSelectedRequest(request);
        setPage('adminDetail');
    };
    
    const handleUpdateRequest = async (updatedRequest: RequestData) => {
        try {
            const payload = { ...updatedRequest, updatedBy: currentUser?.username };
            const response = await fetch(`${API_BASE_URL}/update_request.php`, {
                method: 'POST', // Using POST for broader compatibility
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert(t('admin.details.updateSuccess'));
                await fetchRequests(); // Refresh data
                // Also update the selectedRequest to show changes instantly
                const refreshedRequest = requests.find(r => r.requestNumber === updatedRequest.requestNumber);
                if(refreshedRequest) {
                   // This is a bit tricky since fetchRequests is async. A better way is to get the updated object from API response.
                   // For now, we manually update the selected request with the new status/notes.
                    const newHistoryEntry = {
                        status: updatedRequest.status,
                        date: new Date().toISOString(),
                        notes: updatedRequest.notes,
                        updatedBy: currentUser?.username
                    };
                   const requestWithNewHistory = { ...updatedRequest, statusHistory: [...(updatedRequest.statusHistory || []), newHistoryEntry] };
                   setSelectedRequest(requestWithNewHistory);
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
             alert(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleSaveUser = async (user: UserCredentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/save_user.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const result = await response.json();
             if (result.status === 'success') {
                alert(result.message);
                await fetchUsers(); // Refresh users list
                return true; // Indicate success to close modal
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false; // Indicate failure
        }
    };

    const handleDeleteUser = async (user: UserCredentials) => {
         if (user.username === currentUser?.username) {
            alert(t('admin.userManagement.deleteSelfError'));
            return;
        }
        if (window.confirm(t('admin.userManagement.deleteConfirm').replace('{username}', `${user.firstName} ${user.lastName}`))) {
            try {
                const response = await fetch(`${API_BASE_URL}/delete_user.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user.username })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert(t('admin.userManagement.alerts.deleteSuccess'));
                    await fetchUsers(); // Refresh users list
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                alert(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    
    const handleBackToDashboard = () => {
        setSelectedRequest(null);
        setPage('adminDashboard');
    };

    const handleNavigate = (targetPage: Page) => {
        if (targetPage.startsWith('admin') && !currentUser) {
            setPage('login');
        } else {
            setPage(targetPage);
        }
    };
    
    const renderPage = () => {
        if (isLoading && page !== 'home' && page !== 'request') {
             return <div className="text-center p-12">Loading...</div>;
        }

        switch (page) {
            case 'home':
                return <HomePage onNavigate={() => handleNavigate('request')} />;
            case 'request':
                return <RequestForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />;
            case 'checkStatus':
                return <CheckStatusPrompt onCheckStatus={handleCheckStatus} />;
            case 'statusDetail':
                return trackedRequest ? <StatusDetailPage request={trackedRequest} onGoBack={handleGoBackHome} /> : <CheckStatusPrompt onCheckStatus={handleCheckStatus} />;
            case 'manual':
                return <ManualPage />;
            case 'contact':
                return <ContactPage />;
            case 'login':
                return <LoginPage onLogin={handleLogin} />;
            case 'adminDashboard':
                return currentUser && <AdminDashboard requests={requests} onViewDetails={handleViewDetails} currentUser={currentUser} />;
            case 'adminDetail':
                return selectedRequest && currentUser ? <AdminRequestDetail request={selectedRequest} onUpdate={handleUpdateRequest} onBack={handleBackToDashboard} currentUser={currentUser} /> : <p>Request not found</p>;
            case 'adminReports':
                return currentUser && <AdminReportsPage requests={requests} onBack={handleBackToDashboard} currentUser={currentUser}/>;
            case 'adminUserManagement':
                return currentUser?.role === 'admin' && <AdminUserManagement users={users} onSave={handleSaveUser} onDelete={handleDeleteUser} currentUser={currentUser} />;
            case 'adminStaffReports':
                return currentUser?.role === 'admin' && <AdminStaffReportsPage requests={requests} users={users} onBack={handleBackToDashboard} />;
            default:
                return <HomePage onNavigate={() => handleNavigate('request')} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderPage()}
            </main>
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
        </div>
    );
};

export default App;
