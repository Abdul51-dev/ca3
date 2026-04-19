export type ClassType = 'Lecture' | 'Lab' | 'Tutorial';

export interface ClassSlot {
  time: string;      // e.g. "09:00"
  duration: string;  // e.g. "1h"
  name: string;
  room: string;
  type: ClassType;
  color: string;     // CSS colour for the left bar
}

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const timetable: Record<Day, ClassSlot[]> = {
  Mon: [
    { time: '09:00', duration: '1h',  name: 'Data Structures & Algorithms', room: 'Room B204', type: 'Lecture', color: '#1a1a18' },
    { time: '10:00', duration: '2h',  name: 'Software Engineering',          room: 'Lab L103',  type: 'Lab',     color: '#2563eb' },
    { time: '13:00', duration: '1h',  name: 'Mathematics for Computing',     room: 'Room A110', type: 'Lecture', color: '#d97706' },
    { time: '14:00', duration: '1h',  name: 'Web Development',               room: 'Lab L201',  type: 'Lab',     color: '#16a34a' },
  ],
  Tue: [
    { time: '10:00', duration: '2h',  name: 'Database Systems',              room: 'Room B301', type: 'Lecture', color: '#2563eb' },
    { time: '14:00', duration: '1h',  name: 'Operating Systems',             room: 'Room A210', type: 'Lecture', color: '#d97706' },
  ],
  Wed: [
    { time: '09:00', duration: '1h',  name: 'Mathematics for Computing',     room: 'Room A110', type: 'Tutorial', color: '#d97706' },
    { time: '11:00', duration: '2h',  name: 'Data Structures & Algorithms',  room: 'Lab L104',  type: 'Lab',      color: '#1a1a18' },
    { time: '15:00', duration: '1h',  name: 'Software Engineering',          room: 'Room B204', type: 'Lecture',  color: '#2563eb' },
  ],
  Thu: [
    { time: '10:00', duration: '1h',  name: 'Web Development',               room: 'Room A310', type: 'Lecture', color: '#16a34a' },
    { time: '13:00', duration: '2h',  name: 'Database Systems',              room: 'Lab L102',  type: 'Lab',     color: '#2563eb' },
  ],
  Fri: [
    { time: '09:00', duration: '1h',  name: 'Operating Systems',             room: 'Lab L205',  type: 'Lab',     color: '#d97706' },
    { time: '11:00', duration: '1h',  name: 'Software Engineering',          room: 'Room B204', type: 'Tutorial', color: '#2563eb' },
  ],
};
