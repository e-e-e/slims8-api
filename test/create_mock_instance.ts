export function createMockInstance<T>(ctor: new (...args: any[]) => T): jest.Mocked<T> {
  const klass = Object.create(ctor.prototype);

  stubWalk(klass);
  return klass as jest.Mocked<T>;

  function stubWalk(obj: object, context?: any, seen?: any) {
    if (obj === Object.prototype) {
      return;
    }

    seen = seen || {};
    context = context || obj;

    Object.getOwnPropertyNames(obj).forEach(function (prop) {
      if (!seen[prop]) {
        seen[prop] = true;
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        if (prop !== 'constructor' && descriptor && typeof descriptor.value === 'function') {
          context[prop] = jest.fn().mockName(`${klass.constructor.name}::${prop}`);
        }
      }
    });

    const proto = Object.getPrototypeOf(obj);
    if (proto) {
      stubWalk(proto, context, seen);
    }
  }
}