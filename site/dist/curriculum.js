/* Proposed Transport teaching organisation, following Plants topics/curriculum.js.
 * Levels describe word/concept demands, not ages or qualifications.
 */
(() => {
  const split = text => text.split(' ');
  const levels = [
    {id:'1',label:'Level 1',description:'Familiar vehicles and everyday journeys.'},
    {id:'2',label:'Level 2',description:'More specific vehicles, jobs and travel words.'},
    {id:'3',label:'Level 3',description:'Less familiar transport and useful comparisons.'},
  ];
  const lessons = [
    {id:'everyday',label:'1. Journeys around us'},
    {id:'land',label:'2. Roads and rails'},
    {id:'water',label:'3. On the water'},
    {id:'air',label:'4. In the air and space'},
    {id:'helping',label:'5. Helping and carrying'},
    {id:'safety',label:'6. Safe journeys'},
  ];
  const collectionMembers = {
    road:split('car bus bicycle motorcycle scooter taxi truck van minibus school-bus police-car ambulance fire-engine tractor skateboard rickshaw'),
    rail:split('train subway tram'),
    water:split('boat ship ferry speedboat yacht jet-ski'),
    air:split('airplane helicopter hot-air-balloon glider'),
    emergency:split('police-car ambulance fire-engine'),
    'human-powered':split('bicycle scooter skateboard rickshaw'),
    passengers:split('car bus train subway taxi van tram minibus school-bus rickshaw boat ship ferry airplane helicopter hot-air-balloon'),
    work:split('truck van tractor police-car ambulance fire-engine ship helicopter'),
    farm:['tractor'],
    space:['space-shuttle'],
  };
  const collectionLabels = {road:'Road vehicles',rail:'Rail journeys',water:'Water travel',air:'Air travel',emergency:'Emergency helpers','human-powered':'People power',passengers:'Carrying passengers',work:'Vehicles at work',farm:'On the farm',space:'Space travel'};
  Object.assign(collectionLabels,{
    'vehicle-parts':'Vehicle parts','journey-places':'Journey places','people-at-work':'People at work',
    'journey-actions':'Journey actions','safe-journeys':'Safe journeys',
  });
  const collections = Object.entries(collectionLabels).map(([id,label])=>({id,label}));
  const lessonMembers = {
    everyday:split('car bus bicycle taxi van train school-bus boat airplane'),
    land:[...collectionMembers.road,...collectionMembers.rail],
    water:collectionMembers.water,
    air:[...collectionMembers.air,'space-shuttle'],
    helping:split('truck van tractor police-car ambulance fire-engine bus minibus ferry ship helicopter'),
    safety:split('car bus bicycle motorcycle scooter taxi van school-bus boat ship ferry speedboat yacht jet-ski skateboard'),
  };
  // Explicit stable keys retain the old entry identity through label corrections.
  const rows = [
    ['car','car',1,[], 'A vehicle with four wheels that carries a small group of people.','A car with four wheels.'],
    ['bus','bus',1,[], 'A large road vehicle that carries many passengers.','A single-decker passenger bus.'],
    ['bicycle','bicycle',1,['bike'], 'A vehicle with two wheels that a rider moves by pedalling.','A bicycle with two wheels, pedals and handlebars.'],
    ['motorcycle','motorcycle',2,['motorbike'], 'A motor vehicle with two wheels that a rider sits on.','A motorcycle with two wheels.'],
    ['scooter','kick scooter',2,['scooter'], 'A small vehicle with a standing deck and handlebars, pushed along with one foot.','A kick scooter with a standing deck and two wheels.'],
    ['train','train',1,[], 'A rail vehicle, or connected rail vehicles, that carries people or goods along tracks.','A passenger train on railway wheels.'],
    ['subway','metro train',2,['subway','metro','subway (metro)'], 'A city train that often travels through underground tunnels.','A metro train with passenger doors and windows.'],
    ['taxi','taxi',1,['cab'], 'A car with a driver that passengers pay to take them somewhere.','A taxi passenger car.'],
    ['truck','truck',1,['lorry'], 'A road vehicle used to carry goods.','A truck for carrying goods.'],
    ['van','van',1,[], 'A road vehicle with an enclosed space for goods or passengers.','An enclosed road van.'],
    ['tram','tram',2,['streetcar'], 'A passenger vehicle that runs on rails, often along city streets.','A tram with passenger windows.'],
    ['minibus','minibus',2,[], 'A passenger vehicle that is smaller than a full-sized bus.','A small passenger bus.'],
    ['school-bus','school bus',1,[], 'A bus used to take children to and from school.','A yellow school bus.'],
    ['police-car','police car',2,[], 'A car used by police officers as they do their work.','A police car with emergency lights.'],
    ['ambulance','ambulance',2,[], 'A vehicle equipped to help take ill or injured people for medical care.','An ambulance with emergency markings.'],
    ['fire-engine','fire engine',2,['fire truck'], 'A vehicle that carries firefighters and firefighting equipment.','A fire engine carrying firefighting equipment.'],
    ['tractor','tractor',2,[], 'A strong vehicle used to pull farm equipment or loads.','A farm tractor with large rear wheels.'],
    ['rickshaw','pulled rickshaw',3,['rickshaw'], 'A small passenger cart pulled by a person on foot.','A two-wheeled passenger cart with handles for a person to pull.'],
    ['skateboard','skateboard',2,[], 'A board with four small wheels that a rider stands on.','A skateboard with four small wheels.'],
    ['boat','boat',1,[], 'A water vehicle used to carry people or things.','A small boat.'],
    ['ship','ship',2,[], 'A large water vehicle that carries people or goods.','A large ship.'],
    ['ferry','ferry',2,[], 'A boat or ship that carries passengers, and sometimes vehicles, between stopping places.','A passenger ferry.'],
    ['speedboat','speedboat',2,[], 'A motorboat designed to travel quickly on water.','A small motor-powered speedboat.'],
    ['yacht','yacht',2,[], 'A boat used for leisure, powered by sails or an engine.','A leisure yacht.'],
    ['jet-ski','jet ski',3,['personal watercraft'], 'A small powered watercraft that a rider sits or stands on.','A personal watercraft with a seat and handlebars.'],
    ['airplane','airplane',1,['aeroplane','plane'], 'An aircraft with fixed wings that is moved through the air by an engine.','A fixed-wing airplane.'],
    ['helicopter','helicopter',2,[], 'An aircraft lifted by turning rotor blades above its body.','A helicopter with rotor blades.'],
    ['hot-air-balloon','hot air balloon',2,[], 'A large balloon lifted by warm air, with a basket underneath.','A hot air balloon with a passenger basket.'],
    ['glider','glider',3,[], 'An aircraft designed to glide through the air without engine power.','A glider with long fixed wings.'],
    ['space-shuttle','space shuttle',3,['shuttle orbiter'], 'A reusable spacecraft whose winged orbiter returned to Earth and landed on a runway.','A winged space shuttle orbiter.'],
  ];
  const pictureGroups = {bus:'bus-examples','school-bus':'bus-examples',van:'small-passenger-van',minibus:'small-passenger-van',boat:'small-watercraft',speedboat:'small-watercraft',ferry:'small-watercraft',airplane:'fixed-wing',glider:'fixed-wing'};
  const choices = {level:levels,lesson:lessons,collection:collections};
  const legacyLabels={scooter:'scooter',rickshaw:'rickshaw',subway:'subway (metro)'};
  const examples={car:'We ride in a car to visit a friend.',bus:'Passengers wait at the bus stop.',bicycle:'The rider pushes the bicycle pedals.',motorcycle:'The motorcycle rider wears a helmet.',scooter:'Push with one foot to move the kick scooter.',train:'The train carries passengers along the railway.',subway:'We take a metro train across the city.',taxi:'The taxi driver takes a passenger to the station.',truck:'The truck carries boxes to a shop.',van:'The van carries parcels to our street.',tram:'The tram follows rails through the city.',minibus:'A small group travels in the minibus.','school-bus':'The school bus takes children to school.','police-car':'Police officers travel in the police car.',ambulance:'The ambulance takes someone for medical care.','fire-engine':'Firefighters carry their equipment on the fire engine.',tractor:'The tractor pulls farm equipment.',rickshaw:'A person pulls the rickshaw using its long handles.',skateboard:'The rider stands on the skateboard.',boat:'We travel across the water in a boat.',ship:'The ship carries a large load across the sea.',ferry:'The ferry carries passengers between stopping places.',speedboat:'The speedboat moves quickly across the water.',yacht:'The family takes a leisure trip on a yacht.','jet-ski':'A rider steers the jet ski with its handlebars.',airplane:'The airplane uses its wings to fly.',helicopter:'The helicopter rotor blades turn above the cabin.','hot-air-balloon':'The basket hangs below the hot air balloon.',glider:'The glider moves through the air without engine power.','space-shuttle':'The space shuttle orbiter returned to a runway.'};
  const normaliseScope = (scope={}) => Object.fromEntries(Object.entries(choices).map(([key,options])=>[key,options.some(option=>option.id===String(scope?.[key]))?String(scope[key]):'all']));
  const inScope = (item,scope) => (scope.level==='all'||String(item.level)===scope.level)&&(scope.lesson==='all'||item.lessons.includes(scope.lesson))&&(scope.collection==='all'||item.collections.includes(scope.collection));
  function prepare(entries,questions) {
    if(entries.length!==rows.length)throw new Error('Transport content metadata must be reviewed when the source bank changes.');
    const byLegacyLabel=new Map(rows.map(row=>[legacyLabels[row[0]]||row[1],row]));
    entries.forEach(entry=>{
      const metadata=byLegacyLabel.get(entry.name);
      if(!metadata)throw new Error('Unknown Transport entry: review its explicit curriculum metadata.');
      const [key,name,level,aliases,definition,alt] = metadata;
      const legacyName = entry.name;
      Object.assign(entry,{
        id:`vehicle.${key}`,name,canonicalLabel:name,legacyName,aliases:[...new Set([...aliases,...(legacyName===name?[]:[legacyName])])],level,
        definition,example:examples[key],alt,category:entry.zone,
        lessons:Object.entries(lessonMembers).filter(([,ids])=>ids.includes(key)).map(([id])=>id),
        collections:Object.entries(collectionMembers).filter(([,ids])=>ids.includes(key)).map(([id])=>id),
        image:`images/vocabulary/vehicle.${key}.png`,iconImages:[`images/vocabulary/vehicle.${key}.png`],pictureGroup:pictureGroups[key]||key,
        eligibility:{learn:true,sort:key!=='space-shuttle',identify:true,hangman:true,flip:true,wheel:true,sound:false,detective:false},
        curriculumReview:'proposed; classroom review pending',definitionReview:'reviewed for clear meaning in this foundation batch',
        imageReview:'Painted Field Guide picture (Codex art ledger)',
      });
    });
    const related = [split('car taxi van'),['bicycle'],collectionMembers.road,collectionMembers.road,collectionMembers.water,split('bus minibus school-bus'),collectionMembers.road,collectionMembers.road];
    const ids = ['car-restraint','cycle-helmet','red-light','road-crossing','life-jacket','bus-seat','reversing-vehicle','crossing-place'];
    questions.forEach((q,i)=>Object.assign(q,{id:`safety.${ids[i]}`,relatedIds:related[i].map(id=>`vehicle.${id}`),answerIds:q.answers.map((_,j)=>`safety.${ids[i]}.choice-${j+1}`),eligible:true}));
    // Child restraint type varies; teach the adult check without giving an age/legal rule.
    Object.assign(questions[0],{q:'Who should check that you are safely fastened in the car?',answers:[['A trusted adult','🧑'],['Nobody','❌'],['A toy','🧸']],explain:'A trusted adult checks the right child seat, harness or seat belt for you.'});
    Object.assign(questions[6],{q:'An adult is reversing a car. What should you do?',answers:[['Stay well away with a trusted adult','🛑'],['Walk behind it','🚶'],['Run around it','🏃']],explain:'Stay well away from moving vehicles with a trusted adult.'});
    return entries;
  }
  const scopeLabel = scope => { const value=normaliseScope(scope); const labels=Object.entries(choices).flatMap(([key,options])=>options.filter(o=>o.id===value[key]).map(o=>o.label));return labels.join(' · ')||'All Transport words'; };
  globalThis.TransportCurriculum = {revision:'transport-foundations-1',rows,levels,lessons,collections,choices,normaliseScope,inScope,scopeLabel,prepare};
})();
