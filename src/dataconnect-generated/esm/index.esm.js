import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'dz-tow',
  location: 'northamerica-northeast1'
};

export const createTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTowRequest', inputVars);
}
createTowRequestRef.operationName = 'CreateTowRequest';

export function createTowRequest(dcOrVars, vars) {
  return executeMutation(createTowRequestRef(dcOrVars, vars));
}

export const getTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTowRequest', inputVars);
}
getTowRequestRef.operationName = 'GetTowRequest';

export function getTowRequest(dcOrVars, vars) {
  return executeQuery(getTowRequestRef(dcOrVars, vars));
}

export const updateTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTowRequest', inputVars);
}
updateTowRequestRef.operationName = 'UpdateTowRequest';

export function updateTowRequest(dcOrVars, vars) {
  return executeMutation(updateTowRequestRef(dcOrVars, vars));
}

export const listAvailableOperatorsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableOperators');
}
listAvailableOperatorsRef.operationName = 'ListAvailableOperators';

export function listAvailableOperators(dc) {
  return executeQuery(listAvailableOperatorsRef(dc));
}

