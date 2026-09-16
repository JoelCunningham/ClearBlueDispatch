export type RouteSummary = {
  id: number;
  assignedUserId: number;
  assignedUserName: string;
  date: string;
};

export type RouteDetail = {
  id: number;
  assignedUserId: number;
  assignedUserName: string;
  date: string;
  deliveries: {
    id: number;
    position: number;
    location: {
      id: number;
      address: string;
      customerName: string;
    };
  }[];
};

export type UserSummary = {
  id: number;
  name: string;
};
