import 'egg';

declare module 'egg' {
    interface Request {
        domain: string;
    }
}

