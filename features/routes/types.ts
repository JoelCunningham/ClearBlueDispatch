export type RouteSummary = {
  id: number;
  assignedUserId: number;
  assignedUserName: string;
  assignedUserDeleted: boolean;
  date: Temporal.Instant;
};

export type RouteDetail = {
  id: number;
  user: {
    id: number;
    name: string;
    deleted: boolean;
  };
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

export type RoutesFormInput = {
  assignedUserId: number;
  date: string;
};
