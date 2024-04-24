from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
app = FastAPI()

from domain.answer import answer_router
from domain.question import question_router
app = FastAPI()
origins = [
"http://127.0.0.1:3000","http://192.168.1.105:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(question_router.router)
app.include_router(answer_router.router)