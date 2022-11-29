import { ICardTemplate } from './TreatmentCardTemplate';

const defaultTemplate: ICardTemplate[] = [
  {
    name: 'Cel wizyty',
    value: [],
    identifier: 'purpose',
    options: ['Nowa aplikacja', 'Uzupełnienie rzęs', 'Zdejmowanie rzęs'],
    description: '',
  },
  {
    name: 'Marka rzęs',
    value: [],
    identifier: 'lashesBrand',
    options: ['Noble', 'Itlm', 'Lashes design'],
    description: '',
  },
  {
    name: 'Klej',
    value: [],
    identifier: 'glue',
    options: [],
    description: '',
  },
  {
    name: 'Remover',
    value: [],
    identifier: 'remover',
    options: [],
    description: '',
  },
  {
    name: 'Metoda',
    value: [],
    identifier: 'method',
    options: ['2d', '2/3d', '3d', '4/6d', '5/8d', 'MV'],
    description: '',
  },
  {
    name: 'Skręt',
    value: [],
    identifier: 'curve',
    options: ['L', 'M', 'B', 'C', 'C+', 'D', 'D+'],
    description: '',
  },
  {
    name: 'Grubość',
    value: [],
    identifier: 'width',
    options: [0.03, 0.05, 0.07, 0.1],
    description: '',
  },
  {
    name: 'Długość',
    value: [],
    identifier: 'length',
    options: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    description: '',
  },
  {
    name: 'Struktura na oku',
    value: [],
    identifier: 'modeling',
    options: [],
    description: '',
  },
  {
    name: 'Modelowanie',
    value: [],
    identifier: 'lashesModelingType',
    options: ['Lalka', 'Wiewiórka', 'Kocie oko'],
    description: '',
  },
];

export default defaultTemplate;
