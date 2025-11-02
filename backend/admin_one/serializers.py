from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    AdminUser, StudentInfo, Application, StudentDetails, Student, Payment, 
    LSC, Course, Counsellor, LSCAdmin, SystemSettings, DatabaseBackup, AuditLog
)
import re

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'email']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id', 'user_id', 'email', 'mode_of_study', 'programme_applied', 'course', 'medium',
            'academic_year', 'deb_id', 'abc_id', 'name_initial', 'dob', 'aadhaar_no',
            'name_as_aadhaar', 'parent_selected', 'guardian_selected', 'father_name',
            'father_occupation', 'mother_name', 'mother_occupation', 'guardian_name',
            'guardian_occupation', 'nationality', 'religion', 'community', 'mother_tongue',
            'differently_abled', 'disability_type', 'blood_group', 'access_internet',
            'comm_pincode', 'comm_district', 'comm_state', 'comm_country', 'comm_town',
            'comm_area', 'same_as_comm', 'perm_pincode', 'perm_district', 'perm_state',
            'perm_country', 'perm_town', 'perm_area'
        ]

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['name', 'email', 'phone', 'is_verified']


class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetails
        fields = [
            'user_id', 'email', 'name_initial', 'qualifications', 'semester_marks',
            'current_designation', 'current_institute', 'years_experience', 'annual_income',
            'photo_url', 'signature_url', 'sslc_marksheet_url', 'hsc_marksheet_url',
            'ug_marksheet_url', 'semester_marksheet_url', 'community_certificate_url',
            'aadhaar_url', 'transfer_certificate_url',
            'photo_verified', 'signature_verified', 'sslc_marksheet_verified',
            'hsc_marksheet_verified', 'ug_marksheet_verified', 'semester_marksheet_verified',
            'community_certificate_verified', 'aadhaar_verified', 'transfer_certificate_verified'
        ]
        extra_kwargs = {
            'photo_url': {'required': False, 'allow_null': True},
            'signature_url': {'required': False, 'allow_null': True},
            'sslc_marksheet_url': {'required': False, 'allow_null': True},
            'hsc_marksheet_url': {'required': False, 'allow_null': True},
            'ug_marksheet_url': {'required': False, 'allow_null': True},
            'semester_marksheet_url': {'required': False, 'allow_null': True},
            'community_certificate_url': {'required': False, 'allow_null': True},
            'aadhaar_url': {'required': False, 'allow_null': True},
            'transfer_certificate_url': {'required': False, 'allow_null': True},
            'current_designation': {'required': False, 'allow_null': True},
            'current_institute': {'required': False, 'allow_null': True},
            'years_experience': {'required': False, 'allow_null': True},
            'annual_income': {'required': False, 'allow_null': True},
            'photo_verified': {'read_only': True},
            'signature_verified': {'read_only': True},
            'sslc_marksheet_verified': {'read_only': True},
            'hsc_marksheet_verified': {'read_only': True},
            'ug_marksheet_verified': {'read_only': True},
            'semester_marksheet_verified': {'read_only': True},
            'community_certificate_verified': {'read_only': True},
            'aadhaar_verified': {'read_only': True},
            'transfer_certificate_verified': {'read_only': True},
        }

class StudentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInfo
        fields = ['email', 'temp_register_no', 'password']

    def create(self, validated_data):
        # Store password in plain text
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Store password in plain text if provided, otherwise retain existing
        if 'password' not in validated_data or validated_data['password'] is None:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)

class PaymentSerializer(serializers.ModelSerializer):
    payment_mode = serializers.SerializerMethodField()
    bank_name = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['application_id', 'transaction_id', 'amount', 'payment_status', 'created_at', 'payment_mode', 'bank_name']

    def get_payment_mode(self, obj):
        return 'UPI'  # Dummy value

    def get_bank_name(self, obj):
        return ''  # Empty string

class LSCSerializer(serializers.ModelSerializer):
    class Meta:
        model = LSC
        fields = ['id', 'lsc_code', 'centre_name', 'created_at', 'updated_at']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id',
            'course_short_code',
            'course_full_name',
            'branch_name',
            'num_semesters',
            'num_years',
            'course_code',
            'degree',
            'created_at',
            'updated_at',
        ]

class CounsellorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counsellor
        fields = [
            'id',
            'counsellor_name',
            'father_name',
            'mother_name',
            'dob',
            'gender',
            'aadhaar',
            'qualification',
            'highest_qualification',
            'programme_assigned',
            'mobile',
            'alternate_number',
            'email',
            'designation',
            'experience',
            'address_line1',
            'address_line2',
            'address_line3',
            'pincode',
            'district',
            'state',
            'image',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'alternate_number': {'required': False, 'allow_null': True},
            'designation': {'required': False, 'allow_null': True},
            'experience': {'required': False, 'allow_null': True},
        }

class LSCAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = LSCAdmin
        fields = [
            'id', 'lsc_code', 'center_name', 'admin_email', 'admin_password',
            'admin_name', 'mobile', 'address', 'district', 'state', 'pincode',
            'is_active', 'created_at', 'updated_at', 'created_by'
        ]
        extra_kwargs = {
            'admin_password': {'write_only': True}
        }

    def create(self, validated_data):
        # Hash password before saving
        validated_data['admin_password'] = make_password(validated_data['admin_password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Hash password if it's being updated
        if 'admin_password' in validated_data:
            validated_data['admin_password'] = make_password(validated_data['admin_password'])
        return super().update(instance, validated_data)

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = [
            'id', 'setting_key', 'setting_value', 'setting_type', 'description',
            'is_active', 'updated_by', 'updated_at', 'created_at'
        ]

class DatabaseBackupSerializer(serializers.ModelSerializer):
    backup_size_mb = serializers.SerializerMethodField()
    
    class Meta:
        model = DatabaseBackup
        fields = [
            'id', 'backup_name', 'backup_path', 'backup_size', 'backup_size_mb',
            'backup_type', 'status', 'created_by', 'created_at', 'notes'
        ]

    def get_backup_size_mb(self, obj):
        return round(obj.backup_size / (1024 * 1024), 2)

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            'id', 'admin_email', 'action_type', 'action_description', 'affected_model',
            'affected_record_id', 'ip_address', 'user_agent', 'timestamp', 'status'
        ]