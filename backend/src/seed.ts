import 'dotenv/config';
import { db, pool } from './config/drizzle';
import { users, classCalendars, calendarMemberships, events } from './config/schema';
import bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a random 6-char join code (uppercase alphanumeric) */
function joinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous I/1/O/0
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SEED_USERS = [
  { fullName: 'Alice Johnson', email: 'alice@clace.dev', password: 'Password1!', isClassPresident: true },
  { fullName: 'Bob Martinez', email: 'bob@clace.dev', password: 'Password1!', isClassPresident: false },
  { fullName: 'Carol Zhang', email: 'carol@clace.dev', password: 'Password1!', isClassPresident: false },
  { fullName: 'David Kim', email: 'david@clace.dev', password: 'Password1!', isClassPresident: false },
  { fullName: 'Eva Nguyen', email: 'eva@clace.dev', password: 'Password1!', isClassPresident: false },
];

async function seed() {
  console.log('🧹 Cleaning existing data…');

  // Delete in FK-dependency order (children first)
  await db.delete(events);
  await db.delete(calendarMemberships);
  await db.delete(classCalendars);
  await db.delete(users);

  console.log('👤 Seeding users…');
  const passwordHash = await bcrypt.hash('Password1!', 10);

  const insertedUsers = await db
    .insert(users)
    .values(
      SEED_USERS.map((u) => ({
        fullName: u.fullName,
        email: u.email,
        passwordHash,
        isClassPresident: u.isClassPresident,
      })),
    )
    .returning({ id: users.id, email: users.email });

  const userByEmail = new Map(insertedUsers.map((u) => [u.email, u.id]));

  const aliceId = userByEmail.get('alice@clace.dev')!;
  const bobId = userByEmail.get('bob@clace.dev')!;
  const carolId = userByEmail.get('carol@clace.dev')!;
  const davidId = userByEmail.get('david@clace.dev')!;
  const evaId = userByEmail.get('eva@clace.dev')!;

  console.log(`   ✔ ${insertedUsers.length} users created`);

  // --- Calendars -----------------------------------------------------------

  console.log('📅 Seeding calendars…');
  const calendarsData = [
    { name: 'CS 301 — Algorithms', creatorId: aliceId, joinCode: joinCode() },
    { name: 'Physics 201 — Mechanics', creatorId: bobId, joinCode: joinCode() },
    { name: 'Design Studio', creatorId: carolId, joinCode: joinCode() },
  ];

  const insertedCalendars = await db
    .insert(classCalendars)
    .values(calendarsData)
    .returning({ id: classCalendars.id, name: classCalendars.name });

  const calByName = new Map(insertedCalendars.map((c) => [c.name, c.id]));

  const csCalId = calByName.get('CS 301 — Algorithms')!;
  const physCalId = calByName.get('Physics 201 — Mechanics')!;
  const designCalId = calByName.get('Design Studio')!;

  console.log(`   ✔ ${insertedCalendars.length} calendars created`);

  // --- Memberships ---------------------------------------------------------

  console.log('🔗 Seeding memberships…');

  const membershipsData = [
    // CS 301: Alice (creator), Carol, David, Eva
    { userId: aliceId, calendarId: csCalId },
    { userId: carolId, calendarId: csCalId },
    { userId: davidId, calendarId: csCalId },
    { userId: evaId, calendarId: csCalId },
    // Physics: Bob (creator), Alice, David
    { userId: bobId, calendarId: physCalId },
    { userId: aliceId, calendarId: physCalId },
    { userId: davidId, calendarId: physCalId },
    // Design: Carol (creator), Bob, Eva
    { userId: carolId, calendarId: designCalId },
    { userId: bobId, calendarId: designCalId },
    { userId: evaId, calendarId: designCalId },
  ];

  const insertedMemberships = await db.insert(calendarMemberships).values(membershipsData).returning();
  console.log(`   ✔ ${insertedMemberships.length} memberships created`);

  // --- Events --------------------------------------------------------------

  console.log('📝 Seeding events…');

  function dateAt(daysFromNow: number, hour: number, minute = 0): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  const eventsData = [
    // CS 301 events
    {
      calendarId: csCalId, creatorId: aliceId,
      title: 'Problem Set 3 Due', description: 'Graph algorithms — shortest path, MST, and network flow',
      startDatetime: dateAt(3, 23, 59), endDatetime: dateAt(3, 23, 59), allDay: true,
      type: 'Assignment', subject: 'Algorithms', course: 'CS 301', status: 'Pending',
      location: 'Online', color: '#f59e0b',
    },
    {
      calendarId: csCalId, creatorId: aliceId,
      title: 'Lecture: Dynamic Programming', description: 'Introduction to DP with memoization and tabulation',
      startDatetime: dateAt(5, 10, 0), endDatetime: dateAt(5, 11, 30), allDay: false,
      type: 'ClassSession', subject: 'Algorithms', course: 'CS 301', status: 'Scheduled',
      location: 'Hall B-204', color: '#3b82f6',
    },
    {
      calendarId: csCalId, creatorId: aliceId,
      title: 'Midterm Exam', description: 'Covers chapters 1-6. Closed book, one cheat sheet allowed.',
      startDatetime: dateAt(10, 9, 0), endDatetime: dateAt(10, 11, 0), allDay: false,
      type: 'Exam', subject: 'Algorithms', course: 'CS 301', status: 'Scheduled',
      location: 'Exam Hall A', color: '#ef4444',
    },
    {
      calendarId: csCalId, creatorId: davidId,
      title: 'Study Group — Review Session', description: 'Bring your questions on DP and greedy algorithms',
      startDatetime: dateAt(8, 18, 0), endDatetime: dateAt(8, 20, 0), allDay: false,
      type: 'GeneralActivity', subject: 'Algorithms', course: 'CS 301', status: 'Scheduled',
      location: 'Library Room 3', color: '#8b5cf6',
    },

    // Physics events
    {
      calendarId: physCalId, creatorId: bobId,
      title: 'Lab: Projectile Motion', description: 'Bring lab notebook and safety goggles',
      startDatetime: dateAt(2, 14, 0), endDatetime: dateAt(2, 16, 0), allDay: false,
      type: 'ClassSession', subject: 'Mechanics', course: 'PHYS 201', status: 'Scheduled',
      location: 'Physics Lab 105', color: '#06b6d4',
    },
    {
      calendarId: physCalId, creatorId: bobId,
      title: 'Homework 5 — Rotational Dynamics', description: 'Problems 4.1 through 4.12',
      startDatetime: dateAt(7, 23, 59), endDatetime: dateAt(7, 23, 59), allDay: true,
      type: 'Assignment', subject: 'Mechanics', course: 'PHYS 201', status: 'Pending',
      location: 'Online', color: '#f59e0b',
    },
    {
      calendarId: physCalId, creatorId: aliceId,
      title: 'Office Hours', description: 'Room 302B — first come, first served',
      startDatetime: dateAt(4, 15, 0), endDatetime: dateAt(4, 16, 30), allDay: false,
      type: 'GeneralActivity', subject: 'Mechanics', course: 'PHYS 201', status: 'Scheduled',
      location: 'Room 302B', color: '#10b981',
    },

    // Design Studio events
    {
      calendarId: designCalId, creatorId: carolId,
      title: 'Critique Session', description: 'Bring final mockups for peer review',
      startDatetime: dateAt(6, 13, 0), endDatetime: dateAt(6, 15, 0), allDay: false,
      type: 'ClassSession', subject: 'Design', course: 'DES 100', status: 'Scheduled',
      location: 'Studio A', color: '#8b5cf6',
    },
    {
      calendarId: designCalId, creatorId: carolId,
      title: 'Final Portfolio Submission', description: 'Submit PDF + Figma link via Canvas',
      startDatetime: dateAt(20, 23, 59), endDatetime: dateAt(20, 23, 59), allDay: true,
      type: 'Project', subject: 'Design', course: 'DES 100', status: 'Pending',
      location: 'Canvas', color: '#f97316',
    },
    {
      calendarId: designCalId, creatorId: bobId,
      title: 'Guest Lecture: UX Research Methods', description: 'Speaker from Google Design',
      startDatetime: dateAt(9, 11, 0), endDatetime: dateAt(9, 12, 30), allDay: false,
      type: 'ClassSession', subject: 'UX Research', course: 'DES 100', status: 'Scheduled',
      location: 'Auditorium', color: '#3b82f6',
    },
  ];

  const insertedEvents = await db.insert(events).values(eventsData).returning();
  console.log(`   ✔ ${insertedEvents.length} events created`);

  // --- Summary -------------------------------------------------------------

  console.log('\n✅ Seed complete!\n');
  console.log('   Users:          ', insertedUsers.length);
  console.log('   Calendars:      ', insertedCalendars.length);
  console.log('   Memberships:    ', insertedMemberships.length);
  console.log('   Events:         ', insertedEvents.length);
  console.log('\n   Login credentials (all users):');
  console.log('     Password: Password1!');
  SEED_USERS.forEach((u) => console.log(`     ${u.email}`));

  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
