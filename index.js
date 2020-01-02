// importing node modules
const url = require('url');
const fs = require('fs');
const http = require('http');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js')
// synchronous file handling for the JSON file
// json data 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const JSON_data = JSON.parse(data);

// loading the overview.html file
const template_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
// loading the product.html file
const template_product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
// loading the card.html file
const template_card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const slugs = JSON_data.map(el =>slugify(el.productName, {lower:true}));
console.log(slugs);



// creating the server
const server = http.createServer((req, res)=>{


    // configuring the path names (url routing)
    const pathName=req.url;
    const {query, pathname} = url.parse(req.url, true);

    // overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type':'text/html'});

        const cards_html = JSON_data.map(el=> replaceTemplate(template_card, el)).join('');
        // console.log(cards_html);
        const output_overview = template_overview.replace(`{%PRODUCT_CARDS%}`, cards_html);
        
        res.end(output_overview);
    }


    // product page
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});
        // res.end("This is the product");
        console.log(query);
        const product = JSON_data[query.id];

        const output = replaceTemplate(template_product, product);

        res.end(output);
        
    }


    // API page
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);
    }


    // Not found page
    else{
        // handling the routes that are not defined with 404 error
        
        res.writeHead(404, {
            'Content-Type':'text/html',
        });
        res.end("<h1>Page not found! </h1>");
    }
});


// configuring the server port
server.listen(8000, ()=>{
    console.log("App is running on port 8000!");
});