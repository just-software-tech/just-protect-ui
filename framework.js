
export const input = (props,children,inner) => {
    return component("input",props,children,inner)
}

export const div = (props,children,inner) => {
    return component("div",props,children,inner)
}

export const i = (props,children,inner) => {
    return component("i",props,children,inner)
}

export const span = (props,children,inner) => {
    return component("span",props,children,inner)
}

export const button = (props,children,inner) => {
    return component("button",props,children,inner)
}

export const component = (tag,props,children,inner) =>{
    var d = document.createElement(tag)
    for(const k of Object.keys(props)){
        if(typeof props[k] === "function")
        {
            d.addEventListener(k,props[k])
        }
        else{
            d.setAttribute(k,props[k])
        }
    }

    if(inner){
        d.innerText = inner
    }
    
    let elchildren = children

    if(typeof children === "function")
    {
        elchildren = children()
    }

    for(const child of elchildren){
        let el = child

        try{
        
            for(const child2 of child){
                d.appendChild(child2())
            }
        
        }
        catch{
            d.appendChild(el)
        }

        
        
    }
    return d
}



export const cssSelector = (el,path) =>{
    let children = el.getElementsByClassName(path)
    return children
}

export const idSelector = (el,path) =>{
    let children = el.getElementsById(path)
    return children
}

export const tagSelector = (el,path) =>{
    let children = el.getElementsByTagName(path)
    return children
}

export const findOne = (el, path) =>{
    return find(el,path)[0]
}


export const find = (el, path) =>{
    
    const s = path.split(' ')
    let children = []

    let result = []

     switch(s[0][0]){
        case ".":
            children = cssSelector(el,s[0].substring(1))
            break;
        case "#":
            children = idSelector(el,s[0].substring(1))
            break;
        default:
            children = tagSelector(el,s[0])
            break;
     }

     if(path.indexOf(' ') == -1)
     {
return children
     }
     else{

     
     for(const child of children){
        let c = find(child,s.filter((a,b)=> b>0).join(' '))
        for(const cx of c){
            result.push(cx)
        }
        
     }
    }
    
    return result.flat()
}
