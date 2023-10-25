import {
  ChangeGradeCommand,
  CreateStudentCommand,
  CreateStudentCommandProps,
  Student,
  StudentProps,
} from './student';
import { ChangeNameCommand } from './user';
import { Vehicle } from './vehicle';

const bikeX = Vehicle.initEntity({
  type: 'bike',
  color: 'red',
});

const studentXProps: StudentProps = {
  name: 'Nam',
  age: 22,
  grade: 10,
  vehicle: bikeX,
};

const studentX = Student.initAggregate();

studentX.processCommand(
  CreateStudentCommand.newCommand({
    ...(studentXProps as CreateStudentCommandProps),
  }),
);

studentX.processCommand(
  ChangeNameCommand.newCommand(
    {
      name: 'Huy Vu',
    },
    undefined,
    'request123',
  ),
);

studentX.processCommand(
  ChangeGradeCommand.newCommand({
    grade: 6,
  }),
);

console.log('Aggregate instance', studentX);
console.log('Aggregate handled commands', studentX.getHandledCommands());
console.log('Aggregate events', studentX.getEvents());
console.log(
  'Aggregate events to object',
  studentX.getEvents().map((event) => event.toObject()),
);
console.log('Aggregate to object', studentX.toObject());
console.log('Aggregate initialsnapshot to object', studentX.getInitialSnapshot().toObject());
