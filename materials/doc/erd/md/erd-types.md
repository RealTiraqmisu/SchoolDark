# ชนิดข้อมูลของตารางในเล่ม (PostgreSQL · ไม่ใส่ความยาว)

สร้างเมื่อ 2026-11-07 จากแท็บ v3 · **ชนิดข้อมูลทั้งหมดผมเดาเอง ยังไม่ผ่านการตรวจ** · แถวที่มี ❓ คือที่ผมไม่แน่ใจเป็นพิเศษ
แก้ชนิดในไฟล์นี้ได้เลย แล้วสั่งสร้างแท็บ A4 ใหม่จะใช้ค่าตามไฟล์นี้ (ต้นฉบับ v3 ไม่มีชนิดข้อมูล)

ตารางสีม่วงไม่อยู่ในเล่ม (ExamRoom · StudentLeave* · TardySlip) และคอลัมน์ม่วงของ Application (examRoomID · seatNumber · documentsComplete) ก็ไม่อยู่ในเล่ม

กติกาเดา: PK = SERIAL · FK = INTEGER · is*/has* = BOOLEAN · *Date/dob = DATE · *At = TIMESTAMP · *Time = TIME · จำนวน/ลำดับ = INTEGER · เงิน/เกรด/น้ำหนัก = NUMERIC · extraFields = JSONB · ข้อความยาว = TEXT · นอกนั้น VARCHAR

## หมวดรับสมัคร

### AdmissionRound

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| roundID | PK | SERIAL |  |
| academicYearID | FK | INTEGER |  |
| name |  | VARCHAR |  |
| applyStart |  | DATE |  |
| applyEnd |  | DATE |  |
| examDate |  | DATE |  |
| announceDate |  | DATE |  |
| reportDate |  | DATE |  |
| enrollDate |  | DATE |  |
| isOpen |  | BOOLEAN |  |
| createdAt |  | TIMESTAMP |  |

### AdmissionCoursePlan

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| planID | PK | SERIAL |  |
| roundID | FK | INTEGER |  |
| studyProgramID | FK | INTEGER |  |
| capacity |  | INTEGER |  |
| regulations |  | TEXT |  |
| feeAmount |  | NUMERIC |  |

### Application

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| applicationID | PK | SERIAL |  |
| applicantCode | UK | VARCHAR |  |
| citizenID |  | VARCHAR |  |
| prefix |  | VARCHAR |  |
| firstNameTH |  | VARCHAR |  |
| lastNameTH |  | VARCHAR |  |
| firstNameEN |  | VARCHAR |  |
| lastNameEN |  | VARCHAR |  |
| dob |  | DATE |  |
| gender |  | VARCHAR |  |
| email |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| ethnicity |  | VARCHAR |  |
| nationality |  | VARCHAR |  |
| religion |  | VARCHAR |  |
| roundID | FK | INTEGER |  |
| planID | FK | INTEGER |  |
| prevSchoolName |  | VARCHAR |  |
| prevSchoolProvince |  | VARCHAR |  |
| prevDegree |  | VARCHAR |  |
| gpax |  | NUMERIC |  |
| scoreRaw |  | NUMERIC | ❓ คะแนนอาจมีทศนิยม |
| status |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| feePaid |  | BOOLEAN |  |
| feePaidAt |  | TIMESTAMP |  |
| paymentSlipURL |  | VARCHAR |  |
| reserveRank |  | INTEGER |  |
| extraFields |  | JSONB |  |
| lastEditedAt |  | TIMESTAMP |  |
| appliedAt |  | TIMESTAMP |  |
| statusChangedAt |  | TIMESTAMP |  |
| lastEditedBy |  | VARCHAR |  |
| feeVerifiedBy |  | VARCHAR |  |

### ApplicantAddress

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| addressID | PK | SERIAL |  |
| applicationID | FK | INTEGER |  |
| addressType |  | VARCHAR |  |
| houseCode |  | VARCHAR |  |
| houseNo |  | VARCHAR |  |
| moo |  | VARCHAR |  |
| soi |  | VARCHAR |  |
| street |  | VARCHAR |  |
| subDistrictID | FK | INTEGER |  |
| phoneNumber |  | VARCHAR |  |

