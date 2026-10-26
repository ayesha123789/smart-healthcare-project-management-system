import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import User from './models/User.js';
import Milestone from './models/Milestone.js';
import Requirement from './models/Requirement.js';
import WbsItem from './models/WbsItem.js';
import ChangeRequest from './models/ChangeRequest.js';
import Task from './models/Task.js';
import Defect from './models/Defect.js';
import QualityChecklist from './models/QualityChecklist.js';
import Risk from './models/Risk.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_healthcare_db';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    console.log('[Seed] Connected to MongoDB. Clearing existing collections...');

    // Clear existing
    await Promise.all([
      Project.deleteMany({}),
      User.deleteMany({}),
      Milestone.deleteMany({}),
      Requirement.deleteMany({}),
      WbsItem.deleteMany({}),
      ChangeRequest.deleteMany({}),
      Task.deleteMany({}),
      Defect.deleteMany({}),
      QualityChecklist.deleteMany({}),
      Risk.deleteMany({})
    ]);

    console.log('[Seed] Inserting 7 Team Members (Paper Specification)...');
    const users = await User.insertMany([
      { name: 'Dr. Asim Raza', email: 'asim.raza@smarthealth.pk', role: 'Project Manager', responsibilities: 'Project governance, schedule, budget, change approvals, stakeholder management' },
      { name: 'Bilal Ahmed', email: 'bilal.ahmed@smarthealth.pk', role: 'Backend Developer', responsibilities: 'Core REST APIs, appointment engine, telemedicine backend microservices' },
      { name: 'Farhan Ali', email: 'farhan.ali@smarthealth.pk', role: 'Backend Developer', responsibilities: 'EMR storage, lab reports processing, billing integration services' },
      { name: 'Zainab Fatima', email: 'zainab.fatima@smarthealth.pk', role: 'Frontend Developer', responsibilities: 'Patient portal, appointment booking GUI, dashboard telemetry' },
      { name: 'Hamza Tariq', email: 'hamza.tariq@smarthealth.pk', role: 'Frontend Developer', responsibilities: 'Clinician EMR interface, doctor schedules roster, billing screens' },
      { name: 'Usman Siddiqui', email: 'usman.siddiqui@smarthealth.pk', role: 'Database Developer', responsibilities: 'MongoDB schemas, cross-hospital sharding/indexing, data integrity' },
      { name: 'Ayesha Noor', email: 'ayesha.noor@smarthealth.pk', role: 'QA Engineer', responsibilities: 'Test automation, defect tracking, concurrency testing, quality audits' }
    ]);

    const pm = users[0];
    const backendDev1 = users[1];
    const backendDev2 = users[2];
    const frontendDev1 = users[3];
    const frontendDev2 = users[4];
    const dbDev = users[5];
    const qaEngineer = users[6];

    console.log('[Seed] Creating Project Charter & Baseline...');
    const project = await Project.create({
      title: 'Smart Healthcare System for 5 Hospitals',
      description: 'End-to-end multi-hospital enterprise healthcare platform providing automated patient registration, EMR, online appointments, telemetry lab results, doctor schedules, telemedicine, and centralized billing.',
      objectives: [
        'Unify patient records and medical history seamlessly across 5 regional partner hospitals',
        'Eliminate manual appointment queues through automated real-time slot scheduling',
        'Enable remote clinical consultations and instant lab report distribution',
        'Maintain strict ISO/IEC 25010 clinical data integrity and automated project EVM control'
      ],
      hospitalsCount: 5,
      baselineBudget: 5000000,
      revisedBudget: 5000000,
      baselineDurationWeeks: 16,
      revisedDurationWeeks: 16,
      startDate: new Date('2026-07-01'),
      plannedEndDate: new Date('2026-10-21'), // 16 weeks
      status: 'Execution',
      projectManager: pm._id,
      stakeholders: ['Ministry of Health', 'Hospital Board of Directors', 'Lead Chief Medical Officers', 'Head of Clinical IT'],
      charterApproved: true,
      charterApprovalDate: new Date('2026-07-02'),
      closureSummary: '',
      lessonsLearned: []
    });

    console.log('[Seed] Creating 5 Project Milestones...');
    await Milestone.insertMany([
      { milestoneId: 'MS-01', title: 'Requirements Gathering & SRS Sign-off', targetWeek: 2, targetDate: new Date('2026-07-15'), deliverable: 'Approved SRS and scope baseline document', status: 'Achieved', achievedDate: new Date('2026-07-14') },
      { milestoneId: 'MS-02', title: 'System Architecture & Database Design Complete', targetWeek: 4, targetDate: new Date('2026-07-29'), deliverable: 'ERD, MongoDB schema validation, API design blueprint', status: 'Achieved', achievedDate: new Date('2026-07-28') },
      { milestoneId: 'MS-03', title: 'Core Healthcare Modules Development Complete', targetWeek: 10, targetDate: new Date('2026-09-09'), deliverable: 'Patient, EMR, Appointment, Lab, Doctor, Telemedicine, Billing codebases', status: 'In Progress' },
      { milestoneId: 'MS-04', title: 'System Integration & QA Verification', targetWeek: 14, targetDate: new Date('2026-10-07'), deliverable: 'End-to-end integration and concurrency stress test report', status: 'Pending' },
      { milestoneId: 'MS-05', title: 'Final 5-Hospital Deployment & Closure', targetWeek: 16, targetDate: new Date('2026-10-21'), deliverable: 'Live hospital deployment and formal acceptance sign-off', status: 'Pending' }
    ]);

    console.log('[Seed] Creating Requirements Scope Baseline...');
    await Requirement.insertMany([
      { reqId: 'REQ-01', title: 'Unified Patient Registration & Master Index', description: 'Centralized patient registration with national ID verification across 5 hospitals', category: 'Patient Registration', priority: 'High', estimatedCost: 500000, estimatedDuration: '2 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-02', title: 'Electronic Medical Records (EMR) Storage', description: 'Real-time clinician consultation notes, diagnoses, prescriptions, and vitals', category: 'Electronic Medical Records (EMR)', priority: 'High', estimatedCost: 850000, estimatedDuration: '3 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-03', title: 'Online Appointment Scheduling Engine', description: 'Conflict-free appointment slot booking and token generation with doctor calendars', category: 'Online Appointments', priority: 'High', estimatedCost: 700000, estimatedDuration: '3 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-04', title: 'Automated Laboratory Reports System', description: 'Digital sample tracking, lab test results upload, and automated PDF notification', category: 'Laboratory Reports', priority: 'Medium', estimatedCost: 600000, estimatedDuration: '2 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-05', title: 'Doctor Schedules & Multi-Hospital Roster', description: 'Shift scheduling, emergency on-call rotation, and leave tracking across 5 hospitals', category: 'Doctor Schedules', priority: 'Medium', estimatedCost: 450000, estimatedDuration: '2 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-06', title: 'Telemedicine & Video Consultation Portal', description: 'WebRTC encrypted audio/video consultation and e-prescription generator', category: 'Online Consultations / Telemedicine', priority: 'High', estimatedCost: 950000, estimatedDuration: '3 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-07', title: 'Centralized Billing & Invoicing System', description: 'Multi-hospital payment processing, billing for OPD/IPD, lab tests, and insurance', category: 'Billing Management', priority: 'High', estimatedCost: 650000, estimatedDuration: '2 weeks', status: 'Approved', approvalDate: new Date('2026-07-10') },
      { reqId: 'REQ-08', title: 'AI Preliminary Diagnosis Assistant', description: 'Symptom checker and preliminary disease probability model based on vitals', category: 'Security & Non-Functional', priority: 'Medium', estimatedCost: 500000, estimatedDuration: '2 weeks', status: 'Pending' }, // Unapproved initially
      { reqId: 'REQ-09', title: 'Dedicated Patient & Doctor Mobile Apps', description: 'iOS and Android native interfaces for mobile appointment booking and EMR review', category: 'Security & Non-Functional', priority: 'Medium', estimatedCost: 300000, estimatedDuration: '1 week', status: 'Pending' } // Unapproved initially
    ]);

    console.log('[Seed] Creating Hierarchical Work Breakdown Structure (WBS)...');
    await WbsItem.insertMany([
      { code: '1.0', name: 'Project Planning & Governance', parentCode: null, level: 1, category: 'Planning', estimatedCost: 300000, estimatedDuration: '2 weeks' },
      { code: '1.1', name: 'Requirements Elicitation & Analysis', parentCode: '1.0', level: 2, category: 'Planning', estimatedCost: 150000, estimatedDuration: '1 week' },
      { code: '1.2', name: 'Project Charter & Baseline Plan', parentCode: '1.0', level: 2, category: 'Planning', estimatedCost: 150000, estimatedDuration: '1 week' },

      { code: '2.0', name: 'System Architecture & Design', parentCode: null, level: 1, category: 'System Design', estimatedCost: 500000, estimatedDuration: '2 weeks' },
      { code: '2.1', name: 'Database Schemas & Data Model', parentCode: '2.0', level: 2, category: 'System Design', estimatedCost: 200000, estimatedDuration: '1 week' },
      { code: '2.2', name: 'UI/UX Interactive Prototypes', parentCode: '2.0', level: 2, category: 'System Design', estimatedCost: 150000, estimatedDuration: '1 week' },
      { code: '2.3', name: 'REST API & Security Architecture', parentCode: '2.0', level: 2, category: 'System Design', estimatedCost: 150000, estimatedDuration: '1 week' },

      { code: '3.0', name: 'Core Healthcare Modules Development', parentCode: null, level: 1, category: 'Development', estimatedCost: 3200000, estimatedDuration: '6 weeks' },
      { code: '3.1', name: 'Patient Registration & Indexing Module', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 450000, estimatedDuration: '2 weeks' },
      { code: '3.2', name: 'Appointment Scheduling & Conflict Engine', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 650000, estimatedDuration: '2 weeks' },
      { code: '3.3', name: 'Electronic Medical Records (EMR) System', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 700000, estimatedDuration: '3 weeks' },
      { code: '3.4', name: 'Laboratory Reports Integration', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 450000, estimatedDuration: '2 weeks' },
      { code: '3.5', name: 'Doctor Roster & Schedules Management', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 350000, estimatedDuration: '2 weeks' },
      { code: '3.6', name: 'Telemedicine & Video Consultation', parentCode: '3.0', level: 2, category: 'Development', estimatedCost: 600000, estimatedDuration: '3 weeks' },

      { code: '4.0', name: 'Testing & Quality Assurance', parentCode: null, level: 1, category: 'Testing', estimatedCost: 600000, estimatedDuration: '4 weeks' },
      { code: '4.1', name: 'Functional & Module Testing', parentCode: '4.0', level: 2, category: 'Testing', estimatedCost: 200000, estimatedDuration: '2 weeks' },
      { code: '4.2', name: 'Concurrency & Integration Stress Testing', parentCode: '4.0', level: 2, category: 'Testing', estimatedCost: 250000, estimatedDuration: '1 week' },
      { code: '4.3', name: 'Defect Resolution & Verification Audits', parentCode: '4.0', level: 2, category: 'Testing', estimatedCost: 150000, estimatedDuration: '1 week' },

      { code: '5.0', name: 'Deployment, Training & Closure', parentCode: null, level: 1, category: 'Deployment', estimatedCost: 400000, estimatedDuration: '2 weeks' },
      { code: '5.1', name: 'Hospital Infrastructure & Server Deployment', parentCode: '5.0', level: 2, category: 'Deployment', estimatedCost: 200000, estimatedDuration: '1 week' },
      { code: '5.2', name: 'Staff Training & Operational Handover', parentCode: '5.0', level: 2, category: 'Deployment', estimatedCost: 200000, estimatedDuration: '1 week' }
    ]);

    console.log('[Seed] Creating Change Requests (AI Module & Mobile App)...');
    await ChangeRequest.insertMany([
      {
        crId: 'CR-01',
        title: 'AI Preliminary Diagnosis Module',
        description: 'Implement machine learning models to analyze patient vitals and symptoms for preliminary triage recommendations before doctor review.',
        requester: 'Chief Medical Officer (CMO) Council',
        additionalCost: 500000,
        additionalDurationWeeks: 2,
        impactScope: 'Adds clinical AI triage microservice to patient intake workflow',
        impactSchedule: 'Extends timeline by 2 weeks (requires model training and validation)',
        impactBudget: 'Increases budget by PKR 500,000 for AI compute resources & integration',
        status: 'Pending',
        remarks: 'Under evaluation by SPM Change Control Board. Baseline remains unchanged until formal approval.'
      },
      {
        crId: 'CR-02',
        title: 'Patient & Doctor Native Mobile App',
        description: 'Provide Android & iOS native mobile applications for patient booking, prescription viewing, and doctor schedule notifications.',
        requester: 'Director of Healthcare Operations',
        additionalCost: 300000,
        additionalDurationWeeks: 1,
        impactScope: 'Develops React Native client with push notifications',
        impactSchedule: 'Extends project schedule by 1 week for app store submission & testing',
        impactBudget: 'Increases budget by PKR 300,000 for mobile development licenses & UI build',
        status: 'Pending',
        remarks: 'Pending joint review with CR-01. Total potential impact: PKR 800,000 and 3 weeks.'
      }
    ]);

    console.log('[Seed] Creating Project Tasks with Schedule & EVM Costs...');
    await Task.insertMany([
      {
        taskId: 'TSK-01',
        name: 'Requirement Gathering & Clinical Stakeholder Interviews',
        description: 'Interview medical superintendents across 5 hospitals to capture core functional needs',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-14'),
        durationDays: 14,
        assignedTo: pm._id,
        assignedRole: 'Project Manager',
        dependencies: [],
        priority: 'High',
        progress: 100,
        plannedCost: 200000,
        actualCost: 195000,
        status: 'Completed',
        moduleCategory: 'Planning'
      },
      {
        taskId: 'TSK-02',
        name: 'System Architecture & MongoDB Database Schema Design',
        description: 'Design unified database collections, patient master indexing, and sharding strategies',
        startDate: new Date('2026-07-15'),
        endDate: new Date('2026-07-28'),
        durationDays: 14,
        assignedTo: dbDev._id,
        assignedRole: 'Database Developer',
        dependencies: ['TSK-01'],
        priority: 'High',
        progress: 100,
        plannedCost: 300000,
        actualCost: 310000,
        status: 'Completed',
        moduleCategory: 'Design'
      },
      {
        taskId: 'TSK-03',
        name: 'Patient Registration & Multi-Hospital Master Indexing',
        description: 'Build backend APIs and UI for patient onboarding, MRN generation, and validation',
        startDate: new Date('2026-07-29'),
        endDate: new Date('2026-08-18'),
        durationDays: 21,
        assignedTo: backendDev1._id,
        assignedRole: 'Backend Developer',
        dependencies: ['TSK-02'],
        priority: 'High',
        progress: 100,
        plannedCost: 450000,
        actualCost: 440000,
        status: 'Completed',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-04',
        name: 'Appointment Scheduling Engine & Real-time Slot Lock',
        description: 'Develop online booking, concurrency locks, doctor token assignment across 5 hospitals',
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-09-05'),
        durationDays: 26,
        assignedTo: backendDev1._id,
        assignedRole: 'Backend Developer',
        dependencies: ['TSK-03'],
        priority: 'High',
        progress: 75,
        plannedCost: 650000,
        actualCost: 710000,
        status: 'Delayed', // Auto-detected delay scenario from paper!
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-05',
        name: 'Electronic Medical Records (EMR) Clinical Workflow',
        description: 'Build doctor EMR entry, prescriptions, diagnostics history, and vitals recording',
        startDate: new Date('2026-08-15'),
        endDate: new Date('2026-09-12'),
        durationDays: 28,
        assignedTo: backendDev2._id,
        assignedRole: 'Backend Developer',
        dependencies: ['TSK-03'],
        priority: 'High',
        progress: 60,
        plannedCost: 700000,
        actualCost: 680000,
        status: 'In Progress',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-06',
        name: 'Laboratory Reports Sample Tracking & PDF Automation',
        description: 'Integrate pathology lab test results, automated doctor notification and secure download',
        startDate: new Date('2026-08-25'),
        endDate: new Date('2026-09-20'),
        durationDays: 26,
        assignedTo: frontendDev2._id,
        assignedRole: 'Frontend Developer',
        dependencies: ['TSK-05'],
        priority: 'Medium',
        progress: 40,
        plannedCost: 450000,
        actualCost: 420000,
        status: 'In Progress',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-07',
        name: 'Doctor Schedules & Shift Management Portal',
        description: 'Dynamic roster creation, emergency leaves, and cross-hospital shift transfers',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-22'),
        durationDays: 21,
        assignedTo: frontendDev1._id,
        assignedRole: 'Frontend Developer',
        dependencies: ['TSK-04'],
        priority: 'Medium',
        progress: 30,
        plannedCost: 350000,
        actualCost: 320000,
        status: 'In Progress',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-08',
        name: 'Telemedicine Encrypted WebRTC Consultation Portal',
        description: 'Secure audio/video consulting, waiting room queue, and instant digital prescriptions',
        startDate: new Date('2026-09-10'),
        endDate: new Date('2026-10-05'),
        durationDays: 25,
        assignedTo: backendDev2._id,
        assignedRole: 'Backend Developer',
        dependencies: ['TSK-05'],
        priority: 'High',
        progress: 15,
        plannedCost: 600000,
        actualCost: 200000,
        status: 'In Progress',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-09',
        name: 'Centralized Multi-Hospital Billing & Invoice Settlement',
        description: 'OPD/IPD invoicing, lab billing, insurance claims settlement, and receipts generation',
        startDate: new Date('2026-09-15'),
        endDate: new Date('2026-10-08'),
        durationDays: 23,
        assignedTo: frontendDev2._id,
        assignedRole: 'Frontend Developer',
        dependencies: ['TSK-06'],
        priority: 'High',
        progress: 0,
        plannedCost: 550000,
        actualCost: 0,
        status: 'Not Started',
        moduleCategory: 'Development'
      },
      {
        taskId: 'TSK-10',
        name: 'Comprehensive QA Integration, Load & Concurrency Testing',
        description: 'Perform stress tests simulating concurrent bookings across 5 hospitals',
        startDate: new Date('2026-09-25'),
        endDate: new Date('2026-10-14'),
        durationDays: 19,
        assignedTo: qaEngineer._id,
        assignedRole: 'QA Engineer',
        dependencies: ['TSK-04', 'TSK-05', 'TSK-06'],
        priority: 'High',
        progress: 0,
        plannedCost: 400000,
        actualCost: 0,
        status: 'Not Started',
        moduleCategory: 'Testing'
      },
      {
        taskId: 'TSK-11',
        name: 'Hospital Infrastructure Setup & Live Pilot Deployment',
        description: 'Deploy on 5 hospital server nodes, configure backups, train hospital administrative staff',
        startDate: new Date('2026-10-10'),
        endDate: new Date('2026-10-21'),
        durationDays: 11,
        assignedTo: pm._id,
        assignedRole: 'Project Manager',
        dependencies: ['TSK-10'],
        priority: 'High',
        progress: 0,
        plannedCost: 300000,
        actualCost: 0,
        status: 'Not Started',
        moduleCategory: 'Deployment'
      }
    ]);

    console.log('[Seed] Creating Defects (Focusing on Critical Paper Problem Areas)...');
    await Defect.insertMany([
      {
        defectId: 'DEF-01',
        title: 'Appointment Double-Booking Concurrency Collision',
        description: 'When two patients book the exact same 10:15 AM slot for Dr. Salman at Hospital-1 simultaneously, both transactions succeed, creating conflicting tokens.',
        moduleArea: 'Appointment Scheduling',
        severity: 'Critical',
        priority: 'P1 - Blocker',
        assignedTo: backendDev1._id,
        status: 'Open',
        resolutionDetails: 'Root cause identified in non-atomic MongoDB write lock. Distributed redis lock or atomic findOneAndUpdate with slot reservation required.'
      },
      {
        defectId: 'DEF-02',
        title: 'Duplicate Medical Record Number (MRN) Assignment Across Hospital 2 & 4',
        description: 'Patient registered at Hospital-2 was assigned MRN-90214 which was concurrently generated at Hospital-4, causing patient history record collision.',
        moduleArea: 'Patient Record Management',
        severity: 'Critical',
        priority: 'P1 - Blocker',
        assignedTo: dbDev._id,
        status: 'In Progress',
        resolutionDetails: 'Need compound unique index on { hospitalPrefix, mrnSequence } and centralized sequence counter.'
      },
      {
        defectId: 'DEF-03',
        title: 'Pathology Lab Report PDF Download Gateway Timeout',
        description: 'Reports containing more than 15 scanned pages cause Nginx 504 Gateway Timeout during client download.',
        moduleArea: 'Laboratory Reports',
        severity: 'Medium',
        priority: 'P3 - Normal',
        assignedTo: backendDev2._id,
        status: 'Fixed',
        resolutionDetails: 'Added asynchronous PDF rendering with presigned S3/local streaming storage URL.',
        resolvedDate: new Date('2026-09-02')
      },
      {
        defectId: 'DEF-04',
        title: 'Doctor Shift Schedule Calendar Overlap Validation Warning',
        description: 'Doctor roster allows scheduling a doctor for night emergency shift in Hospital-3 and morning OPD in Hospital-1 without 6-hour buffer warning.',
        moduleArea: 'Doctor Schedules',
        severity: 'Low',
        priority: 'P4 - Low',
        assignedTo: frontendDev1._id,
        status: 'Open',
        resolutionDetails: ''
      }
    ]);

    console.log('[Seed] Creating Clinical Quality Verification Checklists...');
    await QualityChecklist.insertMany([
      { itemCode: 'QC-01', title: 'Patient Record Multi-Hospital Data Integrity', description: 'Ensure MRNs are globally unique and historical encounters are immutable across all 5 hospitals.', responsibleRole: 'Database Developer', status: 'Passed', verifiedDate: new Date('2026-08-19'), remarks: 'Verified with 5,000 synthetic patient records.' },
      { itemCode: 'QC-02', title: 'Appointment Booking Concurrency & Slot Isolation', description: 'Simulate 50 simultaneous booking requests on the same slot without double allocation.', responsibleRole: 'QA Engineer', status: 'Failed', verifiedDate: new Date('2026-08-28'), remarks: 'Failed under 25 concurrent requests (Defect DEF-01 logged).' },
      { itemCode: 'QC-03', title: 'Doctor Roster Calendar Consistency', description: 'Verify no conflicting shifts or unapproved leaves exist in published rosters.', responsibleRole: 'QA Engineer', status: 'Passed', verifiedDate: new Date('2026-09-01'), remarks: 'Roster logic verified across 45 active doctors.' },
      { itemCode: 'QC-04', title: 'Laboratory Report Patient-ID Association Audit', description: 'Confirm every lab result strictly verifies barcode and national ID before report release.', responsibleRole: 'QA Engineer', status: 'Passed', verifiedDate: new Date('2026-09-05'), remarks: 'Zero mismatched lab reports observed in batch test.' },
      { itemCode: 'QC-05', title: 'Billing Calculation & Currency Precision', description: 'Verify taxes, discount authorizations, and insurance co-pay splits calculate accurately down to 2 decimals.', responsibleRole: 'Backend Developer', status: 'Pending', remarks: 'Awaiting completion of billing integration task.' },
      { itemCode: 'QC-06', title: 'API Response Time & ISO 25010 Latency Standard', description: '95% of standard patient lookup and appointment queries must resolve within 400ms.', responsibleRole: 'Backend Developer', status: 'Passed', verifiedDate: new Date('2026-08-20'), remarks: 'Average latency benchmarked at 180ms.' },
      { itemCode: 'QC-07', title: 'Strict Input Validation & Sanitization', description: 'Verify all clinical forms prevent SQL/NoSQL injection, XSS, and negative monetary values.', responsibleRole: 'QA Engineer', status: 'Passed', verifiedDate: new Date('2026-08-15'), remarks: 'Frontend & backend validation schemas verified.' },
      { itemCode: 'QC-08', title: 'Critical Defects Sign-off Gatekeeper', description: 'No release or milestone sign-off permitted while P1/Critical defects remain unresolved.', responsibleRole: 'Project Manager', status: 'Pending', remarks: 'Blocked by DEF-01 and DEF-02.' }
    ]);

    console.log('[Seed] Creating 5x5 Risk Matrix & PDPC Contingency Response Plan...');
    await Risk.insertMany([
      {
        riskId: 'RSK-01',
        title: 'Appointment Scheduling Module Engine Failure',
        description: 'High-volume morning booking peaks cause thread pool exhaustion or race conditions leading to service downtime across hospitals.',
        likelihood: 4,
        impact: 5,
        failureMode: 'Server crashes during peak morning registration hours (8:00 AM - 10:00 AM); patient queues form at hospital entrances.',
        preventiveAction: 'Implement Redis distributed caching, message queues (RabbitMQ/BullMQ), and connection pooling with rate limiting.',
        contingencyPlan: 'Trigger automated fallback to standby node, notify clinic coordinators via SMS, and enable offline token dispensing with later reconciliation.',
        owner: 'Backend Developer (Bilal Ahmed)',
        status: 'Active'
      },
      {
        riskId: 'RSK-02',
        title: 'Patient Medical Record Duplication Across Hospitals',
        description: 'Network partition between regional hospital branches results in unsynced local offline registries and duplicate patient identity generation.',
        likelihood: 3,
        impact: 5,
        failureMode: 'A patient treated at Hospital-1 has a severe penicillin allergy that is not visible when they are admitted at Hospital-4.',
        preventiveAction: 'Enforce National CNIC/ID verification at point of registration, implement two-phase commit or event-driven sync on reconnection.',
        contingencyPlan: 'Run nightly automated deduplication scripts; clinical staff receives merge-review prompt on any suspicious phonetic match.',
        owner: 'Database Developer (Usman Siddiqui)',
        status: 'Active'
      },
      {
        riskId: 'RSK-03',
        title: 'Schedule Delay Due to Scope Expansion (AI & Mobile App)',
        description: 'Stakeholder pressure to introduce AI preliminary triage and native mobile apps without formal schedule buffer expansion.',
        likelihood: 3,
        impact: 4,
        failureMode: 'Core testing is rushed; unstable version deployed to hospitals.',
        preventiveAction: 'Strict Change Control Board (CCB) process: No development begins until PKR 800k budget and 3-week extension are formally signed off.',
        contingencyPlan: 'Reassign frontend developers from non-critical modules; stagger mobile app release to Phase 2 (post-week 16).',
        owner: 'Project Manager (Dr. Asim Raza)',
        status: 'Active'
      },
      {
        riskId: 'RSK-04',
        title: 'Doctor Resistance to Digital Roster & Telemedicine',
        description: 'Senior medical consultants reluctant to use new digital schedule portal, leading to manual paper-based scheduling.',
        likelihood: 3,
        impact: 3,
        failureMode: 'Doctors fail to log in for online telemedicine appointments, leading to patient complaints.',
        preventiveAction: 'Conduct hands-on department workshops; provide intuitive 1-click mobile check-in.',
        contingencyPlan: 'Hospital administration desk assigns medical officers as co-pilots during initial 30 days.',
        owner: 'Project Manager (Dr. Asim Raza)',
        status: 'Active'
      },
      {
        riskId: 'RSK-05',
        title: 'Minor UI Stutter on Low-Bandwidth Hospital Outpost Terminals',
        description: 'Rural hospital branches experience low latency internet causing minor UI lag during initial page bundle load.',
        likelihood: 2,
        impact: 2,
        failureMode: 'Page takes 3-4 seconds to render on outdated hospital desk computers.',
        preventiveAction: 'Enable gzip compression, service worker caching, and code-splitting across React route boundaries.',
        contingencyPlan: 'Deploy local offline proxy cache server inside each hospital LAN.',
        owner: 'Frontend Developer (Zainab Fatima)',
        status: 'Active'
      }
    ]);

    console.log('[Seed] Database successfully seeded with 100% paper requirements!');
    return { success: true, message: 'Database successfully seeded with authentic Smart Healthcare paper dataset.' };
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

// If run directly via node seedData.js
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => {
    console.log('[Seed CLI] Completed successfully. Exiting.');
    process.exit(0);
  }).catch((err) => {
    console.error('[Seed CLI] Failed:', err);
    process.exit(1);
  });
}
