import { ICardField } from './TreatmentCardTemplate';

const defaultTemplate: ICardField[] = [
  {
    name: 'Cel wizyty',
    selectedOptions: [],
    identifier: 'purpose',
    availableOptions: ['Nowa aplikacja', 'Uzupełnienie rzęs', 'Zdejmowanie rzęs'],
    description: '',
  },
  {
    name: 'Marka rzęs',
    selectedOptions: [],
    identifier: 'lashesBrand',
    availableOptions: ['Noble', 'Itlm', 'Lashes design'],
    description: '',
  },
  {
    name: 'Klej',
    selectedOptions: [],
    identifier: 'glue',
    availableOptions: [],
    description: '',
  },
  {
    name: 'Remover',
    selectedOptions: [],
    identifier: 'remover',
    availableOptions: [],
    description: '',
  },
  {
    name: 'Metoda',
    selectedOptions: [],
    identifier: 'method',
    availableOptions: ['2d', '2/3d', '3d', '4/6d', '5/8d', 'MV'],
    description: '',
  },
  {
    name: 'Skręt',
    selectedOptions: [],
    identifier: 'curve',
    availableOptions: ['L', 'M', 'B', 'C', 'C+', 'D', 'D+'],
    description: '',
  },
  {
    name: 'Grubość',
    selectedOptions: [],
    identifier: 'width',
    availableOptions: [0.03, 0.05, 0.07, 0.1],
    description: '',
  },
  {
    name: 'Długość',
    selectedOptions: [],
    identifier: 'length',
    availableOptions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    description: '',
  },
  {
    name: 'Struktura na oku',
    selectedOptions: [],
    identifier: 'modeling',
    availableOptions: [],
    description: '',
  },
  {
    name: 'Modelowanie',
    selectedOptions: [],
    identifier: 'lashesModelingType',
    availableOptions: ['Lalka', 'Wiewiórka', 'Kocie oko'],
    description: '',
  },
];

export default defaultTemplate;
