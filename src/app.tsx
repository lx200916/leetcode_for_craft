// @ts-ignore

import * as React from "react"
import * as ReactDOM from 'react-dom'
import craftXIconSrc from "../icon.png"
import   "turndown"
import  TurndownService from "turndown";
import {CraftTextRun, TextHighlightColor} from "@craftdocs/craft-extension-api";
import  axios from "axios";
import {data, info} from "autoprefixer";
const TagColors:TextHighlightColor[] = [ "yellow","lime", "green", "cyan", "blue", "purple", "pink", "red"]
interface Info{
  translatedTitle: string;
    translatedContent: string;
    difficulty: string;
    topicTags: any[];
    codeSnippets: any[];
  questionFrontendId: string;

}
const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();
  const [info, setinfo] = React.useState(null as Info | null);
  const [lang, setlang] = React.useState(0);

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);
  React.useEffect(() => {
    getTurnDown()
    getAxios()
    // @ts-ignore
  },[])
  function getAxios() {
    let axiosInstance = axios.create();
    axiosInstance.defaults.withCredentials= true;

    // axiosInstance.get("https://leetcode.cn/problemset/all/").then(r => {});
    // @ts-ignore
    window.axios = axiosInstance;


  }
  async function  getContent() {
    try {
      // @ts-ignore
      let urlString = document.getElementById("message").value;
      if (urlString === "") {
        return;
      }
      let params = urlString.split("/")
      let slug: string = params[4]
      let resp = (await axios.get(`https://lcproxy.teletest.workers.dev/${slug}`)).data
//       let data = `{
//   "operationName": "questionData",
//   "variables": { "titleSlug": "${slug}" },
//   "query": "query questionData($titleSlug: String\u0021) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    questionFrontendId\\n    categoryTitle\\n    boundTopicId\\n      translatedTitle\\n    translatedContent\\n    isPaidOnly\\n    difficulty\\n     topicTags {\\n      name\\n      slug\\n      translatedName\\n      __typename\\n    }\\n   codeSnippets {\\n      lang\\n      langSlug\\n      code\\n      __typename\\n    }\\n     hints\\n     }\\n}\\n"
// }`
//       //@ts-ignore
//       let resp = (await window.axios.post("https://leetcode.cn/graphql", data, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })).data
//       await craft.dataApi.addBlocks([craft.blockFactory.textBlock({content: [{text: resp}]})]);

      insertContent(resp.data.question, urlString);
      setinfo(resp.data.question)
    }catch (e) {
      // @ts-ignore
      await craft.dataApi.addBlocks([craft.blockFactory.textBlock({content: [{text: e.content}]})]);

    }
  }
   const  addCodeBlock=()=>{
    if (info === null) return;
    const code = info.codeSnippets[lang].code;
    const langslug = info.codeSnippets[lang].langSlug;

    craft.dataApi.addBlocks([craft.blockFactory.codeBlock({code,language:langslug})]);
    }

  return info==null?<div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }} className={'mt-4'}>
    <img className="icon" src={craftXIconSrc} height={72} width={72} alt="CraftX logo" />

    <label htmlFor="message" className="block my-3 text-lg font-medium px-2 marker">👇 LeetCode Link  </label>
    <textarea id="message" rows={5}
              className="block p-2.5 m-2 mt-0 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="LeetCode CN Link"></textarea>

    <button onClick={getContent}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
  <span
      className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
      Get Content
  </span>
    </button>
  </div>:<div className={'mt-4 mx-3'}  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}>
    <h3 className="mb-4 font-semibold marker text-lg">🎈 添加示例代码 <span className={'highlight'}>Block</span></h3>
    <ul className="w-full mx-24 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">

      {info.codeSnippets.map((v,i)=><li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center pl-3">
          <input  type="radio" value={i} name="list-radio"
                  onClick={()=>setlang(i)}
                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label htmlFor="list-radio-license"
                   className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
              {v.lang}
            </label>
        </div>
      </li>)}


    </ul>
    <button onClick={addCodeBlock}
            className="relative inline-flex items-center justify-center p-0.5 m-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
  <span
      className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
      Add Code Block
  </span>
    </button>
  </div>;
}

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener(env => setIsDarkMode(env.colorScheme === "dark"));
  }, []);

  return isDarkMode;
}

