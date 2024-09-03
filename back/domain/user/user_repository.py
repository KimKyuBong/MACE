from typing import List, Optional
from beanie import PydanticObjectId
from .user_model import User
import logging

class UserRepository:
    @staticmethod
    async def create(user_data: dict) -> User:
        user = User(**user_data)
        user.hash_password()
        await user.create()
        logging.info(f"Created new user: {user.username}")
        return user

    @staticmethod
    async def authenticate(username: str, password: str) -> Optional[User]:
        user = await User.get_by_username(username)
        if not user:
            logging.error(f"Failed to authenticate user: {username}")
            return None

        if user.verify_password(password):
            logging.info(f"Authenticated user: {username}")
            return user
        else:
            logging.error(f"Invalid password for user: {username}")
            return None

    @staticmethod
    async def get_all() -> List[User]:
        return await User.find_all().to_list()

    @staticmethod
    async def get_by_id(user_id: PydanticObjectId) -> Optional[User]:
        return await User.get(user_id)

    @staticmethod
    async def update(user_id: PydanticObjectId, update_data: dict) -> Optional[User]:
        user = await User.get(user_id)
        if not user:
            logging.error(f"User {user_id} not found")
            return None
        
        if 'password' in update_data:
            user.password = update_data['password']
            user.hash_password()
            del update_data['password']
        
        await user.update({"$set": update_data})
        return await User.get(user_id)

    @staticmethod
    async def delete(user_id: PydanticObjectId) -> bool:
        result = await User.delete(user_id)
        if result.deleted_count:
            logging.info(f"Deleted user {user_id}")
            return True
        else:
            logging.error(f"User {user_id} not found or already deleted")
            return False