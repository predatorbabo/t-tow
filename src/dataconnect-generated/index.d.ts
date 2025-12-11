import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateTowRequestData {
  towRequest_insert: TowRequest_Key;
}

export interface CreateTowRequestVariables {
  userId: UUIDString;
  userLocationLatitude: number;
  userLocationLongitude: number;
  vehicleMake: string;
  vehicleModel: string;
  status: string;
}

export interface GetTowRequestData {
  towRequest?: {
    id: UUIDString;
    userId: UUIDString;
    userLocationLatitude: number;
    userLocationLongitude: number;
    vehicleMake: string;
    vehicleModel: string;
    status: string;
    description?: string | null;
    operatorNotes?: string | null;
    destinationLocationLatitude?: number | null;
    destinationLocationLongitude?: number | null;
  } & TowRequest_Key;
}

export interface GetTowRequestVariables {
  id: UUIDString;
}

export interface ListAvailableOperatorsData {
  operators: ({
    id: UUIDString;
    displayName: string;
    companyName?: string | null;
    vehicleType: string;
    averageRating?: number | null;
    licensePlate: string;
  } & Operator_Key)[];
}

export interface Operator_Key {
  id: UUIDString;
  __typename?: 'Operator_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface TowRequest_Key {
  id: UUIDString;
  __typename?: 'TowRequest_Key';
}

export interface UpdateTowRequestData {
  towRequest_update?: TowRequest_Key | null;
}

export interface UpdateTowRequestVariables {
  id: UUIDString;
  status?: string | null;
  operatorNotes?: string | null;
  operatorId?: UUIDString | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateTowRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTowRequestVariables): MutationRef<CreateTowRequestData, CreateTowRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTowRequestVariables): MutationRef<CreateTowRequestData, CreateTowRequestVariables>;
  operationName: string;
}
export const createTowRequestRef: CreateTowRequestRef;

export function createTowRequest(vars: CreateTowRequestVariables): MutationPromise<CreateTowRequestData, CreateTowRequestVariables>;
export function createTowRequest(dc: DataConnect, vars: CreateTowRequestVariables): MutationPromise<CreateTowRequestData, CreateTowRequestVariables>;

interface GetTowRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTowRequestVariables): QueryRef<GetTowRequestData, GetTowRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTowRequestVariables): QueryRef<GetTowRequestData, GetTowRequestVariables>;
  operationName: string;
}
export const getTowRequestRef: GetTowRequestRef;

export function getTowRequest(vars: GetTowRequestVariables): QueryPromise<GetTowRequestData, GetTowRequestVariables>;
export function getTowRequest(dc: DataConnect, vars: GetTowRequestVariables): QueryPromise<GetTowRequestData, GetTowRequestVariables>;

interface UpdateTowRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTowRequestVariables): MutationRef<UpdateTowRequestData, UpdateTowRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTowRequestVariables): MutationRef<UpdateTowRequestData, UpdateTowRequestVariables>;
  operationName: string;
}
export const updateTowRequestRef: UpdateTowRequestRef;

export function updateTowRequest(vars: UpdateTowRequestVariables): MutationPromise<UpdateTowRequestData, UpdateTowRequestVariables>;
export function updateTowRequest(dc: DataConnect, vars: UpdateTowRequestVariables): MutationPromise<UpdateTowRequestData, UpdateTowRequestVariables>;

interface ListAvailableOperatorsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableOperatorsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableOperatorsData, undefined>;
  operationName: string;
}
export const listAvailableOperatorsRef: ListAvailableOperatorsRef;

export function listAvailableOperators(): QueryPromise<ListAvailableOperatorsData, undefined>;
export function listAvailableOperators(dc: DataConnect): QueryPromise<ListAvailableOperatorsData, undefined>;

