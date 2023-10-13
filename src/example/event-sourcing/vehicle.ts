import { EntityBase } from '#core/entity';
import { Entity } from '#decorators/entity';
import { ToObject } from '#decorators/to-object';

@ToObject()
export class VehicleProps {
  type: string;
  color: string;
}

@Entity(VehicleProps)
export class Vehicle extends EntityBase<VehicleProps> {
  // @ToObject()
  get type() {
    return this.props.type;
  }

  // @ToObject()
  get color() {
    return this.props.color;
  }
}
