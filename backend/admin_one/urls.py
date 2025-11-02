from django.urls import path
from . import views
from . import super_admin_views

urlpatterns = [
    path('check-admin-exists/', views.check_admin_exists, name='check_admin_exists'),
    path('create-admin/', views.create_admin, name='create_admin'),
    path('login/', views.login_view, name='login'),
    path('applications/', views.get_applications, name='get_applications'),
    path('student-details/<str:email>/', views.get_student_details, name='get_student_details'),
    path('student-info/<str:email>/', views.get_student_info, name='get_student_info'),
    path('student-info/<str:email>/update/', views.update_student_info, name='update_student_info'),
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('student-details-preview/', views.get_student_details_preview, name='get_student_details_preview'),
    path('verify-student/', views.verify_student, name='verify_student'),
    path('proxy-image/<str:file_id>/', views.proxy_google_drive_image, name='proxy_google_drive_image'),
    path('student-details-admin/', views.get_student_details_admin, name='get_student_details_admin'),
    path('proxy-file/<str:file_id>/', views.proxy_google_drive_file, name='proxy_google_drive_file'),
    path('unverify-student/', views.unverify_student, name='unverify_student'),
    path('verify-document/', views.verify_document, name='verify_document'),  
    path('send-email/', views.send_email, name='send_email'),
    path('save-application-status/', views.save_application_status, name='save-application-status'),
    path('get-student-details-admin/', views.get_student_details_admin, name='get_student_details_admin'),
    path('lsc/create/', views.create_lsc, name='create_lsc'),
    path('lsc/list/', views.list_lsc, name='list_lsc'),
    path('lsc/<int:lsc_id>/update/', views.update_lsc, name='update_lsc'),
    path('lsc/<int:lsc_id>/delete/', views.delete_lsc, name='delete_lsc'),
    path('lsc/delete-all/', views.delete_all_lsc, name='delete_all_lsc'),
    path('get-csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('application-settings/', views.application_settings, name='application_settings'),
    path('system-settings/by_type/', views.system_settings_by_type, name='system_settings_by_type'),
    path('courses/create/', views.create_course, name='create_course'),
    path('courses/list/', views.list_courses, name='list_courses'),
    path('courses/<int:course_id>/update/', views.update_course, name='update_course'),
    path('courses/<int:course_id>/delete/', views.delete_course, name='delete_course'),
    path('courses/delete_all/', views.delete_all_courses, name='delete_all_courses'),
    
    # Super Admin endpoints
    path('superadmin/lsc-admins/', super_admin_views.list_lsc_admins, name='superadmin_list_lsc_admins'),
    path('superadmin/lsc-admins/create/', super_admin_views.create_lsc_admin, name='superadmin_create_lsc_admin'),
    path('superadmin/lsc-admins/<int:admin_id>/update/', super_admin_views.update_lsc_admin, name='superadmin_update_lsc_admin'),
    path('superadmin/lsc-admins/<int:admin_id>/delete/', super_admin_views.delete_lsc_admin, name='superadmin_delete_lsc_admin'),
    
    path('superadmin/settings/', super_admin_views.list_system_settings, name='superadmin_list_settings'),
    path('superadmin/settings/create/', super_admin_views.create_system_setting, name='superadmin_create_setting'),
    path('superadmin/settings/<int:setting_id>/update/', super_admin_views.update_system_setting, name='superadmin_update_setting'),
    
    path('superadmin/backups/', super_admin_views.list_backups, name='superadmin_list_backups'),
    path('superadmin/backups/create/', super_admin_views.create_backup, name='superadmin_create_backup'),
    path('superadmin/backups/<int:backup_id>/delete/', super_admin_views.delete_backup, name='superadmin_delete_backup'),
    path('superadmin/backups/<int:backup_id>/download/', super_admin_views.download_backup, name='superadmin_download_backup'),
    path('superadmin/backups/<int:backup_id>/restore/', super_admin_views.restore_backup, name='superadmin_restore_backup'),
    
    path('superadmin/audit-logs/', super_admin_views.list_audit_logs, name='superadmin_audit_logs'),
    path('superadmin/dashboard-stats/', super_admin_views.get_dashboard_stats, name='superadmin_dashboard_stats'),
    
    # Database Operations
    path('superadmin/database/query/', super_admin_views.execute_database_query, name='superadmin_database_query'),
    path('superadmin/database/tables/', super_admin_views.get_database_tables, name='superadmin_database_tables'),
    path('superadmin/database/table/<str:table_name>/', super_admin_views.get_table_structure, name='superadmin_table_structure'),
    
    # Maintenance Operations
    path('superadmin/maintenance/clear-cache/', super_admin_views.clear_cache, name='superadmin_clear_cache'),
    path('superadmin/maintenance/health/', super_admin_views.get_system_health, name='superadmin_system_health'),
    path('superadmin/maintenance/optimize/', super_admin_views.optimize_database, name='superadmin_optimize_database'),
    
    # Security Operations
    path('superadmin/security/logs/', super_admin_views.get_security_logs, name='superadmin_security_logs'),
    path('superadmin/security/settings/', super_admin_views.update_security_settings, name='superadmin_security_settings'),
    
    # Email Configuration
    path('superadmin/email/settings/', super_admin_views.get_email_settings, name='superadmin_email_settings'),
    path('superadmin/email/update/', super_admin_views.update_email_settings, name='superadmin_update_email_settings'),
    path('superadmin/email/test/', super_admin_views.send_test_email, name='superadmin_send_test_email'),
    
    # Guidelines & Instructions
    path('superadmin/guidelines/', super_admin_views.get_guidelines, name='superadmin_get_guidelines'),
    path('superadmin/guidelines/create/', super_admin_views.create_guideline, name='superadmin_create_guideline'),
    path('superadmin/guidelines/<int:guideline_id>/delete/', super_admin_views.delete_guideline, name='superadmin_delete_guideline'),
]


