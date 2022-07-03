const metaDataKey = Symbol();
const ROUTE_ARGS_METADATA = '__routeArguments__';

export const UseMiddleware = (...arg: Array<string>) => (
  target,
  propertyValue,
  props: PropertyDescriptor,
) => {
  const funcObj = Reflect.getMetadata(metaDataKey, target);
  const middlewares = arg.map((item) => funcObj[item]);
  const temp = props.value;

  const reqArgMetaData = Object.keys(
    Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      target.constructor,
      propertyValue,
    ) || {},
  );

  const reqIndex = reqArgMetaData.reduce((cum, item) => {
    if (/0:\d+/.test(item)) {
      const argIndex = item.match(/(?<=0:)\d+$/g)[0];
      if (!argIndex) throw Error('invalid request index');
      return Number(argIndex);
    } else {
      return cum;
    }
  }, 0);

  const respIndex = reqArgMetaData.reduce((cum, item) => {
    if (/1:\d+/.test(item)) {
      const argIndex = item.match(/(?<=1:)\d+$/g)[0];
      if (!argIndex) throw Error('invalid response index');
      return Number(argIndex);
    } else {
      return cum;
    }
  }, 0);

  props.value = async function (...funcArgs) {
    const req = funcArgs[reqIndex];
    const resp = funcArgs[respIndex];

    for (const index in middlewares) {
      try {
        await middlewares[index].apply(this, [
          req,
          resp,
          () => {
            throw 'exited: ' + Object.keys(funcObj)[index];
          },
        ]);
      } catch (exp) {
        console.log(exp);
        if (!/exited/g.test(exp)) throw exp;
      }
    }
    try {
      await temp.apply(this, [
        ...funcArgs,
        () => {
          throw 'exited main route';
        },
      ]);
    } catch (exp) {
      console.log(exp);
      if (!/exited/g.test(exp)) throw exp;
    }
  };
};

export function Middleware(target, propName, prop: PropertyDescriptor) {
  const funcObj = Reflect.getMetadata(metaDataKey, target) || {};
  Reflect.defineMetadata(
    metaDataKey,
    { ...funcObj, [propName]: prop.value },
    target,
  );
}
