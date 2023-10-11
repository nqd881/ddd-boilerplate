import { CommandBase } from '#core/command';
import { DomainEventBase } from '#core/domain-event';
import { Aggregate, ApplyEvent, ProcessCommand } from '#decorators/aggregate';
import { Command } from '#decorators/command';
import { DomainEvent } from '#decorators/domain-event';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';
import { User, UserProps } from './user';
import { Vehicle } from './vehicle';
import { ToObject } from '#decorators/to-object';

export class StudentProps extends UserProps {
  @Min(5)
  grade: number;

  vehicle?: Vehicle;
}

export class CreateStudentCommandProps {
  @Type(() => StudentProps)
  studentProps: StudentProps;
}

@Command(CreateStudentCommandProps)
export class CreateStudentCommand extends CommandBase<CreateStudentCommandProps> {
  get studentProps() {
    return this.props.studentProps;
  }
}

export class StudentCreatedEventProps {
  name: string;
  age: number;
  grade: number;
  vehicle?: Vehicle;
}

@DomainEvent(StudentCreatedEventProps)
export class StudentCreatedEvent extends DomainEventBase<StudentCreatedEventProps> {
  get name() {
    return this.props.name;
  }

  get age() {
    return this.props.age;
  }

  get grade() {
    return this.props.grade;
  }

  get vehicle() {
    return this.props.vehicle;
  }
}

export class ChangeGradeCommandProps {
  grade: number;
}

@Command(ChangeGradeCommandProps)
export class ChangeGradeCommand extends CommandBase<ChangeGradeCommandProps> {
  get grade() {
    return this.props.grade;
  }
}

export class GradeChangedEventProps {
  newGrade: number;
}

@DomainEvent(GradeChangedEventProps)
export class GradeChangedEvent extends DomainEventBase<GradeChangedEventProps> {
  get newGrade() {
    return this.props.newGrade;
  }
}

@Aggregate(StudentProps)
export class Student extends User<StudentProps> {
  @ToObject()
  get grade() {
    return this.props.grade;
  }

  @ToObject()
  get vehicle() {
    return this.props.vehicle;
  }

  @ProcessCommand(CreateStudentCommand)
  processCreate(command: CreateStudentCommand) {
    const props = this.makeProps(command.studentProps);

    return this.newEvent(StudentCreatedEvent, {
      name: props.name,
      age: props.age,
      grade: props.grade,
      vehicle: props.vehicle,
    });
  }

  @ApplyEvent(StudentCreatedEvent)
  applyCreate(event: StudentCreatedEvent) {
    this.init({
      name: event.name,
      age: event.age,
      grade: event.grade,
      vehicle: event.vehicle,
    });
  }

  @ProcessCommand(ChangeGradeCommand)
  changeGrade(command: ChangeGradeCommand) {
    if (command.grade > 12) throw new Error('Grade must be less or equal than 12');

    return this.newEvent(GradeChangedEvent, { newGrade: command.grade });
  }

  @ApplyEvent(GradeChangedEvent)
  applyGradeChanged(event: GradeChangedEvent) {
    this.props.grade = event.newGrade;
  }
}