### ApplicantGuardian

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| guardianID | PK | SERIAL |  |
| applicationID | FK | INTEGER |  |
| role |  | VARCHAR |  |
| relationship |  | VARCHAR |  |
| citizenID |  | VARCHAR |  |
| prefix |  | VARCHAR |  |
| firstNameTH |  | VARCHAR |  |
| lastNameTH |  | VARCHAR |  |
| firstNameEN |  | VARCHAR |  |
| lastNameEN |  | VARCHAR |  |
| dob |  | DATE |  |
| gender |  | VARCHAR |  |
| email |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| ethnicity |  | VARCHAR |  |
| nationality |  | VARCHAR |  |
| religion |  | VARCHAR |  |
| occupation |  | VARCHAR |  |
| workplace |  | VARCHAR |  |
| monthlyIncome |  | NUMERIC |  |
| addressSameAs |  | VARCHAR | ❓ ไม่แน่ใจว่าเก็บเป็นรหัสผู้ปกครองหรือข้อความ |
| isPrimaryContact |  | BOOLEAN |  |

### ApplicantHealth

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| healthID | PK | SERIAL |  |
| applicationID | FK | INTEGER |  |
| bloodType |  | VARCHAR |  |
| weight |  | NUMERIC |  |
| height |  | NUMERIC |  |
| chronicDisease |  | TEXT |  |
| drugAllergy |  | TEXT |  |
| foodAllergy |  | TEXT |  |

### ApplicationDocument

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| documentID | PK | SERIAL |  |
| applicationID | FK | INTEGER |  |
| fieldID | FK | INTEGER |  |
| filePath |  | VARCHAR |  |
| fileName |  | VARCHAR |  |
| mimeType |  | VARCHAR |  |
| fileSize |  | INTEGER |  |
| uploadedAt |  | TIMESTAMP |  |
| verifyStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| verifiedBy |  | VARCHAR |  |
| verifiedAt |  | TIMESTAMP |  |
| rejectReason |  | TEXT |  |

### ApplicationStatusHistory

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| historyID | PK | SERIAL |  |
| applicationID | FK | INTEGER |  |
| fromStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| toStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| changedBy |  | VARCHAR |  |
| changedAt |  | TIMESTAMP |  |
| note |  | TEXT |  |

## หมวดทะเบียนนักเรียน

### Student

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| studentID | PK | SERIAL |  |
| studentCode | UK | VARCHAR |  |
| citizenID | UK | VARCHAR |  |
| prefix |  | VARCHAR |  |
| firstNameTH |  | VARCHAR |  |
| lastNameTH |  | VARCHAR |  |
| firstNameEN |  | VARCHAR |  |
| lastNameEN |  | VARCHAR |  |
| dob |  | DATE |  |
| gender |  | VARCHAR |  |
| email |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| ethnicity |  | VARCHAR |  |
| nationality |  | VARCHAR |  |
| religion |  | VARCHAR |  |
| fromApplicationID | FK | INTEGER |  |
| entryDate |  | DATE |  |
| graduationDate |  | DATE |  |
| status |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| statusChangedAt |  | TIMESTAMP |  |
| statusEffectiveDate |  | DATE |  |
| destinationSchool |  | VARCHAR |  |
| statusNote |  | TEXT |  |
| prevSchoolName |  | VARCHAR |  |
| transferInNote |  | TEXT |  |
| lastEditedBy |  | VARCHAR |  |
| lastEditedAt |  | TIMESTAMP |  |
| prevSchoolProvince |  | VARCHAR |  |
| prevDegree |  | VARCHAR |  |
| gpax |  | NUMERIC |  |
| extraFields |  | JSONB |  |

