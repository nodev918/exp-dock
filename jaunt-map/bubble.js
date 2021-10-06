const target = [3,10,6,11,5,1]

function bubble(){
    for(let i = 0;i<target.length;i++){     
        for(let j=0;j<target.length;j++){   
            if(target[j]>target[j+1]){
                const temp = target[j]
                target[j] = target[j+1]
                target[j+1] = temp
            }
        }
        console.log(target)
    }
}

bubble()