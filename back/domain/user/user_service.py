from .user_model import User, Token, TokenResponse
import logging
from typing import List, Optional
from fastapi import HTTPException, status
from utils.jwt import create_access_token, decode_access_token
from .user_repository import UserRepository
from beanie import PydanticObjectId
from beanie.exceptions import DocumentNotFound, CollectionWasNotInitialized

class UserService:
    @staticmethod
    async def register_user(user_data: dict) -> User:
        try:
            user = await UserRepository.create(user_data)
            logging.info(f"Created new user: {user.username}")
            return user
        except ValueError as e:
            logging.error(f"Invalid user data: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception as e:
            logging.error(f"Failed to create user: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User registration failed")

    @staticmethod
    async def authenticate_user(username: str, password: str) -> Optional[TokenResponse]:
        try:
            user = await User.find_one(User.username == username)
            if not user:
                logging.warning(f"Authentication failed: User not found - {username}")
                return None

            if not user.verify_password(password):
                logging.warning(f"Authentication failed: Invalid password for user - {username}")
                return None

            logging.info(f"User authenticated successfully - {username}")
            
            token_data = {"sub": user.username}
            access_token = create_access_token(data=token_data)
            
            token = Token(access_token=access_token, token_type="bearer")
            
            # Use the to_response method to convert User to UserResponse
            user_response = user.dict()
            
            return TokenResponse(token=token, user=user_response)
        except Exception as e:
            logging.exception(f"Unexpected error during authentication for user {username}: {str(e)}")
            raise

    @staticmethod
    async def get_all_users() -> List[User]:
        try:
            return await UserRepository.get_all()
        except Exception as e:
            logging.error(f"Failed to fetch all users: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch users")

    @staticmethod
    async def get_user_by_id(user_id: PydanticObjectId) -> User:
        try:
            user = await UserRepository.get_by_id(user_id)
            if not user:
                raise DocumentNotFound("User not found")
            return user
        except DocumentNotFound:
            logging.warning(f"User not found: {user_id}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        except Exception as e:
            logging.error(f"Error fetching user {user_id}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch user")

    @staticmethod
    async def update_user(user_id: PydanticObjectId, update_data: dict) -> User:
        try:
            user = await UserRepository.update(user_id, update_data)
            if not user:
                raise DocumentNotFound("User not found")
            logging.info(f"Updated user: {user_id}")
            return user
        except DocumentNotFound:
            logging.warning(f"User not found for update: {user_id}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        except ValueError as e:
            logging.error(f"Invalid update data for user {user_id}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        except Exception as e:
            logging.error(f"Failed to update user {user_id}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update user")

    @staticmethod
    async def delete_user(user_id: PydanticObjectId) -> bool:
        try:
            result = await UserRepository.delete(user_id)
            if result:
                logging.info(f"Deleted user: {user_id}")
            else:
                logging.warning(f"User not found for deletion: {user_id}")
            return result
        except Exception as e:
            logging.error(f"Failed to delete user {user_id}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user")

    @staticmethod
    async def get_current_user(token: str) -> User:
        try:
            payload = decode_access_token(token)
            username: str = payload.get("sub")
            if username is None:
                raise ValueError("Invalid token payload")
        except ValueError as e:
            logging.error(f"Token validation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        try:
            user = await User.find_one(User.username == username)
            if not user:
                raise DocumentNotFound("User not found")
            return user
        except DocumentNotFound:
            logging.warning(f"User not found for token: {username}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        except Exception as e:
            logging.error(f"Error fetching user for token {username}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch user")