### StudentAddress

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| addressID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| addressType |  | VARCHAR |  |
| houseCode |  | VARCHAR |  |
| houseNo |  | VARCHAR |  |
| moo |  | VARCHAR |  |
| soi |  | VARCHAR |  |
| street |  | VARCHAR |  |
| subDistrictID | FK | INTEGER |  |
| phoneNumber |  | VARCHAR |  |

### StudentHealth

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| healthID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| bloodType |  | VARCHAR |  |
| weight |  | NUMERIC |  |
| height |  | NUMERIC |  |
| chronicDisease |  | TEXT |  |
| drugAllergy |  | TEXT |  |
| foodAllergy |  | TEXT |  |

### StudentGuardian

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| guardianID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| role |  | VARCHAR |  |
| relationship |  | VARCHAR |  |
| citizenID |  | VARCHAR |  |
| prefix |  | VARCHAR |  |
| firstNameTH |  | VARCHAR |  |
| lastNameTH |  | VARCHAR |  |
| firstNameEN |  | VARCHAR |  |
| lastNameEN |  | VARCHAR |  |
| dob |  | DATE |  |
| gender |  | VARCHAR |  |
| email |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| ethnicity |  | VARCHAR |  |
| nationality |  | VARCHAR |  |
| religion |  | VARCHAR |  |
| occupation |  | VARCHAR |  |
| workplace |  | VARCHAR |  |
| monthlyIncome |  | NUMERIC |  |
| addressSameAs |  | VARCHAR | ❓ ไม่แน่ใจว่าเก็บเป็นรหัสผู้ปกครองหรือข้อความ |
| isPrimaryContact |  | BOOLEAN |  |

### StudentDocument

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| documentID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| fieldID | FK | INTEGER |  |
| filePath |  | VARCHAR |  |
| fileName |  | VARCHAR |  |
| mimeType |  | VARCHAR |  |
| fileSize |  | INTEGER |  |
| uploadedAt |  | TIMESTAMP |  |
| verifyStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| verifiedBy |  | VARCHAR |  |
| verifiedAt |  | TIMESTAMP |  |
| rejectReason |  | TEXT |  |

### StudentStatusHistory

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| historyID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| fromStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| toStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| changedBy |  | VARCHAR |  |
| changedAt |  | TIMESTAMP |  |
| note |  | TEXT |  |

### StudentClassHistory

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| historyID | PK | SERIAL |  |
| studentID | FK | INTEGER |  |
| classroomID | FK | INTEGER |  |
| classNo |  | INTEGER |  |
| startDate |  | DATE |  |
| endDate |  | DATE |  |

### Classroom

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| classroomID | PK | SERIAL |  |
| academicYearID | FK | INTEGER |  |
| educationLevelID | FK | INTEGER |  |
| roomNo |  | INTEGER | ❓ เลขห้อง ถ้าเป็นข้อความเช่น 1/2 ใช้ VARCHAR |
| studyProgramID | FK | INTEGER |  |
| capacity |  | INTEGER |  |
| schoolRoomID | FK | INTEGER |  |

### ClassroomHomeroomTeacher

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| classroomHomeroomTeacherID | PK | SERIAL |  |
| classroomID | FK | INTEGER |  |
| employeeID | FK | INTEGER |  |
| academicYearID | FK | INTEGER |  |

## หมวดตั้งค่าโรงเรียนและตารางอ้างอิงกลาง

### SchoolData

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| schoolID | PK | SERIAL |  |
| thSchoolName |  | VARCHAR |  |
| enSchoolName |  | VARCHAR |  |
| houseNo |  | VARCHAR |  |
| moo |  | VARCHAR |  |
| soi |  | VARCHAR |  |
| street |  | VARCHAR |  |
| subDistrictID | FK | INTEGER |  |

### EducationStage

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| educationStageID | PK | SERIAL |  |
| stageCode | UK | VARCHAR |  |
| thStageName |  | VARCHAR |  |
| enStageName |  | VARCHAR |  |
| displayOrder |  | INTEGER |  |
| isActive |  | BOOLEAN |  |

