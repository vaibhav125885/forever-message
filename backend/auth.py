# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta,timezone


# pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")


# SECRET_KEY = "my-super-secret-key"

# ALGORITHM = "HS256"

# ACCESS_TOKEN_EXPIRE_MINUTES = 60


# def hash_password(password: str):
#     return pwd_context.hash(password)


# def verify_password(password: str, hashed_password: str):
#     return pwd_context.verify(password, hashed_password)


# def create_token(data: dict):

#     payload = data.copy()

#     expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

#     payload.update({
#         "exp": expire
#     })

#     token = jwt.encode( payload,SECRET_KEY,algorithm=ALGORITHM)

#     return token


# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta, timezone

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

# SECRET_KEY = "my-key"
# ALGORITHM = "HS256"


# def hash_password(password:str):
#     return pwd_context.hash(password)

# def verify_password(password:str, hashed_password: str):
#     return pwd_context.verify(password, hashed_password)

# def create_token(data:dict):
    
#     payload = data.copy()
    
#     expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    
#     payload.update({
#         "exp": expire
#     })
    
#     token = jwt.encode( payload, SECRET_KEY, algorithm=ALGORITHM)
#     return token

# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta, timezone

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

# SECRET_KEY = "my-key"
# ALGORITHM = "HS256"

# def hash_password(password:str):
#     return pwd_context.hash(password)

# def verify_password(password:str, hashed_password:str):
#     return pwd_context.verify(password, hashed_password)

# def create_token(data:dict):
#     payload = data.copy()
#     expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    
#     payload.update({
#         "exp":expire
#     })
    
#     token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
#     return token


from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "my-key"
ALGORITHM = "HS256"

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(password:str, hashed_password:str):
    return pwd_context.verify(password, hashed_password)

def create_token(data:dict):
    payload = data.copy()
    expire =datetime.now(timezone.utc) + timedelta(minutes=60)
    
    payload.update({
        "exp":expire
    })
    
    token = jwt.encode(payload, SECRET_KEY, algorithm= ALGORITHM)
    return token