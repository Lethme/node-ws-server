declare interface String {
    capitalize(): string;

    bind(...args: Array<string | number>): string;
}