from django.db import models

class AdminUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)

    def __str__(self):
        return self.email

class StudentInfo(models.Model):
    email = models.EmailField(unique=True)
    temp_register_no = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Application(models.Model):
    user_id = models.IntegerField()
    email = models.EmailField()
    mode_of_study = models.CharField(max_length=100)
    programme_applied = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    medium = models.CharField(max_length=100)
    academic_year = models.CharField(max_length=100)
    deb_id = models.CharField(max_length=100)
    abc_id = models.CharField(max_length=100)
    name_initial = models.CharField(max_length=100)
    dob = models.DateField()
    aadhaar_no = models.CharField(max_length=12)
    name_as_aadhaar = models.CharField(max_length=200)
    parent_selected = models.BooleanField()
    guardian_selected = models.BooleanField()
    father_name = models.CharField(max_length=100)
    father_occupation = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    mother_occupation = models.CharField(max_length=100)
    guardian_name = models.CharField(max_length=100)
    guardian_occupation = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100)
    religion = models.CharField(max_length=100)
    community = models.CharField(max_length=100)
    mother_tongue = models.CharField(max_length=100)
    differently_abled = models.CharField(max_length=100)
    disability_type = models.CharField(max_length=100, blank=True, null=True)
    blood_group = models.CharField(max_length=10)
    access_internet = models.CharField(max_length=100)
    comm_pincode = models.CharField(max_length=10)
    comm_district = models.CharField(max_length=100)
    comm_state = models.CharField(max_length=100)
    comm_country = models.CharField(max_length=100)
    comm_town = models.CharField(max_length=100)
    comm_area = models.CharField(max_length=100, choices=[('Rural', 'Rural'), ('Urban', 'Urban')])
    same_as_comm = models.BooleanField()
    perm_pincode = models.CharField(max_length=10)
    perm_district = models.CharField(max_length=100)
    perm_state = models.CharField(max_length=100)
    perm_country = models.CharField(max_length=100)
    perm_town = models.CharField(max_length=100)
    perm_area = models.CharField(max_length=100, choices=[('Rural', 'Rural'), ('Urban', 'Urban')])

    class Meta:
        db_table = 'api_application'

    def __str__(self):
        return self.email

class StudentDetails(models.Model):
    user_id = models.IntegerField()
    email = models.EmailField()
    
    name_initial = models.CharField(max_length=100)
    qualifications = models.JSONField()
    semester_marks = models.JSONField()
    current_designation = models.CharField(max_length=255, blank=True, null=True)
    current_institute = models.CharField(max_length=255, blank=True, null=True)
    years_experience = models.IntegerField(blank=True, null=True)
    annual_income = models.IntegerField(blank=True, null=True)
    photo_url = models.URLField(max_length=500, blank=True, null=True)
    signature_url = models.URLField(max_length=500, blank=True, null=True)
    sslc_marksheet_url = models.URLField(max_length=500, blank=True, null=True)
    hsc_marksheet_url = models.URLField(max_length=500, blank=True, null=True)
    ug_marksheet_url = models.URLField(max_length=500, blank=True, null=True)
    semester_marksheet_url = models.URLField(max_length=500, blank=True, null=True)
    community_certificate_url = models.URLField(max_length=500, blank=True, null=True)
    aadhaar_url = models.URLField(max_length=500, blank=True, null=True)
    transfer_certificate_url = models.URLField(max_length=500, blank=True, null=True)
    # Added verification fields
    photo_verified = models.BooleanField(default=False)
    signature_verified = models.BooleanField(default=False)
    sslc_marksheet_verified = models.BooleanField(default=False)
    hsc_marksheet_verified = models.BooleanField(default=False)
    ug_marksheet_verified = models.BooleanField(default=False)
    semester_marksheet_verified = models.BooleanField(default=False)
    community_certificate_verified = models.BooleanField(default=False)
    aadhaar_verified = models.BooleanField(default=False)
    transfer_certificate_verified = models.BooleanField(default=False)

    

    class Meta:
        db_table = 'api_studentdetails'

    def __str__(self):
        return self.email


class Student(models.Model):
    user_id = models.IntegerField(null=True, blank=True)  # Maps to user_id
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=191, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=128)

    class Meta:
        db_table = 'api_student'

    def __str__(self):
        return self.email

class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    application_id = models.CharField(max_length=10)
    user_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=15)
    transaction_id = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    course = models.CharField(max_length=100)
    payment_status = models.CharField(
        max_length=20,
        choices=[('success', 'Success'), ('failed', 'Failed'), ('cancelled', 'Cancelled')]
    )
    created_at = models.DateTimeField()
    user_id = models.IntegerField()

    class Meta:
        db_table = 'payments'

    def __str__(self):
        return f"{self.application_id} - {self.transaction_id}"


class ApplicationStatus(models.Model):
    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Not Confirmed', 'Not Confirmed'),
        ('Cancelled', 'Cancelled'),
    )
    
    application_id = models.CharField(max_length=50, unique=True)
    student_email = models.EmailField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    reason = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'application_status'

    def __str__(self):
        return f"{self.application_id} - {self.status}"

class LSC(models.Model):
    lsc_code = models.CharField(max_length=50, unique=True)
    centre_name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'lsc_centers'

    def __str__(self):
        return f"{self.lsc_code} - {self.centre_name}"

class Course(models.Model):
    course_short_code = models.CharField(max_length=50)
    course_full_name = models.CharField(max_length=200)
    branch_name = models.CharField(max_length=100)
    num_semesters = models.IntegerField()
    num_years = models.IntegerField()
    course_code = models.CharField(max_length=50)
    degree = models.CharField(max_length=50)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tbl_course'

    def __str__(self):
        return f"{self.course_short_code} - {self.course_full_name}"

class Counsellor(models.Model):
    counsellor_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    aadhaar = models.CharField(max_length=12, unique=True)
    qualification = models.CharField(max_length=100)
    highest_qualification = models.CharField(max_length=50)
    programme_assigned = models.CharField(max_length=50)
    mobile = models.CharField(max_length=15)
    alternate_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    experience = models.IntegerField(blank=True, null=True)
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200)
    address_line3 = models.CharField(max_length=200)
    pincode = models.CharField(max_length=10)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    image = models.ImageField(upload_to='counsellor_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tbl_counsellor'

    def __str__(self):
        return self.counsellor_name