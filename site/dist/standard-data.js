/* Authored Transport rules, not inferred from artwork folders or browsing labels.
 * Reference: blueprint standard-mode invariants and Plants topics/sorting.js.
 */
(() => {
  const ids=text=>text.split(' ').map(id=>`vehicle.${id}`);
  const categories=[
    {id:'all',label:'All words',image:'images/classroom/cover-all.webp'},
    {id:'land',label:'Land travel',image:'images/classroom/cover-land.webp'},
    {id:'water',label:'Water travel',image:'images/classroom/cover-water.webp'},
    {id:'air',label:'Air travel',image:'images/classroom/cover-air.webp'},
    {id:'space',label:'Space travel',image:'images/classroom/cover-space.webp'},
  ];
  const teachingCategories=[
    {id:'part',label:'Vehicle parts',image:'images/classroom/cover-part.webp'},
    {id:'place',label:'Journey places',image:'images/classroom/cover-place.webp'},
    {id:'person',label:'People and roles',image:'images/classroom/cover-person.webp'},
    {id:'action',label:'Journey actions',image:'images/classroom/cover-action.webp'},
    {id:'safety',label:'Safe journeys',image:'images/classroom/cover-safety.webp'},
  ];
  const sortRules=[
    {id:'surfaces',label:'Land, water or air?',description:'Group each pictured vehicle by where it travels.',notes:'Spacecraft are outside this rule.',prompt:name=>`Where does the ${name} travel?`,groups:[
      {id:'land',label:'Land',image:'images/vocabulary/vehicle.car.png',members:ids('car bus bicycle motorcycle scooter train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor rickshaw skateboard motor-scooter auto-rickshaw cycle-rickshaw coach double-decker-bus tow-truck refuse-truck concrete-mixer tipper-truck cargo-bicycle'),explanation:'It travels on land.'},
      {id:'water',label:'Water',image:'images/vocabulary/vehicle.boat.png',members:ids('boat ship ferry speedboat yacht jet-ski rowboat sailboat canoe kayak tugboat'),explanation:'It travels on water.'},
      {id:'air',label:'Air',image:'images/vocabulary/vehicle.airplane.png',members:ids('airplane helicopter hot-air-balloon glider'),explanation:'It travels through the air.'},
    ]},
    {id:'power',label:'People power or engine power?',description:'Group the pictures into people-powered and engine-powered vehicles.',notes:'Sailing boats, yachts, balloons, gliders and spacecraft are excluded from this simple comparison.',prompt:name=>`How is this ${name} powered?`,groups:[
      {id:'people',label:'People power',image:'images/vocabulary/vehicle.bicycle.png',members:ids('bicycle scooter skateboard rickshaw cycle-rickshaw cargo-bicycle rowboat canoe kayak'),explanation:'A person pedals, pushes or pulls it.'},
      {id:'engine',label:'Engine power',image:'images/vocabulary/vehicle.car.png',members:ids('car bus motorcycle train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor ship ferry speedboat jet-ski airplane helicopter motor-scooter auto-rickshaw coach double-decker-bus tow-truck refuse-truck concrete-mixer tipper-truck tugboat'),explanation:'An engine or motor powers it.'},
    ]},
    {id:'rails',label:'Rails or road?',description:'Does it run on rails, or drive on the road?',notes:'Some trams share the street with cars, but they still run on rails. Bicycles, boats and aircraft are left out of this rule.',prompt:name=>`Does the ${name} run on rails or on the road?`,groups:[
      {id:'rails',label:'Rails',image:'images/vocabulary/vehicle.train.png',members:ids('train subway tram'),explanation:'It runs on rails.'},
      {id:'road',label:'Road',image:'images/vocabulary/vehicle.car.png',members:ids('car bus taxi truck van minibus school-bus police-car ambulance fire-engine coach double-decker-bus tow-truck refuse-truck concrete-mixer tipper-truck'),explanation:'It drives on the road.'},
    ]},
    {id:'loads',label:'People or loads?',description:'Is it mainly made to carry people, or to carry loads?',notes:'Sort by the main job. Many vehicles can carry both; vehicles with a special job, such as a fire engine, are left out.',prompt:name=>`What does the ${name} mainly carry?`,groups:[
      {id:'people',label:'People',image:'images/vocabulary/vehicle.bus.png',members:ids('bus taxi minibus school-bus coach double-decker-bus rickshaw auto-rickshaw cycle-rickshaw'),explanation:'It is mainly made to carry people.'},
      {id:'loads',label:'Loads',image:'images/vocabulary/vehicle.truck.png',members:ids('truck van tow-truck refuse-truck concrete-mixer tipper-truck cargo-bicycle'),explanation:'It is mainly made to carry loads.'},
    ]},
  ];
  const silhouetteIds=new Set(ids('bicycle scooter helicopter hot-air-balloon skateboard rickshaw tractor'));
  // All 24 scenes are generated into images/teaching-scenes/library.js from the scene ledger.
  const teachingScenes=[];
  // Read, Draw & Talk: one sentence per card, tied to one taught word (hidden when that word is out of the teacher scope).
  const readingCards=[{"id":"bus","itemId":"vehicle.bus","sentence":"The bus stops to pick up people.","draw":"Draw the bus at the bus stop.","talk":"Where would you like the bus to take you?"},
    {"id":"train","itemId":"vehicle.train","sentence":"The train runs on a long track.","draw":"Draw a train with three carriages.","talk":"Who could be riding on the train?"},
    {"id":"bicycle","itemId":"vehicle.bicycle","sentence":"I push the pedals to ride my bicycle.","draw":"Draw yourself riding a bicycle.","talk":"Where would you ride your bicycle?"},
    {"id":"fire-engine","itemId":"vehicle.fire-engine","sentence":"The fire engine has a long ladder.","draw":"Draw the fire engine and its ladder.","talk":"How do firefighters help people?"},
    {"id":"tractor","itemId":"vehicle.tractor","sentence":"The tractor pulls a heavy load on the farm.","draw":"Draw the tractor in a muddy field.","talk":"What could the tractor carry?"},
    {"id":"ferry","itemId":"vehicle.ferry","sentence":"The ferry carries cars across the water.","draw":"Draw the ferry on the waves.","talk":"What would you see from the ferry?"},
    {"id":"sailboat","itemId":"vehicle.sailboat","sentence":"The wind pushes the sailboat along.","draw":"Draw a sailboat with a big sail.","talk":"What happens when the wind stops?"},
    {"id":"helicopter","itemId":"vehicle.helicopter","sentence":"The helicopter can go straight up.","draw":"Draw the helicopter in the sky.","talk":"Where could a helicopter land?"},
    {"id":"hot-air-balloon","itemId":"vehicle.hot-air-balloon","sentence":"The hot air balloon floats up high.","draw":"Draw the balloon above the trees.","talk":"What would you see from up high?"},
    {"id":"rocket","itemId":"vehicle.rocket","sentence":"The rocket blasts off into space.","draw":"Draw the rocket and the stars.","talk":"Where would you fly in a rocket?"},
    {"id":"ambulance","itemId":"vehicle.ambulance","sentence":"The ambulance takes people to the hospital.","draw":"Draw the ambulance with its lights on.","talk":"Why does the ambulance need to be fast?"},
    {"id":"wheel","itemId":"part.wheel","sentence":"A wheel goes round and round.","draw":"Draw something that has wheels.","talk":"How many wheels can you count on a car?"},
    {"id":"airport","itemId":"place.airport","sentence":"Airplanes take off and land at the airport.","draw":"Draw an airplane at the airport.","talk":"What do people take on a trip?"},
    {"id":"pilot","itemId":"person.pilot","sentence":"The pilot flies the airplane.","draw":"Draw the pilot in the cockpit.","talk":"Would you like to be a pilot? Why?"},
    {"id":"board","itemId":"action.board","sentence":"We get on the bus at the front door.","draw":"Draw people getting on the bus.","talk":"What do you say to the driver?"},
    {"id":"helmet","itemId":"safety.helmet","sentence":"I wear a helmet to keep my head safe.","draw":"Draw yourself wearing a helmet.","talk":"When do you need to wear a helmet?"},
    {"id":"traffic-light","itemId":"safety.traffic-light","sentence":"Red means stop and green means go.","draw":"Draw a traffic light with all three colours.","talk":"What does the yellow light mean?"},
    {"id":"pedestrian-crossing","itemId":"place.pedestrian-crossing","sentence":"I hold a grown-up's hand at the crossing.","draw":"Draw a safe crossing with stripes.","talk":"Who helps you cross the road safely?"}];
  const hubs={
    media:{title:'Media',description:'Choose a resource group.',groups:[['printables','Printables','Picture flashcards to print in four A4 layouts.'],['books','Books','Books are not available yet.'],['videos','Videos','Films are not available yet.'],['songs','Songs','Songs are not available yet.']]},
    games:{title:'Transport Games',description:'Choose a transport game.',groups:[['dispatch','Transport Dispatch','Choose the right vehicle, plan an open road and deliver everyone.'],['driving','Driving game','A separate driving game is being prepared. Choose another activity for now.']]},
    phonics:{title:'Phonics & Sight Words',description:'Explore sounds and Transport words.',groups:[['alphabet','Alphabet names & sounds','Letter names, letter sounds and sentence practice.'],['families','Sound families','Every sound with its different spellings.'],['blends','Consonant blends','Two or three consonants said together, like bl and str.'],['cvc','Topic CVC (CVCC)','Short Transport words, sound by sound: bus, van, ship, wing, land.'],['words','Sound & Blend','Spell, sound out and blend every Transport word.'],['reading','Listen & Read','Hear a Transport sentence, then read it together.']]},
    create:{title:'Read, Draw & Talk',description:'Read together, then draw and talk.',groups:[['cards','Reading cards','One sentence, one picture, then draw and talk.']]},
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
  const variantFor=(mode,setup={})=>mode==='detective'?`${setup.kind}:${setup.duration}`:mode==='sort'?(setup.rule&&setup.rule!=='surfaces'?`rule:${setup.rule}`:'default'):['learn','wheel'].includes(mode)&&setup.category&&setup.category!=='all'?`category:${setup.category}`:'default';
  function setupFor(mode,variant='default'){
    if(mode==='detective'){const [kind,duration]=variant.split(':');return {kind,duration:Number(duration)};}
    if(mode==='sort')return {rule:variant.startsWith('rule:')?variant.slice(5):'surfaces'};
    return {category:variant.startsWith('category:')?variant.slice(9):'all'};
  }
  function guessSpelling(round,letter){
    if(round.terminal||!(/^[a-z]$/).test(letter)||round.guessed.includes(letter))return {changed:false,reward:0};
    round.guessed.push(letter);const letters=round.vehicle.name.toLowerCase().replace(/[^a-z]/g,''),correct=letters.includes(letter);if(!correct)round.misses++;
    const won=[...letters].every(l=>round.guessed.includes(l));let reward=0;
    if(won||round.misses>=8){round.terminal=won?'won':'lost';if(won&&!round.assisted&&!round.awarded){round.awarded=true;reward=1;}}
    return {changed:true,correct,terminal:Boolean(round.terminal),won,reward};
  }
  globalThis.TransportStandard={categories,teachingCategories,sortRules,silhouetteIds,teachingScenes,hubs,readingCards,prepare,ruleFor,sortingPool,availableGroups,poolFor,variantFor,setupFor,guessSpelling};
})();
