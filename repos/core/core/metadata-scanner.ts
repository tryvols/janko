/**
(The MIT License)

Copyright (c) 2017-2022 Kamil Mysliwiec <https://kamilmysliwiec.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { injectable } from 'inversify';
import { iterate } from 'iterare';
import { isFunction, isNil } from 'lodash';
import { isConstructor } from '../helpers/is-constructor';

@injectable()
export class MetadataScanner {
    public scanFromPrototype<R = any>(
        prototype: object,
        callback: (name: string) => R,
    ): R[] {
        const methodNames = new Set(this.getAllFilteredMethodNames(prototype));
        return iterate(methodNames)
        .map(callback)
        .filter(metadata => !isNil(metadata))
        .toArray();
    }

    *getAllFilteredMethodNames(prototype: {[key: string]: any;}): IterableIterator<string> {
        const isMethod = (prop: string) => {
            const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
            if (descriptor.set || descriptor.get) {
                return false;
            }
            return !isConstructor(prop) && isFunction(prototype[prop]);
        };

        do {
            yield* iterate(Object.getOwnPropertyNames(prototype))
                .filter(isMethod)
                .toArray();
        } while (
            (prototype = Reflect.getPrototypeOf(prototype)) &&
            prototype !== Object.prototype
        );
    }
}
