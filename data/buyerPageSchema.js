export function buyerPageSchema(path, page) {
 const url='https://fann.ae'+path;
 return {'@context':'https://schema.org','@graph':[
 {'@type':'Service',name:page.heading,serviceType:page.serviceType || 'Exhibition stand design and build',description:page.description,url,provider:{'@type':'Organization',name:'FANN',url:'https://fann.ae'},areaServed:{'@type':'City',name:page.city || 'Abu Dhabi'}},
 {'@type':'BreadcrumbList',itemListElement:[{name:'Home',url:'https://fann.ae/'},{name:'Services',url:'https://fann.ae/services'},{name:page.heading,url}].map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:x.url}))},
 {'@type':'FAQPage',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
 ]};
}
