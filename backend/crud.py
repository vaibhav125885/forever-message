from sqlalchemy.orm import Session
from models import UserDB,RecipientDB,LegacyMessage,MessageDB,VerificationRequest
from schemas import UserCreate
from auth import hash_password
from datetime import datetime

def create_user(db: Session, user: UserCreate):

    hashed_password = hash_password(user.password)

    new_user = UserDB(
        name=user.name,
        email=user.email,
        password=hashed_password,
        status="ACTIVE",
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def create_recipient(db: Session, recipient, user_id: int):

    new_recipient = RecipientDB(
        user_id=user_id,
        name=recipient.name,
        email=recipient.email,
        relation=recipient.relation,
        date_of_birth=recipient.date_of_birth
    )

    db.add(new_recipient)
    db.commit()
    db.refresh(new_recipient)

    return new_recipient


def create_legacy_message(db: Session,message,current_user):

    if message.release_type not in ["one_time", "yearly"]:
        raise ValueError(
            "release_type must be one_time or yearly"
        )

    new_message = LegacyMessage(

        sender_id=current_user.id,
        recipient_id=message.recipient_id,
        title=message.title,
        message=message.message,
        release_date=message.release_date,
        release_type=message.release_type,
        is_released=False
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message


def update_legacy_message(db: Session, message_id: int, message_data, current_user):

    message = db.query(LegacyMessage).filter(
        LegacyMessage.id == message_id,
        LegacyMessage.sender_id == current_user.id
    ).first()

    if not message:
        return None

    message.title = message_data.title
    message.message = message_data.message

    db.commit()
    db.refresh(message)

    return message


def delete_legacy_message(db: Session, message_id: int, current_user):

    message = db.query(LegacyMessage).filter(
        LegacyMessage.id == message_id,
        LegacyMessage.sender_id == current_user.id
    ).first()

    if not message:
        return None

    db.delete(message)
    db.commit()

    return message


def create_verification_request(
    db: Session,
    recipient_id: int,
    current_user
):

    request = VerificationRequest(
        user_id=current_user.id,
        recipient_id=recipient_id,
        status="pending"
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    return request

def get_verification_request(
    db: Session,
    request_id: int,
    recipient_id: int
):
    return db.query(VerificationRequest).filter(
        VerificationRequest.id == request_id,
        VerificationRequest.recipient_id == recipient_id
    ).first()
    

def update_verification_request(
    db: Session,
    request_id: int,
    recipient_id: int,
    status: str
):

    request = db.query(VerificationRequest).filter(
        VerificationRequest.id == request_id,
        VerificationRequest.recipient_id == recipient_id
    ).first()

    if not request:
        return None

    if request.status != "pending":
        return None

    request.status = status
    request.reviewed_at = datetime.utcnow()

    if status == "approved":
        request.user.verification_status = "verified"

    elif status == "rejected":
        request.user.verification_status = "active"

    db.commit()
    db.refresh(request)

    return request

from datetime import datetime


def release_user_messages(db: Session,user_id: int,recipient_id: int):

    today = datetime.utcnow().date()

    messages = db.query(LegacyMessage).filter(LegacyMessage.sender_id == user_id,LegacyMessage.recipient_id == recipient_id).all()

    released_messages = []

    for message in messages:
        
        if message.release_type == "one_time":

            if (not message.is_released and message.release_date <= today):

                message.is_released = True
                message.released_at = datetime.utcnow()
                released_messages.append(message)

        elif message.release_type == "yearly":

            if (message.release_date.month == today.month and message.release_date.day == today.day):

                already_released_this_year = (message.last_released_at is not None and message.last_released_at.year == today.year)

                if not already_released_this_year:

                    message.is_released = True
                    message.released_at = datetime.utcnow()
                    message.last_released_at = datetime.utcnow()
                    released_messages.append(message)

    db.commit()

    return released_messages


def get_released_messages(db: Session, recipient_id: int):
    return (
        db.query(LegacyMessage).filter(LegacyMessage.recipient_id == recipient_id,LegacyMessage.is_released == True).all()
    )