import Flight from '../models/Flight.js';

const seedFlights = async () => {
  try {
    console.log('Dropping existing flights collection...');
    await Flight.collection.drop().catch(() => console.log('Collection did not exist, creating new one.'));

    console.log('Starting to seed flights...');

    const dummyFlights = [
      {
        flight_id: 'AI101',
        airline: 'Air India',
        departure_city: 'Delhi',
        arrival_city: 'Mumbai',
        base_price: 2500,
        current_price: 2500,
        seatsAvailable: 15
      },
      {
        flight_id: 'AI102',
        airline: 'Air India',
        departure_city: 'Mumbai',
        arrival_city: 'Delhi',
        base_price: 2600,
        current_price: 2600,
        seatsAvailable: 20
      },
      {
        flight_id: 'IN201',
        airline: 'Indigo',
        departure_city: 'Delhi',
        arrival_city: 'Bangalore',
        base_price: 2200,
        current_price: 2200,
        seatsAvailable: 10
      },
      {
        flight_id: 'IN202',
        airline: 'Indigo',
        departure_city: 'Bangalore',
        arrival_city: 'Delhi',
        base_price: 2300,
        current_price: 2300,
        seatsAvailable: 11
      },
      {
        flight_id: 'SJ301',
        airline: 'SpiceJet',
        departure_city: 'Delhi',
        arrival_city: 'Chennai',
        base_price: 2400,
        current_price: 2400,
        seatsAvailable: 23
      },
      {
        flight_id: 'SJ302',
        airline: 'SpiceJet',
        departure_city: 'Chennai',
        arrival_city: 'Delhi',
        base_price: 2450,
        current_price: 2450,
        seatsAvailable: 10
      },
      {
        flight_id: 'VI401',
        airline: 'Vistara',
        departure_city: 'Mumbai',
        arrival_city: 'Bangalore',
        base_price: 2100,
        current_price: 2100,
        seatsAvailable: 10
      },
      {
        flight_id: 'VI402',
        airline: 'Vistara',
        departure_city: 'Bangalore',
        arrival_city: 'Mumbai',
        base_price: 2150,
        current_price: 2150,
        seatsAvailable: 15
      },
      {
        flight_id: 'AI103',
        airline: 'Air India',
        departure_city: 'Delhi',
        arrival_city: 'Kolkata',
        base_price: 2700,
        current_price: 2700,
        seatsAvailable: 5
      },
      {
        flight_id: 'AI104',
        airline: 'Air India',
        departure_city: 'Kolkata',
        arrival_city: 'Delhi',
        base_price: 2750,
        current_price: 2750,
        seatsAvailable: 10
      },
      {
        flight_id: 'IN203',
        airline: 'Indigo',
        departure_city: 'Mumbai',
        arrival_city: 'Chennai',
        base_price: 2000,
        current_price: 2000,
        seatsAvailable: 10
      },
      {
        flight_id: 'IN204',
        airline: 'Indigo',
        departure_city: 'Chennai',
        arrival_city: 'Mumbai',
        base_price: 2050,
        current_price: 2050,
        seatsAvailable: 18
      },
      {
        flight_id: 'SJ303',
        airline: 'SpiceJet',
        departure_city: 'Bangalore',
        arrival_city: 'Kolkata',
        base_price: 2800,
        current_price: 2800,
        seatsAvailable: 10
      },
      {
        flight_id: 'SJ304',
        airline: 'SpiceJet',
        departure_city: 'Kolkata',
        arrival_city: 'Bangalore',
        base_price: 2850,
        current_price: 2850,
        seatsAvailable: 12
      },
      {
        flight_id: 'VI403',
        airline: 'Vistara',
        departure_city: 'Delhi',
        arrival_city: 'Hyderabad',
        base_price: 2250,
        current_price: 2250,
        seatsAvailable: 10
      },
      {
        flight_id: 'VI404',
        airline: 'Vistara',
        departure_city: 'Hyderabad',
        arrival_city: 'Delhi',
        base_price: 2300,
        current_price: 2300,
        seatsAvailable: 19
      },
      {
        flight_id: 'AI105',
        airline: 'Air India',
        departure_city: 'Mumbai',
        arrival_city: 'Hyderabad',
        base_price: 2350,
        current_price: 2350,
        seatsAvailable: 10
      },
      {
        flight_id: 'AI106',
        airline: 'Air India',
        departure_city: 'Hyderabad',
        arrival_city: 'Mumbai',
        base_price: 2400,
        current_price: 2400,
        seatsAvailable: 26
      },
      {
        flight_id: 'IN205',
        airline: 'Indigo',
        departure_city: 'Chennai',
        arrival_city: 'Kolkata',
        base_price: 2900,
        current_price: 2900,
        seatsAvailable: 30
      },
      {
        flight_id: 'IN206',
        airline: 'Indigo',
        departure_city: 'Kolkata',
        arrival_city: 'Chennai',
        base_price: 2950,
        current_price: 2950,
        seatsAvailable: 12
      }
    ];

    await Flight.insertMany(dummyFlights);
  } catch (error) {
    throw error;
  }
};

export { seedFlights };
