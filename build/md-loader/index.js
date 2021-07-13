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

  // if (lang && hljs.getLanguage(lang)) {
  //   try {
  //     let code = hljs.highlight(lang, str, true).value
  //     return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
  //   } catch (__) { }
  // }
  // return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>';
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

markdown.core.ruler.push('render', ({ tokens, idx }) => {
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
    } else if (token.info === 'tsx') {
      sourceCode = token.content;
      code = '````jsx\n' + token.content + '````';
      template = token.content;//getDomHtml(token.content, 'template');
      token.content = '';
      token.type = 'html_block';
    } else {
      // var aIndex = tokens[idx].attrIndex('target');

      // if (aIndex < 0) {
      //   tokens[idx].attrPush(['target', '_blank']); // 添加新属性
      // } else {
      //   tokens[idx].attrs[aIndex][1] = '_blank';    // 替换已经存在的属性值
      // }
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
  descRef = React.createRef()
  componentDidMount() {
    let mountNode = this.descRef.current
    ${cns}
  }
  render(){
    let codeHtml = \`${codeHtml}\`,
    source = \`${source}\`,
    cnHtml = \`${cnHtml}\`;
    
    return (<Demo description={cnHtml} code={codeHtml} sourceCode={source}>
      <div className="k-content" ref={this.descRef}></div>
      </Demo>)
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
  if (md.indexOf('<Demo') >= 0) {
    return callback(null, md)
  }
  md = md
    .replace(/{/g, '{"{"{')
    .replace(/}/g, '{"}"}')
    .replace(/{"{"{/g, '{"{"}')
    .replace(/(\n)/g, '{"\\n"}') //  react 里 pre 代码换行
    // .replace(/(\n)/g, '')
    .replace(/<table>{"\\n"}/g, '<table>')
    .replace(/<thead>{"\\n"}/g, '<thead>').replace(/<\/thead>{"\\n"}/g, '</thead>')
    .replace(/<tbody>{"\\n"}/g, '<tbody>').replace(/<\/tbody>{"\\n"}/g, '</tbody>')
    .replace(/<th>{"\\n"}/g, '<th>').replace(/<\/th>{"\\n"}/g, '</th>')
    .replace(/<td>{"\\n"}/g, '<td>').replace(/<\/td>{"\\n"}/g, '</td>')
    .replace(/<tr>{"\\n"}/g, '<tr>').replace(/<\/tr>{"\\n"}/g, '</tr>')
    .replace(/class=/g, 'className=');
  md = `
  ${doImports}
  export default function() { 
    return (<div className="typo">${md}</div>); 
  };`
  callback(null, md)
};