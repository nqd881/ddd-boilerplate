import { EntityBase } from '#core/entity';
import { Entity } from '#decorators/entity';
import { Props } from '#decorators/props';

@Props()
export class VehicleProps {
  type: string;
  color: string;
}

@Entity(VehicleProps)
export class Vehicle extends EntityBase<VehicleProps> {
  get type() {
    return this.props.type;
  }

  get color() {
    return this.props.color;
  }
}
