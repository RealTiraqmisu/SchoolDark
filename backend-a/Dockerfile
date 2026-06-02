# ใช้ Python เวอร์ชัน 3.11 เป็นพื้นฐาน
FROM python:3.11-slim

# ตั้งค่าโฟลเดอร์ทำงานในกล่อง
WORKDIR /app

# ก๊อปปี้ไฟล์ requirements.txt เข้าไปและติดตั้ง
COPY requirements.txt .
RUN pip install -r requirements.txt

# ก๊อปปี้โค้ดทั้งหมดของเราเข้าไป
COPY . .

# สั่งให้รัน FastAPI เมื่อเปิดกล่อง
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]