from pydantic import BaseModel, Field, EmailStr, constr, field_validator
from typing import Optional
from bson import ObjectId
from common import PyObjectId, CustomBaseModel

class UserCreate(CustomBaseModel):
    username: EmailStr = Field(..., description="User's email address, used as a username.")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long and contain letters, numbers, and special characters.")
    school: str = Field(..., description="Name of the school.")
    studentId: Optional[str] = Field(None, description="Student ID in the format: year-grade-class-number, required if role is student.")
    subject: Optional[str] = Field(None, description="Subject name, required if role is teacher.")
    name: str = Field(..., description="Full name of the user.")
    role: str = Field(..., description="Role of the user, e.g., student or teacher.")

    @field_validator('password')
    def password_complexity(cls, v):
        import re
        if not re.match(r'^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$', v):
            raise ValueError('Password must contain at least one letter, one number, and one special character.')
        return v

    @field_validator('username', 'school', 'name', 'role')
    def not_empty(cls, v, info):
        if not v.strip():
            raise ValueError(f'{info.field_name} field cannot be empty')
        return v

    @field_validator('studentId')
    def validate_student_id(cls, v, values, **kwargs):
        if values.get('role') == 'student' and not v:
            raise ValueError('studentId is required for students')
        if values.get('role') == 'student' and len(v) != 4:
            raise ValueError('studentId must be in the format: year-grade-class-number')
        return v

    @field_validator('subject')
    def validate_subject(cls, v, values, **kwargs):
        if values.get('role') == 'teacher' and not v:
            raise ValueError('subject is required for teachers')
        return v

class UserLogin(CustomBaseModel):
    username: EmailStr = Field(..., description="User's email address, used as a username.")
    password: str = Field(..., description="User's password.")

class User(CustomBaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    username: EmailStr = Field(..., description="User's email address, used as a username.")
    school: str = Field(..., description="Name of the school.")
    studentId: Optional[str] = Field(None, description="Student ID in the format: year-grade-class-number.")
    subject: Optional[str] = Field(None, description="Subject name.")
    name: str = Field(..., description="Full name of the user.")
    role: str = Field(..., description="Role of the user, e.g., student or teacher.")
    token: str = Field(..., description="Authentication token.")
