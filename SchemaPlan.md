# MongoDB Schema for Zen Class Programme

## Users
- `_id`: ObjectId
- `name`: String
- `email`: String
- `codekata_problems_solved`: Number
- `attendance`: Array of references to Attendance documents
- `tasks`: Array of references to Tasks documents

## CodeKata
- `_id`: ObjectId
- `user_id`: ObjectId (reference to Users)
- `problems_solved`: Number

## Attendance
- `_id`: ObjectId
- `user_id`: ObjectId (reference to Users)
- `date`: Date
- `status`: String (e.g., 'present', 'absent')
- `task_id`: ObjectId (reference to Tasks, optional)

## Topics
- `_id`: ObjectId
- `name`: String
- `date_taught`: Date

## Tasks
- `_id`: ObjectId
- `title`: String
- `description`: String
- `due_date`: Date
- `submitted`: Boolean
- `topic_id`: ObjectId (reference to Topics)

## CompanyDrives
- `_id`: ObjectId
- `date`: Date
- `details`: String
- `students_appeared`: Array of references to Users

## Mentors
- `_id`: ObjectId
- `name`: String
- `mentees_count`: Number