### EducationLevels

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| educationLevelID | PK | SERIAL |  |
| levelCode | UK | VARCHAR |  |
| thLevelName |  | VARCHAR |  |
| enLevelName |  | VARCHAR |  |
| educationStageID | FK | INTEGER |  |
| nextEducationLevelID | FK | INTEGER |  |

### AcademicYears

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| academicYearID | PK | SERIAL |  |
| academicYear |  | INTEGER | ❓ ปี พ.ศ. เช่น 2569 |
| isActive |  | BOOLEAN |  |

### Semesters

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| semesterID | PK | SERIAL |  |
| academicYearID | FK | INTEGER |  |
| semesterNo | UK | INTEGER |  |
| startDate |  | DATE |  |
| endDate |  | DATE |  |

### SchoolSchedule

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| scheduleID | PK | SERIAL |  |
| semesterID | FK | INTEGER |  |
| classStartTime |  | TIME |  |
| classEndTime |  | TIME |  |
| gateOpenTime |  | TIME |  |
| absentTime |  | TIME |  |
| lateAfterMinutes |  | INTEGER |  |
| earlyLeaveBeforeMinutes |  | INTEGER |  |
| studyDays |  | VARCHAR | ❓ เก็บเป็นข้อความ เช่น mon,tue,wed |

### SchoolCalendar

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| schoolCalendarID | PK | SERIAL |  |
| academicYearID | FK | INTEGER |  |
| eventName |  | VARCHAR |  |
| eventStartDate |  | DATE |  |
| eventEndDate |  | DATE |  |
| eventType |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |

### StudyProgram

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| studyProgramID | PK | SERIAL |  |
| name |  | VARCHAR |  |
| educationStageID | FK | INTEGER |  |
| isActive |  | BOOLEAN |  |
| note |  | TEXT |  |

### SchoolRoom

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| schoolRoomID | PK | SERIAL |  |
| name |  | VARCHAR |  |
| buildingID | FK | INTEGER |  |
| floor |  | INTEGER | ❓ ชั้น ถ้ามี G/B ให้ใช้ VARCHAR |
| capacity |  | INTEGER |  |
| examCapacity |  | INTEGER |  |
| isExamRoom |  | BOOLEAN |  |
| examRows |  | INTEGER |  |
| examCols |  | INTEGER |  |

### Building

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| buildingID | PK | SERIAL |  |
| buildingNo | UK | VARCHAR |  |
| name |  | VARCHAR |  |
| floorCount |  | INTEGER |  |
| isActive |  | BOOLEAN |  |

### Countries

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| countryID | PK | SERIAL |  |
| thCountryName |  | VARCHAR |  |
| enCountryName |  | VARCHAR |  |

### Provinces

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| provinceID | PK | SERIAL |  |
| countryID | FK | INTEGER |  |
| thProvinceName |  | VARCHAR |  |
| enProvinceName |  | VARCHAR |  |

### Districts

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| districtID | PK | SERIAL |  |
| provinceID | FK | INTEGER |  |
| thDistrictName |  | VARCHAR |  |
| enDistrictName |  | VARCHAR |  |

### SubDistricts

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| subDistrictID | PK | SERIAL |  |
| districtID | FK | INTEGER |  |
| thSubDistrictName |  | VARCHAR |  |
| enSubDistrictName |  | VARCHAR |  |
| zipCode |  | VARCHAR | ❓ รหัสไปรษณีย์ นำศูนย์ได้ จึงใช้ VARCHAR |

### FieldDefinition

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| fieldID | PK | SERIAL |  |
| formType |  | VARCHAR |  |
| sectionKey |  | VARCHAR |  |
| groupName |  | VARCHAR |  |
| fieldKey |  | VARCHAR |  |
| labelTH |  | VARCHAR |  |
| labelEN |  | VARCHAR |  |
| fieldNo |  | VARCHAR | ❓ เลขกำกับช่อง อาจเป็นข้อความ เช่น 2.1 |
| isRequired |  | BOOLEAN |  |
| isHeader |  | BOOLEAN |  |
| displayOrder |  | INTEGER |  |
| isActive |  | BOOLEAN |  |

