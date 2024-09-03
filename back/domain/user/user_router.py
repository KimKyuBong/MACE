from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .user_service import UserService
from .user_model import User, UserResponse,TokenResponse, UserLogin
from typing import List
from beanie import PydanticObjectId

router = APIRouter(prefix="/api/user")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=TokenResponse)
async def register_user(user_data: User):
    user = await UserService.register_user(user_data.dict(exclude={"id"}))
    token_response = await UserService.authenticate_user(user.username, user_data.password)
    if not token_response:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to authenticate after registration")
    return token_response

@router.post("/login", response_model=TokenResponse)
async def login_user(user_data: UserLogin):
    token_response = await UserService.authenticate_user(user_data.username, user_data.password)
    if not token_response:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return token_response

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(token: str = Depends(oauth2_scheme)):
    user = await UserService.get_current_user(token)
    return UserResponse(**user.dict())

@router.get("/", response_model=List[User])
async def get_all_users():
    return await UserService.get_all_users()

@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: PydanticObjectId):
    return await UserService.get_user_by_id(user_id)

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: PydanticObjectId, user_data: User):
    return await UserService.update_user(user_id, user_data.dict(exclude={"id", "password"}))

@router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: PydanticObjectId):
    result = await UserService.delete_user(user_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found or already deleted")
    return {"message": "User deleted successfully"}