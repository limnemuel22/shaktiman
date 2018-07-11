export class Item {
  name: string;
  price: string;
  itemcode: string;
  stocks: string;
  brand: string;
  model: string;
  description: string;
}
export class User {
  id: string;
  username: string;
  password: string;
  isLogin: string;
  loginExpired: string;
  birthday: string;
  position: string;
  usertype: string;
  employeeName: string;
}

export class Delivery {
  item: string;
  quantity: string;
  deliveryDate: string;
  refNo: string;
  supplier: string;
  batch: string;
  serialNo: string;
  chasis: string;
  engine: string;
}

export class Purchase {
  client: string;
  agent: string;
  date: string;
  items: {
    itemID: string;
    quantity: string;
    price: string;
    total: string;
  };
}

export class Client {
  clientName: String;
  clientAddress: String;
  clientContact: String;
  clientAge: String;
  clientEmail: String;
  clientBirthday: String;
}

export class Agent {
  agentName: String;
  agentAddress: String;
  agentContact: String;
  agentAge: String;
  agentEmail: String;
  agentBirthday: String;
}

export class PackingList {
  company: String;
  attention: String;
  date: String;
  plNo: String;
  ref: String;
  blNo: String;
  loading: String;
  discharge: String;
  shipping: String;
  partial: String;
  insurance: String;
  weight: String;
  quantity: String;
  measurement: String;
  description: String;
  totalweight: String;
  totalmeasurement: String;
}

export interface Data {
  message: string;
  status: string;
  id: string;
}
