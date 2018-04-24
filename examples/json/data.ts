import { Zoo } from '../models/zoo';
import { Employee } from '../models/employee';
import { Gender } from '../models/gender';
import { Panther } from '../models/panther';

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
        'gender': 'male'
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthdate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 'male'
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthdate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 'female'
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthdate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 'male'
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthdate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 'male'
        }
    ],
    'Panthers': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthdate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 'male',
            'childrenIdentifiers': [
                2,
                3
            ],
            'color': 'black',
            'isSpeckled': false
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 'female',
            'color': 'blond',
            'isSpeckled': true
        },
        {
            'id': 3,
            'name': 'Chatchat',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 'female',
            'color': 'brown',
            'isSpeckled': false
        }
    ]
};

const boss: Employee = new Employee();
boss.id = data.boss.id;
boss.name = data.boss.name;
boss.birthdate = new Date(data.boss.birthdate);
boss.email = data.boss.email;
boss.gender = data.boss.gender;

const mikasa: Employee = new Employee();
mikasa.id = data.employees[1].id;
mikasa.name = data.employees[1].name;
mikasa.birthdate = new Date(data.employees[1].birthdate);
mikasa.email = data.employees[1].email;
mikasa.gender = data.employees[1].gender;

const red: Employee = new Employee();
red.id = data.employees[2].id;
red.name = data.employees[2].name;
red.birthdate = new Date(data.employees[2].birthdate);
red.email = data.employees[2].email;
red.gender = data.employees[2].gender;

const fried: Employee = new Employee();
fried.id = data.employees[3].id;
fried.name = data.employees[3].name;
fried.birthdate = new Date(data.employees[3].birthdate);
fried.email = data.employees[3].email;
fried.gender = data.employees[3].gender;

const bagheera: Panther = new Panther();
bagheera.id = data.Panthers[0].id;
bagheera.name = data.Panthers[0].name;
bagheera.birthdate = new Date(data.Panthers[0].birthdate);
bagheera.numberOfPaws = data.Panthers[0].numberOfPaws;
bagheera.childrenIds = data.Panthers[0].childrenIdentifiers;
bagheera.gender = data.Panthers[0].gender;
bagheera.color = data.Panthers[0].color;
bagheera.isSpeckled = data.Panthers[0].isSpeckled;

const jolene: Panther = new Panther();
jolene.id = data.Panthers[1].id;
jolene.name = data.Panthers[1].name;
jolene.birthdate = new Date(data.Panthers[1].birthdate);
jolene.numberOfPaws = data.Panthers[1].numberOfPaws;
jolene.gender = data.Panthers[1].gender;
jolene.color = data.Panthers[1].color;
jolene.isSpeckled = data.Panthers[1].isSpeckled;

const chatchat: Panther = new Panther();
chatchat.id = data.Panthers[2].id;
chatchat.name = data.Panthers[2].name;
chatchat.birthdate = new Date(data.Panthers[2].birthdate);
chatchat.numberOfPaws = data.Panthers[2].numberOfPaws;
chatchat.gender = data.Panthers[2].gender;
chatchat.color = data.Panthers[2].color;
chatchat.isSpeckled = data.Panthers[2].isSpeckled;

const zoo: Zoo = new Zoo();
zoo.id = data.id;
zoo.name = data.name;
zoo.country = data.country;
zoo.city = data.city;
zoo.boss = boss;
zoo.employees = [boss, mikasa, red, fried];
zoo.panthers = [bagheera, jolene, chatchat];

export const deserializedData: Zoo = zoo;
