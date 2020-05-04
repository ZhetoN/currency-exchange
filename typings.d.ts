// tslint:disable:member-ordering
// tslint:disable:adjacent-overload-signatures

/**
 * Basic types defined in @angular/forms + rxjs/Observable
 */
type FormGroup = import ('@angular/forms').FormGroup;
type FormArray = import ('@angular/forms').FormArray;
type FormControl = import ('@angular/forms').FormControl;
type AbstractControl = import ('@angular/forms').AbstractControl;
type Observable<T> = import ('rxjs').Observable<T>;

/**
 * Why Angular Team doesn't define it?
 * @link https://github.com/angular/angular/blob/7.2.7/packages/forms/src/model.ts#L15-L45
 */
type STATUS = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

/**
 * string is added only because Angular base class use string instead of union type
 * @link https://github.com/angular/angular/blob/7.2.7/packages/forms/src/model.ts#L196
 */
type STATUSs = STATUS | string;

/**
 * Override types with strict typed interfaces + some type tricks to compose interface.
 * @link https://github.com/Microsoft/TypeScript/issues/16936
 */
interface AbstractControlTyped<T> extends AbstractControl {
  /** Base props and methods common to all FormControl/FormGroup/FormArray */
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V extends T>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V extends Partial<T>>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V extends Partial<T>>(value?: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

interface FormControlTyped<T> extends FormControl {
  /** Copied from AbstractControlTyped<T> because TS does not support multiple extends FormControl, AbstractControlTyped<T> */
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V extends T>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V extends Partial<T>>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V extends Partial<T>>(value?: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

interface FormGroupTyped<T> extends FormGroup {
  /** Props and methods specific for FormGroup */
  controls: { [P in keyof T]: T[P] extends Array<any> ? FormArrayTyped<T[P] extends Array<infer R> ? R : T> : FormControlTyped<T[P]>};
  registerControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): AbstractControlTyped<T[P]>;
  registerControl<V = any>(name: string, control: AbstractControlTyped<V>): AbstractControlTyped<V>;
  addControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): void;
  addControl<V = any>(name: string, control: AbstractControlTyped<V>): void;
  removeControl(name: keyof T): void;
  removeControl(name: string): void;
  setControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): void;
  setControl<V = any>(name: string, control: AbstractControlTyped<V>): void;
  contains(name: keyof T): boolean;
  contains(name: string): boolean;
  get<P extends keyof T>(path: P): AbstractControlTyped<T[P]>;
  getRawValue(): T & { [disabledProp in string | number]: any };

  /** Copied from AbstractControlTyped<T> because TS does not support multiple extends FormGroup, AbstractControlTyped<T> */
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V extends T>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V extends Partial<T>>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V extends Partial<T>>(value?: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

interface FormArrayTyped<T> extends FormArray {
  /** Props and methods specific for FormArray */
  controls: FormControlTyped<T>[];
  at(index: number): AbstractControlTyped<T>;
  push<V = AbstractControlTyped<T>>(ctrl: AbstractControlTyped<T>): void;
  insert<V = AbstractControlTyped<T>>(index: number, control: AbstractControlTyped<T>): void;
  setControl<V = AbstractControlTyped<T>>(index: number, control: AbstractControlTyped<T>): void;
  getRawValue(): T[];

  /** Copied from AbstractControlTyped<T> because TS does not support multiple extends FormArray, AbstractControlTyped<T> */
  readonly value: T[];
  valueChanges: Observable<T[]>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V extends T[]>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V extends Partial<T>[]>(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V extends Partial<T>[]>(value?: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

interface GuardedMap<K, T, KnownKeys extends K = never> extends Map<K, T> {
  get(k: KnownKeys): T;
  get(k: K): T | undefined;
  has<S extends K>(k: S): this is GuardedMap<K, T, S>;
}
