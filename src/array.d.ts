declare interface Array<T> {
    distinct(callback?: (value: T) => any): Array<T>;
}