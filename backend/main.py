from fastapi import FastAPI, Depends, HTTPException,Request
from sqlalchemy.orm import Session
from db import engine, Base, get_db,SessionLocal
import models
from models import VerificationRequest,RecipientDB
from crud import (create_user,create_recipient,create_legacy_message,update_legacy_message,
delete_legacy_message,create_verification_request,release_user_messages,get_released_messages)
from schemas import ( UserCreate,UserResponse,LoginRequest,TokenResponse, RecipientCreate,
RecipientResponse,LegacyMessageResponse,LegacyMessageCreate,LegacyMessageUpdate,
VerificationRequestCreate,VerificationRequestResponse,VerificationDecision,ReleasedMessageResponse)
from auth import verify_password, create_token
from datetime import datetime, date
from dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)


INACTIVITY_DAYS = 180

def check_scheduled_messages():

    db = SessionLocal()

    try:

        users = db.query(models.UserDB).filter(models.UserDB.verification_status == "verified").all()

        for user in users:

            recipients = db.query(RecipientDB).filter(RecipientDB.user_id == user.id).all()

            for recipient in recipients:

                release_user_messages(db,user.id,recipient.id)

    finally:

        db.close()
        
scheduler = BackgroundScheduler()

scheduler.add_job(check_scheduled_messages,"interval",minutes=1)

@asynccontextmanager
async def lifespan(app: FastAPI):

    scheduler.start()
    print("Message scheduler started")

    yield

    scheduler.shutdown()
    print("Message scheduler stopped")

app = FastAPI(
    lifespan=lifespan,
    title="ForeverMessage API",
    description="Future Messages and Memories Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {
        "message": "Welcome to ForeverMessage"
    }


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate,db: Session = Depends(get_db)):

    existing_user = db.query(models.UserDB).filter(models.UserDB.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = create_user(db, user)

    return new_user


@app.post("/login", response_model=TokenResponse)
def login(user: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)
):

    existing_user = db.query(models.UserDB).filter(
        models.UserDB.email == user.username
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = verify_password(user.password,existing_user.password)

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_token({
        "sub": existing_user.email
    })

    existing_user.last_login = datetime.utcnow()

    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
    
    
@app.get("/profile")
def profile(
    current_user = Depends(get_current_user)):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "status": current_user.status,
        "last_login": current_user.last_login
    }
    

@app.post("/recipients",response_model=RecipientResponse)
def add_recipient(recipient: RecipientCreate,current_user = Depends(get_current_user),db: Session = Depends(get_db)):

    new_recipient = create_recipient(
        db,
        recipient,
        current_user.id
    )

    return new_recipient

@app.get("/recipients",response_model=list[RecipientResponse])
def get_recipients(current_user = Depends(get_current_user),db: Session = Depends(get_db)):

    recipients = db.query(models.RecipientDB).filter(models.RecipientDB.user_id == current_user.id).all()

    return recipients


@app.post("/legacy-messages",response_model=LegacyMessageResponse)
def create_message(message: LegacyMessageCreate,current_user=Depends(get_current_user),db: Session = Depends(get_db)):

    if message.release_type not in ["one_time", "yearly"]:

        raise HTTPException(
            status_code=400,
            detail="release_type must be one_time or yearly"
        )

    if message.release_date < datetime.utcnow().date():

        raise HTTPException(
            status_code=400,
            detail="Release date cannot be in the past"
        )

    new_message = create_legacy_message(db,message,current_user)

    return new_message

@app.put(
    "/legacy-messages/{message_id}",
    response_model=LegacyMessageResponse
)
def update_message(
    message_id: int,
    message_data: LegacyMessageUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    message = update_legacy_message(
        db,
        message_id,
        message_data,
        current_user
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )

    return message


@app.delete("/legacy-messages/{message_id}")
def delete_message(
    message_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    message = delete_legacy_message(
        db,
        message_id,
        current_user
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )

    return {
        "message": "Legacy message deleted successfully"
    }
    
@app.get("/legacy-messages", response_model=list[LegacyMessageResponse])
def get_legacy_messages(current_user=Depends(get_current_user),db: Session = Depends(get_db)):
    
    messages = db.query(models.LegacyMessage).filter(models.LegacyMessage.sender_id == current_user.id).all()

    return messages

@app.get("/legacy-messages/{message_id}", response_model=LegacyMessageResponse)
def get_legacy_message(message_id: int,current_user=Depends(get_current_user),db: Session = Depends(get_db)):
    message = db.query(models.LegacyMessage).filter(models.LegacyMessage.id == message_id, models.LegacyMessage.sender_id == current_user.id).first()

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Legacy message not found"
        )

    return message


    

@app.get("/activity")
def check_activity(current_user=Depends(get_current_user),db: Session = Depends(get_db)):

    last_login = current_user.last_login

    days_inactive = (datetime.utcnow() - last_login).days

    if days_inactive >= INACTIVITY_DAYS:

        if current_user.verification_status == "active":

            current_user.verification_status = "verification_required"
            current_user.verification_requested_at = datetime.utcnow()

            db.commit()
            db.refresh(current_user)

    return {
        "last_login": last_login,
        "days_inactive": days_inactive,
        "verification_status": current_user.verification_status
    }
    

@app.get("/verification-status")
def verification_status(current_user=Depends(get_current_user)):

    return {
        "user_id": current_user.id,
        "status": current_user.verification_status,
        "requested_at": current_user.verification_requested_at
    }
    
@app.post("/verification-request",response_model=VerificationRequestResponse)
def create_verification(data: VerificationRequestCreate,current_user=Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user.verification_status != "verification_required":
        raise HTTPException(
            status_code=400,
            detail="Verification is not required yet"
        )
    request = create_verification_request(
        db,
        data.recipient_id,
        current_user
    )

    return request

@app.put("/verification-request/{request_id}",response_model=VerificationRequestResponse)
def update_verification(request_id: int,decision: VerificationDecision,current_user=Depends(get_current_user),db: Session = Depends(get_db)):

    if decision.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be approved or rejected"
        )

    request = db.query(VerificationRequest).filter(
        VerificationRequest.id == request_id,
        VerificationRequest.recipient_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Verification request not found"
        )

    request.status = decision.status
    request.reviewed_at = datetime.utcnow()
    
    if decision.status == "approved":

        request.user.verification_status = "verified"

        release_user_messages(db,request.user_id,request.recipient_id)

    elif decision.status == "rejected":

        request.user.verification_status = "active"

    db.commit()
    db.refresh(request)

    return request


@app.get("/my-released-messages",response_model=list[ReleasedMessageResponse])
def my_released_messages(current_user=Depends(get_current_user),db: Session = Depends(get_db)):

    recipient = db.query(RecipientDB).filter(RecipientDB.user_id == current_user.id).first()

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Recipient profile not found"
        )

    messages = get_released_messages(db, recipient.id)

    return messages