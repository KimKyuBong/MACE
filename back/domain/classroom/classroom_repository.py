from typing import List, Optional
from bson import ObjectId
from .classroom_model import Classroom, ClassroomDetail
from domain.user.user_model import User
from domain.activity.activity_model import Activity
from fastapi import HTTPException, status
from datetime import datetime
import logging

class ClassroomRepository:

    @staticmethod
    async def insert_classroom(name: str, description: str, teacher_id: ObjectId) -> Classroom:
        classroom = Classroom(
            name=name,
            description=description,
            teacher_id=teacher_id,
            students=[],
            pending_students=[],
            activities=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        await classroom.insert()
        logging.info(f"Created new classroom: {classroom.dict()}")
        return classroom

    @staticmethod
    async def fetch_all_classrooms() -> List[Classroom]:
        classrooms = await Classroom.find_all().to_list()
        return classrooms

    @staticmethod
    async def fetch_classroom_by_id(classroom_id: ObjectId) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        return classroom

    @staticmethod
    async def fetch_classroom_detail(classroom_id: ObjectId) -> ClassroomDetail:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        teacher = await User.get(classroom.teacher_id)
        activities = await Activity.find(Activity.id.in_(classroom.activities)).to_list()
        students = await User.find(User.id.in_(classroom.students)).to_list()
        pending_students = await User.find(User.id.in_(classroom.pending_students)).to_list()

        return ClassroomDetail(
            **classroom.dict(),
            teacher_name=teacher.name if teacher else None,
            activities=[activity.name for activity in activities],
            student_details=students,
            pending_student_details=pending_students
        )

    @staticmethod
    async def update_classroom_data(classroom_id: ObjectId, name: str, description: str) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        classroom.name = name
        classroom.description = description
        classroom.updated_at = datetime.utcnow()

        await classroom.save()
        return classroom

    @staticmethod
    async def delete_classroom(classroom_id: ObjectId) -> bool:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found or already deleted")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found or already deleted")
        
        await classroom.delete()
        logging.info(f"Deleted classroom {classroom_id}")
        return True

    @staticmethod
    async def add_pending_student(classroom_id: ObjectId, student_id: ObjectId) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        classroom.pending_students.append(student_id)
        await classroom.save()
        logging.info(f"User {student_id} requested to join classroom {classroom_id}")
        return classroom

    @staticmethod
    async def approve_pending_student(classroom_id: ObjectId, student_id: ObjectId) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        classroom.pending_students.remove(student_id)
        classroom.students.append(student_id)
        await classroom.save()
        logging.info(f"User {student_id} approved to join classroom {classroom_id}")
        return classroom

    @staticmethod
    async def remove_student(classroom_id: ObjectId, student_id: ObjectId) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        classroom.students.remove(student_id)
        await classroom.save()
        logging.info(f"User {student_id} removed from classroom {classroom_id}")
        return classroom

    @staticmethod
    async def add_activity(classroom_id: ObjectId, activity_id: ObjectId) -> Classroom:
        classroom = await Classroom.get(classroom_id)
        if not classroom:
            logging.error(f"Classroom {classroom_id} not found")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found")
        
        classroom.activities.append(activity_id)
        await classroom.save()
        logging.info(f"Activity {activity_id} added to classroom {classroom_id}")
        return classroom
