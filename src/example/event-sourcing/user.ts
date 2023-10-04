import { AggregateBase } from '#core/aggregate';
import { CommandBase } from '#core/command';
import { DomainEventBase } from '#core/domain-event';
import { Aggregate, ApplyEvent, ProcessCommand } from '#decorators/aggregate';
import { Command } from '#decorators/command';
import { DomainEvent } from '#decorators/domain-event';

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
  get name() {
    return this.props.name;
  }

  get age() {
    return this.props.age;
  }

  @ProcessCommand(ChangeNameCommand)
  processChangeNameCommand(command: ChangeNameCommand) {
    if (command.name === 'Vu') throw new Error('Cannot change name to Vu');

    return NameChangedEvent.newEvent(this.id, {
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
