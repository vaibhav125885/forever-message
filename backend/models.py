from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text,Boolean,Date
from sqlalchemy.orm import relationship
from db import Base
from datetime import datetime,date
    
class UserDB(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime)
    status = Column(String, default="ACTIVE")
    recipient = relationship("RecipientDB",back_populates="user",foreign_keys="RecipientDB.user_id")
    messages = relationship("MessageDB", back_populates="user")
    last_login = Column(DateTime, default=datetime.utcnow)
    verification_status = Column(String, default="active")
    verification_requested_at = Column(DateTime,nullable=True)
    
    
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean, Date
from sqlalchemy.orm import relationship
from db import Base
from datetime import datetime, date

class UserDB(Base):
    __tablename__="Users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime)
    status = Column(String, default="Active")
    recipient = relationship("RecipientDB", back_populates="user", foreign_keys="Re")
    
# class RecipientDB(Base):
#     __tablename__ = "Recipients"
    
#     id = Column(Integer,primary_key=True,index=True)
#     user_id = Column(Integer, ForeignKey("Users.id"))
#     name = Column(String)
#     email = Column(String)
#     relation = Column(String)
#     date_of_birth = Column(String)
#     user = relationship("UserDB",back_populates="recipient",foreign_keys= [user_id])
#     messages = relationship("MessageDB",back_populates="recipient")
#     recipient_user_id = Column(Integer,ForeignKey("Users.id"),nullable=True)
    
# class MessageDB(Base):
#     __tablename__ = "Messages"
    
    
#     id = Column(Integer,primary_key=True,index=True)
#     user_id = Column(Integer, ForeignKey("Users.id"))
#     recipient_id = Column(Integer, ForeignKey("Recipients.id"))
#     title = Column(String)
#     message_type = Column(String)
#     content = Column(Text)
#     event_type = Column(String)
#     delivery_date = Column(DateTime)
#     status = Column(String, default="SCHEDULED")
#     created_at = Column(DateTime)
#     user = relationship("UserDB",back_populates="messages")
#     recipient = relationship("RecipientDB",back_populates="messages")
    
    
# class LegacyMessage(Base):
#     __tablename__ = "legacy_messages"

#     id = Column(Integer, primary_key=True, index=True)
#     sender_id = Column(Integer, ForeignKey("Users.id"))
#     recipient_id = Column(Integer, ForeignKey("Recipients.id"))
#     title = Column(String)
#     message = Column(String)
#     sender = relationship("UserDB",foreign_keys=[sender_id])
#     recipient = relationship("RecipientDB",foreign_keys=[recipient_id])
#     created_at = Column(DateTime, default=datetime.utcnow)
#     released_at = Column(DateTime,nullable=True)
#     release_date = Column(Date, nullable=False)
#     release_type = Column(String, nullable=False, default="one_time")
#     is_released = Column(Boolean,default=False)
#     last_released_at = Column(DateTime,nullable=True)
    
    
# class VerificationRequest(Base):
#     __tablename__ = "verification_requests"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer,ForeignKey("Users.id"),nullable=False)
#     recipient_id = Column(Integer,ForeignKey("Recipients.id"),nullable=False)
#     status = Column( String,default="pending")
#     created_at = Column(DateTime,default=datetime.utcnow)
#     reviewed_at = Column(DateTime,nullable=True)
#     user = relationship("UserDB",foreign_keys=[user_id])
#     recipient = relationship("RecipientDB",foreign_keys=[recipient_id])