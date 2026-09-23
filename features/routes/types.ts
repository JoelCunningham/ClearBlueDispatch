export type RouteSummary = {
  id: number;
  assignedUserId: number;
  assignedUserName: string;
  date: Temporal.Instant;
};

export type RouteDetail = {
  id: number;
  assignedUserId: number;
  assignedUserName: string;
  date: Temporal.Instant;
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
