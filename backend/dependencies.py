from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from db import get_db
from models import UserDB
from auth import SECRET_KEY, ALGORITHM


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):  

    credentials_exception = HTTPException(status_code=401,detail="Invalid or expired token",
                                          headers={"WWW-Authenticate": "Bearer"})

    try:

        payload = jwt.decode( token,SECRET_KEY,algorithms=[ALGORITHM])
        
        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(UserDB).filter(UserDB.email == email).first()

    if user is None:
        raise credentials_exception

    return user 

# from fastapi import Depends,HTTPException
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt, JWTError
# from sqlalchemy.orm import Session
# from db import get_db
# from models import UserDB
# from auth import SECRET_KEY,ALGORITHM

# oauth2_schema = OAuth2PasswordBearer(tokenUrl="/login")
# def get_current_user(token:str = Depends(oauth2_schema), db:Session= Depends(get_db)):
#     credentials_exception = HTTPException(status_code=401, detail="Invalid or expired token")
    
#     try:
        
#         payload = jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
#         email = payload.get("sub")
        
#         if email is None:
#             raise credentials_exception
        
#     except JWTError:
#         raise credentials_exception
    
#     user = db.query(UserDB).filter(UserDB.email == email).first()
    
#     if user is None:
#         raise credentials_exception
#     return user


# from fastapi import Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt, JWTError
# from sqlalchemy.orm import Session
# from db import get_db
# from models import UserDB
# from auth import SECRET_KEY,ALGORITHM

# oauth2_schema = OAuth2PasswordBearer(tokenUrl="/login")
# def get_current_user(token:str = Depends(oauth2_schema), db : Session = Depends(get_db)):
#     credentials_exception = HTTPException(status_code=401, detail="Invalid or expired token")
    
#     try:
        
#         payload = jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
#         email = payload.get("sub")
        
#         if email is None:
#             raise credentials_exception
        
#     except JWTError:
#         raise credentials_exception
        
#     user = db.query(UserDB).filter(UserDB.email == email).first()
    
#     if user is None:
#         raise credentials_exception
#     return user

# from fastapi import Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt, JWTError
# from sqlalchemy.orm import Session
# from db import get_db
# from  models import UserDB
# from auth import SECRET_KEY,ALGORITHM

# oauth2_schema = OAuth2PasswordBearer(tokenUrl="/login")
# def get_current_user(token:str = Depends(oauth2_schema), db: Session = Depends(get_db)):
#     credentials_exception = HTTPException(status_code=401, detail="Invalid or expired token")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("sub")
        
#         if email is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
    
#     user = db.query(UserDB).filter(UserDB.email == email).first()
    
#     if user is None:
#         raise credentials_exception
#     return user
    