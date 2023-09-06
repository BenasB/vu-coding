export type ValidatedInputValue<T> =
  | ValidationPending
  | ValidationSuccess<T>
  | ValidationFail;

interface ValidationPending {
  status: 'pending';
  input: string;
}

interface ValidationSuccess<T> {
  status: 'success';
  input: string;
  validValue: T;
}

interface ValidationFail {
  status: 'fail';
  input: string;
}

export type BinaryString = ('0' | '1')[];
