/* Authored Transport rules, not inferred from artwork folders or browsing labels.
 * Reference: blueprint standard-mode invariants and Plants topics/sorting.js.
 */
(() => {
  const ids=text=>text.split(' ').map(id=>`vehicle.${id}`);
  const categories=[
    {id:'all',label:'All words',image:'images/emoji-codex/bus.png'},
    {id:'land',label:'Land travel',image:'images/categories/land.png'},
    {id:'water',label:'Water travel',image:'images/categories/water.png'},
    {id:'air',label:'Air travel',image:'images/categories/air.png'},
    {id:'space',label:'Space travel',image:'images/emoji-codex/space_shuttle.png'},
  ];
  const sortRules=[
    {id:'surfaces',label:'Land, water or air?',description:'Group each pictured vehicle by where it travels.',notes:'Spacecraft are outside this rule.',prompt:name=>`Where does the ${name} travel?`,groups:[
      {id:'land',label:'Land',image:'images/categories/land.png',members:ids('car bus bicycle motorcycle scooter train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor rickshaw skateboard'),explanation:'It travels on land.'},
      {id:'water',label:'Water',image:'images/categories/water.png',members:ids('boat ship ferry speedboat yacht jet-ski'),explanation:'It travels on water.'},
      {id:'air',label:'Air',image:'images/categories/air.png',members:ids('airplane helicopter hot-air-balloon glider'),explanation:'It travels through the air.'},
    ]},
    {id:'power',label:'People power or engine power?',description:'Group the pictures into people-powered and engine-powered vehicles.',notes:'Boats, yachts, balloons, gliders and spacecraft are excluded from this simple comparison.',prompt:name=>`How is this ${name} powered?`,groups:[
      {id:'people',label:'People power',image:'images/emoji-codex/bicycle.png',members:ids('bicycle scooter skateboard rickshaw'),explanation:'A person pedals, pushes or pulls it.'},
      {id:'engine',label:'Engine power',image:'images/emoji-codex/car.png',members:ids('car bus motorcycle train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor ship ferry speedboat jet-ski airplane helicopter'),explanation:'An engine or motor powers it.'},
    ]},
  ];
  const silhouetteIds=new Set(ids('bicycle scooter helicopter hot-air-balloon skateboard rickshaw tractor'));
  const hubs={
    media:{title:'Media',description:'Choose a resource group.',groups:[['printables','Printables','Printable cards are not available yet.'],['books','Books','Books are not available yet.'],['videos','Videos','Films are not available yet.'],['songs','Songs','Songs are not available yet.']]},
    games:{title:'Transport Games',description:'Choose a transport game.',groups:[['dispatch','Transport Dispatch','Transport Dispatch is being prepared. Choose another activity for now.'],['driving','Driving game','A separate driving game is being prepared. Choose another activity for now.']]},
    phonics:{title:'Phonics & Sight Words',description:'Explore sounds and Transport words.',groups:[['sounds','Shared sounds','Sound practice is not available yet.'],['words','Transport words','Transport word practice is not available yet.']]},
    create:{title:'Read, Draw & Talk',description:'Read together, then draw and talk.',groups:[['cards','Reading cards','Reading cards are not available yet.']]},
  };
  function prepare(entries){for(const entry of entries){entry.eligibility.detective=true;entry.silhouetteEligible=silhouetteIds.has(entry.id);if(entry.id==='vehicle.space-shuttle')entry.category='space';}}
  const ruleFor=id=>sortRules.find(rule=>rule.id===id)||sortRules[0];
  const sortingPool=(rule,pool)=>pool.filter(item=>rule.groups.filter(group=>group.members.includes(item.id)).length===1);
  const availableGroups=(rule,pool)=>rule.groups.filter(group=>pool.some(item=>group.members.includes(item.id)));
  function poolFor(mode,pool,{category='all',rule='surfaces',kind='mosaic'}={}){
    if(mode==='learn'||mode==='wheel')return pool.filter(item=>category==='all'||item.category===category);
    if(mode==='sort')return sortingPool(ruleFor(rule),pool);
    if(mode==='detective')return pool.filter(item=>kind!=='silhouette'||item.silhouetteEligible);
    return pool;
  }
  const variantFor=(mode,setup={})=>mode==='detective'?`${setup.kind}:${setup.duration}`:mode==='sort'?(setup.rule==='power'?'rule:power':'default'):['learn','wheel'].includes(mode)&&setup.category&&setup.category!=='all'?`category:${setup.category}`:'default';
  function setupFor(mode,variant='default'){
    if(mode==='detective'){const [kind,duration]=variant.split(':');return {kind,duration:Number(duration)};}
    if(mode==='sort')return {rule:variant==='rule:power'?'power':'surfaces'};
    return {category:variant.startsWith('category:')?variant.slice(9):'all'};
  }
  function guessSpelling(round,letter){
    if(round.terminal||!(/^[a-z]$/).test(letter)||round.guessed.includes(letter))return {changed:false,reward:0};
    round.guessed.push(letter);const letters=round.vehicle.name.toLowerCase().replace(/[^a-z]/g,''),correct=letters.includes(letter);if(!correct)round.misses++;
    const won=[...letters].every(l=>round.guessed.includes(l));let reward=0;
    if(won||round.misses>=8){round.terminal=won?'won':'lost';if(won&&!round.assisted&&!round.awarded){round.awarded=true;reward=1;}}
    return {changed:true,correct,terminal:Boolean(round.terminal),won,reward};
  }
  globalThis.TransportStandard={categories,sortRules,silhouetteIds,hubs,prepare,ruleFor,sortingPool,availableGroups,poolFor,variantFor,setupFor,guessSpelling};
})();
