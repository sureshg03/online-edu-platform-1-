"""
Super Admin views for complete system control
Handles LSC Admin management, system settings, backups, audit logs, and database operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import LSCAdmin, SystemSettings, DatabaseBackup, AuditLog
from .serializers import (
    LSCAdminSerializer, SystemSettingsSerializer,
    DatabaseBackupSerializer, AuditLogSerializer
)
import logging
import os
from datetime import datetime

logger = logging.getLogger(__name__)

def log_audit(request, action_type, description, affected_model=None, affected_id=None, log_status='success'):
    """Helper function to log admin actions"""
    try:
        admin_email = request.user.email if request.user.is_authenticated else 'dev@example.com'
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        AuditLog.objects.create(
            admin_email=admin_email,
            action_type=action_type,
            action_description=description,
            affected_model=affected_model,
            affected_record_id=affected_id,
            ip_address=ip_address,
            user_agent=user_agent[:500] if user_agent else None,
            status=log_status
        )
    except Exception as e:
        logger.error(f"Failed to log audit: {str(e)}")

# LSC Admin Management
@api_view(['POST'])
def create_lsc_admin(request):
    try:
        data = request.data.copy()
        data['created_by'] = 'dev@example.com'  # Default for dev
        serializer = LSCAdminSerializer(data=data)
        if serializer.is_valid():
            lsc_admin = serializer.save()
            
            log_audit(
                request,
                'CREATE_LSC_ADMIN',
                f"Created LSC Admin: {lsc_admin.lsc_code} - {lsc_admin.center_name}",
                'LSCAdmin',
                lsc_admin.id
            )
            
            logger.info(f"LSC Admin created: {lsc_admin.lsc_code}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        
        logger.error(f"Validation errors in create_lsc_admin: {serializer.errors}")
        log_audit(request, 'CREATE_LSC_ADMIN', f"Failed: {serializer.errors}", log_status='failed')
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in create_lsc_admin: {str(e)}")
        log_audit(request, 'CREATE_LSC_ADMIN', f"Error: {str(e)}", log_status='failed')
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_lsc_admins(request):
    try:
        lsc_admins = LSCAdmin.objects.all().order_by('-created_at')
        serializer = LSCAdminSerializer(lsc_admins, many=True)
        
        logger.info(f"Retrieved {lsc_admins.count()} LSC Admins")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_lsc_admins: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def update_lsc_admin(request, admin_id):
    try:
        lsc_admin = LSCAdmin.objects.get(id=admin_id)
        serializer = LSCAdminSerializer(lsc_admin, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_admin = serializer.save()
            
            log_audit(
                request,
                'UPDATE_LSC_ADMIN',
                f"Updated LSC Admin: {updated_admin.lsc_code}",
                'LSCAdmin',
                updated_admin.id
            )
            
            logger.info(f"LSC Admin updated: {updated_admin.lsc_code}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        
        logger.error(f"Validation errors in update_lsc_admin: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except LSCAdmin.DoesNotExist:
        logger.warning(f"LSC Admin not found: {admin_id}")
        return Response({"status": "error", "message": "LSC Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in update_lsc_admin: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_lsc_admin(request, admin_id):
    try:
        lsc_admin = LSCAdmin.objects.get(id=admin_id)
        lsc_code = lsc_admin.lsc_code
        lsc_admin.delete()
        
        log_audit(
            request,
            'DELETE_LSC_ADMIN',
            f"Deleted LSC Admin: {lsc_code}",
            'LSCAdmin',
            admin_id
        )
        
        logger.info(f"LSC Admin deleted: {lsc_code}")
        return Response({"status": "success", "message": "LSC Admin deleted successfully"}, status=status.HTTP_200_OK)
    except LSCAdmin.DoesNotExist:
        logger.warning(f"LSC Admin not found: {admin_id}")
        return Response({"status": "error", "message": "LSC Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in delete_lsc_admin: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# System Settings Management
@api_view(['GET'])
@permission_classes([AllowAny])
def list_system_settings(request):
    try:
        setting_type = request.query_params.get('type', None)
        if setting_type:
            settings = SystemSettings.objects.filter(setting_type=setting_type, is_active=True)
        else:
            settings = SystemSettings.objects.filter(is_active=True).order_by('setting_type', 'setting_key')
        
        serializer = SystemSettingsSerializer(settings, many=True)
        logger.info(f"Retrieved {settings.count()} system settings")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_system_settings: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_system_setting(request):
    try:
        data = request.data.copy()
        data['updated_by'] = request.user.email
        
        serializer = SystemSettingsSerializer(data=data)
        if serializer.is_valid():
            setting = serializer.save()
            
            log_audit(
                request,
                'CREATE_SYSTEM_SETTING',
                f"Created setting: {setting.setting_key}",
                'SystemSettings',
                setting.id
            )
            
            logger.info(f"System setting created: {setting.setting_key}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        
        logger.error(f"Validation errors in create_system_setting: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in create_system_setting: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def update_system_setting(request, setting_id):
    try:
        setting = SystemSettings.objects.get(id=setting_id)
        data = request.data.copy()
        data['updated_by'] = request.user.email
        
        serializer = SystemSettingsSerializer(setting, data=data, partial=True)
        if serializer.is_valid():
            updated_setting = serializer.save()
            
            log_audit(
                request,
                'UPDATE_SYSTEM_SETTING',
                f"Updated setting: {updated_setting.setting_key}",
                'SystemSettings',
                updated_setting.id
            )
            
            logger.info(f"System setting updated: {updated_setting.setting_key}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        
        logger.error(f"Validation errors in update_system_setting: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except SystemSettings.DoesNotExist:
        logger.warning(f"System setting not found: {setting_id}")
        return Response({"status": "error", "message": "Setting not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in update_system_setting: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Database Backup Management
@api_view(['POST'])
def create_backup(request):
    try:
        from django.core.management import call_command
        from django.conf import settings
        import subprocess
        import shutil
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f"backup_{timestamp}.sql"
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        backup_path = os.path.join(backup_dir, backup_name)
        
        db_settings = settings.DATABASES['default']
        
        log_audit(
            request,
            'CREATE_BACKUP',
            f"Initiated database backup: {backup_name}",
            'DatabaseBackup',
            None
        )
        
        # Create backup record
        backup_record = DatabaseBackup.objects.create(
            backup_name=backup_name,
            backup_path=backup_path,
            backup_size=0,  # Will be updated after backup completes
            backup_type=request.data.get('backup_type', 'full'),
            status='in_progress',
            created_by=request.user.email,
            notes=request.data.get('notes', '')
        )
        
        try:
            # Check if mysqldump is available
            mysqldump_path = shutil.which('mysqldump')
            if not mysqldump_path:
                # Try common locations on Windows
                common_paths = [
                    r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
                    r"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe",
                    r"C:\xampp\mysql\bin\mysqldump.exe",
                ]
                for path in common_paths:
                    if os.path.exists(path):
                        mysqldump_path = path
                        break
                
                if not mysqldump_path:
                    raise Exception("mysqldump not found. Please install MySQL client tools or add MySQL bin directory to PATH")
            
            # Build mysqldump command with proper quoting
            command = [
                mysqldump_path,
                '-u', db_settings['USER'],
                f"-p{db_settings['PASSWORD']}",
                db_settings['NAME']
            ]
            
            # Add host if specified
            if db_settings.get('HOST') and db_settings['HOST'] not in ['localhost', '127.0.0.1', '']:
                command.extend(['-h', db_settings['HOST']])
            
            # Add port if specified
            if db_settings.get('PORT'):
                command.extend(['-P', str(db_settings['PORT'])])
            
            # Execute backup with output redirection
            with open(backup_path, 'w', encoding='utf-8') as backup_file:
                result = subprocess.run(
                    command, 
                    stdout=backup_file, 
                    stderr=subprocess.PIPE, 
                    text=True,
                    timeout=300  # 5 minute timeout
                )
            
            if result.returncode == 0 and os.path.exists(backup_path):
                # Get file size
                file_size = os.path.getsize(backup_path)
                
                # Verify backup is not empty
                if file_size < 100:  # Less than 100 bytes is probably an error
                    backup_record.status = 'failed'
                    backup_record.notes = 'Backup file is too small or empty'
                    backup_record.save()
                    return Response({
                        "status": "error", 
                        "message": "Backup file is too small or empty. Check database connection."
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                backup_record.backup_size = file_size
                backup_record.status = 'completed'
                backup_record.save()
                
                log_audit(
                    request,
                    'CREATE_BACKUP',
                    f"Backup completed: {backup_name} ({file_size / (1024*1024):.2f} MB)",
                    'DatabaseBackup',
                    backup_record.id
                )
                
                serializer = DatabaseBackupSerializer(backup_record)
                return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
            else:
                error_msg = result.stderr if result.stderr else "Backup file not created"
                backup_record.status = 'failed'
                backup_record.notes = error_msg
                backup_record.save()
                
                log_audit(request, 'CREATE_BACKUP', f"Backup failed: {error_msg}", log_status='failed')
                return Response({
                    "status": "error", 
                    "message": f"Backup failed: {error_msg}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except subprocess.TimeoutExpired:
            backup_record.status = 'failed'
            backup_record.notes = 'Backup timeout after 5 minutes'
            backup_record.save()
            return Response({
                "status": "error", 
                "message": "Backup timeout. Database may be too large."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            backup_record.status = 'failed'
            backup_record.notes = str(e)
            backup_record.save()
            raise e
            
    except Exception as e:
        logger.error(f"Error in create_backup: {str(e)}")
        log_audit(request, 'CREATE_BACKUP', f"Error: {str(e)}", log_status='failed')
        return Response({
            "status": "error", 
            "message": f"Backup error: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_backups(request):
    try:
        backups = DatabaseBackup.objects.all().order_by('-created_at')
        serializer = DatabaseBackupSerializer(backups, many=True)
        
        logger.info(f"Retrieved {backups.count()} backups")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_backups: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_backup(request, backup_id):
    """Delete a database backup"""
    try:
        backup = DatabaseBackup.objects.get(id=backup_id)
        backup_name = backup.backup_name
        backup_path = backup.backup_path
        
        # Delete file if it exists
        if os.path.exists(backup_path):
            os.remove(backup_path)
            logger.info(f"Deleted backup file: {backup_path}")
        
        # Delete database record
        backup.delete()
        
        log_audit(
            request,
            'DELETE_BACKUP',
            f"Deleted backup: {backup_name}",
            'DatabaseBackup',
            backup_id
        )
        
        return Response({
            "status": "success", 
            "message": f"Backup '{backup_name}' deleted successfully"
        }, status=status.HTTP_200_OK)
    except DatabaseBackup.DoesNotExist:
        return Response({
            "status": "error", 
            "message": "Backup not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in delete_backup: {str(e)}")
        return Response({
            "status": "error", 
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def download_backup(request, backup_id):
    """Download a database backup file"""
    try:
        from django.http import FileResponse
        
        backup = DatabaseBackup.objects.get(id=backup_id)
        backup_path = backup.backup_path
        
        if not os.path.exists(backup_path):
            return Response({
                "status": "error", 
                "message": "Backup file not found on server"
            }, status=status.HTTP_404_NOT_FOUND)
        
        log_audit(
            request,
            'DOWNLOAD_BACKUP',
            f"Downloaded backup: {backup.backup_name}",
            'DatabaseBackup',
            backup_id
        )
        
        # Return file for download
        response = FileResponse(
            open(backup_path, 'rb'),
            as_attachment=True,
            filename=backup.backup_name
        )
        return response
    except DatabaseBackup.DoesNotExist:
        return Response({
            "status": "error", 
            "message": "Backup not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in download_backup: {str(e)}")
        return Response({
            "status": "error", 
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def restore_backup(request, backup_id):
    """Restore database from a backup file"""
    try:
        from django.conf import settings
        import subprocess
        import shutil
        
        backup = DatabaseBackup.objects.get(id=backup_id)
        backup_path = backup.backup_path
        
        if not os.path.exists(backup_path):
            return Response({
                "status": "error", 
                "message": "Backup file not found on server"
            }, status=status.HTTP_404_NOT_FOUND)
        
        db_settings = settings.DATABASES['default']
        
        log_audit(
            request,
            'RESTORE_BACKUP',
            f"Initiated restore from backup: {backup.backup_name}",
            'DatabaseBackup',
            backup_id
        )
        
        # Find mysql client
        mysql_path = shutil.which('mysql')
        if not mysql_path:
            # Try common locations on Windows
            common_paths = [
                r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
                r"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
                r"C:\xampp\mysql\bin\mysql.exe",
            ]
            for path in common_paths:
                if os.path.exists(path):
                    mysql_path = path
                    break
            
            if not mysql_path:
                raise Exception("mysql client not found. Please install MySQL client tools or add MySQL bin directory to PATH")
        
        # Build mysql restore command
        command = [
            mysql_path,
            '-u', db_settings['USER'],
            f"-p{db_settings['PASSWORD']}",
            db_settings['NAME']
        ]
        
        # Add host if specified
        if db_settings.get('HOST') and db_settings['HOST'] not in ['localhost', '127.0.0.1', '']:
            command.extend(['-h', db_settings['HOST']])
        
        # Add port if specified
        if db_settings.get('PORT'):
            command.extend(['-P', str(db_settings['PORT'])])
        
        # Execute restore with input redirection
        with open(backup_path, 'r', encoding='utf-8') as backup_file:
            result = subprocess.run(
                command,
                stdin=backup_file,
                stderr=subprocess.PIPE,
                text=True,
                timeout=600  # 10 minute timeout
            )
        
        if result.returncode == 0:
            log_audit(
                request,
                'RESTORE_BACKUP',
                f"Successfully restored from backup: {backup.backup_name}",
                'DatabaseBackup',
                backup_id
            )
            
            return Response({
                "status": "success",
                "message": f"Database successfully restored from '{backup.backup_name}'"
            }, status=status.HTTP_200_OK)
        else:
            error_msg = result.stderr if result.stderr else "Restore failed"
            log_audit(
                request,
                'RESTORE_BACKUP',
                f"Restore failed: {error_msg}",
                'DatabaseBackup',
                backup_id,
                log_status='failed'
            )
            return Response({
                "status": "error",
                "message": f"Restore failed: {error_msg}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except subprocess.TimeoutExpired:
        return Response({
            "status": "error",
            "message": "Restore timeout after 10 minutes. Database may be too large."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except DatabaseBackup.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Backup not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in restore_backup: {str(e)}")
        log_audit(
            request,
            'RESTORE_BACKUP',
            f"Restore error: {str(e)}",
            log_status='failed'
        )
        return Response({
            "status": "error",
            "message": f"Restore error: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Audit Logs
@api_view(['GET'])
def list_audit_logs(request):
    try:
        action_type = request.query_params.get('action_type', None)
        admin_email = request.query_params.get('admin_email', None)
        limit = int(request.query_params.get('limit', 100))
        
        logs = AuditLog.objects.all()
        
        if action_type:
            logs = logs.filter(action_type=action_type)
        if admin_email:
            logs = logs.filter(admin_email=admin_email)
        
        logs = logs.order_by('-timestamp')[:limit]
        serializer = AuditLogSerializer(logs, many=True)
        
        logger.info(f"Retrieved {logs.count()} audit logs")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_audit_logs: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Dashboard Statistics
@api_view(['GET'])
def get_dashboard_stats(request):
    try:
        from .models import Application, Student, LSC, Course
        
        stats = {
            'total_students': Student.objects.count(),
            'total_applications': Application.objects.count(),
            'total_lscs': LSC.objects.count(),
            'total_courses': Course.objects.count(),
            'active_lsc_admins': LSCAdmin.objects.filter(is_active=True).count(),
            'total_backups': DatabaseBackup.objects.filter(status='completed').count(),
            'recent_audit_logs': AuditLog.objects.count(),
        }
        
        return Response({"status": "success", "data": stats}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_dashboard_stats: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================= DATABASE OPERATIONS =========================
@api_view(['POST'])
def execute_database_query(request):
    """Execute read-only database queries"""
    try:
        from django.db import connection
        query = request.data.get('query', '').strip().lower()
        
        # Security check - only allow SELECT queries
        if not query.startswith('select'):
            log_audit(request, 'database_query', 'Attempted non-SELECT query', status='failed')
            return Response({"status": "error", "message": "Only SELECT queries are allowed"}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        with connection.cursor() as cursor:
            cursor.execute(request.data.get('query'))
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        log_audit(request, 'database_query', f'Executed query: {query[:100]}')
        return Response({"status": "success", "data": results, "columns": columns}, 
                       status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in execute_database_query: {str(e)}")
        log_audit(request, 'database_query', f'Query failed: {str(e)}', status='failed')
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_database_tables(request):
    """Get list of all database tables"""
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
        
        log_audit(request, 'database_info', 'Retrieved database tables list')
        return Response({"status": "success", "data": tables}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_database_tables: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_table_structure(request, table_name):
    """Get structure of a specific table"""
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            cursor.execute(f"DESCRIBE {table_name}")
            columns = [col[0] for col in cursor.description]
            structure = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        log_audit(request, 'database_info', f'Retrieved structure for table: {table_name}')
        return Response({"status": "success", "data": structure}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_table_structure: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================= MAINTENANCE OPERATIONS =========================
@api_view(['POST'])
def clear_cache(request):
    """Clear application cache"""
    try:
        from django.core.cache import cache
        cache.clear()
        
        log_audit(request, 'maintenance', 'Cleared application cache')
        return Response({"status": "success", "message": "Cache cleared successfully"}, 
                       status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in clear_cache: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_system_health(request):
    """Get system health metrics"""
    try:
        from django.db import connection
        import platform
        import os
        
        # Database connection check
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                db_status = "healthy"
        except Exception:
            db_status = "error"
        
        # Try to get system metrics with psutil, fallback to basic info if not available
        try:
            import psutil
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            health_data = {
                'database': db_status,
                'cpu_percent': round(cpu_percent, 2),
                'cpu_usage': f"{cpu_percent}%",
                'memory_percent': round(memory.percent, 2),
                'memory_usage': f"{memory.percent}%",
                'disk_percent': round(disk.percent, 2),
                'disk_usage': f"{disk.percent}%",
                'memory_available': f"{memory.available / (1024**3):.2f} GB",
                'disk_free': f"{disk.free / (1024**3):.2f} GB",
                'uptime': 'Available'
            }
        except ImportError:
            # Fallback if psutil is not installed
            logger.warning("psutil not installed, returning basic system info")
            health_data = {
                'database': db_status,
                'cpu_percent': 0,
                'cpu_usage': 'N/A (install psutil)',
                'memory_percent': 0,
                'memory_usage': 'N/A (install psutil)',
                'disk_percent': 0,
                'disk_usage': 'N/A (install psutil)',
                'memory_available': 'N/A',
                'disk_free': 'N/A',
                'uptime': 'N/A',
                'system': platform.system(),
                'python_version': platform.python_version(),
                'note': 'Install psutil for detailed metrics: pip install psutil'
            }
        
        log_audit(request, 'maintenance', 'Retrieved system health metrics')
        return Response({"status": "success", "data": health_data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_system_health: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def optimize_database(request):
    """Optimize database tables"""
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            
            optimized_tables = []
            for table in tables:
                cursor.execute(f"OPTIMIZE TABLE {table}")
                optimized_tables.append(table)
        
        log_audit(request, 'maintenance', f'Optimized {len(optimized_tables)} database tables')
        return Response({"status": "success", "message": f"Optimized {len(optimized_tables)} tables", 
                        "tables": optimized_tables}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in optimize_database: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================= SECURITY OPERATIONS =========================
@api_view(['GET'])
def get_security_logs(request):
    """Get security-related audit logs"""
    try:
        security_logs = AuditLog.objects.filter(
            action_type__in=['login', 'logout', 'permission_change', 'security_setting']
        ).order_by('-timestamp')[:100]
        
        serializer = AuditLogSerializer(security_logs, many=True)
        log_audit(request, 'security', 'Retrieved security logs')
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_security_logs: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_security_settings(request):
    """Update security-related settings"""
    try:
        setting_data = request.data
        setting_key = setting_data.get('key')
        setting_value = setting_data.get('value')
        
        setting, created = SystemSettings.objects.update_or_create(
            setting_key=setting_key,
            defaults={
                'setting_value': setting_value,
                'setting_type': 'security',
                'description': setting_data.get('description', ''),
                'updated_by': request.user.email
            }
        )
        
        log_audit(request, 'security_setting', f'Updated security setting: {setting_key}')
        serializer = SystemSettingsSerializer(setting)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in update_security_settings: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================= EMAIL CONFIGURATION =========================
@api_view(['GET'])
def get_email_settings(request):
    """Get email configuration settings"""
    try:
        email_settings = SystemSettings.objects.filter(setting_type='email')
        serializer = SystemSettingsSerializer(email_settings, many=True)
        
        log_audit(request, 'email_config', 'Retrieved email settings')
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_email_settings: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_email_settings(request):
    """Update email configuration"""
    try:
        settings_data = request.data.get('settings', [])
        updated_settings = []
        
        for setting in settings_data:
            obj, created = SystemSettings.objects.update_or_create(
                setting_key=setting['key'],
                defaults={
                    'setting_value': setting['value'],
                    'setting_type': 'email',
                    'description': setting.get('description', ''),
                    'updated_by': request.user.email
                }
            )
            updated_settings.append(obj)
        
        log_audit(request, 'email_config', f'Updated {len(updated_settings)} email settings')
        serializer = SystemSettingsSerializer(updated_settings, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in update_email_settings: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def send_test_email(request):
    """Send a test email"""
    try:
        from django.core.mail import send_mail
        from django.conf import settings
        
        recipient = request.data.get('recipient')
        subject = request.data.get('subject', 'Test Email from Super Admin Panel')
        message = request.data.get('message', 'This is a test email from the Super Admin Control Panel.')
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient],
            fail_silently=False,
        )
        
        log_audit(request, 'email_config', f'Sent test email to {recipient}')
        return Response({"status": "success", "message": "Test email sent successfully"}, 
                       status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in send_test_email: {str(e)}")
        log_audit(request, 'email_config', f'Failed to send test email: {str(e)}', status='failed')
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================= GUIDELINES & INSTRUCTIONS =========================
@api_view(['GET'])
def get_guidelines(request):
    """Get system guidelines and instructions"""
    try:
        guidelines = SystemSettings.objects.filter(setting_type='guideline').order_by('setting_key')
        serializer = SystemSettingsSerializer(guidelines, many=True)
        
        log_audit(request, 'guidelines', 'Retrieved system guidelines')
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_guidelines: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_guideline(request):
    """Create new guideline/instruction"""
    try:
        guideline = SystemSettings.objects.create(
            setting_key=request.data.get('key'),
            setting_value=request.data.get('content'),
            setting_type='guideline',
            description=request.data.get('title'),
            updated_by=request.user.email
        )
        
        log_audit(request, 'guidelines', f'Created new guideline: {guideline.setting_key}')
        serializer = SystemSettingsSerializer(guideline)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error in create_guideline: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_guideline(request, guideline_id):
    """Delete a guideline"""
    try:
        guideline = SystemSettings.objects.get(id=guideline_id, setting_type='guideline')
        guideline_key = guideline.setting_key
        guideline.delete()
        
        log_audit(request, 'guidelines', f'Deleted guideline: {guideline_key}', 
                 affected_model='SystemSettings', affected_id=guideline_id)
        return Response({"status": "success", "message": "Guideline deleted successfully"}, 
                       status=status.HTTP_200_OK)
    except SystemSettings.DoesNotExist:
        return Response({"status": "error", "message": "Guideline not found"}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in delete_guideline: {str(e)}")
        return Response({"status": "error", "message": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)
