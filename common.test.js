// node site/common.test.js — проверка разбора контакта из формы.
const assert = require('assert');
const { parseContact } = require('./common.js');

assert.deepStrictEqual(parseContact('+7 (999) 123-45-67'), { type: 'phone', value: '+79991234567' });
assert.deepStrictEqual(parseContact('89991234567'), { type: 'phone', value: '+79991234567' });
assert.deepStrictEqual(parseContact('999 123 45 67'), { type: 'phone', value: '+79991234567' });
assert.deepStrictEqual(parseContact('@ivan_cars'), { type: 'telegram', value: '@ivan_cars' });
assert.deepStrictEqual(parseContact('t.me/ivan_cars'), { type: 'telegram', value: '@ivan_cars' });
assert.strictEqual(parseContact('12345'), null);
assert.strictEqual(parseContact('@abc'), null);
assert.strictEqual(parseContact('+1 555 123 4567 89'), null);
assert.strictEqual(parseContact(''), null);
console.log('parseContact: ok');
