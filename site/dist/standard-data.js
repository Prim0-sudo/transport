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
  const teachingCategories=[
    {id:'part',label:'Vehicle parts',image:'images/teaching-scenes/bicycle-parts-v1.jpg'},
    {id:'place',label:'Journey places',image:'images/teaching-scenes/train-at-the-platform-v1.jpg'},
    {id:'person',label:'People and roles',image:'images/teaching-scenes/bus-at-the-bus-stop-v2.jpg'},
    {id:'action',label:'Journey actions',image:'images/teaching-scenes/bus-at-the-bus-stop-v2.jpg'},
    {id:'safety',label:'Safe journeys',image:'images/teaching-scenes/bicycle-parts-v1.jpg'},
  ];
  const sortRules=[
    {id:'surfaces',label:'Land, water or air?',description:'Group each pictured vehicle by where it travels.',notes:'Spacecraft are outside this rule.',prompt:name=>`Where does the ${name} travel?`,groups:[
      {id:'land',label:'Land',image:'images/categories/land.png',members:ids('car bus bicycle motorcycle scooter train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor rickshaw skateboard motor-scooter auto-rickshaw cycle-rickshaw coach double-decker-bus tow-truck refuse-truck concrete-mixer tipper-truck cargo-bicycle'),explanation:'It travels on land.'},
      {id:'water',label:'Water',image:'images/categories/water.png',members:ids('boat ship ferry speedboat yacht jet-ski rowboat sailboat canoe kayak tugboat'),explanation:'It travels on water.'},
      {id:'air',label:'Air',image:'images/categories/air.png',members:ids('airplane helicopter hot-air-balloon glider'),explanation:'It travels through the air.'},
    ]},
    {id:'power',label:'People power or engine power?',description:'Group the pictures into people-powered and engine-powered vehicles.',notes:'Sailing boats, yachts, balloons, gliders and spacecraft are excluded from this simple comparison.',prompt:name=>`How is this ${name} powered?`,groups:[
      {id:'people',label:'People power',image:'images/emoji-codex/bicycle.png',members:ids('bicycle scooter skateboard rickshaw cycle-rickshaw cargo-bicycle rowboat canoe kayak'),explanation:'A person pedals, pushes or pulls it.'},
      {id:'engine',label:'Engine power',image:'images/emoji-codex/car.png',members:ids('car bus motorcycle train subway taxi truck van tram minibus school-bus police-car ambulance fire-engine tractor ship ferry speedboat jet-ski airplane helicopter motor-scooter auto-rickshaw coach double-decker-bus tow-truck refuse-truck concrete-mixer tipper-truck tugboat'),explanation:'An engine or motor powers it.'},
    ]},
  ];
  const silhouetteIds=new Set(ids('bicycle scooter helicopter hot-air-balloon skateboard rickshaw tractor'));
  // Outlines are drawn in the approved illustrations' native pixel coordinates.
  const teachingScenes=[
    {
      title:'Bicycle parts', image:'bicycle-parts-v1.jpg', width:1536, height:1024,
      alt:'A blue bicycle with two spoked wheels, a pedal and a brass bell.',
      labels:[
        ['Wheel','The whole wheel turns as the bicycle moves.','M1215 386a288 291 0 1 1 0 582a288 291 0 1 1 0 -582Z'],
        ['Tyre','The tyre is the dark rubber around the wheel.','M1215 386a288 291 0 1 1 0 582a288 291 0 1 1 0 -582Z M1215 438a236 239 0 1 1 0 478a236 239 0 1 1 0 -478Z'],
        ['Pedal','Push this part with your foot to turn the crank.','M786 827 870 824 893 853 889 900 800 906 783 879Z'],
        ['Handlebars','Hold these grips to steer the bicycle.','M798 101 902 65 945 66 976 76 1057 127 1148 104 1209 85 1299 111 1319 147 1299 169 1201 149 1155 128 1093 154 1079 176 1047 183 1026 157 983 130 941 110 855 139 817 144 798 129Z'],
        ['Bell','Ring this bell to make a sound.','M1127 47 Q1130 30 1157 26 L1157 21 1180 21 1180 30 Q1204 32 1213 49 L1241 42 Q1258 42 1252 59 L1217 68 1215 80 Q1171 103 1128 79Z'],
        ['Bicycle','You ride a bicycle by pushing its pedals.','M42 349H1503V964H42Z M794 20H1320V348H794Z'],
      ],
      entryIds:['part.wheel','part.tyre','part.pedal','part.handlebars','safety.bicycle-bell','vehicle.bicycle'],
    },
    {
      title:'Bus at the bus stop', image:'bus-at-the-bus-stop-v2.jpg', width:1672, height:941,
      alt:'A yellow bus with its door open at the kerb beside a bus stop sign and shelter.',
      labels:[
        ['Bus stop','The sign marks where passengers wait for the bus.','M1048 212 Q1048 201 1067 201 H1159 Q1182 201 1182 224 V339 Q1182 359 1158 362 H1140 L1134 645 1153 660 1156 713 Q1116 730 1075 717 L1076 659 1099 644 1103 362 H1068 Q1046 361 1046 339Z'],
        ['Door','Passengers use this opening to get on or off.','M426 356 571 347 584 707 581 728 425 757Z'],
        ['Handrail','Hold this rail for support when using the step.','M541 438 Q513 437 508 470 L509 563 Q510 594 539 598 L550 584 Q530 582 528 564 L527 473 Q528 458 547 454Z'],
        ['Get on','Move from the pavement up into the stopped bus.','M535 809 553 798 497 712 519 698 458 681 451 743 475 729Z','direction'],
        ['Get off','Move out of the stopped bus and down onto the pavement.','M454 697 475 685 534 773 558 757 553 819 491 801 513 787Z','direction'],
        ['Bus','A bus carries passengers along roads.','M106 243H1037V751H106Z'],
      ],
      entryIds:['place.bus-stop','part.door','safety.handrail','action.board','action.get-off','vehicle.bus'],
    },
    {
      title:'Train at the platform', image:'train-at-the-platform-v1.jpg', width:1672, height:941,
      alt:'A red passenger train and its carriage stand on rails next to a raised station platform.',
      labels:[
        ['Train','The whole train includes the front cab and the carriage joined behind it.','M591 733 611 613 647 539 681 507 790 484 818 464 921 459 979 473 1089 467 1140 440 1459 417 1521 420 1571 444 1591 487 1597 608 1579 652 1554 692 1511 711 1453 732 1344 754 1210 789 1150 799 1081 810 894 830 784 845 674 817 592 776Z'],
        ['Carriage','This joined section has seats for passengers.','M1090 469 1141 440 1460 418 1523 420 1571 445 1592 485 1597 610 1579 654 1553 693 1512 711 1440 735 1344 755 1211 790 1179 758 1179 530 1164 510Z'],
        ['Window','Passengers can look outside through this carriage window.','M1372 536 1416 529 1427 535 1429 590 1423 601 1374 609 1368 604 1366 546Z'],
        ['Railway','The train runs on the metal rails of the railway.','M0 888 588 754 593 779 666 807 782 843 890 832 1149 801 1211 789 1444 735 1557 696 1588 650 1595 617 1672 596 1672 667 249 941 0 941Z'],
        ['Station','The station is the place where passengers come to catch the train.','M91 243 238 88 311 88 315 20 379 22 380 87 810 107 944 214 1098 243 1099 281 1042 304 1046 427 1026 454 1008 449 1010 309 916 309 920 464 735 487 646 500 434 539 411 538 414 520 221 520 98 492Z'],
        ['Platform','This raised area beside the rails is where passengers wait to get on or off.','M0 520 94 493 216 522 409 524 639 496 681 501 644 544 622 583 0 671Z M1106 455 1435 373 1518 366 1538 375 1538 386 1672 384 1672 431 1582 453 1521 422 1462 418Z'],
      ],
      entryIds:['vehicle.train','part.carriage','part.window','place.railway','place.station','place.platform'],
    },
  ];
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
    phonics:{title:'Phonics & Sight Words',description:'Explore sounds and Transport words.',groups:[['alphabet','Alphabet names & sounds','Letter names, letter sounds and sentence practice.'],['families','Sound families','Every sound with its different spellings.'],['blends','Consonant blends','Two or three consonants said together, like bl and str.'],['cvc','Topic CVC (CVCC)','Short Transport words, sound by sound: bus, van, ship, wing, land.'],['words','Sound & Blend','Spell, sound out and blend every Transport word.']]},
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
  globalThis.TransportStandard={categories,teachingCategories,sortRules,silhouetteIds,teachingScenes,hubs,readingCards,prepare,ruleFor,sortingPool,availableGroups,poolFor,variantFor,setupFor,guessSpelling};
})();
