const { MongoClient, ObjectId } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'zen_class_programme';

async function runQueries() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // 1. Find all topics and tasks taught in October
    const topicsInOctober = await db.collection('topics').find({
      date_taught: {
        $gte: new Date('2023-10-01T00:00:00.000Z'),
        $lt: new Date('2023-11-01T00:00:00.000Z')
      }
    }).toArray();

    const tasksInOctober = await db.collection('tasks').find({
      due_date: {
        $gte: new Date('2023-10-01T00:00:00.000Z'),
        $lt: new Date('2023-11-01T00:00:00.000Z')
      }
    }).toArray();

    console.log('Topics in October:', topicsInOctober);
    console.log('Tasks in October:', tasksInOctober);

    // 2. Find company drives between 15 Oct 2020 and 31 Oct 2020
    const companyDrives = await db.collection('company_drives').find({
      date: {
        $gte: new Date('2020-10-15T00:00:00.000Z'),
        $lte: new Date('2020-10-31T23:59:59.999Z')
      }
    }).toArray();

    console.log('Company Drives in October 2020:', companyDrives);

    // 3. Find company drives and students who appeared for placement
    const companyDrivesWithStudents = await db.collection('company_drives').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'students_appeared',
          foreignField: '_id',
          as: 'appeared_students'
        }
      }
    ]).toArray();

    console.log('Company Drives with Appeared Students:', companyDrivesWithStudents);

    // 4. Find number of problems solved by a user in CodeKata
    const userId = new ObjectId('USER_ID'); // Replace USER_ID with actual user ID
    const userProblemsSolved = await db.collection('codekata').aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: '$user_id', total_problems_solved: { $sum: '$problems_solved' } } }
    ]).toArray();

    console.log('Problems Solved by User:', userProblemsSolved);

    // 5. Find mentors with more than 15 mentees
    const mentorsWithManyMentees = await db.collection('mentors').find({
      mentees_count: { $gt: 15 }
    }).toArray();

    console.log('Mentors with More Than 15 Mentees:', mentorsWithManyMentees);

    // 6. Find number of users absent and tasks not submitted between 15 Oct 2020 and 31 Oct 2020
    const absentAndNotSubmitted = await db.collection('attendance').aggregate([
      {
        $match: {
          status: 'absent',
          date: {
            $gte: new Date('2020-10-15T00:00:00.000Z'),
            $lte: new Date('2020-10-31T23:59:59.999Z')
          }
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'task_id',
          foreignField: '_id',
          as: 'task'
        }
      },
      {
        $unwind: '$task'
      },
      {
        $match: {
          'task.submitted': false
        }
      },
      {
        $group: {
          _id: '$user_id',
          absent_and_not_submitted: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log('Users Absent and Tasks Not Submitted:', absentAndNotSubmitted);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

runQueries();
