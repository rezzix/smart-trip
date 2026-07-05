from pydantic import BaseModel


class Question(BaseModel):
    id: str
    category: str
    difficulty: str
    text: str
    choices: list[str]
    answer: int
    explanation: str
    source: str = ""
    min_age: int = 0
    max_age: int = 999
