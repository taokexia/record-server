import { Request } from 'egg';

const DOMAIN = Symbol('Request#domain');
export default {
  get domain() {
    if (!this[DOMAIN]) {
      const { ctx } = this;
      const host = ctx!.host.indexOf(':') ? ctx!.host.split(':')[0] : ctx!.host;
      this[DOMAIN] =
        host.split('.').length > 1
          ? host
            .split('.')
            .slice(-2)
            .join('.')
          : host;
    }
    return this[DOMAIN];
  },
} as Partial<Request>;
