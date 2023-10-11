import { AggregateBase } from '#core/aggregate';
import { CommandBase } from '#core/command';
import { DomainEventBase } from '#core/domain-event';
import { Aggregate, ApplyEvent, ProcessCommand } from '#decorators/aggregate';
import { Command } from '#decorators/command';
import { DomainEvent } from '#decorators/domain-event';
import { ToObject } from '#decorators/to-object';
import { Transform } from 'class-transformer';

export class ChangeNameCommandProps {
  name: string;
}

@Command(ChangeNameCommandProps, 'user.change_name')
export class ChangeNameCommand extends CommandBase<ChangeNameCommandProps> {
  get name() {
    return this.props.name;
  }
}

export class NameChangedEventProps {
  newName: string;
}

@DomainEvent(NameChangedEventProps, 'user.name_changed')
export class NameChangedEvent extends DomainEventBase<NameChangedEventProps> {
  get newName() {
    return this.props.newName;
  }
}

export class UserProps {
  name: string;
  age: number;
}

@Aggregate(UserProps)
export class User<P extends UserProps> extends AggregateBase<P> {
  @ToObject()
  @Transform(
    ({ value }) => {
      return `#${value}#`;
    },
    { toPlainOnly: true },
  )
  get name() {
    return this.props.name;
  }

  @ToObject()
  get age() {
    return this.props.age;
  }

  @ProcessCommand(ChangeNameCommand)
  processChangeNameCommand(command: ChangeNameCommand) {
    if (command.name === 'Vu') throw new Error('Cannot change name to Vu');

    return this.newEvent(NameChangedEvent, {
      newName: command.name,
    });
  }

  @ApplyEvent(NameChangedEvent)
  applyNameChanged(event: NameChangedEvent) {
    this.updateProps(() => {
      this.props.name = event.newName;
    });
  }
}
