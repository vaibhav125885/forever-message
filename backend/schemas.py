from pydantic import BaseModel, EmailStr
from datetime import datetime, date

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    status: str

    class Config:
        from_attributes = True
        
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
class RecipientCreate(BaseModel):
    name: str
    email: EmailStr | None = None
    relation: str
    date_of_birth: str | None = None


class RecipientResponse(BaseModel):
    id: int
    name: str
    email: EmailStr | None
    relation: str
    date_of_birth: str | None

    class Config:
        from_attributes = True
        
        
class LegacyMessageCreate(BaseModel):
    recipient_id: int
    title: str
    message: str
    release_date: date
    release_type: str


class LegacyMessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    title: str
    message: str
    release_date: date
    release_type: str
    is_released: bool
    released_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True
        
class LegacyMessageUpdate(BaseModel):
    title: str
    message: str
    
    
class VerificationRequestCreate(BaseModel):
    recipient_id: int


class VerificationRequestResponse(BaseModel):
    id: int
    user_id: int
    recipient_id: int
    status: str
    created_at: datetime
    reviewed_at: datetime | None = None

    class Config:
        from_attributes = True

class VerificationDecision(BaseModel):
    status: str
    
class ReleasedMessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    title: str
    message: str
    released_at: datetime | None = None
    release_type: str

    class Config:
        from_attributes = True