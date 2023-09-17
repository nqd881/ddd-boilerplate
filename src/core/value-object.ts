import { ValueObjectClass } from '#types/value-object.type';
import _ from 'lodash';
import { VALUE_OBJECT_TYPE } from 'src/decorators';
import { Constructor } from 'type-fest';

export abstract class ValueObject<P> {
  private readonly _type: string;
  protected readonly _props: Readonly<P>;

  constructor(type: string, props: P) {
    this.validateProps(props);

    this._type = type;
    this._props = props;
  }

  static getValueObjectType<T extends AnyValueObject>(this: ValueObjectClass<T>) {
    return Reflect.getMetadata(VALUE_OBJECT_TYPE, this) ?? this.name;
  }

  static initValueObject<T extends AnyValueObject>(
    this: ValueObjectClass<T>,
    props: GetValueObjectProps<T>,
  ) {
    const valueObjectType = this.getValueObjectType();

    return new this(valueObjectType, props);
  }

  static isValueObject(obj: any) {
    return obj instanceof ValueObject;
  }

  abstract validateProps(props: P): void;

  equalsType(obj: ValueObject<P>) {
    // return obj instanceof this.constructor;
    return this.type === obj.type;
  }

  equals(obj: ValueObject<P>) {
    if (obj === null || obj === undefined) return false;

    if (!this.equalsType(obj)) return false;

    return JSON.stringify(this.props) === JSON.stringify(obj.props);
  }

  cloneWith(props: Partial<P>) {
    const clonedProps = _.cloneDeep(this.props);

    return new (this.constructor as Constructor<ValueObject<P>>)(
      _.merge(clonedProps, props),
    ) as this;
  }

  clone() {
    return this.cloneWith({});
  }

  get type() {
    return this._type;
  }

  get props() {
    return this._props;
  }
}

export type AnyValueObject = ValueObject<any>;

export type GetValueObjectProps<T extends AnyValueObject> = T extends ValueObject<infer Props>
  ? Props
  : any;

export type ValueObjectConstructorParams<T extends AnyValueObject> = ConstructorParameters<
  typeof ValueObject<GetValueObjectProps<T>>
>;
