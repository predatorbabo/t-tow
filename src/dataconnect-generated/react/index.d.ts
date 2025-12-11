import { CreateTowRequestData, CreateTowRequestVariables, GetTowRequestData, GetTowRequestVariables, UpdateTowRequestData, UpdateTowRequestVariables, ListAvailableOperatorsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTowRequest(options?: useDataConnectMutationOptions<CreateTowRequestData, FirebaseError, CreateTowRequestVariables>): UseDataConnectMutationResult<CreateTowRequestData, CreateTowRequestVariables>;
export function useCreateTowRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTowRequestData, FirebaseError, CreateTowRequestVariables>): UseDataConnectMutationResult<CreateTowRequestData, CreateTowRequestVariables>;

export function useGetTowRequest(vars: GetTowRequestVariables, options?: useDataConnectQueryOptions<GetTowRequestData>): UseDataConnectQueryResult<GetTowRequestData, GetTowRequestVariables>;
export function useGetTowRequest(dc: DataConnect, vars: GetTowRequestVariables, options?: useDataConnectQueryOptions<GetTowRequestData>): UseDataConnectQueryResult<GetTowRequestData, GetTowRequestVariables>;

export function useUpdateTowRequest(options?: useDataConnectMutationOptions<UpdateTowRequestData, FirebaseError, UpdateTowRequestVariables>): UseDataConnectMutationResult<UpdateTowRequestData, UpdateTowRequestVariables>;
export function useUpdateTowRequest(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTowRequestData, FirebaseError, UpdateTowRequestVariables>): UseDataConnectMutationResult<UpdateTowRequestData, UpdateTowRequestVariables>;

export function useListAvailableOperators(options?: useDataConnectQueryOptions<ListAvailableOperatorsData>): UseDataConnectQueryResult<ListAvailableOperatorsData, undefined>;
export function useListAvailableOperators(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableOperatorsData>): UseDataConnectQueryResult<ListAvailableOperatorsData, undefined>;
