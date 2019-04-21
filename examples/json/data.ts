import { Zoo } from '../models/zoo';
import { Employee } from '../models/employee';
import { Panther } from '../models/panther';

import { Gender } from '../models/gender';
import { Status } from '../models/status';
import { Snake } from '../models/snake';

export const data: any = {
    'id': 15,
    'name': 'The Greatest Zoo',
    'city': 'Bordeaux',
    'country': 'France',
    'boss': {
        'id': 1,
        'name': 'Bob Razowsky',
        'birthdate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthdate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthdate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthdate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthdate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Animals': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthdate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'childrenIdentifiers': [
                2,
                3
            ],
            'color': 'black',
            'isSpeckled': false,
            'status': 'Sick'
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Ka',
            'birthdate': '2018-09-09T00:00:00.000Z',
            'numberOfPaws': 0,
            'gender': 1,
            'isPoisonous': true,
            'status': 'Alive'
        },
        {
            'id': 4,
            'name': 'Schrodinger',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ],
    'mascot': {
        'id': 1,
        'name': 'Bagheera',
        'birthdate': '2010-01-11T22:00:00.000Z',
        'numberOfPaws': 4,
        'gender': 1,
        'childrenIdentifiers': [
            2,
            3
        ],
        'color': 'black',
        'isSpeckled': false,
        'status': 'Sick'
    }
};

const boss: Employee = new Employee();
boss.birthdate = new Date(data.boss.birthdate);
boss.email = data.boss.email;
boss.gender = Gender.male;
boss.id = data.boss.id;
boss.name = data.boss.name;

const mikasa: Employee = new Employee();
mikasa.birthdate = new Date(data.employees[1].birthdate);
mikasa.email = data.employees[1].email;
mikasa.gender = Gender.female;
mikasa.id = data.employees[1].id;
mikasa.name = data.employees[1].name;

const red: Employee = new Employee();
red.birthdate = new Date(data.employees[2].birthdate);
red.email = data.employees[2].email;
red.gender = Gender.male;
red.id = data.employees[2].id;
red.name = data.employees[2].name;

const fried: Employee = new Employee();
fried.birthdate = new Date(data.employees[3].birthdate);
fried.email = data.employees[3].email;
fried.gender = Gender.male;
fried.id = data.employees[3].id;
fried.name = data.employees[3].name;

const bagheera: Panther = new Panther();
bagheera.birthdate = new Date(data.Animals[0].birthdate);
bagheera.childrenIds = data.Animals[0].childrenIdentifiers;
bagheera.color = data.Animals[0].color;
bagheera.gender = Gender.male;
bagheera.id = data.Animals[0].id;
bagheera.isSpeckled = data.Animals[0].isSpeckled;
bagheera.name = data.Animals[0].name;
bagheera.numberOfPaws = data.Animals[0].numberOfPaws;
bagheera.status = Status.sick;

const jolene: Panther = new Panther();
jolene.birthdate = new Date(data.Animals[1].birthdate);
jolene.color = data.Animals[1].color;
jolene.gender = Gender.female;
jolene.id = data.Animals[1].id;
jolene.isSpeckled = data.Animals[1].isSpeckled;
jolene.name = data.Animals[1].name;
jolene.numberOfPaws = data.Animals[1].numberOfPaws;
jolene.status = Status.alive;

const ka: Snake = new Snake();
ka.birthdate = new Date(data.Animals[2].birthdate);
ka.gender = Gender.male;
ka.id = data.Animals[2].id;
ka.isPoisonous = data.Animals[2].isPoisonous;
ka.name = data.Animals[2].name;
ka.numberOfPaws = data.Animals[2].numberOfPaws;
ka.status = Status.alive;

const schrodinger: Panther = new Panther();
schrodinger.birthdate = new Date(data.Animals[3].birthdate);
schrodinger.color = data.Animals[3].color;
schrodinger.gender = Gender.male;
schrodinger.id = data.Animals[3].id;
schrodinger.isSpeckled = data.Animals[3].isSpeckled;
schrodinger.name = data.Animals[3].name;
schrodinger.numberOfPaws = data.Animals[3].numberOfPaws;
schrodinger.status = Status.deadAndAlive;

const zoo: Zoo = new Zoo();
zoo.animals = [bagheera, jolene, ka, schrodinger];
zoo.boss = boss;
zoo.city = data.city;
zoo.country = data.country;
zoo.employees = [boss, mikasa, red, fried];
zoo.id = data.id;
zoo.mascot = bagheera;
zoo.name = data.name;

export const deserializedData: Zoo = zoo;
