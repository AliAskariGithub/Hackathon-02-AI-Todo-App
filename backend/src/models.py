from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid
from uuid import UUID


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    user_name: str = Field(nullable=False)
    password: str = Field(nullable=False)  # This will store the hashed password


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow,
                                sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")
    # Relationship to testimonials
    testimonials: List["Testimonial"] = Relationship(back_populates="user")


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow,
                                sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user
    user: User = Relationship(back_populates="tasks")


class TestimonialBase(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(max_length=100)
    rating: int = Field(ge=1, le=5)
    message: str = Field(min_length=10, max_length=1000)


class Testimonial(TestimonialBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow,
                                sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user
    user: User = Relationship(back_populates="testimonials")


class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    # user_id will be taken from the path parameter, not the request body


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)


class TaskCreateInternal(TaskBase):
    user_id: uuid.UUID = Field(foreign_key="user.id")  # For internal use when creating with user_id


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: Optional[bool] = Field(default=None)
    # user_id should not be updatable through this endpoint


class TaskPublic(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID  # Include user_id in the public representation
    created_at: datetime
    updated_at: datetime


class TaskWithUser(TaskPublic):
    user: User


class TestimonialCreate(SQLModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(max_length=100)
    rating: int = Field(ge=1, le=5)
    message: str = Field(min_length=10, max_length=1000)
    # user_id will be taken from the authentication context


class TestimonialUpdate(SQLModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    email: Optional[str] = Field(default=None, max_length=100)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    message: Optional[str] = Field(default=None, min_length=10, max_length=1000)


class TestimonialPublic(TestimonialBase):
    id: uuid.UUID
    user_id: uuid.UUID  # Include user_id in the public representation
    created_at: datetime
    updated_at: datetime


class UserRegistration(SQLModel):
    user_name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=5, max_length=100)
    password: str = Field(min_length=6, max_length=128)  # Plain password to be hashed


class UserPublic(SQLModel):
    id: uuid.UUID
    user_name: str
    email: str
    created_at: datetime
    updated_at: datetime