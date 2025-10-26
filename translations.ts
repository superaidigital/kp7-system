export const translations = {
  th: {
    header: {
      title: 'ระบบคำขอ ก.พ. 7',
      home: 'หน้าหลัก',
      newRequest: 'ยื่นคำขอใหม่',
      checkStatus: 'ตรวจสอบสถานะ',
      manual: 'คู่มือการใช้งาน',
      contact: 'ติดต่อเรา',
      adminLogin: 'สำหรับเจ้าหน้าที่',
      dashboard: 'แดชบอร์ด',
      reports: 'รายงาน',
      staffReports: 'รายงานเจ้าหน้าที่',
      userManagement: 'จัดการผู้ใช้',
      welcome: 'ยินดีต้อนรับ',
      logout: 'ออกจากระบบ',
    },
    footer: {
      copyright: '© {year} องค์การบริหารส่วนจังหวัดศรีสะเกษ สงวนลิขสิทธิ์',
      developedBy: 'พัฒนาโดย ทีมเทคโนโลยีสารสนเทศ อบจ.ศรีสะเกษ',
    },
    home: {
      heroTitle: 'ระบบยื่นคำร้องขอสำเนาทะเบียนประวัติ (ก.พ. 7)',
      heroSubtitle: 'บริการยื่นคำร้องขอสำเนาทะเบียนประวัติ (ก.พ. 7) ของ อบจ.ศรีสะเกษ ได้อย่างสะดวก รวดเร็ว และติดตามสถานะได้ทุกที่ทุกเวลา',
      ctaButton: 'ยื่นคำขอทันที',
      featuresTitle: 'คุณสมบัติเด่น',
      feature1Title: 'รวดเร็วและง่าย',
      feature1Body: 'กรอกแบบฟอร์มออนไลน์ได้ในไม่กี่ขั้นตอน ลดระยะเวลาในการเดินทางและรอคิว',
      feature2Title: 'ปลอดภัยและเชื่อถือได้',
      feature2Body: 'ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัยตามนโยบายคุ้มครองข้อมูลส่วนบุคคล',
      feature3Title: 'ติดตามได้',
      feature3Body: 'ตรวจสอบสถานะคำขอของคุณได้ตลอด 24 ชั่วโมง ผ่านหมายเลขคำขอ',
    },
    form: {
      requesterInfo: {
        title: 'ข้อมูลผู้ยื่นคำขอ',
        prefix: 'คำนำหน้า',
        prefixOptions: { mr: 'นาย', mrs: 'นาง', ms: 'นางสาว', other: 'อื่นๆ' },
        otherPrefix: 'ระบุ',
        firstName: 'ชื่อ',
        lastName: 'นามสกุล',
        nationalId: 'เลขประจำตัวประชาชน',
        position: 'ตำแหน่ง',
        department: 'หน่วยงาน/สังกัด',
      },
      contactInfo: {
        title: 'ข้อมูลติดต่อ',
        phone: 'หมายเลขโทรศัพท์',
        email: 'อีเมล',
      },
      requestDetails: {
        title: 'รายละเอียดคำขอ',
        purpose: 'วัตถุประสงค์ในการขอ',
        purposePlaceholder: 'เช่น เพื่อใช้ประกอบการสมัครศึกษาต่อ, เพื่อปรับวุฒิการศึกษา',
        quantity: 'จำนวน (ชุด)',
        deliveryMethod: 'วิธีการรับเอกสาร',
        deliveryOptions: { pickup: 'รับด้วยตนเอง', postal: 'จัดส่งทางไปษณีย์', email: 'จัดส่งทางอีเมล' },
        shippingAddress: 'ที่อยู่ในการจัดส่ง',
      },
      validation: {
        specify: 'กรุณาระบุ',
        firstName: 'กรุณากรอกชื่อ',
        lastName: 'กรุณากรอกนามสกุล',
        nationalId: 'กรุณากรอกเลขประจำตัวประชาชน 13 หลักให้ถูกต้อง',
        position: 'กรุณากรอกตำแหน่ง',
        department: 'กรุณากรอกหน่วยงาน',
        phone: 'กรุณากรอกหมายเลขโทรศัพท์ 10 หลักให้ถูกต้อง',
        email: 'กรุณากรอกอีเมลให้ถูกต้อง',
        purpose: 'กรุณาระบุวัตถุประสงค์',
        quantity: 'กรุณาระบุจำนวน',
        shippingAddress: 'กรุณากรอกที่อยู่ในการจัดส่ง',
      },
      submitButton: 'ยื่นคำขอ',
    },
    confirmationModal: {
      title: 'ยืนยันข้อมูลคำขอ',
      summaryTitle: 'สรุปรายละเอียดคำขอ',
      summary: {
        name: 'ชื่อ-นามสกุล',
        nationalId: 'เลขประจำตัวประชาชน',
        position: 'ตำแหน่ง',
        department: 'หน่วยงาน',
        phone: 'โทรศัพท์',
        email: 'อีเมล',
        purpose: 'วัตถุประสงค์',
        quantity: 'จำนวน',
        quantityUnit: 'ชุด',
        deliveryMethod: 'วิธีการรับ',
        shippingAddress: 'ที่อยู่จัดส่ง',
      },
      pdpa: {
        title: 'การคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
        readPolicy: {
          prefix: 'โปรดอ่านและทำความเข้าใจ',
          link: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',
        },
        consent: {
          processing: {
            title: 'การประมวลผล:',
            body: 'ข้าพเจ้ายินยอมให้ อบจ.ศรีสะเกษ เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของข้าพเจ้าเพื่อวัตถุประสงค์ในการดำเนินการตามคำขอนี้',
          },
          storage: {
            title: 'การจัดเก็บ:',
            body: 'ข้อมูลจะถูกจัดเก็บตามระยะเวลาที่กฎหมายกำหนดเพื่อการตรวจสอบและอ้างอิง',
          },
          rights: {
            title: 'สิทธิของเจ้าของข้อมูล:',
            body: 'ท่านมีสิทธิในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของท่านตามที่กฎหมายกำหนด',
          },
        },
        checkboxLabel: 'ข้าพเจ้าได้อ่านและยอมรับข้อตกลงและเงื่อนไข',
        checkboxSublabel: 'การยินยอมนี้จำเป็นต่อการดำเนินการ',
      },
      cancelButton: 'แก้ไขข้อมูล',
      confirmButton: 'ยืนยันการยื่นคำขอ',
    },
    successModal: {
      title: 'ยื่นคำขอสำเร็จ!',
      body: 'ระบบได้รับคำขอของคุณเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลให้ทราบต่อไป',
      reference: {
        prefix: 'โปรดจด',
        label: 'หมายเลขคำขอ',
        suffix: 'เพื่อใช้ในการติดตามสถานะ',
      },
      trackButton: 'ติดตามสถานะคำขอ',
    },
    statusTracker: {
      title: 'ติดตามสถานะคำขอ',
      referenceLabel: 'หมายเลขคำขอของคุณคือ:',
      keepReference: 'โปรดเก็บหมายเลขนี้ไว้เพื่อใช้ในการตรวจสอบสถานะในอนาคต',
      currentStatusTitle: 'สถานะปัจจุบัน',
      status: {
        pending: {
          title: 'รอดำเนินการ',
          description: 'ระบบได้รับคำขอของท่านแล้ว และกำลังรอเจ้าหน้าที่ตรวจสอบ',
        },
      },
      newRequestButton: 'ยื่นคำขอใหม่',
    },
    checkStatus: {
      title: 'ตรวจสอบสถานะคำขอ',
      inputLabel: 'หมายเลขคำขอ',
      inputPlaceholder: 'ตัวอย่าง: REQ-1689253401569',
      submitButton: 'ตรวจสอบสถานะ',
      notFound: 'ไม่พบข้อมูลคำขอหมายเลขนี้',
    },
    statusDetail: {
        title: 'รายละเอียดสถานะคำขอ',
        requestNumber: 'หมายเลขคำขอ:',
        submissionDate: 'วันที่ยื่นคำขอ:',
        currentStatus: 'สถานะปัจจุบัน',
        historyTitle: 'ประวัติการดำเนินการ',
        timeline: {
            updatedBy: 'โดย:',
            notes: 'บันทึก:',
        }
    },
    manual: {
      title: 'คู่มือการใช้งานระบบ',
      step1Title: 'ขั้นตอนที่ 1: กรอกแบบฟอร์มคำขอ',
      step1Body: 'ไปที่หน้า "ยื่นคำขอใหม่" และกรอกข้อมูลส่วนตัว ข้อมูลติดต่อ และรายละเอียดคำขอให้ครบถ้วนและถูกต้อง',
      step2Title: 'ขั้นตอนที่ 2: ยืนยันข้อมูล',
      step2Body: 'ตรวจสอบความถูกต้องของข้อมูลทั้งหมดในหน้าสรุป อ่านและยอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล จากนั้นกดยืนยันการยื่นคำขอ',
      step3Title: 'ขั้นตอนที่ 3: รับหมายเลขคำขอ',
      step3Body: 'เมื่อยื่นคำขอสำเร็จ ระบบจะแสดงหมายเลขคำขอของคุณ โปรดจดหมายเลขนี้ไว้เพื่อใช้ในการติดตามสถานะ',
      step4Title: 'ขั้นตอนที่ 4: ตรวจสอบสถานะ',
      step4Body: 'ไปที่หน้า "ตรวจสอบสถานะ" และกรอกหมายเลขคำขอของคุณเพื่อดูความคืบหน้าล่าสุดของการดำเนินการ',
    },
    contactPage: {
      title: 'ติดต่อเรา',
      infoTitle: 'ข้อมูลการติดต่อ',
      address: 'ที่อยู่',
      addressValue: 'องค์การบริหารส่วนจังหวัดศรีสะเกษ 1000 หมู่ 12 ถ.เลี่ยงเมือง ต.โพธิ์ อ.เมืองศรีสะเกษ จ.ศรีสะเกษ 33000',
      phone: 'โทรศัพท์',
      email: 'อีเมล',
      hours: 'เวลาทำการ',
      hoursValue: 'วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น.',
      mapTitle: 'แผนที่',
    },
    loginPage: {
        title: 'เข้าสู่ระบบสำหรับเจ้าหน้าที่',
        usernameLabel: 'ชื่อผู้ใช้',
        usernamePlaceholder: 'ชื่อผู้ใช้',
        passwordLabel: 'รหัสผ่าน',
        passwordPlaceholder: 'รหัสผ่าน',
        rememberMe: 'จดจำฉันไว้ในระบบ',
        forgotPassword: 'ลืมรหัสผ่าน?',
        submitButton: 'เข้าสู่ระบบ',
        invalidCredentials: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
    },
    admin: {
        dashboard: {
            title: 'แดชบอร์ดจัดการคำขอ',
            subtitle: 'ภาพรวมและจัดการคำขอทั้งหมด',
            stats: {
                total: 'คำขอทั้งหมด',
                pending: 'รอดำเนินการ',
                inProgress: 'กำลังดำเนินการ',
                completed: 'เสร็จสิ้น'
            },
            searchPlaceholder: 'ค้นหาด้วยเลขคำขอ, ชื่อ, หรือเลข ปชช.',
            allStatuses: 'ทุกสถานะ',
            table: {
                requestNumber: 'เลขที่คำขอ',
                name: 'ชื่อผู้ขอ',
                date: 'วันที่ยื่น',
                status: 'สถานะ',
                actions: 'จัดการ'
            },
            viewDetails: 'ดูรายละเอียด',
            noResults: 'ไม่พบคำขอที่ตรงกับเงื่อนไขการค้นหา',
        },
        details: {
            title: 'รายละเอียดคำขอ',
            backButton: 'กลับไปหน้าแดชบอร์ด',
            requesterInfo: 'ข้อมูลผู้ขอ',
            contactInfo: 'ข้อมูลติดต่อ',
            requestDetails: 'รายละเอียดคำขอ',
            updateStatusSection: 'อัปเดตสถานะ',
            newStatusLabel: 'สถานะใหม่',
            notesLabel: 'บันทึกเพิ่มเติม (สำหรับเจ้าหน้าที่)',
            notesPlaceholder: 'เช่น เอกสารไม่ครบ, รอการอนุมัติ',
            updateButton: 'อัปเดตสถานะ',
            updateSuccess: 'อัปเดตสถานะคำขอสำเร็จแล้ว'
        },
        reports: {
            title: 'รายงานสรุป',
            backButton: 'กลับไปหน้าแดชบอร์ด',
            totalRequests: 'คำขอทั้งหมด',
            requestsByStatus: 'คำขอตามสถานะ',
            requestsByDelivery: 'คำขอตามวิธีการรับ',
            noData: 'ยังไม่มีข้อมูล',
            exportCsv: 'ส่งออกเป็น CSV',
            csv: {
                statistic: 'สถิติ',
                value: 'ค่า',
                status: 'สถานะ',
                count: 'จำนวน',
                deliveryMethod: 'วิธีการรับ'
            }
        },
        staffReports: {
            title: 'รายงานประสิทธิภาพเจ้าหน้าที่',
            backButton: 'กลับไปหน้าแดชบอร์ด',
            totalHandled: 'คำขอที่จัดการแล้ว',
            totalStaff: 'จำนวนเจ้าหน้าที่',
            requestsHandledByUser: 'จำนวนคำขอที่จัดการโดยแต่ละคน',
            noData: 'ยังไม่มีข้อมูลการดำเนินการ',
        },
        userManagement: {
            title: 'จัดการผู้ใช้งานระบบ',
            addUser: 'เพิ่มผู้ใช้ใหม่',
            deleteSelfError: 'คุณไม่สามารถลบตัวเองได้',
            deleteConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ {username}?',
            alerts: {
                deleteSuccess: 'ลบผู้ใช้สำเร็จ',
                updateSuccess: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
                usernameExists: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว',
                addSuccess: 'เพิ่มผู้ใช้ใหม่สำเร็จ',
            },
            table: {
                username: 'ชื่อผู้ใช้',
                fullName: 'ชื่อ-นามสกุล',
                position: 'ตำแหน่ง',
                role: 'สิทธิ์',
                actions: 'จัดการ'
            },
            edit: 'แก้ไข',
            delete: 'ลบ',
            modal: {
                editTitle: 'แก้ไขข้อมูลผู้ใช้',
                addTitle: 'เพิ่มผู้ใช้ใหม่',
                usernameLabel: 'ชื่อผู้ใช้',
                passwordLabel: 'รหัสผ่าน',
                passwordPlaceholder: 'เว้นว่างไว้หากไม่ต้องการเปลี่ยน',
                firstNameLabel: 'ชื่อจริง',
                lastNameLabel: 'นามสกุล',
                positionLabel: 'ตำแหน่ง',
                phoneLabel: 'โทรศัพท์',
                emailLabel: 'อีเมล',
                roleLabel: 'สิทธิ์การใช้งาน',
                roleOptions: { hr: 'เจ้าหน้าที่ (HR)', admin: 'ผู้ดูแลระบบ (Admin)' },
                cancel: 'ยกเลิก',
                save: 'บันทึก',
            }
        },
        status: {
            pending: 'รอดำเนินการ',
            in_progress: 'กำลังดำเนินการ',
            ready_for_pickup: 'พร้อมให้มารับ',
            shipped: 'จัดส่งแล้ว',
            emailed: 'ส่งอีเมลแล้ว',
            completed: 'เสร็จสิ้น',
            rejected: 'ปฏิเสธ',
            hr_officer: 'ส่งต่อเจ้าหน้าที่ HR',
            admin_officer: 'ส่งต่อผู้ดูแลระบบ'
        }
    }
  },
  en: {
    header: {
      title: 'Kor Por 7 Request System',
      home: 'Home',
      newRequest: 'New Request',
      checkStatus: 'Check Status',
      manual: 'Manual',
      contact: 'Contact Us',
      adminLogin: 'For Staff',
      dashboard: 'Dashboard',
      reports: 'Reports',
      staffReports: 'Staff Reports',
      userManagement: 'User Management',
      welcome: 'Welcome',
      logout: 'Logout',
    },
    footer: {
      copyright: '© {year} Sisaket Provincial Administrative Organization. All Rights Reserved.',
      developedBy: 'Developed by Sisaket PAO IT Team',
    },
    home: {
      heroTitle: 'Personnel Record (Kor Por 7) Copy Request System',
      heroSubtitle: 'Conveniently apply for a copy of your Personnel Record (Kor Por 7) from Sisaket PAO. Fast, easy, and trackable anytime, anywhere.',
      ctaButton: 'Apply Now',
      featuresTitle: 'Key Features',
      feature1Title: 'Fast & Easy',
      feature1Body: 'Fill out the online form in just a few steps, reducing travel and waiting time.',
      feature2Title: 'Secure & Reliable',
      feature2Body: 'Your information is kept secure in accordance with our privacy policy.',
      feature3Title: 'Trackable',
      feature3Body: 'Check the status of your request 24/7 using your request number.',
    },
    form: {
      requesterInfo: {
        title: 'Requester Information',
        prefix: 'Prefix',
        prefixOptions: { mr: 'Mr.', mrs: 'Mrs.', ms: 'Ms.', other: 'Other' },
        otherPrefix: 'Specify',
        firstName: 'First Name',
        lastName: 'Last Name',
        nationalId: 'National ID',
        position: 'Position',
        department: 'Department/Agency',
      },
      contactInfo: {
        title: 'Contact Information',
        phone: 'Phone Number',
        email: 'Email',
      },
      requestDetails: {
        title: 'Request Details',
        purpose: 'Purpose of Request',
        purposePlaceholder: 'e.g., For further education application, For salary adjustment',
        quantity: 'Quantity (sets)',
        deliveryMethod: 'Delivery Method',
        deliveryOptions: { pickup: 'Self Pickup', postal: 'By Mail', email: 'By Email' },
        shippingAddress: 'Shipping Address',
      },
      validation: {
        specify: 'Please specify',
        firstName: 'Please enter your first name',
        lastName: 'Please enter your last name',
        nationalId: 'Please enter a valid 13-digit National ID',
        position: 'Please enter your position',
        department: 'Please enter your department',
        phone: 'Please enter a valid 10-digit phone number',
        email: 'Please enter a valid email address',
        purpose: 'Please state the purpose of your request',
        quantity: 'Please enter the quantity',
        shippingAddress: 'Please enter the shipping address',
      },
      submitButton: 'Submit Request',
    },
    confirmationModal: {
      title: 'Confirm Request Information',
      summaryTitle: 'Request Summary',
      summary: {
        name: 'Full Name',
        nationalId: 'National ID',
        position: 'Position',
        department: 'Department',
        phone: 'Phone',
        email: 'Email',
        purpose: 'Purpose',
        quantity: 'Quantity',
        quantityUnit: 'sets',
        deliveryMethod: 'Delivery Method',
        shippingAddress: 'Shipping Address',
      },
      pdpa: {
        title: 'Personal Data Protection Act (PDPA)',
        readPolicy: {
          prefix: 'Please read and understand our',
          link: 'Personal Data Protection Policy',
        },
        consent: {
            processing: {
                title: 'Processing:',
                body: 'I consent to Sisaket PAO collecting and using my personal data for the purpose of processing this request.'
            },
            storage: {
                title: 'Storage:',
                body: 'The data will be stored for the period required by law for auditing and reference purposes.'
            },
            rights: {
                title: 'Data Subject Rights:',
                body: 'You have the right to access, correct, or delete your personal data as permitted by law.'
            }
        },
        checkboxLabel: 'I have read and agree to the terms and conditions',
        checkboxSublabel: 'Consent is required to proceed.',
      },
      cancelButton: 'Edit Information',
      confirmButton: 'Confirm Submission',
    },
    successModal: {
      title: 'Request Submitted Successfully!',
      body: 'We have received your request. Our staff will review it and notify you of the progress.',
      reference: {
        prefix: 'Please note your',
        label: 'Request Number',
        suffix: 'for tracking purposes.',
      },
      trackButton: 'Track My Request',
    },
    statusTracker: {
      title: 'Track Request Status',
      referenceLabel: 'Your request number is:',
      keepReference: 'Please keep this number for future status checks.',
      currentStatusTitle: 'Current Status',
      status: {
        pending: {
          title: 'Pending',
          description: 'Your request has been received and is waiting for an officer to review.',
        },
      },
      newRequestButton: 'Make a New Request',
    },
    checkStatus: {
      title: 'Check Request Status',
      inputLabel: 'Request Number',
      inputPlaceholder: 'e.g., REQ-1689253401569',
      submitButton: 'Check Status',
      notFound: 'Request number not found.',
    },
     statusDetail: {
        title: 'Request Status Details',
        requestNumber: 'Request Number:',
        submissionDate: 'Submission Date:',
        currentStatus: 'Current Status',
        historyTitle: 'Processing History',
        timeline: {
            updatedBy: 'by:',
            notes: 'Notes:',
        }
    },
    manual: {
      title: 'User Manual',
      step1Title: 'Step 1: Fill out the Request Form',
      step1Body: 'Go to the "New Request" page and fill in your personal, contact, and request details completely and accurately.',
      step2Title: 'Step 2: Confirm Your Information',
      step2Body: 'Review all the information on the summary page. Read and accept the privacy policy, then confirm your submission.',
      step3Title: 'Step 3: Receive Your Request Number',
      step3Body: 'Upon successful submission, the system will display your request number. Please write it down for tracking.',
      step4Title: 'Step 4: Check Your Status',
      step4Body: 'Go to the "Check Status" page and enter your request number to see the latest updates on your request.',
    },
    contactPage: {
      title: 'Contact Us',
      infoTitle: 'Contact Information',
      address: 'Address',
      addressValue: 'Sisaket Provincial Administrative Organization, 1000 Moo 12, Liang Mueang Rd., Phot, Mueang Sisaket, Sisaket 33000',
      phone: 'Phone',
      email: 'Email',
      hours: 'Office Hours',
      hoursValue: 'Monday - Friday, 8:30 AM - 4:30 PM',
      mapTitle: 'Map',
    },
     loginPage: {
        title: 'Staff Login',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Username',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submitButton: 'Sign in',
        invalidCredentials: 'Invalid username or password.'
    },
    admin: {
        dashboard: {
            title: 'Request Management Dashboard',
            subtitle: 'Overview and management of all requests.',
            stats: {
                total: 'Total Requests',
                pending: 'Pending',
                inProgress: 'In Progress',
                completed: 'Completed'
            },
            searchPlaceholder: 'Search by Request No., Name, or National ID',
            allStatuses: 'All Statuses',
            table: {
                requestNumber: 'Request No.',
                name: 'Requester Name',
                date: 'Date',
                status: 'Status',
                actions: 'Actions'
            },
            viewDetails: 'View Details',
            noResults: 'No requests match the search criteria.',
        },
        details: {
            title: 'Request Details',
            backButton: 'Back to Dashboard',
            requesterInfo: 'Requester Info',
            contactInfo: 'Contact Info',
            requestDetails: 'Request Details',
            updateStatusSection: 'Update Status',
            newStatusLabel: 'New Status',
            notesLabel: 'Internal Notes (for staff)',
            notesPlaceholder: 'e.g., Incomplete documents, waiting for approval',
            updateButton: 'Update Status',
            updateSuccess: 'Request status updated successfully.'
        },
        reports: {
            title: 'Summary Reports',
            backButton: 'Back to Dashboard',
            totalRequests: 'Total Requests',
            requestsByStatus: 'Requests by Status',
            requestsByDelivery: 'Requests by Delivery Method',
            noData: 'No data available yet.',
            exportCsv: 'Export to CSV',
            csv: {
                statistic: 'Statistic',
                value: 'Value',
                status: 'Status',
                count: 'Count',
                deliveryMethod: 'Delivery Method'
            }
        },
        staffReports: {
            title: 'Staff Performance Report',
            backButton: 'Back to Dashboard',
            totalHandled: 'Total Handled Requests',
            totalStaff: 'Total Staff Members',
            requestsHandledByUser: 'Requests Handled per User',
            noData: 'No handling data available yet.',
        },
        userManagement: {
            title: 'User Management',
            addUser: 'Add New User',
            deleteSelfError: 'You cannot delete your own account.',
            deleteConfirm: 'Are you sure you want to delete the user {username}?',
             alerts: {
                deleteSuccess: 'User deleted successfully.',
                updateSuccess: 'User updated successfully.',
                usernameExists: 'This username already exists.',
                addSuccess: 'New user added successfully.',
            },
            table: {
                username: 'Username',
                fullName: 'Full Name',
                position: 'Position',
                role: 'Role',
                actions: 'Actions'
            },
            edit: 'Edit',
            delete: 'Delete',
            modal: {
                editTitle: 'Edit User',
                addTitle: 'Add New User',
                usernameLabel: 'Username',
                passwordLabel: 'Password',
                passwordPlaceholder: 'Leave blank to keep current password',
                firstNameLabel: 'First Name',
                lastNameLabel: 'Last Name',
                positionLabel: 'Position',
                phoneLabel: 'Phone',
                emailLabel: 'Email',
                roleLabel: 'Role',
                roleOptions: { hr: 'Staff (HR)', admin: 'Administrator (Admin)' },
                cancel: 'Cancel',
                save: 'Save',
            }
        },
        status: {
            pending: 'Pending',
            in_progress: 'In Progress',
            ready_for_pickup: 'Ready for Pickup',
            shipped: 'Shipped',
            emailed: 'Emailed',
            completed: 'Completed',
            rejected: 'Rejected',
            hr_officer: 'Forwarded to HR',
            admin_officer: 'Forwarded to Admin'
        }
    }
  }
};

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : '') extends infer D ? Extract<D, string> : never;

export type TranslationKeys = DotNestedKeys<typeof translations.en>;