### StudentColumnSetting

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| columnID | PK | SERIAL |  |
| labelTH |  | VARCHAR |  |
| fieldKey |  | VARCHAR |  |
| isVisible |  | BOOLEAN |  |
| isPrimary |  | BOOLEAN |  |
| isLocked |  | BOOLEAN |  |
| align |  | VARCHAR |  |
| displayOrder |  | INTEGER |  |

### EmailTemplate

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| templateKey | PK | VARCHAR |  |
| label |  | VARCHAR |  |
| subject |  | VARCHAR |  |
| body |  | TEXT |  |

### SystemSetting

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| settingKey | PK | VARCHAR |  |
| value |  | TEXT |  |
| description |  | TEXT |  |
| updatedAt |  | TIMESTAMP |  |

### ActivityLog

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| logID | PK | SERIAL |  |
| occurredAt |  | TIMESTAMP |  |
| action |  | VARCHAR |  |
| status |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| userName |  | VARCHAR |  |
| actionType |  | VARCHAR |  |
| targetType |  | VARCHAR |  |
| targetID |  | VARCHAR | ❓ ชี้หลายชนิดตาราง ไม่ใช่ FK จริง |

## หมวดบุคลากร

### Employees

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| employeeID | PK | SERIAL |  |
| thTitle |  | VARCHAR |  |
| enTitle |  | VARCHAR |  |
| thFirstName |  | VARCHAR |  |
| thLastName |  | VARCHAR |  |
| enFirstName |  | VARCHAR |  |
| enLastName |  | VARCHAR |  |
| idType |  | VARCHAR |  |
| idNumber |  | VARCHAR |  |
| dob |  | DATE |  |
| gender |  | VARCHAR |  |
| bloodGroup |  | VARCHAR |  |
| nationality |  | VARCHAR |  |
| religious |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| email |  | VARCHAR |  |
| role |  | VARCHAR |  |
| isCompleted |  | BOOLEAN |  |

### Education

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| educationID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| degree |  | VARCHAR |  |
| major |  | VARCHAR |  |
| institution |  | VARCHAR |  |
| graduateYear |  | INTEGER |  |
| gpa |  | NUMERIC |  |

### RoyalDecorations

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| royalDecorationsID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| decorationClass |  | VARCHAR |  |
| dateReceived |  | DATE |  |
| yearReceived |  | INTEGER |  |
| gazetteReference |  | VARCHAR |  |

### License

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| licenseID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| licenseType |  | VARCHAR |  |
| issueDate |  | DATE |  |
| expiryDate |  | DATE |  |

### ToeicScore

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| toeicID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| score |  | INTEGER | ❓ คะแนน TOEIC เต็ม 990 |
| expiryDate |  | DATE |  |
| document |  | VARCHAR |  |

### JobDetails

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| jobID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| positionID | FK | INTEGER |  |
| departmentID | FK | INTEGER |  |
| staffTypeID | FK | INTEGER |  |
| startDate |  | DATE |  |
| salary |  | NUMERIC |  |
| workStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |

### Training

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| trainingID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| trainingName |  | VARCHAR |  |
| trainingType |  | VARCHAR |  |
| organizer |  | VARCHAR |  |
| startDate |  | DATE |  |
| endDate |  | DATE |  |
| hour |  | INTEGER | ❓ ชั่วโมงอาจมีเศษ ถ้ามีเศษใช้ NUMERIC |
| location |  | VARCHAR |  |
| country |  | VARCHAR |  |
| province |  | VARCHAR |  |
| cost |  | NUMERIC |  |

### FamilyMember

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| familyID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| thTitle |  | VARCHAR |  |
| enTitle |  | VARCHAR |  |
| thFirstName |  | VARCHAR |  |
| thLastName |  | VARCHAR |  |
| enFirstName |  | VARCHAR |  |
| enLastName |  | VARCHAR |  |
| phoneNumber |  | VARCHAR |  |
| relationship |  | VARCHAR |  |
| dob |  | DATE |  |
| maritalStatus |  | VARCHAR |  |
| lifeStatus |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| career |  | VARCHAR |  |
| educationLevel |  | VARCHAR |  |

