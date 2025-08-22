type TPoint = {
  id: string;
  base_price: number;
  date_from: string;
  date_to: string;
  destination: string;
  is_favorite: boolean;
  offers: string[];
  type: string;
};

type TDestination = {
  id: string;
  name: string;
  description: string;
  pictures: {
    src: string;
    description: string;
  }[];
};

type TOffer = {
  id: string;
  title: string;
  price: number;
};

type TOffersGroup = {
  type: string;
  offers: TOffer[];
};
