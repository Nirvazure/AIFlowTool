let getColor=type=> {
    if (type == 'audio') return 'green'
    else if (type == 'text') return 'orange'
    else if (type == 'camera') return 'cyan'
    else if (type == 'video') return 'indigo'
    else return 'greydeep-purple darken-1'
}

let getDagName=dags=> {
    let dagNames = []
    for (let k in dags) {
        dagNames.push(dags[k].name)
    }
    return dagNames
}

export default{
    getDagName,
    getColor
}