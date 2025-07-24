const destinations = [
  {
    id: '6cd9a7d2-c511-4bea-8d2f-d643aeab26ec',
    description: 'Paris - a perfect place to stay with a family',
    name: 'Paris',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/14.jpg',
        description: 'Paris in a middle of Europe',
      },
    ],
  },
  {
    id: 'a458d528-e300-4397-a5be-8b49fdfb4f91',
    description: 'Rome - a true asian pearl',
    name: 'Rome',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/17.jpg',
        description: 'Rome in a middle of Europe',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/18.jpg',
        description:
          'Rome full of of cozy canteens where you can try the best coffee in the Middle East',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/5.jpg',
        description: 'Rome middle-eastern paradise',
      },
    ],
  },
  {
    id: '8bb98cf5-d4a1-4538-b183-c38eace43fb0',
    description: '',
    name: 'Kioto',
    pictures: [],
  },
  {
    id: '68ab1942-657f-4010-90f2-d6e0f3514cda',
    description:
      'Vien - full of of cozy canteens where you can try the best coffee in the Middle East',
    name: 'Vien',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/12.jpg',
        description: 'Vien a true asian pearl',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/15.jpg',
        description: 'Vien with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/14.jpg',
        description: 'Vien a perfect place to stay with a family',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/13.jpg',
        description:
          'Vien full of of cozy canteens where you can try the best coffee in the Middle East',
      },
    ],
  },
  {
    id: 'f46e01f8-7412-4980-b074-a2fb6004c930',
    description: 'Monaco - a true asian pearl',
    name: 'Monaco',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/5.jpg',
        description: 'Monaco with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/20.jpg',
        description: 'Monaco middle-eastern paradise',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/16.jpg',
        description:
          'Monaco full of of cozy canteens where you can try the best coffee in the Middle East',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/18.jpg',
        description: 'Monaco with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/14.jpg',
        description: 'Monaco in a middle of Europe',
      },
    ],
  },
  {
    id: 'b22f9c41-fed8-4841-bf65-2e073e839837',
    description: 'Chamonix - a true asian pearl',
    name: 'Chamonix',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/15.jpg',
        description:
          'Chamonix full of of cozy canteens where you can try the best coffee in the Middle East',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/3.jpg',
        description:
          'Chamonix famous for its crowded street markets with the best street food in Asia',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/1.jpg',
        description:
          'Chamonix with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/8.jpg',
        description: 'Chamonix with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/2.jpg',
        description: 'Chamonix middle-eastern paradise',
      },
    ],
  },
  {
    id: '50efe481-179b-4d60-86c1-6c6fd96723ba',
    description: 'Tokio - in a middle of Europe',
    name: 'Tokio',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/9.jpg',
        description: 'Tokio is a beautiful city',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/1.jpg',
        description:
          'Tokio with an embankment of a mighty river as a centre of attraction',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/4.jpg',
        description:
          'Tokio full of of cozy canteens where you can try the best coffee in the Middle East',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/6.jpg',
        description: 'Tokio with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/2.jpg',
        description:
          'Tokio with an embankment of a mighty river as a centre of attraction',
      },
    ],
  },
  {
    id: '3add2e2b-2c76-4205-b7a2-ff8fc0d198cc',
    description: 'Saint Petersburg - with a beautiful old town',
    name: 'Saint Petersburg',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/5.jpg',
        description: 'Saint Petersburg with crowded streets',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/6.jpg',
        description: 'Saint Petersburg with a beautiful old town',
      },
    ],
  },
  {
    id: 'c021da8a-1fed-4b32-9947-468a6582d94d',
    description:
      'Frankfurt - famous for its crowded street markets with the best street food in Asia',
    name: 'Frankfurt',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/1.jpg',
        description: 'Frankfurt with a beautiful old town',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/11.jpg',
        description: 'Frankfurt with a beautiful old town',
      },
    ],
  },
  {
    id: '8d7cd59b-92de-4e29-8999-0fa581a85e12',
    description: 'Valencia - in a middle of Europe',
    name: 'Valencia',
    pictures: [
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/14.jpg',
        description: 'Valencia with crowded streets',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/8.jpg',
        description: 'Valencia middle-eastern paradise',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/19.jpg',
        description: 'Valencia a perfect place to stay with a family',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/10.jpg',
        description: 'Valencia in a middle of Europe',
      },
      {
        src: 'https://22.objects.htmlacademy.pro/static/destinations/13.jpg',
        description: 'Valencia for those who value comfort and coziness',
      },
    ],
  },
];

export { destinations };
