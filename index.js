const csvFilePath='./input.csv';
const csv = require('csvtojson');
const fs = require('fs');

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    const produtos = jsonObj.filter((e) => e.Tipo === 'Produto');
    const complementos = jsonObj.filter((e) => e.Tipo === 'Complemento');
    const sectionsName = [...new Set(produtos.map(produto => produto["Seção"]))];
    const menu = {
        sections: sectionsName.map(s => ({
            name: s,
            items: produtos.filter(p => p["Seção"] === s).map(p => 
                {
                    return ({
                name: p["Nome"],
                price: p["Preço"],
                code: p["Código"],
                description: p["Descrição"],
                customizations: [
                    {
                        type: 'MULTI_SELECT',
                        title: 'Adicionais',
                        fields:  p["Adicionais"].split('/').map(code => {
                            const add = complementos.find(comp => comp["Código"] === code);
                            return add ? ({
                                title: add["Nome"],
                                price: add["Preço"]
                            }) : undefined;
                        }).filter(field => field)
                    }
                ]
            })})
        }))
    };

    fs.writeFileSync('output.json', JSON.stringify(menu));

});