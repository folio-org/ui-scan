import React from 'react';
import '!style-loader!css-loader!./CodeMirrorCustom.css';
import '!style-loader!css-loader!codemirror/addon/fold/foldgutter.css';
import Codemirror from 'codemirror';
import CodeMirror from 'react-codemirror';
import './LoanRulesCMM';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/foldgutter';
import css from './LoanRulesEditor.css';

class LoanRulesEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.updateCode = this.updateCode.bind(this);

  }

  getInitialState() {
		return  {
      codeMirrorOptions: {
		  	lineNumbers: true,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: false,
        mode: 'loanRulesCMM',
        foldGutter: {rangeFinder: Codemirror.fold.indent},
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	  	},
      code: `# Setup / this applies to all rules
fallback-policy : no-circulation 
priority: t, a, b, c, s, m, g

# All branches
m newspaper: policy-c
m streaming-subscription: policy-c
    g visitor: in-house
    g undergrad: in-house
m book cd dvd + t special-items : in-house

# General rules for main and music branch
a cornell
    m newspaper: policy-d
    t special-items
        g !visitor: policy-d
        g visitor: in-house

# Exceptions across all branches
g all + t rare + m all + s all : locked`
    }
	}

  updateCode(newCode, foo, bar) {
    //console.log(newCode);
		this.setState({
			code: newCode,
		});
	}

  render() {
    return(
      <CodeMirror className={css.codeMirrorFullScreen} value={this.state.code} onChange={this.updateCode} options={this.state.codeMirrorOptions} />
    );
  }

}

export default LoanRulesEditor;