function getTurnDown(){
  let turndownService = new TurndownService();
  turndownService.addRule('strikethrough', {
    filter: ['strong', 'b',],
    replacement: function (content) {
      return ' **' + content + '** '
    }
  });
  turndownService.addRule('emthrough',{
    filter: ['em', 'i'],
    replacement: function (content) {
      return ' *' + content + '* '
    }
  })

  //@ts-ignore
  window.turndown=turndownService;
}
// const text=`<p>给定两个大小相等的数组&nbsp;<code>nums1</code>&nbsp;和&nbsp;<code>nums2</code>，<code>nums1</code>&nbsp;相对于 <code>nums2</code> 的<em>优势</em>可以用满足&nbsp;<code>nums1[i] &gt; nums2[i]</code>&nbsp;的索引 <code>i</code>&nbsp;的数目来描述。</p>
//
// <p>返回 <font color="#c7254e" face="Menlo, Monaco, Consolas, Courier New, monospace" size="1"><span style="background-color: rgb(249, 242, 244);">nums1</span></font>&nbsp;的<strong>任意</strong>排列，使其相对于 <code>nums2</code>&nbsp;的优势最大化。</p>
//
// <p>&nbsp;</p>
//
// <p><strong>示例 1：</strong></p>
//
// <pre>
// <strong>输入：</strong>nums1 = [2,7,11,15], nums2 = [1,10,4,11]
// <strong>输出：</strong>[2,11,7,15]
// </pre>
//
// <p><strong>示例 2：</strong></p>
//
// <pre>
// <strong>输入：</strong>nums1 = [12,24,8,32], nums2 = [13,25,32,11]
// <strong>输出：</strong>[24,32,8,12]
// </pre>
//
// <p>&nbsp;</p>
//
// <p><strong>提示：</strong></p>
//
// <ul>
// \t<li><code>1 &lt;= nums1.length &lt;= 10<sup>5</sup></code></li>
// \t<li><code>nums2.length == nums1.length</code></li>
// \t<li><code>0 &lt;= nums1[i], nums2[i] &lt;= 10<sup>9</sup></code></li>
// </ul>
// `
// const tags =[
//   {
//     "name": "Greedy",
//     "slug": "greedy",
//     "translatedName": "贪心",
//     "__typename": "TopicTagNode"
//   },
//   {
//     "name": "Array",
//     "slug": "array",
//     "translatedName": "数组",
//     "__typename": "TopicTagNode"
//   },
//   {
//     "name": "Two Pointers",
//     "slug": "two-pointers",
//     "translatedName": "双指针",
//     "__typename": "TopicTagNode"
//   },
//   {
//     "name": "Sorting",
//     "slug": "sorting",
//     "translatedName": "排序",
//     "__typename": "TopicTagNode"
//   }
// ]
function insertContent(info:Info,url:string){
  try {
    craft.dataApi.addBlocks([craft.blockFactory.textBlock({content:[{text:`LeetCode #${info.questionFrontendId} ${info.translatedTitle}`,isBold:true}]})]);
    // @ts-ignore
    const md=window['turndown'].turndown(info.translatedContent)
    const blocks=craft.markdown.markdownToCraftBlocks(md);

    for (let block of blocks) {
      if (block.type === "textBlock") {
        for (let subBlock of block.content) {
          if (typeof(subBlock)=='string') continue;
          if (subBlock.isItalic ) {
            subBlock.highlightColor = 'sunsetGradient';
          }
          if (subBlock.isBold) {
            subBlock.highlightColor = 'beachGradient';
          }
        }
      }
    }
    const tagBlocks:CraftTextRun[] = [];
    info.topicTags.forEach((tag,index)=> {
      tagBlocks.push({
        text: `#${tag.translatedName}`,
        highlightColor: TagColors[index % 8],
        isBold: true,
      });
      tagBlocks.push({
        text: '  ',
      });
    });
    blocks.push(craft.blockFactory.textBlock({content: tagBlocks}));
    blocks.push(craft.blockFactory.urlBlock({url:url,layoutStyle:'small',title:info.translatedTitle}));

    craft.dataApi.addBlocks(blocks);
  }catch (e) {
    // @ts-ignore
    craft.dataApi.addBlocks([craft.blockFactory.textBlock({content: [{text: e.toString()}]})]);

  }


}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'))
}
