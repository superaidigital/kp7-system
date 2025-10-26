import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';

// --- Error Boundary Component ---
// คอมโพเนนต์นี้จะดักจับ JavaScript error ที่เกิดขึ้นใน child component tree,
// บันทึก error, และแสดง UI สำรองแทน component เดิมที่แครชไป
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // อัปเดต state เพื่อให้ render ครั้งถัดไปแสดง UI สำรอง
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // สามารถส่ง error ไปยัง service สำหรับ logging ได้ที่นี่
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // UI สำรองที่ต้องการแสดงเมื่อเกิด error
      return (
        <div style={{ fontFamily: "'Sarabun', sans-serif" }} className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-red-600">เกิดข้อผิดพลาดบางอย่าง</h1>
                <p className="text-slate-600 mt-2">ขออภัยในความไม่สะดวก โปรดลองรีเฟรชหน้าเว็บ</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    รีเฟรชหน้า
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);