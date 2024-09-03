import logging
from bson import ObjectId
from .classroom_model import Classroom, ClassroomDetail
from fastapi import HTTPException, status
from datetime import datetime
from typing import List
from domain.user.user_model import User
from domain.activity.activity_model import Activity

class ClassroomService:
    @staticmethod
    async def create_new_classroom(name: str, description: str, teacher_id: ObjectId) -> Classroom:
        try:
            new_classroom = Classroom(
                name=name,
                description=description,
                teacher_id=teacher_id,
                students=[],
                pending_students=[],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            await new_classroom.insert()
            logging.info(f"Created new classroom with ID: {new_classroom.id}")
            return new_classroom
        except Exception as e:
            logging.error(f"Error creating classroom: {str(e)}")
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    @staticmethod
    async def get_all_classrooms() -> List[Classroom]:
        try:
            classrooms = await Classroom.find_all().to_list()
            logging.info(f"Retrieved {len(classrooms)} classrooms")
            return classrooms
        except Exception as e:
            logging.error(f"Error retrieving classrooms: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving classrooms")

    @staticmethod
    async def get_classroom_details_by_id(classroom_id: ObjectId) -> ClassroomDetail:
        try:
            classroom = await Classroom.get(classroom_id)
            if not classroom:
                logging.warning(f"Classroom not found: {classroom_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")

            activities = await Activity.find(Activity.classroom_id == classroom.id).to_list()
            teacher = await User.get(classroom.teacher_id)
            
            return ClassroomDetail(
                **classroom.dict(),
                teacher_name=teacher.name if teacher else None,
                activities=[activity.name for activity in activities]
            )
        except Exception as e:
            logging.error(f"Error retrieving classroom details: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving classroom details")

    @staticmethod
    async def update_classroom(classroom_id: ObjectId, update_data: dict) -> Classroom:
        try:
            classroom = await Classroom.get(classroom_id)
            if not classroom:
                logging.warning(f"Classroom not found for update: {classroom_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")

            for key, value in update_data.items():
                setattr(classroom, key, value)
            classroom.updated_at = datetime.utcnow()

            await classroom.save()
            logging.info(f"Updated classroom: {classroom.id}")
            return classroom
        except Exception as e:
            logging.error(f"Error updating classroom: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error updating classroom")

    @staticmethod
    async def remove_classroom(classroom_id: ObjectId) -> bool:
        try:
            classroom = await Classroom.get(classroom_id)
            if not classroom:
                logging.warning(f"Classroom not found for deletion: {classroom_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
            
            await classroom.delete()
            logging.info(f"Removed classroom: {classroom.id}")
            return True
        except Exception as e:
            logging.error(f"Error removing classroom: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error removing classroom")

    @staticmethod
    async def request_student_to_join_classroom(classroom_id: ObjectId, student_id: ObjectId):
        try:
            classroom = await Classroom.get(classroom_id)
            if not classroom:
                logging.warning(f"Classroom not found for join request: {classroom_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")

            if student_id not in classroom.pending_students:
                classroom.pending_students.append(student_id)
                await classroom.save()
                logging.info(f"Student {student_id} requested to join classroom {classroom_id}")
        except Exception as e:
            logging.error(f"Error processing join request: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing join request")

    @staticmethod
    async def approve_student_join_request(classroom_id: ObjectId, student_id: ObjectId):
        try:
            classroom = await Classroom.get(classroom_id)
            if not classroom:
                logging.warning(f"Classroom not found or student not in pending list: {classroom_id}, {student_id}")
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found or student not in pending list")

            if student_id in classroom.pending_students:
                classroom.pending_students.remove(student_id)
                if student_id not in classroom.students:
                    classroom.students.append(student_id)
                await classroom.save()
                logging.info(f"Approved student {student_id} to join classroom {classroom_id}")
        except Exception as e:
            logging.error(f"Error approving join request: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error approving join request")
