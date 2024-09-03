from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field
from typing import Optional, Literal
import bcrypt
import re

class User(Document):
    id: PydanticObjectId = Field(alias="_id")
    username: Indexed(str, unique=True)
    password: str
    school: str
    name: str
    role: Literal["student", "teacher"]
    studentId: Optional[str] = None
    subject: Optional[str] = None

    class Settings:
        name = "users"
        indexes = [
            "username",
        ]

    @classmethod
    async def get_by_username(cls, username: str):
        return await cls.find_one(cls.username == username)

    def hash_password(self):
        self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    @classmethod
    def validate_student_id(cls, studentId: Optional[str], role: str) -> Optional[str]:
        if role == 'student':
            if not studentId:
                raise ValueError('studentId is required for students')
            if not re.match(r'^\d{4}-\d-\d-\d$', studentId):
                raise ValueError('studentId must be in the format: year-grade-class-number')
        return studentId

    @classmethod
    def validate_subject(cls, subject: Optional[str], role: str) -> Optional[str]:
        if role == 'teacher' and not subject:
            raise ValueError('subject is required for teachers')
        return subject

    def validate(self):
        super().validate()
        self.studentId = self.validate_student_id(self.studentId, self.role)
        self.subject = self.validate_subject(self.subject, self.role)

class UserResponse(BaseModel):
    id: str
    username: str
    school: str
    name: str
    role: str
    studentId: Optional[str] = None
    subject: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class TokenResponse(BaseModel):
    token: Token
    user: UserResponse