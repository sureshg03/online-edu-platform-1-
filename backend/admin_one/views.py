from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AdminUser, StudentInfo, Application, StudentDetails
from .serializers import ApplicationSerializer, StudentDetailsSerializer, StudentInfoSerializer
import json
import logging
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
import random
import string

# Set up logging
logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
def check_admin_exists(request):
    try:
        exists = AdminUser.objects.exists()
        logger.debug("Checked admin existence")
        return JsonResponse({"exists": exists})
    except Exception as e:
        logger.error(f"Error in check_admin_exists: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from .models import AdminUser
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def create_admin(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            logger.warning("Missing email or password in create_admin request")
            return JsonResponse({"error": "Email and password are required"}, status=400)

        # Check if AdminUser already exists
        if AdminUser.objects.filter(email=email).exists():
            logger.warning(f"Attempt to create existing admin: {email}")
            return JsonResponse({"error": "Admin already exists"}, status=400)

        # Check if User with this email already exists
        existing_user = User.objects.filter(email=email).first()
        if existing_user:
            # User exists but AdminUser doesn't - reuse the User
            logger.info(f"Reusing existing User for admin: {email}")
            # Update the User's password to match the new admin password
            existing_user.set_password(password)
            existing_user.save()
            user = existing_user
        else:
            # Check if username (email) is taken by a different user
            if User.objects.filter(username=email).exists():
                # Username collision - use a unique username based on email + timestamp
                import time
                unique_username = f"{email.split('@')[0]}_{int(time.time())}"
                logger.info(f"Username collision, using unique username: {unique_username}")
                user = User.objects.create_user(
                    username=unique_username,
                    email=email,
                    password=password
                )
            else:
                # Create new User with email as username
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password
                )
            logger.info(f"Created new User instance for admin: {email}")

        # Create AdminUser
        hashed_password = make_password(password)
        admin_user = AdminUser.objects.create(email=email, password=hashed_password)

        logger.info(f"Admin created successfully: {email}")
        return JsonResponse({"status": "success", "message": "Admin created successfully"})
    except Exception as e:
        logger.error(f"Error in create_admin: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=400)

from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import AdminUser
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        logger.debug(f"Received login request with body: {request.body}")

        if not email or not password:
            logger.warning("Missing email or password in login request")
            return JsonResponse({"status": "fail", "message": "Email and password are required"}, status=400)

        # Check AdminUser credentials
        try:
            admin = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            logger.warning(f"Login attempt for non-existent admin: {email}")
            return JsonResponse({"status": "fail", "message": "Admin not found"}, status=404)

        if check_password(password, admin.password):
            # Get or create corresponding User instance
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                logger.error(f"No User instance found for admin: {email}")
                return JsonResponse({"status": "fail", "message": "Authentication user not found"}, status=404)

            # Generate token for User instance
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Login successful for {email}")
            return JsonResponse({"status": "success", "token": token.key})
        else:
            logger.warning(f"Invalid password for {email}")
            return JsonResponse({"status": "fail", "message": "Invalid credentials"}, status=401)
    except json.JSONDecodeError:
        logger.error("Invalid JSON in login request")
        return JsonResponse({"status": "fail", "message": "Invalid request data"}, status=400)
    except Exception as e:
        logger.error(f"Error in login_view: {str(e)}")
        return JsonResponse({"status": "fail", "message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def send_otp(request):
    try:
        # Assume only one admin exists in admin_one_adminuser
        admin = AdminUser.objects.first()
        if not admin:
            logger.warning("No admin found in admin_one_adminuser")
            return JsonResponse({"error": "No admin found"}, status=404)

        email = admin.email
        # Generate 6-digit OTP
        otp = ''.join(random.choices(string.digits, k=6))
        # Store OTP in cache with 10-minute expiry
        cache.set(f"otp_{email}", otp, timeout=600)

        # Send OTP via email
        subject = 'Your Password Reset OTP'
        message = f"Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes."
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        try:
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False,
            )
            logger.info(f"OTP sent to {email}")
            return JsonResponse({"status": "success", "message": "OTP sent to admin email", "email": email})
        except Exception as email_error:
            logger.error(f"Failed to send OTP email to {email}: {str(email_error)}")
            return JsonResponse({"error": "Failed to send OTP email", "details": str(email_error)}, status=500)
    except Exception as e:
        logger.error(f"Error in send_otp: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def verify_otp(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        stored_otp = cache.get(f"otp_{email}")

        if not stored_otp:
            logger.warning(f"OTP verification failed for {email}: OTP expired or not found")
            return JsonResponse({"error": "OTP expired or not found"}, status=400)

        if otp == stored_otp:
            # OTP is valid, clear it from cache
            cache.delete(f"otp_{email}")
            logger.info(f"OTP verified for {email}")
            return JsonResponse({"status": "success", "message": "OTP verified"})
        else:
            logger.warning(f"Invalid OTP attempt for {email}")
            return JsonResponse({"error": "Invalid OTP"}, status=400)
    except Exception as e:
        logger.error(f"Error in verify_otp: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        
        try:
            admin = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            logger.warning(f"Password reset attempt for non-existent admin: {email}")
            return JsonResponse({"error": "Admin not found"}, status=404)

        # Update password
        admin.password = make_password(password)
        admin.save()
        logger.info(f"Password reset for {email}")
        return JsonResponse({"status": "success", "message": "Password reset successfully"})
    except Exception as e:
        logger.error(f"Error in reset_password: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['GET'])
def get_applications(request):
    try:
        applications = Application.objects.all()
        logger.debug(f"Retrieved {applications.count()} applications")
        serializer = ApplicationSerializer(applications, many=True)
        logger.debug(f"Serialized data: {serializer.data}")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_applications: {str(e)}")
        return Response({"error": str(e), "details": "Failed to fetch applications"}, status=400)

@api_view(['GET'])
def get_student_details(request, email):
    try:
        student_details = StudentDetails.objects.filter(email=email).first()
        if not student_details:
            logger.warning(f"No student details found for email: {email}")
            return Response({"error": "Student details not found"}, status=404)
        serializer = StudentDetailsSerializer(student_details)
        logger.debug(f"Serialized student details for {email}: {serializer.data}")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_student_details: {str(e)}")
        return Response({"error": str(e), "details": "Failed to fetch student details"}, status=400)

@api_view(['POST'])
@csrf_exempt
def verify_student(request):
    try:
        serializer = StudentInfoSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            logger.info(f"Student verified: {request.data.get('email')}")

            # Send email with credentials
            email = request.data.get('email')
            temp_register_no = request.data.get('temp_register_no')
            password = request.data.get('password')

            subject = 'Your Current Reg No and Password'
            message = (
                f"Your Current Reg No and Password\n\n"
                f"Reg No: {temp_register_no}\n"
                f"Password: {password}"
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]

            try:
                send_mail(
                    subject,
                    message,
                    from_email,
                    recipient_list,
                    fail_silently=False,
                )
                logger.info(f"Verification email sent to {email}")
            except Exception as email_error:
                logger.error(f"Failed to send verification email to {email}: {str(email_error)}")
                return Response(
                    {"error": "Student verified, but failed to send email", "details": str(email_error)},
                    status=500
                )

            return Response({"status": "success", "message": "Student verified and email sent"})
        logger.error(f"Validation errors in verify_student: {serializer.errors}")
        return Response({"error": serializer.errors}, status=400)
    except Exception as e:
        logger.error(f"Error in verify_student: {str(e)}")
        return Response({"error": str(e), "details": "Failed to verify student"}, status=400)

@api_view(['GET'])
def get_student_info(request, email):
    try:
        student_info = StudentInfo.objects.filter(email=email).first()
        if not student_info:
            logger.warning(f"No student info found for email: {email}")
            return Response({"error": "Student info not found"}, status=404)
        serializer = StudentInfoSerializer(student_info)
        logger.debug(f"Serialized student info for {email}: {serializer.data}")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_student_info: {str(e)}")
        return Response({"error": str(e), "details": "Failed to fetch student info"}, status=400)

@api_view(['PUT'])
@csrf_exempt
def update_student_info(request, email):
    try:
        student_info = StudentInfo.objects.filter(email=email).first()
        if not student_info:
            logger.warning(f"No student info found for email: {email}")
            return Response({"error": "Student info not found"}, status=404)
        serializer = StudentInfoSerializer(student_info, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            logger.info(f"Student info updated: {email}")

            # Send email with updated credentials
            temp_register_no = request.data.get('temp_register_no', instance.temp_register_no)
            password = request.data.get('password', instance.password)

            subject = 'Your Updated Reg No and Password'
            message = (
                f"Your Updated Reg No and Password\n\n"
                f"Reg No: {temp_register_no}\n"
                f"Password: {password}"
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]

            try:
                send_mail(
                    subject,
                    message,
                    from_email,
                    recipient_list,
                    fail_silently=False,
                )
                logger.info(f"Update email sent to {email}")
            except Exception as email_error:
                logger.error(f"Failed to send update email to {email}: {str(email_error)}")
                return Response(
                    {"error": "Student updated, but failed to send email", "details": str(email_error)},
                    status=500
                )

            return Response(serializer.data)
        logger.error(f"Validation errors in update_student_info: {serializer.errors}")
        return Response({"error": serializer.errors}, status=400)
    except Exception as e:
        logger.error(f"Error in update_student_info: {str(e)}")
        return Response({"error": str(e), "details": "Failed to update student info"}, status=400)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Student, Application, StudentDetails, Payment
from admin_one.serializers import StudentSerializer, ApplicationSerializer, StudentDetailsSerializer,PaymentSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_details_preview(request):
    email = request.query_params.get('email')
    logger.info(f"Received request for student details preview with email: {email}")
    
    if not email:
        logger.warning("Email parameter missing in student details preview request")
        return Response({'status': 'error', 'message': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        logger.debug(f"Fetching data for email: {email}")
        student = Student.objects.filter(email=email).first()
        application = Application.objects.filter(email=email).first()
        student_details = StudentDetails.objects.filter(email=email).first()
        payment = Payment.objects.filter(email=email).first()
        
        data = {
            'student': StudentSerializer(student).data if student else {},
            'application': ApplicationSerializer(application).data if application else {},
            'student_details': StudentDetailsSerializer(student_details).data if student_details else {},
            'payment': PaymentSerializer(payment).data if payment else {},
        }
        
        logger.info(f"Successfully fetched data for email: {email}")
        return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error fetching student details for email {email}: {str(e)}", exc_info=True)
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_details(request):
    try:
        student = Student.objects.filter(user=request.user).first()
        if not student:
            student = Student.objects.filter(email=request.user.email).first()
            if student:
                student.user = request.user
                student.save()
            else:
                student = Student.objects.create(
                    user=request.user,
                    email=request.user.email,
                    name=request.user.username or 'User',
                    phone='',
                    is_verified=True,
                )
        return Response(
            {
                "status": "success",
                "data": {
                    "email": student.email,
                    "name": student.name or 'User',
                    "phone": student.phone or ''
                }
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error fetching student details: {str(e)}")
        return Response(
            {"status": "error", "message": f"An error occurred while fetching student details: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import StudentInfo
from .serializers import StudentInfoSerializer
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
import logging
import random

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_student(request):
    try:
        email = request.data.get('email')
        temp_register_no = request.data.get('temp_register_no')
        password = request.data.get('password')
        
        if not email:
            logger.warning("Missing email in verify-student request")
            return Response({'status': 'error', 'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        student_info = StudentInfo.objects.filter(email__iexact=email).first()
        if not student_info:
            # Create new StudentInfo record
            serializer = StudentInfoSerializer(data={
                'email': email,
                'temp_register_no': temp_register_no or f"TEMP_{random.randint(1000, 9999)}",
                'password': password or 'defaultpassword',
            })
            if serializer.is_valid():
                student_info = serializer.save()
                logger.info(f"Created and verified StudentInfo for email: {email}")
            else:
                logger.error(f"Validation errors in verify_student: {serializer.errors}")
                return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Update existing record
            student_info.is_verified = True
            if temp_register_no:
                student_info.temp_register_no = temp_register_no
            if password:
                student_info.password = make_password(password)
            student_info.save()
            logger.info(f"Updated and verified StudentInfo for email: {email}")
        
        # Send email with credentials
        subject = 'Your Student Credentials'
        message = (
            f"Your Student Credentials\n\n"
            f"Reg No: {student_info.temp_register_no}\n"
            f"Password: {password or 'defaultpassword'}"
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        try:
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False,
            )
            logger.info(f"Verification email sent to {email}")
        except Exception as email_error:
            logger.error(f"Failed to send verification email to {email}: {str(email_error)}")
            return Response(
                {'status': 'success', 'message': 'Student verified, but failed to send email', 'details': str(email_error)},
                status=status.HTTP_200_OK
            )
        
        return Response({'status': 'success', 'message': 'Student verified successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in verify_student: {str(e)}")
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import StudentDetails
import logging

logger = logging.getLogger(__name__)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import StudentInfo, StudentDetails
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_document(request):
    email = request.data.get('email')
    document_type = request.data.get('document_type')

    if not email or not document_type:
        logger.warning(f"Missing parameters: email={email}, document_type={document_type}")
        return Response(
            {'status': 'error', 'message': 'Email and document_type are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        student_details = StudentDetails.objects.get(email=email)
    except StudentDetails.DoesNotExist:
        logger.error(f"StudentDetails not found for email: {email}")
        return Response(
            {'status': 'error', 'message': 'Student details not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    document_field_map = {
        'photo': 'photo_verified',
        'signature': 'signature_verified',
        'sslc_marksheet': 'sslc_marksheet_verified',
        'hsc_marksheet': 'hsc_marksheet_verified',
        'ug_marksheet': 'ug_marksheet_verified',
        'semester_marksheet': 'semester_marksheet_verified',
        'community_certificate': 'community_certificate_verified',
        'aadhaar': 'aadhaar_verified',
        'transfer_certificate': 'transfer_certificate_verified',
    }

    if document_type not in document_field_map:
        logger.warning(f"Invalid document_type: {document_type}")
        return Response(
            {'status': 'error', 'message': 'Invalid document type'},
            status=status.HTTP_400_BAD_REQUEST
        )

    field_name = document_field_map[document_type]
    try:
        setattr(student_details, field_name, True)
        student_details.save()
        logger.info(f"Document {document_type} verified for email: {email}")
        return Response(
            {'status': 'success', 'message': f'{document_type} verified successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error verifying document {document_type} for email {email}: {str(e)}")
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unverify_student(request):
    email = request.data.get('email')
    if not email:
        logger.warning("Missing email parameter in unverify-student request")
        return Response(
            {'status': 'error', 'message': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        student_info = StudentInfo.objects.filter(email__iexact=email).first()
        if not student_info:
            logger.warning(f"No student info found for email: {email}. Creating new record.")
            student = Student.objects.filter(email__iexact=email).first()
            if not student:
                logger.error(f"No student record found for email: {email}")
                return Response(
                    {'status': 'error', 'message': 'Student record not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            student_info = StudentInfo.objects.create(
                email=email,
                temp_register_no=f"TEMP_{random.randint(1000, 9999)}",
                password=make_password('defaultpassword')
            )
            logger.info(f"Created StudentInfo record for email: {email}")
        
        student_info.is_verified = False
        student_info.save()
        
        student_details = StudentDetails.objects.filter(email__iexact=email).first()
        if student_details:
            verification_fields = [
                'photo_verified', 'signature_verified', 'sslc_marksheet_verified',
                'hsc_marksheet_verified', 'ug_marksheet_verified', 'semester_marksheet_verified',
                'community_certificate_verified', 'aadhaar_verified', 'transfer_certificate_verified'
            ]
            for field in verification_fields:
                setattr(student_details, field, False)
            student_details.save()
            logger.info(f"Verification fields reset for email: {email}")
        
        logger.info(f"Student unverified successfully for email: {email}")
        return Response(
            {'status': 'success', 'message': 'Student unverified successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error unverifying student for email {email}: {str(e)}")
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
from django.http import HttpResponse
import requests
import logging

logger = logging.getLogger(__name__)

def proxy_google_drive_image(request, file_id):
    try:
        token = request.GET.get('token')
        if not token:
            logger.warning(f"Missing token for file_id {file_id}")
            return HttpResponse(status=401, content="Authentication token required")

        from rest_framework.authtoken.models import Token
        try:
            Token.objects.get(key=token)
        except Token.DoesNotExist:
            logger.warning(f"Invalid token for file_id {file_id}")
            return HttpResponse(status=403, content="Invalid token")

        image_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        logger.info(f"Attempting to fetch image: {image_url}")
        response = requests.get(image_url, stream=True, timeout=10)
        logger.info(f"Google Drive response status: {response.status_code}")
        if response.status_code == 200:
            content_type = response.headers.get('content-type', 'image/jpeg')
            logger.info(f"Content-Type: {content_type}")
            return HttpResponse(
                content=response.content,
                content_type=content_type,
            )
        logger.error(f"Google Drive returned status {response.status_code} for file_id {file_id}")
        return HttpResponse(status=404)
    except requests.RequestException as e:
        logger.error(f"Error proxying image {file_id}: {str(e)}")
        return HttpResponse(status=500)
        
from django.http import HttpResponse
import requests
import logging
from rest_framework.authtoken.models import Token

logger = logging.getLogger(__name__)

import requests
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
import logging

logger = logging.getLogger(__name__)
import requests
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
import logging

logger = logging.getLogger(__name__)
import requests
import logging
from django.http import StreamingHttpResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def proxy_google_drive_file(request, file_id):
    try:
        token = request.GET.get('token')
        if not token or token != request.META.get('HTTP_AUTHORIZATION', '').replace('Token ', ''):
            logger.warning(f"Invalid token for file_id: {file_id}")
            return Response({'error': 'Invalid or missing token'}, status=status.HTTP_401_UNAUTHORIZED)

        drive_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        logger.debug(f"Fetching Google Drive file: {drive_url}")
        response = requests.get(drive_url, stream=True, timeout=30)

        if response.status_code != 200:
            logger.error(f"Google Drive request failed with status {response.status_code} for file_id: {file_id}")
            return Response({'error': 'Failed to fetch file from Google Drive'}, status=response.status_code)

        # Check if response is likely a PDF
        content = next(response.iter_content(5))
        is_pdf = content.startswith(b'%PDF')
        content_type = 'application/pdf' if is_pdf else 'application/octet-stream'
        logger.debug(f"File_id: {file_id}, Content-Type: {content_type}, is_pdf: {is_pdf}")

        def stream_content():
            yield content
            for chunk in response.iter_content(chunk_size=8192):
                yield chunk

        headers = {
            'Content-Type': content_type,
            'Content-Disposition': response.headers.get('Content-Disposition', f'attachment; filename="{file_id}.pdf"'),
            'Accept-Ranges': 'bytes',  
        }

        return StreamingHttpResponse(stream_content(), headers=headers, status=response.status_code)
    except Exception as e:
        logger.error(f"Error proxying file_id {file_id}: {str(e)}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_details_admin(request):
    try:
        email = request.GET.get('email')
        if not email:
            return Response({"status": "error", "message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = {}
        student = Student.objects.filter(email=email).first()
        data['student'] = StudentSerializer(student).data if student else None

        application = Application.objects.filter(email=email).first()
        data['application'] = ApplicationSerializer(application).data if application else None

        student_details = StudentDetails.objects.filter(email=email).first()
        data['student_details'] = StudentDetailsSerializer(student_details).data if student_details else None

        return Response({"status": "success", "data": data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error fetching student details for {email}: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.template.exceptions import TemplateDoesNotExist
from .models import ApplicationStatus
import logging
import os
import re

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_email(request):
    try:
        data = request.data
        logger.info(f"Received send-email request with payload: {data}")
        email = data.get('email')
        student_name = data.get('studentName')
        subject = data.get('subject')
        invalid_reasons = data.get('invalidReasons', {})
        upload_requests = data.get('uploadRequests', {})
        eligibility_status = data.get('eligibilityStatus')
        not_eligible_reason = data.get('notEligibleReason')
        admission_status = data.get('admissionStatus')
        not_admitted_reason = data.get('notAdmittedReason')
        application_id = data.get('applicationId')

        if not email or not subject or not application_id:
            logger.warning(f"Missing required fields in send-email request: email={email}, subject={subject}, application_id={application_id}")
            return Response(
                {'status': 'error', 'message': 'Email, subject, and application_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if subject:
            subject = re.sub(r'[\n\r;|\t]', ' ', subject)
            subject = re.sub(r'\s+', ' ', subject).strip()
            if len(subject) > 998:
                subject = subject[:995] + '...'
                logger.info(f"Sanitized subject: {subject}")

        invalid_reasons_list = []
        if isinstance(invalid_reasons, dict):
            invalid_reasons_list = [
                {'label': item['label'], 'reason': item['reason']}
                for key, item in invalid_reasons.items()
                if item.get('label') and item.get('reason')
            ]
        elif isinstance(invalid_reasons, list):
            invalid_reasons_list = [
                {'label': item['label'], 'reason': item['reason']}
                for item in invalid_reasons
                if item.get('label') and item.get('reason')
            ]
        else:
            logger.warning(f"Invalid format for invalid_reasons: {type(invalid_reasons)}")

        upload_requests_list = []
        if isinstance(upload_requests, dict):
            upload_requests_list = [
                {'label': item['label'], 'query': item['query']}
                for key, item in upload_requests.items()
                if item.get('label') and item.get('query')
            ]
        elif isinstance(upload_requests, list):
            upload_requests_list = [
                {'label': item['label'], 'query': item['query']}
                for item in upload_requests
                if item.get('label') and item.get('query')
            ]
        else:
            logger.warning(f"Invalid format for upload_requests: {type(upload_requests)}")

        context = {
            'student_name': student_name or 'Student',
            'invalid_reasons': invalid_reasons_list,
            'upload_requests': upload_requests_list,
            'eligibility_status': eligibility_status,
            'not_eligible_reason': not_eligible_reason,
            'admission_status': admission_status,
            'not_admitted_reason': not_admitted_reason,
            'current_year': 2025,
            'STATIC_URL': settings.STATIC_URL,
        }

        template_path = 'email/invalid_certificates.html'
        try:
            template_full_path = os.path.join(settings.BASE_DIR, 'admin_one', 'templates', template_path)
            if not os.path.exists(template_full_path):
                logger.error(f"Template not found at: {template_full_path}")
                raise TemplateDoesNotExist(template_path)
            html_content = render_to_string(template_path, context)
        except TemplateDoesNotExist as e:
            logger.error(f"Template error: {str(e)}. Checked path: {template_full_path}")
            return Response(
                {'status': 'error', 'message': 'Email template not found', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        text_content = (
            f"Dear {student_name or 'Student'},\n\n"
            f"Your application has issues that need to be addressed:\n\n"
        )
        if invalid_reasons_list:
            text_content += "Invalid Documents:\n"
            for item in invalid_reasons_list:
                text_content += f"- {item['label']}: {item['reason']}\n"
            text_content += "\n"
        if upload_requests_list:
            text_content += "Document Upload Requests:\n"
            for item in upload_requests_list:
                text_content += f"- {item['label']}: {item['query']}\n"
            text_content += "\n"
        if eligibility_status == 'Not Eligible' and not_eligible_reason:
            text_content += f"Eligibility Status: {eligibility_status}\n"
            text_content += f"Reason: {not_eligible_reason}\n\n"
        if admission_status in ['Not Confirmed', 'Cancelled'] and not_admitted_reason:
            text_content += f"Admission Status: {admission_status}\n"
            text_content += f"Reason: {not_admitted_reason}\n\n"
        text_content += "Please address these issues and resubmit the required documents.\n\nBest regards,\nPeriyar University"

        email_msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        email_msg.attach_alternative(html_content, "text/html")
        email_msg.send()

        if admission_status in ['Not Confirmed', 'Cancelled']:
            ApplicationStatus.objects.update_or_create(
                application_id=application_id,
                defaults={
                    'student_email': email,
                    'status': admission_status,
                    'reason': not_admitted_reason or subject,
                }
            )
            logger.info(f"Application status saved as {admission_status} for application_id: {application_id}")

        logger.info(f"Email sent successfully to {email}")
        return Response(
            {'status': 'success', 'message': 'Email sent successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error sending email to {email}: {str(e)}")
        return Response(
            {'status': 'error', 'message': 'Failed to send email', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ApplicationStatus
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_application_status(request):
    try:
        application_id = request.data.get('application_id')
        student_email = request.data.get('student_email')
        app_status = request.data.get('status')
        reason = request.data.get('reason', '')
        enrollment_number = request.data.get('enrollment_number', '')

        if not application_id or not student_email or not app_status:
            logger.warning(f"Missing required fields in save-application-status: application_id={application_id}, student_email={student_email}, status={app_status}")
            return Response(
                {'status': 'error', 'message': 'Application ID, student email, and status are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if app_status == 'Confirmed' and not enrollment_number:
            logger.warning(f"Enrollment number missing for Confirmed status: application_id={application_id}")
            return Response(
                {'status': 'error', 'message': 'Enrollment number is required for Confirmed status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ApplicationStatus.objects.update_or_create(
            application_id=application_id,
            defaults={
                'student_email': student_email,
                'status': app_status,
                'reason': reason,
            }
        )
        logger.info(f"Application status saved as {app_status} for application_id: {application_id}")
        return Response(
            {'status': 'success', 'message': 'Application status saved successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error saving application status for application_id {application_id}: {str(e)}")
        return Response(
            {'status': 'error', 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Student, Application, StudentDetails, ApplicationStatus
from .serializers import StudentSerializer, ApplicationSerializer, StudentDetailsSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_details_admin(request):
    try:
        email = request.GET.get('email')
        if not email:
            logger.warning("Email parameter missing in get-student-details-admin request")
            return Response(
                {"status": "error", "message": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {}
        student = Student.objects.filter(email=email).first()
        data['student'] = StudentSerializer(student).data if student else None

        application = Application.objects.filter(email=email).first()
        data['application'] = ApplicationSerializer(application).data if application else None

        student_details = StudentDetails.objects.filter(email=email).first()
        data['student_details'] = StudentDetailsSerializer(student_details).data if student_details else None

        application_status = ApplicationStatus.objects.filter(student_email=email).first()
        data['application_status'] = {
            'status': application_status.status,
            'reason': application_status.reason,
            'application_id': application_status.application_id
        } if application_status else None

        logger.info(f"Fetched student details for email: {email}")
        return Response(
            {"status": "success", "data": data},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error fetching student details for email {email}: {str(e)}")
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import LSC
from .serializers import LSCSerializer
import logging

logger = logging.getLogger(__name__)

from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import LSC
from .serializers import LSCSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Return a CSRF token to anonymous clients.

    By default REST framework has global permission IsAuthenticated in settings.
    This endpoint must be accessible without authentication so the frontend
    can obtain a CSRF token prior to making requests that require CSRF.
    """
    try:
        token = get_token(request)
        return JsonResponse({"status": "success", "csrfToken": token}, status=200)
    except Exception as e:
        logger.error(f"Error in get_csrf_token: {str(e)}")
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def application_settings(request):
    """Minimal endpoint to return application-level settings.

    Frontend expects `/api/application-settings/`. Return an empty object for now
    (implement real settings retrieval later as needed).
    """
    try:
        # Placeholder: return empty settings
        return Response({"status": "success", "data": {}}, status=200)
    except Exception as e:
        logger.error(f"Error in application_settings: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def system_settings_by_type(request):
    """Minimal endpoint to return system settings filtered by type.

    Frontend calls `/api/system-settings/by_type/?type=...`. We'll accept 'type' query
    parameter and return an empty list for now. Replace with actual DB-backed
    implementation when the SystemSettings model exists.
    """
    try:
        s_type = request.query_params.get('type')
        # Placeholder response
        return Response({"status": "success", "type": s_type, "data": []}, status=200)
    except Exception as e:
        logger.error(f"Error in system_settings_by_type: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lsc(request):
    try:
        serializer = LSCSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"LSC created: {serializer.data['lsc_code']}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors in create_lsc: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in create_lsc: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_lsc(request):
    logger.info(f"LSC list requested by user: {request.user}")
    try:
        lscs = LSC.objects.all()
        serializer = LSCSerializer(lscs, many=True)
        logger.info(f"Retrieved {lscs.count()} LSCs")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_lsc: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_lsc(request, lsc_id):
    try:
        lsc = LSC.objects.get(id=lsc_id)
        serializer = LSCSerializer(lsc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"LSC updated: {lsc.lsc_code}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        logger.error(f"Validation errors in update_lsc: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except LSC.DoesNotExist:
        logger.warning(f"LSC not found: {lsc_id}")
        return Response({"status": "error", "message": "LSC not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in update_lsc: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_lsc(request, lsc_id):
    try:
        lsc = LSC.objects.get(id=lsc_id)
        lsc_code = lsc.lsc_code
        lsc.delete()
        logger.info(f"LSC deleted: {lsc_code}")
        return Response({"status": "success", "message": "LSC deleted successfully"}, status=status.HTTP_200_OK)
    except LSC.DoesNotExist:
        logger.warning(f"LSC not found: {lsc_id}")
        return Response({"status": "error", "message": "LSC not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in delete_lsc: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_all_lsc(request):
    try:
        count = LSC.objects.all().delete()[0]
        logger.info(f"Deleted all LSCs: {count} records")
        return Response({"status": "success", "message": f"Deleted {count} LSCs"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in delete_all_lsc: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    try:
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Course created: {serializer.data['course_short_code']}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors in create_course: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in create_course: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses(request):
    try:
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        logger.info(f"Retrieved {courses.count()} courses")
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in list_courses: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Course updated: {course.course_short_code}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        logger.error(f"Validation errors in update_course: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Course.DoesNotExist:
        logger.warning(f"Course not found: {course_id}")
        return Response({"status": "error", "message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in update_course: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        course_short_code = course.course_short_code
        course.delete()
        logger.info(f"Course deleted: {course_short_code}")
        return Response({"status": "success", "message": "Course deleted successfully"}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        logger.warning(f"Course not found: {course_id}")
        return Response({"status": "error", "message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in delete_course: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_all_courses(request):
    try:
        count = Course.objects.all().delete()[0]
        logger.info(f"Deleted all courses: {count} records")
        return Response({"status": "success", "message": f"Deleted {count} courses"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in delete_all_courses: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_counsellor(request):
    try:
        serializer = CounsellorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Counsellor created: {serializer.data['counsellor_name']}")
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors in create_counsellor: {serializer.errors}")
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in create_counsellor: {str(e)}")
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)