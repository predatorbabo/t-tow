# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetTowRequest*](#gettowrequest)
  - [*ListAvailableOperators*](#listavailableoperators)
- [**Mutations**](#mutations)
  - [*CreateTowRequest*](#createtowrequest)
  - [*UpdateTowRequest*](#updatetowrequest)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetTowRequest
You can execute the `GetTowRequest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTowRequest(vars: GetTowRequestVariables): QueryPromise<GetTowRequestData, GetTowRequestVariables>;

interface GetTowRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTowRequestVariables): QueryRef<GetTowRequestData, GetTowRequestVariables>;
}
export const getTowRequestRef: GetTowRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTowRequest(dc: DataConnect, vars: GetTowRequestVariables): QueryPromise<GetTowRequestData, GetTowRequestVariables>;

interface GetTowRequestRef {
  ...
  (dc: DataConnect, vars: GetTowRequestVariables): QueryRef<GetTowRequestData, GetTowRequestVariables>;
}
export const getTowRequestRef: GetTowRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTowRequestRef:
```typescript
const name = getTowRequestRef.operationName;
console.log(name);
```

### Variables
The `GetTowRequest` query requires an argument of type `GetTowRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTowRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTowRequest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTowRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetTowRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTowRequest, GetTowRequestVariables } from '@dataconnect/generated';

// The `GetTowRequest` query requires an argument of type `GetTowRequestVariables`:
const getTowRequestVars: GetTowRequestVariables = {
  id: ..., 
};

// Call the `getTowRequest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTowRequest(getTowRequestVars);
// Variables can be defined inline as well.
const { data } = await getTowRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTowRequest(dataConnect, getTowRequestVars);

console.log(data.towRequest);

// Or, you can use the `Promise` API.
getTowRequest(getTowRequestVars).then((response) => {
  const data = response.data;
  console.log(data.towRequest);
});
```

### Using `GetTowRequest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTowRequestRef, GetTowRequestVariables } from '@dataconnect/generated';

// The `GetTowRequest` query requires an argument of type `GetTowRequestVariables`:
const getTowRequestVars: GetTowRequestVariables = {
  id: ..., 
};

// Call the `getTowRequestRef()` function to get a reference to the query.
const ref = getTowRequestRef(getTowRequestVars);
// Variables can be defined inline as well.
const ref = getTowRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTowRequestRef(dataConnect, getTowRequestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.towRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.towRequest);
});
```

## ListAvailableOperators
You can execute the `ListAvailableOperators` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableOperators(): QueryPromise<ListAvailableOperatorsData, undefined>;

interface ListAvailableOperatorsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableOperatorsData, undefined>;
}
export const listAvailableOperatorsRef: ListAvailableOperatorsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableOperators(dc: DataConnect): QueryPromise<ListAvailableOperatorsData, undefined>;

interface ListAvailableOperatorsRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableOperatorsData, undefined>;
}
export const listAvailableOperatorsRef: ListAvailableOperatorsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableOperatorsRef:
```typescript
const name = listAvailableOperatorsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableOperators` query has no variables.
### Return Type
Recall that executing the `ListAvailableOperators` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableOperatorsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAvailableOperators`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableOperators } from '@dataconnect/generated';


// Call the `listAvailableOperators()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableOperators();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableOperators(dataConnect);

console.log(data.operators);

// Or, you can use the `Promise` API.
listAvailableOperators().then((response) => {
  const data = response.data;
  console.log(data.operators);
});
```

### Using `ListAvailableOperators`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableOperatorsRef } from '@dataconnect/generated';


// Call the `listAvailableOperatorsRef()` function to get a reference to the query.
const ref = listAvailableOperatorsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableOperatorsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.operators);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.operators);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTowRequest
You can execute the `CreateTowRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTowRequest(vars: CreateTowRequestVariables): MutationPromise<CreateTowRequestData, CreateTowRequestVariables>;

interface CreateTowRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTowRequestVariables): MutationRef<CreateTowRequestData, CreateTowRequestVariables>;
}
export const createTowRequestRef: CreateTowRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTowRequest(dc: DataConnect, vars: CreateTowRequestVariables): MutationPromise<CreateTowRequestData, CreateTowRequestVariables>;

interface CreateTowRequestRef {
  ...
  (dc: DataConnect, vars: CreateTowRequestVariables): MutationRef<CreateTowRequestData, CreateTowRequestVariables>;
}
export const createTowRequestRef: CreateTowRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTowRequestRef:
```typescript
const name = createTowRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateTowRequest` mutation requires an argument of type `CreateTowRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTowRequestVariables {
  userId: UUIDString;
  userLocationLatitude: number;
  userLocationLongitude: number;
  vehicleMake: string;
  vehicleModel: string;
  status: string;
}
```
### Return Type
Recall that executing the `CreateTowRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTowRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTowRequestData {
  towRequest_insert: TowRequest_Key;
}
```
### Using `CreateTowRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTowRequest, CreateTowRequestVariables } from '@dataconnect/generated';

