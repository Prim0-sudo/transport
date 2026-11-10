// Original Transport read-together books (Media > Books), following the Plants books model:
// one picture and one or two short sentences per page, a "Talk together" prompt, no score.
// Pictures are the approved Painted Field Guide teaching scenes.
(() => {
  const scene = id => `images/teaching-scenes/${id}.png`;
  const page = (id, title, text, talk, note = '') => ({image: scene(id), title, text, talk, note, alt: globalThis.TransportSceneLibrary?.scenes.find(s => s.id === id)?.alt || ''});
  globalThis.TransportBooks = [
    {id: 'a-trip-through-town', title: 'A Trip Through Town', summary: 'Walk, ride the bus and catch a train.', cover: scene('bus-at-the-bus-stop'),
      credit: 'Original Transport read-together book with Painted Field Guide scenes.',
      pages: [
        page('street-crossing', 'Ready to go', 'We walk on the pavement. We wait at the crossing until it is safe.', 'What helps us cross the road safely?'),
        page('bus-at-the-bus-stop', 'The bus stop', 'The bus stops and the doors open. We get on and hold the handrail.', 'Find the door and the handrail.'),
        page('crew-and-passengers', 'On the bus', 'The driver drives the bus. The passengers sit on the seats.', 'Point to the driver and a passenger.'),
        page('driving-actions', 'Steer, turn and stop', 'The driver steers and turns. The bus stops at the shelter.', 'Which picture shows a vehicle going backwards?'),
        page('route-features', 'Ways through town', 'Roads meet at a junction. They go round a roundabout, over a bridge and through a tunnel.', 'Which way would you like to go?'),
        page('train-at-the-platform', 'At the station', 'We get off the bus at the station. The train waits at the platform.', 'Why is the platform higher than the rails?'),
        page('airfield', 'Going far away', 'Some trips go a long way. At the airport, one plane takes off and another lands.', 'Where would you like to fly?')
      ]},
    {id: 'land-water-and-air', title: 'Land, Water and Air', summary: 'Vehicles that roll, float and fly.', cover: scene('aircraft'),
      credit: 'Original Transport read-together book with Painted Field Guide scenes.',
      pages: [
        page('road-vehicles', 'On the road', 'Cars, taxis and motorcycles travel on roads.', 'Which ones have two wheels?'),
        page('passenger-vehicles', 'Lots of passengers', 'Buses, trams and trains carry many people at once.', 'Which one runs on rails?'),
        page('work-vehicles', 'Vehicles that work', 'Trucks and vans carry things. A tractor works on the farm.', 'What could the truck be carrying?'),
        page('rickshaws', 'Around the world', 'In many places people ride in rickshaws. One is pulled, one is pedalled and one has a motor.', 'Which rickshaw has a motor?'),
        page('watercraft', 'On the water', 'Boats, ships and ferries float on water.', 'Which one is the biggest?'),
        page('small-boats', 'Paddle and sail', 'We paddle a canoe or a kayak. The wind pushes the sail of a sailboat.', 'How does each boat move?'),
        page('aircraft', 'Up in the air', 'Planes and helicopters fly in the sky. A rocket goes all the way to space.', 'Which one has a spinning rotor on top?')
      ]},
    {id: 'safe-journeys', title: 'Safe Journeys', summary: 'Stop, look, buckle up and be seen.', cover: scene('cycle-safety'),
      credit: 'Original Transport read-together book. Road advice follows the UK Highway Code.',
      pages: [
        page('street-crossing', 'Stop, look and listen', 'We cross at a crossing. We stop, look and listen before we go.', 'What does a red light tell us?', 'A red light means stop. Wait for the green signal at a light-controlled crossing.'),
        page('car-cockpit', 'Buckle up', 'In a car everyone wears a seat belt. Young children sit in a child car seat.', 'Why do we wear a seat belt?'),
        page('cycle-safety', 'Ready to ride', 'The cyclist wears a helmet and a bright vest. The reflector helps others see the bicycle.', 'What would you wear to ride a bike?'),
        page('car-front', 'See and be seen', 'Headlights help drivers see. An indicator shows which way a car will turn.', 'Find the headlight and the indicator.'),
        page('rail-crossing', 'Wait for the train', 'The barrier is down. We wait until the train has gone and the barrier goes up.', 'Why must we wait behind the barrier?'),
        page('water-safety', 'On the water', 'We wear a life jacket in a boat. It helps us float if we fall in.', 'What is the person wearing?'),
        page('emergency-vehicles', 'Make way', 'Fire engines, ambulances and police cars rush to help. Other drivers move aside to let them pass.', 'How do we know an emergency vehicle is coming?')
      ]},
    {id: 'who-helps-us-travel', title: 'Who Helps Us Travel?', summary: 'Drivers, pilots, captains and more.', cover: scene('crew-and-passengers'),
      credit: 'Original Transport read-together book with Painted Field Guide scenes.',
      pages: [
        page('crew-and-passengers', 'People aboard', 'A driver drives the bus. A pilot flies the plane. A captain steers the boat.', 'Who looks after the train?'),
        page('carrying-and-helping', 'Carrying things', 'A delivery worker brings a parcel. Workers load and unload the van.', 'What does unload mean?'),
        page('parking-and-repair', 'Fixing and filling', 'A mechanic fixes cars at the repair garage. Cars fill up at the fuel station.', 'What is the mechanic holding?'),
        page('harbour-and-canal', 'At the harbour', 'A tugboat helps big ships in the harbour. Boats tie up at the dock.', 'How is the tugboat different from a ferry?'),
        page('airfield', 'At the airport', 'People in the control tower help planes take off and land safely.', 'Find the runway.'),
        page('emergency-vehicles', 'Emergency helpers', 'Police officers, paramedics and firefighters hurry to help people.', 'Which vehicle carries a ladder?'),
        page('train-at-the-platform', 'All aboard', 'The train stops at the platform. Passengers get on and get off.', 'What should we do while people get off?')
      ]},
    {id: 'parts-that-make-it-go', title: 'Parts That Make It Go', summary: 'Pedals, engines, wings and sails.', cover: scene('bicycle-parts'),
      credit: 'Original Transport read-together book with Painted Field Guide scenes.',
      pages: [
        page('bicycle-parts', 'A bicycle', 'Push the pedals and the wheels turn. Steer with the handlebars and ring the bell!', 'Find the pedal and the bell.'),
        page('cycle-safety', 'Slow down', 'Squeeze the brake to slow down and stop.', 'When should a cyclist use the brake?'),
        page('car-cockpit', 'Inside a car', 'The driver holds the steering wheel. The engine makes the car go.', 'Where is the engine?'),
        page('car-front', 'Lights and mirrors', 'Headlights shine at night. The mirror shows what is behind.', 'Why does a driver look in the mirror?'),
        page('train-at-the-platform', 'Carriages', 'The engine pulls the carriages. Passengers look out of the windows.', 'How many carriages can you see?'),
        page('small-boats', 'Sails', 'A sail catches the wind and pushes the boat along.', 'What happens when there is no wind?'),
        page('aircraft', 'Wings, rotors and propellers', 'Wings help a plane fly. A helicopter has a rotor that spins on top.', 'Find a propeller.')
      ]}
  ];
})();
