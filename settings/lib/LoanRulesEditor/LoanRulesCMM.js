import CodeMirror from "codemirror/lib/codemirror"

CodeMirror.defineMode("loanRulesCMM", function(config, parserConfig) {

  const indentUnit = config.indentUnit;

  const keyChars = [
    "a", // Campus
    "b", // Branch
    "c", // Collection 
    "g", // Patron Group
    "m", // Material Type
    "s", // Shelf
    "t", // Loan type,
  ]

  // const regex = new RegExp("^["+keyChars.join("")+"]\\s(?:(?![\\+:]).)*");
  const criteriaRegex = new RegExp("["+keyChars.join("")+"]");
  const commentRegex = new RegExp(/^\//);
  const state = {};

  return {

    startState: function() {
      return {
        comment: false,
      }
    },

    token: function(stream, state) {
      

      let tokenClass;

      // comment
      const maybeComment= stream.match(commentRegex);
      if (maybeComment) {
        stream.skipToEnd();
        state.comment = true;
        return 'comment';
      }

      // Rule
      const maybeRule = stream.match('#');
      if (maybeRule) {
          stream.eatWhile((char) => !commentRegex.test(char) );
          state.comment = false;
          if(!stream.eol()) {
            stream.backUp(1);
          }
          return 'rule';
      }

      // criteria
      const maybeCriteria = stream.match(/^(\w)\b/);// non-word character followed by character.

      if (maybeCriteria) {
        if(criteriaRegex.test(maybeCriteria[1])) {
          const prevChar = stream.string.charAt(stream.start-1);
          if (prevChar === ' ' || prevChar === '') {
            state.comment = false;
            tokenClass = maybeCriteria[1];
            return tokenClass;
          }
        }
      } 

      stream.next();

      
 
      
      // const match = stream.match(regex);

      // if(match) {
      //   tokenClass = match[0][0];
      // } else { 
      //   stream.next();
      // }

      return tokenClass ? tokenClass : null;
    }
  };
});