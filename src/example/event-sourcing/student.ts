import { CommandBase } from '#core/command';
import { DomainEventBase } from '#core/domain-event';
import { Aggregate, ApplyEvent, ProcessCommand } from '#decorators/aggregate';
import { Command } from '#decorators/command';
import { DomainEvent } from '#decorators/domain-event';
import { Props } from '#decorators/props';
import { Min } from 'class-validator';
import { CreateUserCommandProps, User, UserProps } from './user';
import { Vehicle } from './vehicle';
import { Type } from 'class-transformer';

@Props()
export class CreateStudentCommandProps extends CreateUserCommandProps {
  grade: number;

  @Type(() => Vehicle)
  vehicle: Vehicle;
}

@Command(CreateStudentCommandProps)
export class CreateStudentCommand extends CommandBase<CreateStudentCommandProps> {}

//
@Props()
export class StudentCreatedEventProps {
  name: string;
  age: number;
  grade: number;
  vehicle?: Vehicle;
}

@DomainEvent(StudentCreatedEventProps)
export class StudentCreatedEvent extends DomainEventBase<StudentCreatedEventProps> {}

//
@Props()
export class ChangeGradeCommandProps {
  grade: number;
}

@Command(ChangeGradeCommandProps)
export class ChangeGradeCommand extends CommandBase<ChangeGradeCommandProps> {}

//
@Props()
export class GradeChangedEventProps {
  newGrade: number;
}

@DomainEvent(GradeChangedEventProps)
export class GradeChangedEvent extends DomainEventBase<GradeChangedEventProps> {}

//
@Props()
export class StudentProps extends UserProps {
  @Min(5)
  grade: number;

  vehicle?: Vehicle;
}

@Aggregate(StudentProps)
export class Student extends User<StudentProps> {
  get grade() {
    return this.props.grade;
  }

  get vehicle() {
    return this.props.vehicle;
  }

  @ProcessCommand(CreateStudentCommand)
  processCreate(command: CreateStudentCommand) {
    const props = this.makeProps(command.getProps());

    return this.newEvent(StudentCreatedEvent, {
      name: props.name,
      age: props.age,
      grade: props.grade,
      vehicle: props.vehicle,
    });
  }

  @ApplyEvent(StudentCreatedEvent)
  applyCreate(event: StudentCreatedEvent) {
    const { name, age, grade, vehicle } = event.getProps();

    this.initProps({
      name,
      age,
      grade,
      vehicle,
    });
  }

  @ProcessCommand(ChangeGradeCommand)
  changeGrade(command: ChangeGradeCommand) {
    const { grade } = command.getProps();

    if (grade > 12) throw new Error('Grade must be less or equal than 12');

    return this.newEvent(GradeChangedEvent, { newGrade: grade });
  }

  @ApplyEvent(GradeChangedEvent)
  applyGradeChanged(event: GradeChangedEvent) {
    const { newGrade } = event.getProps();

    this.props.grade = newGrade;
  }
}
