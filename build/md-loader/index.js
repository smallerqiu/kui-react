'use strict';
const anchor = require('markdown-it-anchor')
const hljs = require('highlight.js');
const cheerio = require('cheerio');
const Token = require('markdown-it/lib/token');

const replaceDelimiters = function (str) {
  return str.replace(/({{|}})/g, '<span>$1</span>');
};

const renderHighlight = function (str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return '';
  }

  try {
    return replaceDelimiters(hljs.highlight(lang, str, true).value);
  } catch (err) { }
};

const getDomHtml = (str, tag) => {
  const $ = cheerio.load(str, { decodeEntities: false, xmlMode: true, });  //xmlMode 为false 闭合标签 编译错误 
  if (!tag) { return str; }
  return $(tag).html() || '';
};

const markdown = require('markdown-it')({
  html: true,
  breaks: true,
  xhtmlOut: true,
  highlight: renderHighlight,
}).use(anchor, {
  level: 2,
  slugify: string => string.trim().split(' ').join('-'),
  permalink: true,
  permalinkClass: 'anchor',
  permalinkSymbol: '#',
  permalinkBefore: false,
})

const cnReg = new RegExp('<(cn)(?:[^<]|<)+</\\1>', 'g');
let doImports = 'import React from \'react\';\n';

markdown.core.ruler.push('render', ({ tokens }) => {
  let cn, template, code, sourceCode;

  tokens.forEach(token => {
    if (token.type === 'html_block') {
      if (token.content.match(cnReg)) {
        cn = getDomHtml(token.content, 'cn');
        token.content = ''
      }
      /* if (token.content.match(usReg)) {
           us = getDomHtml(token.content, 'us');
           token.content = '';
         } */
    }
    if (token.info === 'ts') {
      sourceCode = token.content;
      code = '````jsx\n' + token.content + '````';
      template = token.content;//getDomHtml(token.content, 'template');
      token.content = '';
      token.type = 'html_block';
    }
  });

  if (template) {
    // let data = { html: template, script, style,  cn, sourceCode, };

    let source = markdown.utils.escapeHtml(JSON.stringify(sourceCode));

    const codeHtml = code ? markdown.render(code) : '';

    const cnHtml = cn ? markdown.render(cn) : '';
    //找出 代码里的 import
    let rg = /import(.*?)(?=[\n])/g
    let imps = template.match(rg);
    let cns = template.replace(rg, '')
    let newContent = `
${doImports}
import Demo from '@/docs/components/demo/demo.jsx'
import ReactDOM from 'react-dom'
${imps.join('\n')}
export default class demo extends React.Component {
  state = {
    a : 0
  }
  render(){
    let codeHtml = \`${codeHtml}\`,
    source = \`${source}\`,
    cnHtml = \`${cnHtml}\`;
    
    const child = (<Demo description={cnHtml} code={codeHtml} sourceCode={source}>
      <div className="k-content" ref="com"></div>
      </Demo>)

    setTimeout(()=>{
      let mountNode = this.refs.com
      ${cns}
    })
    return child
  }
}`;

    const tk = new Token('html_block', '', 0);
    tk.content = newContent;
    tokens.push(tk);
  }
})

/**
 * Main function
 * @param   {String}  content   Markdown file content
 */
module.exports = function loader(content) {
  const callback = this.async();
  let md = markdown.render(content)


  if (md.indexOf('import') >= 0) {

    // md = md
    //   .replace(/{/g, '{"{"{')
    //   .replace(/}/g, '{"}"}')
    //   .replace(/{"{"{/g, '{"{"}')
    //   .replace(/(\n)/g, '{"\\n"}')
    //   .replace(/class=/g, 'className=');
    return callback(null, md)
  }
  md = md.replace(/class=/g, 'className=');

  md = `
  ${doImports}
  export default function() { return (<div className="typo">${md}</div>); };`
  callback(null, md)
  // parser
  //   .parse(content)
  //   .then(build)
  //   .then((component) => callback(null, component))
  //   .catch(callback);

  // callback(null, null)
};