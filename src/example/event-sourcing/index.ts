import { ChangeGradeCommand, CreateStudentCommand, Student, StudentProps } from './student';
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
    studentProps: studentXProps,
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

const initialStudentX = studentX.getSnapshots()[0];

console.log(studentX.toObject());
console.log(initialStudentX.toObject());
