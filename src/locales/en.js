/**
 * locales/en.js — English Dictionary
 */

const en = {
  // ──────────────────────────────────────────
  // GLOBAL
  // ──────────────────────────────────────────
  lang:          'EN',
  langFull:      'English',
  langSwitch:    'Indonesia',

  appName:       'Cardiomegaly ODGJ',
  institution:   'RSJ Tampan Riau',
  systemName:    'Digital Analysis System',

  save:          'Save',
  cancel:        'Cancel',
  close:         'Close',
  back:          'Back',
  next:          'Next',
  reset:         'Reset',
  detail:        'Detail',
  viewAll:       'View All',
  loading:       'Loading data...',
  noData:        'No examination data available.',
  error:         'An error occurred.',
  success:       'Settings saved!',
  status:        'Status',
  date:          'Date',
  action:        'Action',

  // ──────────────────────────────────────────
  // SIDEBAR NAV
  // ──────────────────────────────────────────
  nav_dashboard:  'Dashboard',
  nav_upload:     'Upload & Analysis',
  nav_history:    'Medical Records',
  nav_settings:   'Settings',
  nav_exit:       'Back to Portal',

  nav_dashboard_desc:  'Summary & Statistics',
  nav_upload_desc:     'X-Ray Image Analysis',
  nav_history_desc:    'Patient History',
  nav_settings_desc:   'System Configuration',

  storage:        'Storage',
  storageUsed:    '1.5 TB of 2 TB used',
  onlineStatus:   'Online',

  // ──────────────────────────────────────────
  // HEADER
  // ──────────────────────────────────────────
  header_dashboard:   'Cardiomegaly Analytics Dashboard',
  header_upload:      'Data Processing & CTR Analysis',
  header_history:     'Patient Medical Record History',
  header_settings:    'System Settings & Configuration',

  header_desc_dashboard:   'Summary statistics & latest analyses',
  header_desc_upload:      'Upload & process chest X-Ray images',
  header_desc_history:     'Medical records and patient data history',
  header_desc_settings:    'Configure API endpoint & computation system',

  notifications:      'Latest Notifications',
  notifClose:         'Close',
  notifViewAll:       'View All Notifications →',
  notifEmpty:         'No new notifications.',

  notif1:   'Analysis complete: Patient #HK-2901 detected Cardiomegaly.',
  notif2:   'Dr. Budi, please review classification result for patient #EP-9910.',
  notif3:   'Python Backend API connection successfully established.',

  time_10min:  '10 min ago',
  time_1h:     '1 hour ago',
  time_2h:     '2 hours ago',

  // ──────────────────────────────────────────
  // PUBLIC PORTAL (LANDING PAGE)
  // ──────────────────────────────────────────
  pp_badge:         'Medical Decision Support System · RSJ Tampan Riau',
  pp_hero_title1:   'Classification of',
  pp_hero_title2:   'Cardiomegaly',
  pp_hero_title3:   'in ODGJ Patients Based on Thorax Morphometric Imaging',
  pp_hero_subtitle: 'A Computational System based on {arch} to detect cardiac enlargement via Cardiothoracic Ratio (CTR) calculation instantly and precisely.',
  pp_cta_analyze:   'Start Thorax Analysis',
  pp_cta_learn:     'Learn About the System',
  pp_scroll:        'Scroll down',

  pp_stat_arch:     'System Architecture',
  pp_stat_time:     'Processing Time',
  pp_stat_acc:      'System Accuracy',
  pp_stat_res:      'Input Resolution',

  pp_nav_home:   'Home',
  pp_nav_about:  'About',
  pp_nav_char:   'Characteristics',
  pp_nav_flow:   'Architecture',
  pp_nav_team:   'Team',
  pp_admin:      'Admin Panel',

  pp_about_label:    'About the System',
  pp_about_title:    'Clinical Computation-Based Digital Analysis System',
  pp_about_subtitle: 'Integrating chest X-Ray imaging with computational algorithms to support clinical decisions by RSJ Tampan Riau physicians accurately and efficiently.',

  pp_stat_total:   'Total Examinations',
  pp_stat_acc2:    'System Accuracy',
  pp_stat_class:   'Diagnosis Categories',
  pp_stat_speed:   'Analysis Time',

  pp_feat1_title:  'Automated CTR Classification',
  pp_feat1_desc:   'Automatically calculates the Cardiothoracic Ratio (CTR) from chest X-Ray images using a CNN-based Computational System.',
  pp_feat2_title:  'System Accuracy: 86.5%',
  pp_feat2_desc:   'Validated directly from medical records and historical diagnoses by RSJ Tampan Riau physicians using DenseNet-121 architecture.',
  pp_feat3_title:  'Analysis < 0.5 Seconds',
  pp_feat3_desc:   'Very fast computation time allows physicians to receive digital analysis results instantly in the examination room.',
  pp_feat4_title:  'Medical Data Protected',
  pp_feat4_desc:   'All patient medical records are securely stored in Supabase with encryption and audit logging for regulatory compliance.',

  pp_char_label:    'Data Characteristics',
  pp_char_title:    'Diagnosis Thresholds & Categories',
  pp_char_subtitle: 'Two diagnosis classes based on Cardiothoracic Ratio (CTR) values established by the RSJ Tampan Riau medical team.',

  pp_flow_label:    'System Architecture',
  pp_flow_title:    'AI System Methodology & Architecture',
  pp_flow_subtitle: 'Technical pipeline details: data preparation, DenseNet121 design, model testing, through to Flask backend & React frontend integration.',

  pp_team_label:    'Research Team',
  pp_team_title:    'Cardiomegaly Group',
  pp_team_subtitle: 'Information Systems students at Politeknik Caltex Riau developing this system as a Data Mining project.',

  pp_cta_label:     'Get Started',
  pp_cta_title:     'Ready to Analyze Patient Thorax Images?',
  pp_cta_subtitle:  'Log in to the Admin Panel to upload X-Ray images and get instant digital analysis results.',
  pp_cta_btn:       'Open Admin Panel',

  pp_footer_brand:   'CNN-based Computational System for Cardiomegaly detection in ODGJ patients at RSJ Tampan Riau.',
  pp_footer_nav:     'Navigation',
  pp_footer_spec:    'System Specifications',
  pp_footer_inst:    'Institution',
  pp_footer_group:   'Cardiomegaly Group',
  pp_footer_copy:    '© 2026 RSJ Tampan Riau · Politeknik Caltex Riau · Cardiomegaly Group',
  pp_footer_by:      'Powered by',

  // ──────────────────────────────────────────
  // DASHBOARD
  // ──────────────────────────────────────────
  db_hero_label:    'Radiology Analysis Center · RSJ Tampan Riau',
  db_hero_title:    'Clinical Dashboard for Cardiomegaly Monitoring',
  db_hero_subtitle: 'Examination summary, finding distribution, and physician validation status pulled directly from Supabase.',
  db_readiness:     'Physician Review Readiness',
  db_validated:     'results validated correctly',
  db_total:         'out of {n} total stored examinations',

  db_metric_total:    'Total Examinations',
  db_metric_normal:   'Normal Status',
  db_metric_cardi:    'Cardiomegaly',
  db_metric_review:   'Needs Review',

  db_metric_total_desc:   'Total examinations stored in Supabase.',
  db_metric_normal_desc:  'Findings within normal physiological limits.',
  db_metric_cardi_desc:   'Findings that require follow-up action.',
  db_metric_review_desc:  'Low confidence or physician correction.',

  db_chart_time:     'Total Examinations Over Time',
  db_chart_time_sub: 'Grouped monthly by the recording date.',
  db_chart_dist:     'Finding Distribution',
  db_chart_dist_sub: 'Comparison of Normal and Cardiomegaly results.',
  db_chart_valid:    'Physician Validation Accuracy',
  db_chart_valid_sub:'Number of agreed and corrected results.',
  db_chart_exam:     'Examinations',
  db_chart_agree:    'Agreed',
  db_chart_correct:  'Corrected',

  db_recent_title:  'Latest Patient Logs',
  db_recent_sub:    'Most recent data from classification_logs table.',
  db_col_id:        'Patient ID',
  db_col_date:      'Date',
  db_col_conf:      'Confidence',
  db_col_status:    'Status',
  db_col_action:    'Action',

  // ──────────────────────────────────────────
  // SCANNER / UPLOAD
  // ──────────────────────────────────────────
  scan_banner_label:    'Radiology Examination Flow · CNN Computational System',
  scan_banner_title:    'Upload Thorax X-Ray & Get Structured Clinical Summary',
  scan_banner_subtitle: 'The Digital Analysis System helps physicians read cardiomegaly status, display confidence levels, and generate initial clinical recommendations automatically.',

  scan_patient_data:    'Patient Data',
  scan_patient_id:      'Patient ID / Medical Record No.',
  scan_patient_id_ph:   'e.g., RM-2026-001',
  scan_patient_name:    'Patient Name',
  scan_patient_name_ph: 'e.g., John Doe',
  scan_patient_age:     'Age',
  scan_patient_age_ph:  '0 - 120',
  scan_endpoint:        'Analysis Endpoint',
  scan_analyze:         'Run Analysis',
  scan_processing:      'Processing...',
  scan_reset:           'Reset',

  scan_dropzone_title:  'Upload Thorax X-Ray Image',
  scan_dropzone_sub:    'Use PNG, JPG, or JPEG format.',
  scan_remove:          'Remove File',

  scan_result_image:    'Examination Image',
  scan_xray:            'Thorax X-Ray',
  scan_gradcam:         'Clinical Attention Map (Grad-CAM)',
  scan_no_gradcam:      'Visualization not available from the computation system.',
  scan_result_label:    'Digital Analysis Result',
  scan_patient_label:   'Patient Name',
  scan_age_label:       'Age',
  scan_id_label:        'Patient ID',
  scan_year:            'Years old',
  scan_low_conf:        'Needs manual review',

  scan_knowledge_title: 'Knowledge System & Clinical Recommendations',
  scan_valid_title:     'Physician Validation',
  scan_valid_result:    'Validation result',
  scan_valid_doctor:    'Examining physician',
  scan_valid_match:     'Matches digital analysis result',
  scan_valid_corrected: 'Corrected by physician',
  scan_save:            'Run New Analysis',
  scan_saving:          'Saving examination...',

  scan_modal_title:     'Manual Confirmation Required',
  scan_modal_sub:       'Physician review required before recording.',
  scan_modal_body:      'Manual Confirmation Required: System confidence level is below the standard threshold. Please perform a manual review and select the correct validation result.',
  scan_modal_confirm:   'Continue Validation',

  scan_back:            'Back to Examination Form',
  scan_detail:          'Examination Detail',
  scan_stored_image:    'Stored Image',
  scan_conf:            'Confidence',
  scan_valid_status:    'Validation Status',
  scan_doctor:          'Physician',
  scan_time:            'Time',
  scan_agree:           'Agreed',
  scan_corrected:       'Corrected',
  scan_no_image:        'Image not available.',

  // ──────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────
  set_title:         'System Settings & Configuration',
  set_subtitle:      'Configure Python backend API connection and computation system architecture',
  set_mock_title:    'Simulation Mode (Mock Data)',
  set_mock_desc:     'Enable to use simulated data without Python backend connection. Ideal for demos and UI development.',
  set_mock_on:       'Active',
  set_mock_off:      'Inactive',
  set_url_title:     'Python Backend URL',
  set_url_label:     'Endpoint URL (FastAPI / Flask + Ngrok)',
  set_url_ph:        'https://xxxxx.ngrok-free.app',
  set_url_note:      'Ensure the backend server allows CORS and the header ngrok-skip-browser-warning: true',
  set_model_title:   'Computation System Architecture',
  set_model_note:    'The Computational System on the Python backend detects cardiac shadow enlargement based on the selected architecture weights.',
  set_save:          'Save Configuration',
  set_saved:         'Settings saved successfully!',
  set_active:        'ACTIVE',
  set_status_active: 'ACTIVE',

  set_model_densenet: 'DenseNet-121 (CheXNet Pretrained)',
  set_model_vgg:      'ResNet50 (ImageNet Pretrained)',
  set_model_mobile:   'MobileNetV2 (Lightweight)',
  set_badge_rec:      'Recommended',
  set_badge_std:      'Stable',
  set_badge_light:    'Lightweight',

  // ──────────────────────────────────────────
  // KARAKTERISTIK DATA
  // ──────────────────────────────────────────
  kd_label0:     'Normal Heart',
  kd_label1:     'Cardiac Enlargement',
  kd_label_data: 'Data Specifications',
  kd_radiologi:  'Radiological Characteristics',
  kd_handling:   'Clinical Handling Guide',

  kd0_title: 'Label 0: Normal',
  kd0_c1: 'Normal cardiac silhouette size (CTR ≤ 50%)',
  kd0_c2: 'Cardiothoracic Ratio (CTR) within normal physiological limits',
  kd0_c3: 'Historical diagnosis by RSJ Tampan Riau (Panam) medical team',
  kd0_c4: 'Spatial morphometric features of the thoracic cavity in normal range',
  kd0_c5: 'No cardiology intervention or therapy change required',

  kd1_title: 'Label 1: Cardiomegaly',
  kd1_c1: 'Cardiac silhouette size exceeds normal limits (CTR > 50%)',
  kd1_c2: 'Indicates hypertrophy or cardiac shadow enlargement',
  kd1_c3: 'High cardiovascular risk due to long-term antipsychotic use',
  kd1_c4: 'Historical diagnosis verified by RSJ Tampan Riau physicians',
  kd1_c5: 'Requires cardiology referral and antipsychotic dose evaluation',

  kd2_title: 'Dataset & Preprocessing',
  kd2_c1: 'Data Source: Medical records & historical diagnoses at RSJ Tampan Riau',
  kd2_c2: 'Dataset Classification: Data split into Normal and Cardiomegaly labels',
  kd2_c3: 'Feature Extraction: Spatial morphometric features from chest X-Ray images',
  kd2_c4: 'Preprocessing: Automated processing (resize, dimension expansion, pixel normalization)',
  kd2_c5: 'Input Dimension: Adjusted for CNN architecture extraction requirements (.h5)',

  kd_detail_ctr:     'CTR Ratio',
  kd_detail_label:   'Class Label',
  kd_detail_risk:    'Cardio Risk',
  kd_detail_action:  'Action',

  kd0_d1: '≤ 50% (0.50)',    kd0_d2: '0 (Normal)',       kd0_d3: 'Low / Normal',        kd0_d4: 'Continue ODGJ Therapy',
  kd1_d1: '> 50% (0.50)',    kd1_d2: '1 (Cardiomegaly)', kd1_d3: 'High (Hypertrophy)',  kd1_d4: 'Cardiology Referral',
  kd2_d1: 'X-Ray Thorax (Binary)', kd2_d2: 'Spatial Morphometrics', kd2_d3: '86.5% CNN', kd2_d4: 'RSJ Tampan Riau',

  kd_detail_label2:  'Class Label',
  kd_detail_feat:    'Feature Extraction',
  kd_detail_acc:     'System Accuracy',
  kd_detail_source:  'Case Study',

  // ──────────────────────────────────────────
  // FLOWCHART
  // ──────────────────────────────────────────
  fc_title:        'Architecture & Digital Analysis System Flow',
  fc_subtitle:     'Hover over stages to see technical details of the cardiomegaly computation system for ODGJ patients',
  fc_badge:        'Integrated Python & React System',
  fc_more:         'more',

  // ──────────────────────────────────────────
  // BIODATA TIM
  // ──────────────────────────────────────────
  bio_title:      'Cardiomegaly Group (Politeknik Caltex Riau)',
  bio_subtitle:   'The Classification of Cardiomegaly Conditions in ODGJ Patients Based on Thorax Image Morphometric Features Using Convolutional Neural Network (CNN) was developed as part of the Data Mining course practicum in the Information Systems study program at Politeknik Caltex Riau, fully supported clinically by RSJ Tampan Riau (Panam).',
  bio_profile:    'Researcher Profile',
  bio_focus:      'Contribution Focus',
  bio_skills:     'Technical Competencies',
  bio_category:   'Practicum Category',
  bio_course:     'Data Mining — Cardiomegaly Group',
};

export default en;
