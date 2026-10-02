/**
 * Deep equality method to check if two objects have the same exact key value pairs
 * @param objA object
 * @param objB object
 * @returns boolean
 */

function deepEquality(objA = {}, objB = {}) {
  // check if they have the same memory ref. or if they are both equal variables in case of primitive types
  if (objA === objB) return true;

  // check if they're the required type (if they're null or not an object, return false if they don't pass the first strict equality test)
  if (
    objA === null ||
    objB === null ||
    typeof objA !== "object" ||
    typeof objB !== "object"
  )
    return false;

  // get the keys
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  // check if the number of keys are equal
  if (keysA.length !== keysB.length) return false;

  // check if the name of the keys in the first object exist in the second, as well as if they're equal (recursively) if they're objects or primitive types
  for (let i = 0; i < keysA.length; i++) {
    if (
      !keysB.includes(keysA[i]) ||
      !deepEquality(objA[keysA[i]], objB[keysB[i]])
    )
      return false;
  }

  return true;
}

/**
 * Method to find the changes, additions and removals between two similar objects
 * @param {object} oldObj
 * @param {object} newObj
 * @returns {object} changelogger : an object containing the changes, additions and removals between the two objects
 */
function diffObjects(oldObj = {}, newObj = {}) {
  const changeLogger = {
    changes: {
      from: {},
      to: {},
    },
    additions: {},
    removals: {},
  };
  const oldKeys = new Set(Object.keys(oldObj));
  const newKeys = new Set(Object.keys(newObj));
  // check for the removals
  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      changeLogger.removals[key] = oldObj[key];
    }
  }
  // check for changes and additions
  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      changeLogger.additions[key] = newObj[key];
    }
    // if old object already has the key, check if the value has changed
    if (oldKeys.has(key) && oldObj[key] !== newObj[key]) {
      changeLogger.changes.from[key] = oldObj[key];
      changeLogger.changes.to[key] = newObj[key];
    }
  }
  return changeLogger;
}

/**
 * Method that represents a mini class that can be used as a counter, holds increment, decrement methods as well as the ability to get the current value
 */

function createCounter() {
  let count = 0;

  return {
    increment() {
      return count++;
    },
    decrement() {
      return count--;
    },
    get value() {
      return count;
    },
  };
}

/**
 * Method to validate the values of an object based on the validation schema provided
 * @param {object} obj - the object to be validated
 * @param {object} schema - the validation schema to be used
 * @returns {object} result - an object containing a success prop and an errors prop
 * @returns {boolean} result.success - true if the object is valid, false otherwise
 * @returns {object} result.errors - a key-value array containing the errors for each field in the object
 */

function validateObject(obj = {}, schema = {}) {
  const result = {
    success: false,
    errors: [],
  };

  const objKeys = new Set(Object.keys(obj));
  const schemaKeys = new Set(Object.keys(schema));
  //   check the size
  if (schemaKeys.size !== objKeys.size) {
    result.errors.push({
      countError: "The size of your object isn't the same as it's validator",
    });
    return result;
  }

  // evaluate the presence of an object property and it's type using the schema provided
  for (const key of schemaKeys) {
    if (!objKeys.has(key)) {
      result.errors.push({
        key: `${key} is missing from the object`,
      });
    }

    if (typeof obj[key] !== String(schema[key]).toLowerCase()) {
      result.errors.push({
        key: `${key} has an invalid type : expected ${schema[key]} but received ${typeof obj[key]}`,
      });
    }
  }

  result.success = true;
  return result;
}

const schema = { name: "string", age: "number", isAdmin: "boolean" };
console.log(validateObject({ name: "Ada", age: 21, isAdmin: false }, schema));

/**
 * Method to deeply freeze an object. Hence making it immutable
 * @param {object} obj
 * @returns {object} obj - a frozen object
 */

function deepFreeze(obj) {
  if (obj === null || typeof obj !== "object") {
    alert("This isn't a valid object");
    return;
  }

  // freeze the object at it's top layer
  Object.freeze(obj);

  const keys = Object.keys(obj);
  // check the keys one by one and freeze them IF they're objects
  for (const key of keys) {
    if (typeof obj[key] === "object") {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}
