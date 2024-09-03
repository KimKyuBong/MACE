from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from .classroom_service import ClassroomService
from .classroom_model import Classroom, ClassroomDetail
from domain.user.user_model import User
from domain.user.user_service import UserService
from typing import List

router = APIRouter(prefix="/api/classrooms")

@router.post("/create", response_model=Classroom)
async def create_classroom_endpoint(
    name: str, 
    description: str, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create classrooms")
    try:
        new_classroom = await ClassroomService.create_new_classroom(
            name=name, 
            description=description, 
            teacher_id=user.id
        )
        return new_classroom
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create classroom")

@router.get("/", response_model=List[Classroom])
async def get_classrooms_endpoint():
    try:
        classrooms = await ClassroomService.get_all_classrooms()
        return classrooms
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch classrooms")

@router.get("/{classroom_id}", response_model=ClassroomDetail)
async def get_classroom_detail_endpoint(classroom_id: PydanticObjectId):
    try:
        classroom = await ClassroomService.get_classroom_details_by_id(classroom_id)
        return classroom
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch classroom details")

@router.put("/{classroom_id}", response_model=Classroom)
async def update_classroom_endpoint(
    classroom_id: PydanticObjectId, 
    name: str, 
    description: str, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can update classrooms")
    try:
        updated_classroom = await ClassroomService.update_classroom(
            classroom_id=classroom_id, 
            update_data={"name": name, "description": description}
        )
        return updated_classroom
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update classroom")

@router.delete("/{classroom_id}", response_model=dict)
async def delete_classroom_endpoint(
    classroom_id: PydanticObjectId, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can delete classrooms")
    try:
        await ClassroomService.remove_classroom(classroom_id)
        return {"message": "Classroom deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete classroom")

@router.post("/join/{classroom_id}", response_model=dict)
async def request_join_classroom_endpoint(
    classroom_id: PydanticObjectId, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can request to join classrooms")
    try:
        await ClassroomService.request_student_to_join_classroom(classroom_id, user.id)
        return {"message": "Join request sent successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send join request")

@router.post("/approve_join/{classroom_id}", response_model=dict)
async def approve_join_classroom_endpoint(
    classroom_id: PydanticObjectId, 
    student_id: PydanticObjectId, 
    user: User = Depends(UserService.get_current_user)
):
    if user.role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can approve join requests")
    try:
        await ClassroomService.approve_student_join_request(classroom_id, student_id)
        return {"message": "Join request approved successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to approve join request")
