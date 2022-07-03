import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsEqualTo<T>(
    property: keyof T,
    validationOptions?: ValidationOptions,
  ) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'isEqualTo',
        target: object.constructor,
        propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return value === relatedValue;
          },
  
          defaultMessage(args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            return `${propertyName} must match ${relatedPropertyName} exactly`;
          },
        },
      });
    };
  }
  
  export function ValidateDiscount<T> (
    cost: keyof T,
    validationOptions?: ValidationOptions
  ) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'ValidateDiscount',
        target: object.constructor,
        propertyName,
        constraints: [cost],
        options: validationOptions,
        validator: {
          validate(value: number, args: ValidationArguments) {
            const [costP] = args.constraints;
            const cost = (args.object as any)[costP];

            return value <= cost;
          },
          defaultMessage() {
            return 'Discounted price cannot be more than the cost price'
          }
        }
      })
    }
  }

  export function ValidateDiscountN<T> (
    cost: keyof T,
    validationOptions?: ValidationOptions
  ) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'ValidateDiscount',
        target: object.constructor,
        propertyName,
        constraints: [cost],
        options: validationOptions,
        validator: {
          validate(value: number, args: ValidationArguments) {
            const [costP] = args.constraints;
            const cost = (args.object as any)[costP];

            return value <= cost
          },
          defaultMessage() {
            return 'Discounted price cannot be more than the cost price'
          }
        }
      })
    }
  }
