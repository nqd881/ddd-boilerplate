export class PropsEnvelope<M extends object, P extends object> {
  private _metadata: M;
  private _props: P;

  constructor(metadata: M, props: P) {
    this._metadata = metadata;
    this._props = props;
  }

  getPropsSchema() {}
}
