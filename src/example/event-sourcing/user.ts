import { AggregateBase } from '#core/aggregate';
import { CommandBase } from '#core/command';
import { DomainEventBase } from '#core/domain-event';
import { Aggregate, ApplyEvent, ProcessCommand } from '#decorators/aggregate';
import { Command } from '#decorators/command';
import { DomainEvent } from '#decorators/domain-event';
import { Props } from '#decorators/props';
import { Transform } from 'class-transformer';

@Props()
export class CreateUserCommandProps {
  name: string;
  age: number;
}

@Command(CreateUserCommandProps, 'user.create')
export class CreateUserCommand extends CommandBase<CreateUserCommandProps> {}

//
@Props()
export class ChangeNameCommandProps {
  name: string;
}

@Command(ChangeNameCommandProps, 'user.change_name')
export class ChangeNameCommand extends CommandBase<ChangeNameCommandProps> {}

//
@Props()
export class NameChangedEventProps {
  newName: string;
}

@DomainEvent(NameChangedEventProps, 'user.name_changed')
export class NameChangedEvent extends DomainEventBase<NameChangedEventProps> {}

//
@Props()
export class UserProps {
  @Transform(
    ({ value }) => {
      return `#_${value}_#`;
    },
    { toPlainOnly: true },
  )
  name: string;
  age: number;
}

@Aggregate(UserProps)
export class User<P extends UserProps> extends AggregateBase<P> {
  get name() {
    return this.props.name;
  }

  get age() {
    return this.props.age;
  }

  @ProcessCommand(ChangeNameCommand)
  processChangeNameCommand(command: ChangeNameCommand) {
    const { name } = command.getProps();

    if (name === 'Vu') throw new Error('Cannot change name to Vu');

    return this.newEvent(NameChangedEvent, {
      newName: name,
    });
  }

  @ApplyEvent(NameChangedEvent)
  applyNameChanged(event: NameChangedEvent) {
    const { newName } = event.getProps();

    this.props.name = newName;
  }
}