// The `CreateTowRequest` mutation requires an argument of type `CreateTowRequestVariables`:
const createTowRequestVars: CreateTowRequestVariables = {
  userId: ..., 
  userLocationLatitude: ..., 
  userLocationLongitude: ..., 
  vehicleMake: ..., 
  vehicleModel: ..., 
  status: ..., 
};

// Call the `createTowRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTowRequest(createTowRequestVars);
// Variables can be defined inline as well.
const { data } = await createTowRequest({ userId: ..., userLocationLatitude: ..., userLocationLongitude: ..., vehicleMake: ..., vehicleModel: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTowRequest(dataConnect, createTowRequestVars);

console.log(data.towRequest_insert);

// Or, you can use the `Promise` API.
createTowRequest(createTowRequestVars).then((response) => {
  const data = response.data;
  console.log(data.towRequest_insert);
});
```

### Using `CreateTowRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTowRequestRef, CreateTowRequestVariables } from '@dataconnect/generated';

// The `CreateTowRequest` mutation requires an argument of type `CreateTowRequestVariables`:
const createTowRequestVars: CreateTowRequestVariables = {
  userId: ..., 
  userLocationLatitude: ..., 
  userLocationLongitude: ..., 
  vehicleMake: ..., 
  vehicleModel: ..., 
  status: ..., 
};

// Call the `createTowRequestRef()` function to get a reference to the mutation.
const ref = createTowRequestRef(createTowRequestVars);
// Variables can be defined inline as well.
const ref = createTowRequestRef({ userId: ..., userLocationLatitude: ..., userLocationLongitude: ..., vehicleMake: ..., vehicleModel: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTowRequestRef(dataConnect, createTowRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.towRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.towRequest_insert);
});
```

## UpdateTowRequest
You can execute the `UpdateTowRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTowRequest(vars: UpdateTowRequestVariables): MutationPromise<UpdateTowRequestData, UpdateTowRequestVariables>;

interface UpdateTowRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTowRequestVariables): MutationRef<UpdateTowRequestData, UpdateTowRequestVariables>;
}
export const updateTowRequestRef: UpdateTowRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTowRequest(dc: DataConnect, vars: UpdateTowRequestVariables): MutationPromise<UpdateTowRequestData, UpdateTowRequestVariables>;

interface UpdateTowRequestRef {
  ...
  (dc: DataConnect, vars: UpdateTowRequestVariables): MutationRef<UpdateTowRequestData, UpdateTowRequestVariables>;
}
export const updateTowRequestRef: UpdateTowRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTowRequestRef:
```typescript
const name = updateTowRequestRef.operationName;
console.log(name);
```

### Variables
The `UpdateTowRequest` mutation requires an argument of type `UpdateTowRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTowRequestVariables {
  id: UUIDString;
  status?: string | null;
  operatorNotes?: string | null;
  operatorId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `UpdateTowRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTowRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTowRequestData {
  towRequest_update?: TowRequest_Key | null;
}
```
### Using `UpdateTowRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTowRequest, UpdateTowRequestVariables } from '@dataconnect/generated';

// The `UpdateTowRequest` mutation requires an argument of type `UpdateTowRequestVariables`:
const updateTowRequestVars: UpdateTowRequestVariables = {
  id: ..., 
  status: ..., // optional
  operatorNotes: ..., // optional
  operatorId: ..., // optional
};

// Call the `updateTowRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTowRequest(updateTowRequestVars);
// Variables can be defined inline as well.
const { data } = await updateTowRequest({ id: ..., status: ..., operatorNotes: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTowRequest(dataConnect, updateTowRequestVars);

console.log(data.towRequest_update);

// Or, you can use the `Promise` API.
updateTowRequest(updateTowRequestVars).then((response) => {
  const data = response.data;
  console.log(data.towRequest_update);
});
```

### Using `UpdateTowRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTowRequestRef, UpdateTowRequestVariables } from '@dataconnect/generated';

// The `UpdateTowRequest` mutation requires an argument of type `UpdateTowRequestVariables`:
const updateTowRequestVars: UpdateTowRequestVariables = {
  id: ..., 
  status: ..., // optional
  operatorNotes: ..., // optional
  operatorId: ..., // optional
};

// Call the `updateTowRequestRef()` function to get a reference to the mutation.
const ref = updateTowRequestRef(updateTowRequestVars);
// Variables can be defined inline as well.
const ref = updateTowRequestRef({ id: ..., status: ..., operatorNotes: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTowRequestRef(dataConnect, updateTowRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.towRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.towRequest_update);
});
```

