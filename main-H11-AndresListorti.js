// Homework 11
// https://chivalrous-camelotia-9aa.notion.site/Homework-11-90bdd1a9c71e44d8ae76a52a8ca3274c

/**
 * My JSON Parse
 * A function that parses a JSON-formatted string and returns the corresponding JavaScript object.
 * This implementation uses regular expressions to tokenize and parse the input string.
 */
function myJSONParse(jsonString) {
    let index = 0;  // Tracks the current position in the jsonString
  
    /**
     * Main function to parse a value. Determines the type of the value and delegates to the corresponding parse function.
     * @returns {any} - The parsed JavaScript value.
     */
    function parseValue() {
      consumeWhitespace();
      let char = jsonString[index];
      if (char === '{') {        // Object
        return parseObject();
      } else if (char === '[') { // Array
        return parseArray();
      } else if (char === '"') { // String
        return parseString();
      } else if (char === 't' || char === 'f' || char === 'n') { // Boolean or Null
        return parseLiteral();
      } else if (/\d|-/.test(char)) { // Number
        return parseNumber();
      } else {
        throw new SyntaxError(`Invalid JSON format at position ${index}`);
      }
    }
  
    /**
     * Function to parse an object
     * @returns {Object} - The parsed JavaScript object.
     */
    function parseObject() {
      const obj = {};
      index++; // Skip '{'
      consumeWhitespace();
      if (jsonString[index] === '}') { // Handle empty object
        index++;
        return obj;
      }
      while (true) {
        const key = parseString(); // Parse the key
        consumeWhitespace();
        if (jsonString[index] !== ':') {
          throw new SyntaxError(`Expected ":" in object at position ${index}`);
        }
        index++; // Skip ':'
        const value = parseValue(); // Parse the value
        obj[key] = value;
        consumeWhitespace();
        if (jsonString[index] === ',') {
          index++;
          consumeWhitespace();
        } else if (jsonString[index] === '}') {
          index++;
          break;
        } else {
          throw new SyntaxError(`Expected "," or "}" in object at position ${index}`);
        }
      }
      return obj;
    }
  
    /**
     * Function to parse an array
     * @returns {Array} - The parsed JavaScript array.
     */
    function parseArray() {
      const arr = [];
      index++; // Skip '['
      consumeWhitespace();
      if (jsonString[index] === ']') { // Handle empty array
        index++;
        return arr;
      }
      while (true) {
        const value = parseValue(); // Parse the value
        arr.push(value);
        consumeWhitespace();
        if (jsonString[index] === ',') {
          index++;
          consumeWhitespace();
        } else if (jsonString[index] === ']') {
          index++;
          break;
        } else {
          throw new SyntaxError(`Expected "," or "]" in array at position ${index}`);
        }
      }
      return arr;
    }
  
    /**
     * Function to parse a string
     * @returns {string} - The parsed JavaScript string.
     */
    function parseString() {
      const strMatch = /^"([^"\\]*(?:\\.[^"\\]*)*)"/.exec(jsonString.slice(index));
      if (!strMatch) {
        throw new SyntaxError(`Invalid string format at position ${index}`);
      }
      index += strMatch[0].length; // Skip the entire matched string
      return strMatch[1].replace(
        /\\u(\d{4})|\\(.)/g, 
        (match, unicode, char) => {
          if (unicode) {
            return String.fromCharCode(parseInt(unicode, 16));
          }
          const escapes = { '"': '"', '\\': '\\', '/': '/', 'b': '\b', 'f': '\f', 'n': '\n', 'r': '\r', 't': '\t' };
          return escapes[char] || char;
        }
      );
    }
  
    /**
     * Function to parse a literal (true, false, null)
     * @returns {boolean|null} - The parsed literal value.
     */
    function parseLiteral() {
      const literals = {
        'true': true,
        'false': false,
        'null': null
      };
      for (let lit in literals) {
        if (jsonString.startsWith(lit, index)) {
          index += lit.length;
          return literals[lit];
        }
      }
      throw new SyntaxError(`Invalid literal at position ${index}`);
    }
  
    /**
     * Function to parse a number
     * @returns {number} - The parsed JavaScript number.
     */
    function parseNumber() {
      const numMatch = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(jsonString.slice(index));
      if (numMatch) {
        index += numMatch[0].length;
        return parseFloat(numMatch[0]);
      }
      throw new SyntaxError(`Invalid number format at position ${index}`);
    }
  
    /**
     * Function to consume whitespace characters (spaces, tabs, etc.)
     */
    function consumeWhitespace() {
      const whitespaceMatch = /^\s*/.exec(jsonString.slice(index));
      if (whitespaceMatch) {
        index += whitespaceMatch[0].length;
      }
    }
  
    const result = parseValue();
    consumeWhitespace();
    if (index !== jsonString.length) {
      throw new SyntaxError(`Unexpected end of input at position ${index}`);
    }
    return result;
  }
  
  // Test cases
  try {
    const jsonString = '{"name": "Andres", "age": 42, "city": "Buenos Aires"}';
    const jsonObject = myJSONParse(jsonString);
    console.log(jsonObject); // { name: 'Andres', age: 42, city: 'Buenos Aires' }
  } catch (e) {
    console.error(e.message);
  }
  
  try {
    const jsonStringArray = '[1, "two", false, null]';
    const jsonArray = myJSONParse(jsonStringArray);
    console.log(jsonArray); // [1, "two", false, null]
  } catch (e) {
    console.error(e.message);
  }
  
  try {
    const jsonStringComplex = '{"person": {"name": "Alexa", "age": 27}, "cities": ["Cordoba", "Mendoza"]}';
    const jsonComplexObject = myJSONParse(jsonStringComplex);
    console.log(jsonComplexObject); // {person: {name: "Alexa", age: 27}, cities: ["Cordoba", "Mendoza"]}
  } catch (e) {
    console.error(e.message);
  }
  
  try {
    console.log(myJSONParse('{"name": "John", "age":}')); // Error
  } catch (e) {
    console.error(e.message); // Expected ":" in object at position XX
  }