### Address

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| addressID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| houseNo |  | VARCHAR |  |
| moo |  | VARCHAR |  |
| soi |  | VARCHAR |  |
| street |  | VARCHAR |  |
| subDistrictID | FK | INTEGER |  |
| countryID | FK | INTEGER |  |
| addressLine |  | TEXT |  |
| addressType |  | VARCHAR |  |

## หมวดตั้งค่าบุคลากร

### StaffType

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| staffTypeID | PK | SERIAL |  |
| typeCode | UK | VARCHAR |  |
| name |  | VARCHAR |  |
| description |  | TEXT |  |
| color |  | VARCHAR | ❓ เก็บรหัสสี เช่น #1d4ed8 |
| isActive |  | BOOLEAN |  |
| displayOrder |  | INTEGER |  |

### Position

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| positionID | PK | SERIAL |  |
| positionCode | UK | VARCHAR |  |
| name |  | VARCHAR |  |
| isActive |  | BOOLEAN |  |
| displayOrder |  | INTEGER |  |

### PositionStaffType

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| positionStaffTypeID | PK | SERIAL |  |
| positionID | FK | INTEGER |  |
| staffTypeID | FK | INTEGER |  |
| (positionID, staffTypeID) | UK | — |  |

### Department

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| departmentID | PK | SERIAL |  |
| departmentCode | UK | VARCHAR |  |
| name |  | VARCHAR |  |
| description |  | TEXT |  |
| color |  | VARCHAR | ❓ เก็บรหัสสี เช่น #1d4ed8 |
| headEmployeeID | FK | INTEGER |  |
| isActive |  | BOOLEAN |  |
| displayOrder |  | INTEGER |  |

### StaffWorkTime

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| workTimeID | PK | SERIAL |  |
| workStart |  | TIME |  |
| workEnd |  | TIME |  |
| lunchStart |  | TIME |  |
| lunchEnd |  | TIME |  |
| otStart |  | TIME |  |
| lateAfterMinutes |  | INTEGER |  |
| earlyOutBeforeMinutes |  | INTEGER |  |
| workdays |  | VARCHAR | ❓ เก็บเป็นข้อความ เช่น mon,tue,wed |

### Shift

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| shiftID | PK | SERIAL |  |
| name |  | VARCHAR |  |
| startTime |  | TIME |  |
| endTime |  | TIME |  |

### User

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| userID | PK | SERIAL |  |
| employeeID | UK | INTEGER |  |
| accessRole |  | VARCHAR | ❓ ค่าตายตัว อาจใช้ ENUM |
| isActive |  | BOOLEAN |  |

### Permission

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| permissionID | PK | SERIAL |  |
| permissionKey | UK | VARCHAR |  |
| labelTH |  | VARCHAR |  |

### UserPermission

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| userPermissionID | PK | SERIAL |  |
| userID | FK | INTEGER |  |
| permissionID | FK | INTEGER |  |
| (userID, permissionID) | UK | — |  |

### Signatory

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| signatoryID | PK | SERIAL |  |
| employeeID | FK | INTEGER |  |
| prefix |  | VARCHAR |  |
| name |  | VARCHAR |  |
| position |  | VARCHAR |  |
| displayOrder |  | INTEGER |  |
| isActive |  | BOOLEAN |  |

### DocSignatory

| คอลัมน์ | คีย์ | ชนิด | หมายเหตุ |
|---|---|---|---|
| docSignatoryID | PK | SERIAL |  |
| signatoryID | FK | INTEGER |  |
| docType |  | VARCHAR | ❓ ชนิดเอกสาร เป็นข้อความ (ยังมีสองรายการไม่ตรงกัน) |
| (docType, signatoryID) | UK | — |  |
