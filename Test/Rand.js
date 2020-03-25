/*const n = 10;
var i=0;
for(i=0; i<50; i++)
{
    let x = Math.floor(n * Math.random());
    console.log(x);
}*/
//==============================================================
console.log("===========================================================================================");
const length = 10;
const N = 5;

function uniqueRandom(length, N)
{
    let indices = [];
    let counter = 0;
    while(counter<N)
    {
        var x = Math.floor(length * Math.random());
        //console.log(x);
        var flag = true;
        for(let j=0; j<counter; j++)
        {
            if(indices[j]==x)flag=false;
        }
        if(flag==false)continue;
        indices.push(x);
        counter++;    
    }
    //console.log(indices);
    return indices;
}

var arr = uniqueRandom(length, N);
console.log(arr);