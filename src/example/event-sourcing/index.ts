import { ChangeGradeCommand, CreateStudentCommand, Student, StudentProps } from './student';
import { ChangeNameCommand } from './user';

const studentXProps: StudentProps = {
  name: 'Nam',
  age: 22,
  grade: 10,
};

const studentX = Student.initAggregate();

console.log(studentX);

const event0 = studentX.processCommand(
  CreateStudentCommand.newCommand({ studentProps: studentXProps }),
);

studentX.applyEvent(event0);

console.log(studentX);

const event1 = studentX.processCommand(
  ChangeNameCommand.newCommand(
    {
      name: 'Huy Vu',
    },
    undefined,
    'request123',
  ),
);

studentX.applyEvent(event1);

console.log(studentX);

const event2 = studentX.processCommand(
  ChangeGradeCommand.newCommand({
    grade: 6,
  }),
);

studentX.applyEvent(event2);

console.log(studentX);
