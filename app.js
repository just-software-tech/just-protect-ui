import { div, input, i, button, span, find, findOne } from "./framework";

let itemsCount = 3;
let salt="";

export const handleUp = (e) => {
  const [node, value] = getStateX(e);

  if (value >= itemsCount) {
    node.setAttribute("class", "p" + 1);
  } else {
    node.setAttribute("class", "p" + (value + 1));
  }
};

export const handleDown = (e) => {
  const [node, value] = getStateX(e);

  if (value <= 1) {
    node.setAttribute("class", "p" + itemsCount);
  } else {
    node.setAttribute("class", "p" + (value - 1));
  }
};

export const getStateX = (e) => {
  let [cx, cv] = getStateX2(e);
  if (cx == null) {
    [cx, cv] = getStateX2(e.parentNode);
  }

  return [cx, cv];
};

export const getStateX2 = (e) => {
  let cx;
  let cv;
  for (const child of e.parentNode.children) {
    let tv = child.attributes.class ? child.attributes.class.value : "";
    let atv = tv.split(" ");

    if (
      child.attributes.class &&
      (tv.indexOf("d ") == 0 || tv.indexOf(" d ") > -1)
    ) {
      let c = Number.parseInt(
        child.children[0].attributes.class.value.substring(1)
      );
      cv = c;
      cx = child.children[0];
    }
  }
  return [cx, cv];
};

export const setUpColumn = (items,name) => {
    itemsCount = items
  const children = [];
  for (let x = 0; x < itemsCount; x++) {
    children.push(() => span({}, []));
  }

  return div(
    {
      class: "m",
    },
    [
      button(
        {
          class: "bu",
          click: (e) => handleUp(e.target),
        },
        [i({ class: "fa-solid fa-caret-up" }, [])]
      ),
      div(
        {
          class: "d "+name,
        },
        [div({ class: "p1" }, [children])]
      ),
      button(
        {
          class: "bd",
          click: (e) => handleDown(e.target),
        },
        [i({ class: "fa-solid fa-caret-down" }, [])]
      ),
    ]
  );
};

let rootElement = {};
// const defaultHeaders  = {
//     "clientId":"111",
//     "clientKey":"V5B940Klo47cUmaExRUiVBxQIlvhUvqkBDl5rO5NvYjhUq3xDgqX9EO4kN+g7/RnVOES0QMXl14VOdW/KrC/KMzvxdGLysihI131+00pFwR13HUYicZyD5OhB5vfPu999gKmi2m17KrDTtBQfxwG5L0KJOBQHb8W9KegR3TS0GGy991HD0WcF08ADVNGuGFdg8h72RUt55pvoB7dEqN3cp4VetN9FzUIQYWpTodXLHzQeJQvHsuCnL/YgtcZtSgyntqIeATqvOWOI4T/3+e7PlJRQBFi1BqhjB82nxbwEQzy5k83q9b5KJkaBrdNK0nkfdJvu8aK8RB4ylCU82RwaM6xW+QSlEbfykWLCwYCK3tdah40HNCFCiO5Qa1RvgkQQsYPq8kqjsZE44Apd4JqmcVU28qNHcORwqU6qNBh/0SEktWHjsO9eedA1+iF+WHGhHPlkuJEddEtYH1VbVbY7kqAs2/gd9U9aKvseND7/cTriYXlXuQPlYCHfHzmprPR"
// };

let clientId="";
let clientKey="";

const url = "http://localhost:5171/request"
const baseurl = "http://localhost:5171/"

export const start = async () => {
    
    rootElement.appendChild(span({class:"loader"},[]))
    

    let data = await fetch(url+"?salt="+salt,{
        headers:{
            "clientId":clientId,
            "clientKey":clientKey
        }
    }).then((data)=> data.json())
    .then((data)=> {

        findOne(document,"head").appendChild(
            component("script",{
                src: baseurl+ data.name+".css"
            },[])
        )
        
        rootElement.textContent = ""

        let question = div({class:"question"},[
            span({class:"strong"},[],"put logos in order"),
            span({},[],data.items)
        ])
        rootElement.appendChild(question)

        let items = data.items.split(',')
    
        for (let ix = 0; ix < items.length; ix++) {
            let app = setUpColumn(data.count,data.name);
            rootElement.appendChild(app);
          }
        
          let buttondiv = div({
                class:"validate"
          },[
            button({                
                click:async (e)=>{
                    
                    Function("val",rootElement.getAttribute("data-call"))({val:nobot.getValue(),key:data.requestId})
                }
            },[
                i({
                    class:"fa fa-check"
                },[])
            ])
          ])
        rootElement.appendChild(buttondiv)
    })

   
      
}

export const setUp = (el) => {
  rootElement = el;
  const asAttr = el.attributes["autostart"]
  
  clientId = el.getAttribute("clientId")
  clientKey = el.getAttribute("clientKey")
  salt = el.getAttribute("salt")

  global.nobot = {
    getValue : () => {
        let value = find(rootElement, ".m .d div")
        .map((x) => (Number.parseInt(x.getAttribute("class").substring(1))-1))
        .join(",")
        
        return value;
    },
    start: start
  }


  if(asAttr && asAttr.value && asAttr.value == "false"){
        return
  }

  start()

};

