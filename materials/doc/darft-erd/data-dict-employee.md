# Data Dictionary: หน้า employee (ระบบบุคลากร)

ที่มา: [erd-care.drawio](erd-care.drawio) หน้า `employee` (15 ตาราง) ชื่อ attribute คงตามไดอะแกรมทุกตัว

คอลัมน์ Key/Constraint: `PK` = Primary Key · `FK` = Foreign Key · `NOT NULL` = ห้ามว่าง · ช่องว่าง `-` = ไม่มีข้อบังคับ (ว่างได้)

## สารบัญ

1. [Countries](#1-countries) · 2. [Provinces](#2-provinces) · 3. [Districts](#3-districts) · 4. [SubDistricts](#4-subdistricts)
5. [Employees](#5-employees) · 6. [Education](#6-education) · 7. [RoyalDecorations](#7-royaldecorations) · 8. [License](#8-license)
9. [ToeicScore](#9-toeicscore) · 10. [JobDetails](#10-jobdetails) · 11. [Training](#11-training) · 12. [FamilyMember](#12-familymember) · 13. [Address](#13-address)

---

## 1. Countries

ประเทศ (ข้อมูลอ้างอิงสำหรับที่อยู่)

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| countryID_PK | รหัสประเทศ | VARCHAR(10) | PK, NOT NULL | - |
| thCountryName | ชื่อประเทศ (ภาษาไทย) | VARCHAR(255) | - | - |
| enCountryName | ชื่อประเทศ (ภาษาอังกฤษ) | VARCHAR(255) | - | - |

## 2. Provinces

จังหวัด

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| provinceID_PK | รหัสจังหวัด | VARCHAR(10) | PK, NOT NULL | - |
| countryID_FK | รหัสประเทศที่จังหวัดนี้สังกัด | VARCHAR(10) | FK, NOT NULL | Countries |
| thProvinceName | ชื่อจังหวัด (ภาษาไทย) | VARCHAR(255) | - | - |
| enProvinceName | ชื่อจังหวัด (ภาษาอังกฤษ) | VARCHAR(255) | - | - |

## 3. Districts

อำเภอ/เขต

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| districtID_PK | รหัสอำเภอ/เขต | VARCHAR(10) | PK, NOT NULL | - |
| provinceID_FK | รหัสจังหวัดที่อำเภอนี้สังกัด | VARCHAR(10) | FK, NOT NULL | Provinces |
| thDistrictName | ชื่ออำเภอ/เขต (ภาษาไทย) | VARCHAR(255) | - | - |
| enDistrictName | ชื่ออำเภอ/เขต (ภาษาอังกฤษ) | VARCHAR(255) | - | - |

## 4. SubDistricts

ตำบล/แขวง

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| subDistrictID_PK | รหัสตำบล/แขวง | VARCHAR(10) | PK, NOT NULL | - |
| districtID_FK | รหัสอำเภอที่ตำบลนี้สังกัด | VARCHAR(10) | FK, NOT NULL | Districts |
| thSubDistrictName | ชื่อตำบล/แขวง (ภาษาไทย) | VARCHAR(255) | - | - |
| enSubDistrictName | ชื่อตำบล/แขวง (ภาษาอังกฤษ) | VARCHAR(255) | - | - |
| zipCode | รหัสไปรษณีย์ | VARCHAR(10) | - | - |

## 5. Employees

ข้อมูลหลักของบุคลากร/ครู (ตารางแม่ของตาราง 6-13)

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| employeeID | รหัสบุคลากร | VARCHAR(10) | PK, NOT NULL | - |
| thTitle | คำนำหน้าชื่อ (ภาษาไทย) | VARCHAR(50) | - | - |
| enTitle | คำนำหน้าชื่อ (ภาษาอังกฤษ) | VARCHAR(50) | - | - |
| thFirstName | ชื่อ (ภาษาไทย) | VARCHAR(100) | - | - |
| thLastName | นามสกุล (ภาษาไทย) | VARCHAR(100) | - | - |
| enFirstName | ชื่อ (ภาษาอังกฤษ) | VARCHAR(100) | - | - |
| enLastName | นามสกุล (ภาษาอังกฤษ) | VARCHAR(100) | - | - |
| idType | ประเภทเอกสารยืนยันตัวตน: `NATIONAL_ID` (บัตรประชาชน) หรือ `PASSPORT` (หนังสือเดินทาง) | ENUM('NATIONAL_ID','PASSPORT') | - | - |
| idNumber | เลขบัตรประจำตัวประชาชน หรือเลขหนังสือเดินทาง (ตาม idType) | VARCHAR(20) | - | - |
| dob | วันเกิด | DATE | - | - |
| gender | เพศ: `M` (ชาย) หรือ `F` (หญิง) | ENUM('M','F') | - | - |
| bloodGroup | หมู่เลือด | VARCHAR(5) | - | - |
| nationality | สัญชาติ | VARCHAR(50) | - | - |
| religious | ศาสนา | VARCHAR(50) | - | - |
| phoneNumber | เบอร์โทรศัพท์ | VARCHAR(20) | - | - |
| email | อีเมล | VARCHAR(100) | - | - |
| role | บทบาทของบุคลากรในระบบ: `STAFF` (บุคลากร) หรือ `TEACHER` (ครู) | ENUM('STAFF','TEACHER') | - | - |

## 6. Education

ประวัติการศึกษาของบุคลากร (1 คนมีได้หลายแถว)

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| educationID_PK | รหัสประวัติการศึกษา | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรเจ้าของประวัติ | VARCHAR(10) | FK, NOT NULL | Employees |
| degree | ระดับวุฒิการศึกษา | VARCHAR(50) | - | - |
| major | สาขาวิชา/วิชาเอก | VARCHAR(100) | - | - |
| institution | สถานศึกษาที่สำเร็จการศึกษา | VARCHAR(100) | - | - |
| graduateYear | ปีที่สำเร็จการศึกษา | VARCHAR(10) | - | - |
| gpa | เกรดเฉลี่ยสะสม | DECIMAL(3,2) | - | - |

## 7. RoyalDecorations

เครื่องราชอิสริยาภรณ์ที่บุคลากรได้รับ

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| royalDecorationsID_PK | รหัสรายการเครื่องราชอิสริยาภรณ์ | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรผู้ได้รับ | VARCHAR(10) | FK, NOT NULL | Employees |
| decorationClass | ชั้นเครื่องราชอิสริยาภรณ์ | VARCHAR(50) | - | - |
| dateReceived | วันที่ได้รับ | DATE | - | - |
| yearReceived | ปีที่ได้รับ | VARCHAR(10) | - | - |
| gazetteReference | อ้างอิงราชกิจจานุเบกษา | VARCHAR(255) | - | - |

## 8. License

ใบอนุญาต/ใบประกอบวิชาชีพของบุคลากร

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| licenseID_PK | รหัสใบอนุญาต | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรผู้ถือใบอนุญาต | VARCHAR(10) | FK, NOT NULL | Employees |
| licenseType | ประเภทใบอนุญาต | VARCHAR(50) | - | - |
| issueDate | วันที่ออกใบอนุญาต | DATE | - | - |
| expiryDate | วันที่หมดอายุ | DATE | - | - |

## 9. ToeicScore

ผลสอบ TOEIC ของบุคลากร

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| toeicID_PK | รหัสผลสอบ TOEIC | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรผู้สอบ | VARCHAR(10) | FK, NOT NULL | Employees |
| score | คะแนนสอบ | DECIMAL(5,2) | - | - |
| expiryDate | วันที่คะแนนหมดอายุ | DATE | - | - |
| document | ไฟล์/เอกสารหลักฐานผลสอบ | VARCHAR(255) | - | - |

## 10. JobDetails

ข้อมูลการทำงาน/ตำแหน่งของบุคลากร

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| jobID_PK | รหัสรายการข้อมูลการทำงาน | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากร | VARCHAR(10) | FK, NOT NULL | Employees |
| jobTitle | ตำแหน่งงาน | VARCHAR(50) | - | - |
| department | ฝ่าย/หน่วยงานที่สังกัด | VARCHAR(50) | - | - |
| startDate | วันที่เริ่มปฏิบัติงาน | DATE | - | - |
| salary | เงินเดือน | DECIMAL(10,2) | - | - |
| workStatus | สถานะการทำงาน: `ACTIVE` (ยังทำงานอยู่) หรือ `RESIGNED` (ออกไปแล้ว) | ENUM('ACTIVE','RESIGNED') | - | - |

## 11. Training

ประวัติการอบรม/ศึกษาดูงานของบุคลากร

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| trainingID_PK | รหัสการอบรม | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรผู้เข้าอบรม | VARCHAR(10) | FK, NOT NULL | Employees |
| trainingName | ชื่อหลักสูตร/โครงการอบรม | VARCHAR(100) | - | - |
| trainingType | ประเภทการอบรม | VARCHAR(50) | - | - |
| organizer | หน่วยงานผู้จัด | VARCHAR(100) | - | - |
| startDate | วันที่เริ่มอบรม | DATE | - | - |
| endDate | วันที่สิ้นสุดการอบรม | DATE | - | - |
| hour | จำนวนชั่วโมงอบรม | INT | - | - |
| location | สถานที่จัดอบรม | VARCHAR(100) | - | - |
| country | ประเทศที่จัดอบรม | VARCHAR(50) | - | - |
| province | จังหวัดที่จัดอบรม | VARCHAR(50) | - | - |
| cost | ค่าใช้จ่ายในการอบรม | DECIMAL(10,2) | - | - |

## 12. FamilyMember

ข้อมูลสมาชิกครอบครัวของบุคลากร

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| familyID_PK | รหัสสมาชิกครอบครัว | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรที่เป็นเจ้าของครอบครัว | VARCHAR(10) | FK, NOT NULL | Employees |
| thTitle | คำนำหน้าชื่อ (ภาษาไทย) | VARCHAR(50) | - | - |
| enTitle | คำนำหน้าชื่อ (ภาษาอังกฤษ) | VARCHAR(50) | - | - |
| thFirstName | ชื่อ (ภาษาไทย) | VARCHAR(100) | - | - |
| thLastName | นามสกุล (ภาษาไทย) | VARCHAR(100) | - | - |
| enFirstName | ชื่อ (ภาษาอังกฤษ) | VARCHAR(100) | - | - |
| enLastName | นามสกุล (ภาษาอังกฤษ) | VARCHAR(100) | - | - |
| phoneNumber | เบอร์โทรศัพท์ | VARCHAR(20) | - | - |
| relationship | ความสัมพันธ์กับบุคลากร (เช่น บิดา มารดา คู่สมรส บุตร) | VARCHAR(50) | - | - |
| dob | วันเกิด | DATE | - | - |
| maritalStatus | สถานภาพสมรส | VARCHAR(20) | - | - |
| lifeStatus | สถานะการมีชีวิต | VARCHAR(20) | - | - |
| career | อาชีพ | VARCHAR(100) | - | - |
| educationLevel | ระดับการศึกษา | VARCHAR(50) | - | - |

## 13. Address

ที่อยู่ของบุคลากร (1 คนมีได้หลายที่อยู่ แยกตามประเภท)

| Attribute Name | Description | Types | Key/Constraint | FK Referenced Table |
|---|---|---|---|---|
| addressID_PK | รหัสที่อยู่ | VARCHAR(10) | PK, NOT NULL | - |
| employeeID_FK | รหัสบุคลากรเจ้าของที่อยู่ | VARCHAR(10) | FK, NOT NULL | Employees |
| houseNo | บ้านเลขที่ | VARCHAR(50) | - | - |
| moo | หมู่ที่ | VARCHAR(10) | - | - |
| soi | ซอย | VARCHAR(100) | - | - |
| street | ถนน | VARCHAR(100) | - | - |
| subDistrictID_FK | รหัสตำบล/แขวง (ที่อยู่ในไทยเท่านั้น ใช้หาอำเภอและจังหวัดต่อผ่านตาราง SubDistricts) | VARCHAR(10) | FK | SubDistricts |
| countryID_FK | รหัสประเทศของที่อยู่ | VARCHAR(10) | FK, NOT NULL | Countries |
| addressLine | ที่อยู่เต็มแบบข้อความ ใช้กับที่อยู่ต่างประเทศที่ไม่มีตำบล | VARCHAR(255) | CHECK | - |
| addressType | ประเภทที่อยู่: `REGISTERED` (ตามทะเบียนบ้าน) หรือ `CURRENT` (ที่อยู่ปัจจุบัน) | ENUM('REGISTERED','CURRENT') | - | - |

กฎของตาราง: `subDistrictID_FK` กับ `addressLine` ต้องมีอย่างน้อยหนึ่งช่อง (ที่อยู่ไทยกรอกตำบล ที่อยู่ต่างประเทศกรอก `addressLine`) ตั้งเป็น CHECK constraint ได้

---

## ข้อสังเกต

- ไฟล์นี้ตรงกับไดอะแกรม [erd-care.drawio](erd-care.drawio) แล้ว รวมส่วนที่ปรับให้รองรับครูต่างชาติ: `Address` (ตัด `districtID_FK`, `provinceID_FK` ให้ตำบลว่างได้ เพิ่ม `addressLine`) และ `Employees` (เพิ่ม `idType`)
- ชุดค่าที่อนุญาตของ `idType`, `role`, `gender`, `workStatus`, `addressType` กำหนดเป็นชนิด ENUM แล้ว ระบุไว้ในคำอธิบายของแต่ละคอลัมน์ ถ้าต้องเพิ่มค่าใหม่ในอนาคตต้องแก้โครงสร้างตาราง
